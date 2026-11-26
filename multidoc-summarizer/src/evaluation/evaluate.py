"""ROUGE evaluation for multi-document summarization (base vs fine-tuned)."""
from __future__ import annotations

import json
from typing import Dict, List, Optional, Sequence

from rouge_score import rouge_scorer

from src.data.preprocessing import split_documents
from src.model.inference import GenerationParams, summarize

KEYS = ["rouge1", "rouge2", "rougeL"]


def _mean(values: Sequence[float]) -> float:
    return round(100.0 * sum(values) / len(values), 4) if values else 0.0


def evaluate_model(
    model,
    tokenizer,
    examples: List[Dict],
    gen: Optional[GenerationParams] = None,
    max_input_len: int = 2048,
    limit: Optional[int] = None,
    device: Optional[str] = None,
) -> Dict:
    """Generate a summary per example and score it against the reference."""
    scorer = rouge_scorer.RougeScorer(KEYS, use_stemmer=True)
    rows: List[Dict] = []
    totals = {k: [] for k in KEYS}

    for i, ex in enumerate(examples[:limit] if limit else examples):
        docs = split_documents(ex["document"])
        prediction = summarize(model, tokenizer, docs, max_input_len, gen, device)
        scores = scorer.score(ex["summary"], prediction)
        row = {"index": i, "reference": ex["summary"], "prediction": prediction}
        for k in KEYS:
            row[k] = round(scores[k].fmeasure, 4)
            totals[k].append(scores[k].fmeasure)
        rows.append(row)

    return {"aggregate": {k: _mean(totals[k]) for k in KEYS}, "examples": rows}


def compare_models(
    base_model,
    tuned_model,
    tokenizer,
    examples: List[Dict],
    gen: Optional[GenerationParams] = None,
    max_input_len: int = 2048,
    limit: Optional[int] = None,
    device: Optional[str] = None,
) -> Dict:
    """Evaluate both checkpoints on the SAME examples with the SAME decoding."""
    common = dict(gen=gen, max_input_len=max_input_len, limit=limit, device=device)
    base = evaluate_model(base_model, tokenizer, examples, **common)
    tuned = evaluate_model(tuned_model, tokenizer, examples, **common)
    delta = {k: round(tuned["aggregate"][k] - base["aggregate"][k], 4) for k in KEYS}
    return {"base": base, "finetuned": tuned, "delta_finetuned_minus_base": delta}


def save_results(path: str, results: Dict) -> None:
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(results, fh, indent=2)
    print(f"[saved] {path}")
