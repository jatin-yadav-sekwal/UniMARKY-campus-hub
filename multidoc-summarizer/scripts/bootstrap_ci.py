"""Paired bootstrap confidence interval for the fine-tune gain.

Honest quantification of the ROUGE delta on this 64-example subset: resample
examples with replacement and report the 95% CI and the one-sided p-value
(fraction of resamples where the gain is <= 0).
"""
from __future__ import annotations

import json
import random
import sys

METRICS = ["rouge1", "rouge2", "rougeL"]


def main(path: str = "results.json", B: int = 10000) -> None:
    d = json.load(open(path, encoding="utf-8"))
    base = d["base"]["examples"]
    ft = d["finetuned"]["examples"]
    n = len(ft)
    random.seed(1234)

    print(f"paired bootstrap, n={n} examples, {B} resamples")
    for m in METRICS:
        deltas = [ft[i][m] - base[i][m] for i in range(n)]
        mean = sum(deltas) / n
        boot = []
        for _ in range(B):
            s = 0.0
            for _ in range(n):
                s += deltas[random.randrange(n)]
            boot.append(s / n)
        boot.sort()
        lo = boot[int(0.025 * B)]
        hi = boot[int(0.975 * B)]
        p = sum(1 for x in boot if x <= 0.0) / B
        print(f"  {m:7s} delta {100*mean:+.2f}  95% CI [{100*lo:+.2f}, {100*hi:+.2f}]  "
              f"p(gain<=0)={p:.4f}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "results.json")
