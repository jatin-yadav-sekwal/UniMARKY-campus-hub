"""Reusable multi-document inference pipeline.

Takes several documents about one topic, applies the exact PRIMERA
preprocessing, builds the global attention mask, and returns one consolidated
summary.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional, Sequence

import torch

from src.data.preprocessing import (
    DOC_SEP_STR,
    build_global_attention_mask,
    build_input_ids,
    clean_document,
    get_docsep_token_id,
    split_documents,
)


@dataclass
class GenerationParams:
    max_length: int = 256
    min_length: int = 32
    num_beams: int = 4
    no_repeat_ngram_size: int = 3
    length_penalty: float = 2.0
    early_stopping: bool = True

    def to_dict(self) -> Dict:
        return {k: v for k, v in self.__dict__.items() if v is not None}


def normalize_inputs(documents: Sequence[str]) -> List[str]:
    """Accept a list of documents, or one pre-joined ``|||||`` string."""
    if isinstance(documents, str):
        docs = split_documents(documents, DOC_SEP_STR)
    else:
        docs = [str(d) for d in documents]
    docs = [clean_document(d) for d in docs if d and str(d).strip()]
    if not docs:
        raise ValueError("At least one non-empty document is required.")
    return docs


def build_batch(tokenizer, documents: Sequence[str], max_input_len: int, device):
    docsep = get_docsep_token_id(tokenizer)
    input_ids = build_input_ids(tokenizer, list(documents), max_input_len, 0, docsep)
    gam = build_global_attention_mask(input_ids, docsep)
    input_ids_t = torch.tensor([input_ids], device=device)
    attention_t = torch.ones_like(input_ids_t)
    gam_t = torch.tensor([gam], device=device)
    return input_ids_t, attention_t, gam_t


@torch.no_grad()
def summarize(
    model,
    tokenizer,
    documents: Sequence[str],
    max_input_len: int = 2048,
    gen: Optional[GenerationParams] = None,
    device: Optional[str] = None,
) -> str:
    """Generate a single consolidated summary from multiple documents."""
    gen = gen or GenerationParams()
    device = device or ("cuda" if torch.cuda.is_available() else "cpu")
    model.eval().to(device)

    docs = normalize_inputs(documents)
    input_ids, attention, gam = build_batch(tokenizer, docs, max_input_len, device)

    output = model.generate(
        input_ids=input_ids,
        attention_mask=attention,
        global_attention_mask=gam,
        use_cache=True,
        **gen.to_dict(),
    )
    txt = tokenizer.decode(output[0].tolist(), skip_special_tokens=True)
    return txt.replace("\ufffd", "").replace("<n>", "\n").strip()
