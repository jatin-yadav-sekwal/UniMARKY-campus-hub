# %% [markdown]
# # Multi-Document Summarization: fine-tune PRIMERA on Multi-News
#
# Self-contained Kaggle GPU notebook (generated from `training_src.py`).
#
# - Base checkpoint: `allenai/PRIMERA` (the **general pretrained** one — not `allenai/PRIMERA-multinews`).
# - Dataset: Multi-News, loaded **without** the deprecated HF loading script.
# - Preprocessing: PRIMERA `concat_start_wdoc_global` (per-document budget, `<doc-sep>` + global attention).
# - Manual training loop: real gradient updates, checkpointing, resume, weight-delta proof.
# - Evaluation: ROUGE-1/2/L, base vs fine-tuned, on the same test subset.

# %% [markdown]
# ## 0. Dependencies
#
# Only install what is missing; never upgrade the Kaggle image's torch/transformers
# (that is how a CUDA build can get replaced). No-op when already present.

# %%
import importlib, subprocess, sys

def ensure(mod, pip_name=None):
    try:
        importlib.import_module(mod)
        print(mod, "present")
    except ImportError:
        print("installing", pip_name or mod)
        subprocess.run([sys.executable, "-m", "pip", "install", "-q", pip_name or mod], check=False)

ensure("rouge_score")
print("deps ready")

# %% [markdown]
# ## 1. Imports, environment, GPU info

# %%
import json, os, random, time
import numpy as np
import torch
from torch.utils.data import DataLoader

print("torch", torch.__version__)
print("cuda available:", torch.cuda.is_available())
if torch.cuda.is_available():
    props = torch.cuda.get_device_properties(0)
    print("GPU:", props.name, "| VRAM GB:", round(props.total_memory / 1024 ** 3, 1))
    print("free/total GB:", [round(x / 1024 ** 3, 1) for x in torch.cuda.mem_get_info()])
else:
    print("WARNING: no GPU. Enable the GPU accelerator for realistic training.")

# Fail fast and loud: on Kaggle, "no GPU" + "no DNS" both mean the account is not
# phone-verified (Settings -> Phone Verification). Better than training on CPU for hours.
import socket
if not torch.cuda.is_available():
    raise SystemExit(
        "STOP: no CUDA GPU. On Kaggle this means the account is not phone-verified. "
        "Verify at kaggle.com/settings -> Phone Verification, then re-run with the GPU accelerator on.")
try:
    socket.gethostbyname("huggingface.co")
except OSError as exc:
    raise SystemExit(
        f"STOP: no internet/DNS ({exc}). Enable Internet in notebook settings; this also "
        "requires a phone-verified Kaggle account.")
print("GPU + DNS OK")

# %% [markdown]
# ## 2. Configuration

# %%
CFG = dict(
    checkpoint="allenai/PRIMERA",
    doc_sep="|||||", newline_token="NEWLINE_CHAR",
    train_size=512, val_size=32, test_size=64, seed=42,
    max_input_len=2048, max_output_len=256, mask_num=0,
    lr=2e-5, weight_decay=0.01, per_device_bs=1, grad_accum=8, epochs=1,
    max_grad_norm=1.0, fp16=True, logging_steps=5, save_steps=25, eval_steps=25,
    out_dir="/kaggle/working/finetuned",
)
os.makedirs(CFG["out_dir"], exist_ok=True)
random.seed(CFG["seed"]); np.random.seed(CFG["seed"]); torch.manual_seed(CFG["seed"])
CFG

# %% [markdown]
# ## 3. PRIMERA preprocessing (faithful to the official `concat_start_wdoc_global`)
#
# `<s> doc1 <doc-sep> doc2 <doc-sep> ... </s>` — each doc tokenised separately with a
# fair budget `(max_input_len - mask_num) // n_docs`; global attention on the first
# token and every `<doc-sep>`. Generic LED preprocessing is **not** equivalent.

# %%
from transformers import AutoTokenizer, LEDForConditionalGeneration

DOC_SEP_TOKEN = "<doc-sep>"

def get_docsep_token_id(tok):
    return tok.convert_tokens_to_ids(DOC_SEP_TOKEN)

def split_documents(document, doc_sep="|||||"):
    parts = document.split(doc_sep)
    if parts and parts[-1].strip() == "":
        parts = parts[:-1]
    return parts

def clean_document(doc):
    return " ".join(doc.replace("\n", " ").split())

def build_input_ids(tok, documents, max_input_len, mask_num=0, docsep_token_id=None):
    if docsep_token_id is None:
        docsep_token_id = get_docsep_token_id(tok)
    docs = [clean_document(d) for d in documents] or [""]
    per_doc = max((max_input_len - mask_num) // len(docs), 1)
    ids = [tok.mask_token_id] * mask_num if mask_num > 0 else []
    for doc in docs:
        enc = tok.encode(doc, truncation=True, max_length=per_doc)
        ids.extend(enc[1:-1])
        ids.append(docsep_token_id)
    ids = [tok.bos_token_id] + ids + [tok.eos_token_id]
    if len(ids) > max_input_len:
        ids = ids[:max_input_len - 1] + [tok.eos_token_id]
    return ids

def build_global_attention_mask(input_ids, docsep_token_id):
    mask = [1 if i == 0 else 0 for i in range(len(input_ids))]
    for i, t in enumerate(input_ids):
        if t == docsep_token_id:
            mask[i] = 1
    return mask

def build_target_ids(tok, summary, max_output_len):
    return tok.encode(summary, truncation=True, max_length=max_output_len)

def preprocess_example(tok, document, summary):
    docsep = get_docsep_token_id(tok)
    docs = split_documents(document, CFG["doc_sep"])
    ids = build_input_ids(tok, docs, CFG["max_input_len"], CFG["mask_num"], docsep)
    return {"input_ids": ids,
            "global_attention_mask": build_global_attention_mask(ids, docsep),
            "labels": build_target_ids(tok, summary, CFG["max_output_len"])}

tokenizer = AutoTokenizer.from_pretrained(CFG["checkpoint"])
docsep = get_docsep_token_id(tokenizer)
print("doc-sep token id:", docsep)
assert docsep == 50265, f"unexpected <doc-sep> id {docsep} (expected 50265 for allenai/PRIMERA)"
print("bos/pad/eos:", tokenizer.bos_token_id, tokenizer.pad_token_id, tokenizer.eos_token_id)

# %% [markdown]
# ## 4. Load Multi-News (script-free)
#
# `load_dataset("multi_news")` is expected to fail on modern `datasets`: the repo is
# script-only (no Parquet). We attempt it, print the reason, then fall back to the
# **same** dataset's raw files (no silent substitution).

# %%
from datasets import Dataset, DatasetDict
from huggingface_hub import hf_hub_download

REPO = "alexfabbri/multi_news"
RAW = {"train": "train", "validation": "val", "test": "test"}

def load_dataset_attempt():
    try:
        from datasets import load_dataset
        ds = load_dataset("multi_news")
        print("load_dataset('multi_news') OK")
        return ds
    except Exception as e:
        print("load_dataset('multi_news') failed ->", type(e).__name__, str(e)[:300])
        return None

def _download(split, suffix):
    return hf_hub_download(repo_id=REPO, filename=f"data/{RAW[split]}.{suffix}", repo_type="dataset")

def _pairs(src_path, tgt_path):
    docs, sums = [], []
    with open(src_path, encoding="utf-8") as sf, open(tgt_path, encoding="utf-8") as tf:
        for s, t in zip(sf, tf):
            d = s.strip().replace(CFG["newline_token"], "\n"); y = t.strip()
            if d and y:
                docs.append(d); sums.append(y)
    return docs, sums

def load_split(split):
    docs, sums = _pairs(_download(split, "src.cleaned"), _download(split, "tgt"))
    return Dataset.from_dict({"document": docs, "summary": sums})

hf = load_dataset_attempt()
if hf is None:
    splits = {}
    for split, size in [("train", CFG["train_size"]), ("validation", CFG["val_size"]), ("test", CFG["test_size"])]:
        ds = load_split(split).shuffle(seed=CFG["seed"]).select(range(size))
        splits[split] = ds
    hf = DatasetDict(splits)
    print("built Multi-News from raw files:", {k: len(v) for k, v in hf.items()})
hf

# %% [markdown]
# ## 5. Inspect raw examples (before preprocessing)

# %%
def show_examples(ds, n=2, max_chars=500):
    for i in range(min(n, len(ds))):
        ex = ds[i]
        ndocs = len(ex["document"].split(CFG["doc_sep"])) - 1
        print(f"--- example {i}: {ndocs} documents ---")
        print("DOCUMENT:", ex["document"][:max_chars].replace("\n", " \\n "), "...")
        print("SUMMARY :", ex["summary"][:max_chars], "\n")

show_examples(hf["train"], n=2)

# %% [markdown]
# ## 6. Load model + tokenizer

# %%
model = LEDForConditionalGeneration.from_pretrained(CFG["checkpoint"])
model.gradient_checkpointing_enable()
model.config.use_cache = False
print("class:", type(model).__name__)
print("params (M):", round(sum(p.numel() for p in model.parameters()) / 1e6, 1))
print("vocab:", model.config.vocab_size, "| max enc pos:", model.config.max_encoder_position_embeddings)

# %% [markdown]
# ## 7. Datasets + collator

# %%
class PrimeraDataset(torch.utils.data.Dataset):
    def __init__(self, hf_split):
        self.hf = hf_split
    def __len__(self):
        return len(self.hf)
    def __getitem__(self, i):
        ex = self.hf[i]
        return preprocess_example(tokenizer, ex["document"], ex["summary"])

class Collator:
    def __call__(self, features):
        max_len = max(len(f["input_ids"]) for f in features)
        bs = len(features)
        input_ids = torch.full((bs, max_len), tokenizer.pad_token_id, dtype=torch.long)
        att = torch.zeros((bs, max_len), dtype=torch.long)
        gam = torch.zeros((bs, max_len), dtype=torch.long)
        max_lab = max(len(f["labels"]) for f in features)
        labels = torch.full((bs, max_lab), -100, dtype=torch.long)
        for i, f in enumerate(features):
            n = len(f["input_ids"]); input_ids[i, :n] = torch.tensor(f["input_ids"])
            att[i, :n] = 1; gam[i, :n] = torch.tensor(f["global_attention_mask"])
            k = len(f["labels"]); labels[i, :k] = torch.tensor(f["labels"])
        return {"input_ids": input_ids, "attention_mask": att, "global_attention_mask": gam, "labels": labels}

collator = Collator()
train_loader = DataLoader(PrimeraDataset(hf["train"]), batch_size=CFG["per_device_bs"], shuffle=True, collate_fn=collator)
val_loader = DataLoader(PrimeraDataset(hf["validation"]), batch_size=CFG["per_device_bs"], shuffle=False, collate_fn=collator)
b = next(iter(train_loader))
print("batch:", {k: tuple(v.shape) for k, v in b.items()})
print("global-attn ones in sample:", int(b["global_attention_mask"][0].sum()))

# %% [markdown]
# ## 8. Train (manual loop: fp16, grad accumulation, checkpoint + resume, weight-delta proof)

# %%
def fingerprint(m, take=4):
    chunks = []
    for p in m.parameters():
        chunks.append(p.detach().float().flatten()[:4096].cpu())
        if len(chunks) >= take:
            break
    return torch.cat(chunks)

def eval_loss(max_batches=16):
    model.eval(); tot = n = 0
    with torch.no_grad():
        for i, batch in enumerate(val_loader):
            if i >= max_batches:
                break
            batch = {k: v.to(device) for k, v in batch.items()}
            tot += float(model(**batch).loss); n += 1
    model.train()
    return tot / max(n, 1)

device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device); model.train()

no_decay = ["bias", "LayerNorm.weight"]
opt = torch.optim.AdamW([
    {"params": [p for n, p in model.named_parameters() if not any(nd in n for nd in no_decay)], "weight_decay": CFG["weight_decay"]},
    {"params": [p for n, p in model.named_parameters() if any(nd in n for nd in no_decay)], "weight_decay": 0.0},
], lr=CFG["lr"])

updates_per_epoch = max(len(train_loader) // CFG["grad_accum"], 1)
sched = torch.optim.lr_scheduler.OneCycleLR(opt, max_lr=CFG["lr"],
                                            total_steps=max(updates_per_epoch * CFG["epochs"], 1), pct_start=0.1)
use_fp16 = CFG["fp16"] and device == "cuda"
scaler = torch.cuda.amp.GradScaler(enabled=use_fp16)

state_path = os.path.join(CFG["out_dir"], "trainer_state.pt")
start_epoch, step = 0, 0
if os.path.exists(state_path):
    st = torch.load(state_path, map_location=device)
    opt.load_state_dict(st["optimizer"]); sched.load_state_dict(st["scheduler"])
    scaler.load_state_dict(st["scaler"]); start_epoch, step = st["epoch"], st["global_step"]
    print("[resume] epoch", start_epoch, "step", step)

before = fingerprint(model)
history = []; t0 = time.time()

for epoch in range(start_epoch, CFG["epochs"]):
    opt.zero_grad(); running = 0.0
    for i, batch in enumerate(train_loader):
        batch = {k: v.to(device) for k, v in batch.items()}
        with torch.cuda.amp.autocast(enabled=use_fp16):
            loss = model(**batch).loss / CFG["grad_accum"]
        scaler.scale(loss).backward()
        running += float(loss.detach()) * CFG["grad_accum"]

        if (i + 1) % CFG["grad_accum"] == 0:
            scaler.unscale_(opt)
            torch.nn.utils.clip_grad_norm_(model.parameters(), CFG["max_grad_norm"])
            scaler.step(opt); scaler.update(); sched.step(); opt.zero_grad()
            step += 1
            if step % CFG["logging_steps"] == 0:
                lr = sched.get_last_lr()[0]
                print(f"[train] epoch {epoch} step {step} loss {running/(i+1):.4f} lr {lr:.2e}")
                history.append({"epoch": epoch, "step": step, "train_loss": running/(i+1), "lr": lr})
            if step % CFG["eval_steps"] == 0:
                v = eval_loss(); print(f"[eval]  step {step} val_loss {v:.4f}")
                if history: history[-1]["val_loss"] = v
            if step % CFG["save_steps"] == 0:
                torch.save({"optimizer": opt.state_dict(), "scheduler": sched.state_dict(),
                            "scaler": scaler.state_dict(), "epoch": epoch, "global_step": step}, state_path)

after = fingerprint(model)
delta = float((after - before).abs().mean())
print(f"\nweights_updated={delta > 0}  mean|delta param|={delta:.3e}  wall={time.time()-t0:.0f}s")

# %% [markdown]
# ## 9. Save checkpoint + tokenizer + metadata, verify reload

# %%
model.save_pretrained(CFG["out_dir"]); tokenizer.save_pretrained(CFG["out_dir"])
meta = {
    "checkpoint": CFG["checkpoint"], "device": device,
    "gpu": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None,
    "epochs": CFG["epochs"], "global_step": step,
    "train_examples": len(hf["train"]), "val_examples": len(hf["validation"]),
    "max_input_len": CFG["max_input_len"], "max_output_len": CFG["max_output_len"],
    "learning_rate": CFG["lr"], "grad_accum": CFG["grad_accum"], "fp16": use_fp16,
    "param_delta": delta, "weights_updated": delta > 0, "history": history,
}
with open(os.path.join(CFG["out_dir"], "training_meta.json"), "w") as fh:
    json.dump(meta, fh, indent=2)
print(json.dumps({k: meta[k] for k in ["gpu", "global_step", "train_examples", "weights_updated", "param_delta"]}, indent=2))

reloaded = LEDForConditionalGeneration.from_pretrained(CFG["out_dir"])
print("reload OK ->", type(reloaded).__name__, "| files:", sorted(os.listdir(CFG["out_dir"]))[:8])

# %% [markdown]
# ## 10. Evaluate: base vs fine-tuned on the same test subset (ROUGE-1/2/L)

# %%
from rouge_score import rouge_scorer
from tqdm.auto import tqdm

GEN = dict(max_length=CFG["max_output_len"], min_length=32, num_beams=4,
           no_repeat_ngram_size=3, length_penalty=2.0, early_stopping=True)

def generate(model, document):
    docs = [clean_document(d) for d in split_documents(document, CFG["doc_sep"]) if d.strip()]
    ids = build_input_ids(tokenizer, docs, CFG["max_input_len"], 0, docsep)
    gam = build_global_attention_mask(ids, docsep)
    inp = torch.tensor([ids], device=device); am = torch.ones_like(inp); g = torch.tensor([gam], device=device)
    with torch.no_grad():
        out = model.generate(input_ids=inp, attention_mask=am, global_attention_mask=g, use_cache=True, **GEN)
    txt = tokenizer.decode(out[0].tolist(), skip_special_tokens=True)
    return txt.replace("\ufffd", "").replace("<n>", "\n").strip()

def rouge_all(m, examples):
    sc = rouge_scorer.RougeScorer(["rouge1", "rouge2", "rougeL"], use_stemmer=True)
    m.eval().to(device)
    tot = {"rouge1": 0.0, "rouge2": 0.0, "rougeL": 0.0}; rows = []
    for ex in tqdm(examples):
        pred = generate(m, ex["document"]); s = sc.score(ex["summary"], pred)
        for k in tot: tot[k] += s[k].fmeasure
        rows.append({"reference": ex["summary"], "prediction": pred,
                     **{k: round(s[k].fmeasure, 4) for k in tot}})
    n = max(len(examples), 1)
    return {k: round(100 * v / n, 4) for k, v in tot.items()}, rows

test_examples = [hf["test"][i] for i in range(len(hf["test"]))]

base_model = LEDForConditionalGeneration.from_pretrained(CFG["checkpoint"])
base_agg, base_rows = rouge_all(base_model, test_examples)
ft_agg, ft_rows = rouge_all(reloaded, test_examples)

results = {
    "config": CFG, "train_meta": meta, "test_examples": len(test_examples),
    "base": {"aggregate": base_agg, "examples": base_rows},
    "finetuned": {"aggregate": ft_agg, "examples": ft_rows},
    "delta": {k: round(ft_agg[k] - base_agg[k], 4) for k in base_agg},
}
with open("/kaggle/working/results.json", "w") as fh:
    json.dump(results, fh, indent=2)
print("BASE     :", base_agg)
print("FINETUNED:", ft_agg)
print("DELTA    :", results["delta"])

# %% [markdown]
# ## 11. Sample consolidated summaries (base vs fine-tuned)

# %%
for i in range(min(2, len(test_examples))):
    ex = test_examples[i]
    print("=" * 100)
    print("N documents:", len(split_documents(ex["document"], CFG["doc_sep"])))
    print("\nREFERENCE :", ex["summary"])
    print("\nBASE      :", base_rows[i]["prediction"])
    print("\nFINETUNED :", ft_rows[i]["prediction"])
    print()

# %% [markdown]
# ## 12. Inference demo: five articles -> one consolidated summary

# %%
def pick_multidoc_example(examples, want=5):
    best = None
    for ex in examples:
        docs = [d.strip() for d in split_documents(ex["document"], CFG["doc_sep"]) if d.strip()]
        if len(docs) >= want:
            return docs[:want], ex
        if best is None or len(docs) > len(best[0]):
            best = (docs, ex)
    return best

docs5, demo_ex = pick_multidoc_example(test_examples, want=5)
joined = CFG["doc_sep"].join(docs5)
finetuned_summary = generate(reloaded, joined)
base_summary = generate(base_model, joined)
demo = {
    "n_documents": len(docs5),
    "documents": docs5,
    "reference": demo_ex["summary"],
    "base_summary": base_summary,
    "finetuned_summary": finetuned_summary,
}
with open("/kaggle/working/inference_demo.json", "w") as fh:
    json.dump(demo, fh, indent=2)
print("documents:", len(docs5))
print("\n--- REFERENCE ---\n", demo["reference"])
print("\n--- BASE (pretrained) ---\n", base_summary)
print("\n--- FINETUNED (ours) ---\n", finetuned_summary)

# %% [markdown]
# ## 13. Done — artifacts in `/kaggle/working`
#
# - `finetuned/` — fine-tuned weights + tokenizer + `training_meta.json`
# - `results.json` — ROUGE (base vs fine-tuned) + sample summaries
