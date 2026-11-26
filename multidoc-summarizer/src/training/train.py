"""Manual, transparent fine-tuning loop for PRIMERA on Multi-News.

Deliberately not ``transformers.Trainer``: we want explicit control, explicit
logging, resumable checkpoints, and an explicit proof that gradient-based
training actually changed the weights (parameter-delta check).
"""
from __future__ import annotations

import json
import os
import random
import time
from typing import Dict, List, Optional

import numpy as np
import torch
from torch.utils.data import DataLoader

from src.data.preprocessing import preprocess_example
from src.training.collator import DataCollatorForPrimera
from src.training.configuration import Config


def set_seed(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)


class PrimeraDataset(torch.utils.data.Dataset):
    """Wraps a raw Multi-News HF split and applies PRIMERA preprocessing."""

    def __init__(self, hf_split, tokenizer, cfg: Config):
        self.hf = hf_split
        self.tok = tokenizer
        self.cfg = cfg

    def __len__(self) -> int:
        return len(self.hf)

    def __getitem__(self, idx: int) -> Dict[str, List[int]]:
        ex = self.hf[idx]
        return preprocess_example(
            self.tok,
            ex["document"],
            ex["summary"],
            self.cfg.tokenization.max_input_len,
            self.cfg.tokenization.max_output_len,
            self.cfg.tokenization.mask_num,
            self.cfg.data.doc_sep,
        )


def _param_fingerprint(model, take: int = 4) -> torch.Tensor:
    """Concatenate a slice of the first few parameter tensors."""
    chunks = []
    for p in model.parameters():
        chunks.append(p.detach().float().flatten()[:4096].cpu())
        if len(chunks) >= take:
            break
    return torch.cat(chunks)


@torch.no_grad()
def evaluate_loss(model, loader, device, max_batches: Optional[int] = None) -> float:
    model.eval()
    total, n = 0.0, 0
    for i, batch in enumerate(loader):
        if max_batches is not None and i >= max_batches:
            break
        batch = {k: v.to(device) for k, v in batch.items()}
        loss = model(**batch).loss
        total += float(loss.detach())
        n += 1
    model.train()
    return total / max(n, 1)


def train(
    cfg: Config,
    tokenizer,
    model,
    train_hf,
    val_hf,
    out_dir: str,
    device: Optional[str] = None,
) -> Dict:
    device = device or ("cuda" if torch.cuda.is_available() else "cpu")
    set_seed(cfg.training.seed)
    os.makedirs(out_dir, exist_ok=True)

    collator = DataCollatorForPrimera(pad_token_id=tokenizer.pad_token_id)
    train_ds = PrimeraDataset(train_hf, tokenizer, cfg)
    val_ds = PrimeraDataset(val_hf, tokenizer, cfg)
    train_loader = DataLoader(train_ds, batch_size=cfg.training.per_device_batch_size,
                              shuffle=True, collate_fn=collator, num_workers=2)
    val_loader = DataLoader(val_ds, batch_size=cfg.training.per_device_batch_size,
                            shuffle=False, collate_fn=collator, num_workers=2)

    model.to(device)
    model.train()

    no_decay = ["bias", "LayerNorm.weight"]
    params = [
        {"params": [p for n, p in model.named_parameters() if not any(nd in n for nd in no_decay)],
         "weight_decay": cfg.training.weight_decay},
        {"params": [p for n, p in model.named_parameters() if any(nd in n for nd in no_decay)],
         "weight_decay": 0.0},
    ]
    optimizer = torch.optim.AdamW(params, lr=cfg.training.learning_rate)

    updates_per_epoch = max(len(train_loader) // cfg.training.grad_accum, 1)
    total_steps = updates_per_epoch * cfg.training.epochs
    scheduler = torch.optim.lr_scheduler.OneCycleLR(
        optimizer, max_lr=cfg.training.learning_rate,
        total_steps=max(total_steps, 1), pct_start=0.1)

    use_fp16 = cfg.training.fp16 and device == "cuda"
    scaler = torch.cuda.amp.GradScaler(enabled=use_fp16)

    start_epoch, global_step = 0, 0
    ckpt_path = os.path.join(out_dir, "trainer_state.pt")
    if cfg.training.resume and os.path.exists(ckpt_path):
        state = torch.load(ckpt_path, map_location=device)
        optimizer.load_state_dict(state["optimizer"])
        scheduler.load_state_dict(state["scheduler"])
        scaler.load_state_dict(state["scaler"])
        start_epoch, global_step = state["epoch"], state["global_step"]
        print(f"[resume] epoch={start_epoch} step={global_step}")

    before = _param_fingerprint(model)
    history: List[Dict] = []
    t0 = time.time()

    for epoch in range(start_epoch, cfg.training.epochs):
        optimizer.zero_grad()
        running = 0.0
        for step, batch in enumerate(train_loader):
            batch = {k: v.to(device) for k, v in batch.items()}
            with torch.cuda.amp.autocast(enabled=use_fp16):
                loss = model(**batch).loss / cfg.training.grad_accum
            scaler.scale(loss).backward()
            running += float(loss.detach()) * cfg.training.grad_accum

            if (step + 1) % cfg.training.grad_accum == 0:
                scaler.unscale_(optimizer)
                torch.nn.utils.clip_grad_norm_(model.parameters(), cfg.training.max_grad_norm)
                scaler.step(optimizer)
                scaler.update()
                scheduler.step()
                optimizer.zero_grad()
                global_step += 1

                if global_step % cfg.training.logging_steps == 0:
                    lr = scheduler.get_last_lr()[0]
                    print(f"[train] epoch {epoch} step {global_step} loss {running / (step + 1):.4f} lr {lr:.2e}")
                    history.append({"epoch": epoch, "step": global_step,
                                    "train_loss": running / (step + 1), "lr": lr})

                if global_step % cfg.training.eval_steps == 0:
                    vloss = evaluate_loss(model, val_loader, device, max_batches=16)
                    print(f"[eval]  step {global_step} val_loss {vloss:.4f}")
                    history[-1]["val_loss"] = vloss

                if global_step % cfg.training.save_steps == 0:
                    torch.save({"optimizer": optimizer.state_dict(), "scheduler": scheduler.state_dict(),
                                "scaler": scaler.state_dict(), "epoch": epoch,
                                "global_step": global_step}, ckpt_path)

    after = _param_fingerprint(model)
    delta = float((after - before).abs().mean())
    trained_ok = delta > 0.0

    # Persist artifacts
    model.save_pretrained(out_dir)
    tokenizer.save_pretrained(out_dir)
    meta = {
        "checkpoint": cfg.model.name,
        "device": device,
        "gpu": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None,
        "epochs": cfg.training.epochs,
        "global_step": global_step,
        "train_examples": len(train_ds),
        "val_examples": len(val_ds),
        "max_input_len": cfg.tokenization.max_input_len,
        "max_output_len": cfg.tokenization.max_output_len,
        "learning_rate": cfg.training.learning_rate,
        "grad_accum": cfg.training.grad_accum,
        "fp16": use_fp16,
        "gradient_checkpointing": cfg.model.gradient_checkpointing,
        "param_fingerprint_delta": delta,
        "weights_updated": trained_ok,
        "wall_seconds": round(time.time() - t0, 1),
        "history": history,
    }
    with open(os.path.join(out_dir, "training_meta.json"), "w", encoding="utf-8") as fh:
        json.dump(meta, fh, indent=2)

    print(f"[done] weights_updated={trained_ok} mean|Δparam|={delta:.3e} in {meta['wall_seconds']}s")
    return meta
