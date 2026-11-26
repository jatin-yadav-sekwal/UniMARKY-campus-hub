"""Local smoke test: load the fine-tuned PRIMERA checkpoint and summarize.

Usage:  python scripts/local_demo.py [checkpoint_dir] [inference_demo.json]
"""
from __future__ import annotations

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.model.inference import GenerationParams, summarize
from src.model.loader import load_model, load_tokenizer


def main() -> None:
    ckpt = sys.argv[1] if len(sys.argv) > 1 else "checkpoints/finetuned"
    demo_path = sys.argv[2] if len(sys.argv) > 2 else "inference_demo.json"

    tokenizer = load_tokenizer(ckpt)
    docsep = tokenizer.convert_tokens_to_ids("<doc-sep>")
    print(f"checkpoint: {ckpt}")
    print(f"<doc-sep> id: {docsep} (expected 50265)  bos/pad/eos: "
          f"{tokenizer.bos_token_id}/{tokenizer.pad_token_id}/{tokenizer.eos_token_id}")

    model = load_model(ckpt, gradient_checkpointing=False)
    print(f"model: {type(model).__name__} | params(M): {sum(p.numel() for p in model.parameters()) / 1e6:.1f}")

    with open(demo_path, encoding="utf-8") as fh:
        demo = json.load(fh)
    docs = demo["documents"]
    print(f"documents: {len(docs)}")

    gen = GenerationParams(max_length=256, min_length=32, num_beams=4,
                           no_repeat_ngram_size=3, length_penalty=2.0, early_stopping=True)
    summary = summarize(model, tokenizer, docs, max_input_len=2048, gen=gen)
    print("\n=== CONSOLIDATED SUMMARY (local, CPU) ===\n" + summary)
    if "reference" in demo:
        print("\n=== REFERENCE ===\n" + demo["reference"])


if __name__ == "__main__":
    main()
