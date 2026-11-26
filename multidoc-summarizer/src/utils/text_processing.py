"""Text helpers used by the inference pipeline (and later the Streamlit app)."""
from __future__ import annotations

import re
from typing import Iterable, List

from src.data.preprocessing import DOC_SEP_STR, clean_document, split_documents

_WS = re.compile(r"\s+")


def normalize_whitespace(text: str) -> str:
    return _WS.sub(" ", text.replace("\r\n", "\n").replace("\r", "\n")).strip()


def validate_documents(documents: Iterable[str], min_chars: int = 20) -> List[str]:
    """Clean, drop empties, and require a minimum size. Raises on bad input."""
    cleaned: List[str] = []
    for i, doc in enumerate(documents):
        if doc is None:
            continue
        text = normalize_whitespace(str(doc))
        if not text:
            continue
        if len(text) < min_chars:
            raise ValueError(f"Document {i} is too short ({len(text)} chars).")
        cleaned.append(text)
    if not cleaned:
        raise ValueError("No usable documents supplied.")
    return cleaned


def to_primera_document(documents: Iterable[str]) -> str:
    """Join documents with the Multi-News separator PRIMERA expects."""
    return DOC_SEP_STR.join(clean_document(d) for d in documents)


__all__ = [
    "normalize_whitespace",
    "validate_documents",
    "to_primera_document",
    "split_documents",
    "clean_document",
]
