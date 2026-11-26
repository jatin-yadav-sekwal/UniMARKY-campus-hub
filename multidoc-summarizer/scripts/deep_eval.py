"""Deeper evaluation of base vs fine-tuned, from results.json.

Goes beyond the headline ROUGE means: per-example win/tie/loss, output length
behaviour, and repetition (the brief explicitly cares about "avoid repeated
information").
"""
from __future__ import annotations

import json
import statistics as st
from collections import Counter

METRICS = ["rouge1", "rouge2", "rougeL"]


def ngram_repetition(text: str, n: int = 3) -> float:
    toks = text.split()
    if len(toks) < n:
        return 0.0
    grams = [tuple(toks[i:i + n]) for i in range(len(toks) - n + 1)]
    counts = Counter(grams)
    repeats = sum(v - 1 for v in counts.values() if v > 1)
    return repeats / len(grams)


def ends_clean(text: str) -> bool:
    return text.strip().endswith((".", "!", "?", '"', "”", ")"))


def main(path: str = "results.json") -> None:
    d = json.load(open(path, encoding="utf-8"))
    base = d["base"]["examples"]
    ft = d["finetuned"]["examples"]
    n = len(ft)

    print(f"examples: {n} | same test set & decoding: {len(base) == n}")
    print("\n== ROUGE: mean / median ==")
    for m in METRICS:
        b = [e[m] for e in base]
        f = [e[m] for e in ft]
        print(f"  {m:7s} base {100*st.mean(b):6.2f}/{100*st.median(b):6.2f}  "
              f"ft {100*st.mean(f):6.2f}/{100*st.median(f):6.2f}  "
              f"delta {100*(st.mean(f)-st.mean(b)):+.2f}")

    print("\n== Per-example win / tie / loss (ROUGE-1, ft vs base) ==")
    for m in METRICS:
        w = sum(1 for e, b in zip(ft, base) if e[m] > b[m] + 1e-9)
        t = sum(1 for e, b in zip(ft, base) if abs(e[m] - b[m]) <= 1e-9)
        l = n - w - t
        print(f"  {m:7s} win {w:2d}  tie {t:2d}  loss {l:2d}")

    print("\n== Output length (words) ==")
    ref = [len(e["reference"].split()) for e in ft]
    for name, rows in (("base", base), ("finetuned", ft)):
        lens = [len(e["prediction"].split()) for e in rows]
        print(f"  {name:10s} mean {st.mean(lens):6.1f}  median {st.median(lens):6.1f}")
    print(f"  {'reference':10s} mean {st.mean(ref):6.1f}  median {st.median(ref):6.1f}")

    print("\n== Repetition (fraction of repeated 3-grams, lower is better) ==")
    for name, rows in (("base", base), ("finetuned", ft)):
        reps = [ngram_repetition(e["prediction"]) for e in rows]
        clean = sum(1 for r in reps if r == 0.0)
        print(f"  {name:10s} mean {st.mean(reps):.4f}  median {st.median(reps):.4f}  "
              f"no-repetition {clean}/{n}")

    print("\n== Truncation (prediction ends mid-sentence) ==")
    for name, rows in (("base", base), ("finetuned", ft)):
        bad = sum(0 if ends_clean(e["prediction"]) else 1 for e in rows)
        print(f"  {name:10s} {bad}/{n}")

    print("\n== Biggest fine-tune wins (ROUGE-1 gain) ==")
    deltas = sorted(range(n), key=lambda i: ft[i]["rouge1"] - base[i]["rouge1"], reverse=True)
    for i in deltas[:3]:
        print(f"  +{100*(ft[i]['rouge1']-base[i]['rouge1']):.2f}  ft_pred: {ft[i]['prediction'][:150]}")
    print("\n== Biggest fine-tune losses (ROUGE-1 drop) ==")
    for i in deltas[-3:]:
        print(f"  {100*(ft[i]['rouge1']-base[i]['rouge1']):+.2f}  base_pred: {base[i]['prediction'][:150]}")


if __name__ == "__main__":
    import sys
    main(sys.argv[1] if len(sys.argv) > 1 else "results.json")
