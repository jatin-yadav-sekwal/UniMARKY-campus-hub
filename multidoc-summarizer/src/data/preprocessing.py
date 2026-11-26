"""PRIMERA-exact preprocessing for multi-document summarization.

Reproduces the ``concat_start_wdoc_global`` join method from the official
PRIMER repo (``script/dataloader.py``), which is PRIMERA's default and the
format the released checkpoints expect::

    <s> doc1_tokens <doc-sep> doc2_tokens <doc-sep> ... </s>

Do NOT substitute generic LED preprocessing. The PRIMERA conventions are:

* Each document is tokenised *separately*, its BOS/EOS stripped, then the
  ``<doc-sep>`` id (50265 for allenai/PRIMERA) is appended.
* Every document gets a fair budget ``(max_input_len - mask_num) // n_docs``
  -- not one blind truncation of the whole concatenation.
* Global attention is on the first token AND on every ``<doc-sep>`` token.
"""
from __future__ import annotations

from typing import Dict, List, Optional

DOC_SEP_STR = "|||||"
DOC_SEP_TOKEN = "<doc-sep>"


def get_docsep_token_id(tokenizer) -> int:
    """Token id of PRIMERA's document separator (50265 for allenai/PRIMERA)."""
    return tokenizer.convert_tokens_to_ids(DOC_SEP_TOKEN)


def split_documents(document: str, doc_sep: str = DOC_SEP_STR) -> List[str]:
    """Split a Multi-News ``document`` field into individual documents.

    Mirrors PRIMERA's ``document.split("|||||")[:-1]``: the trailing chunk is
    an artefact of the source format, so it is dropped.
    """
    parts = document.split(doc_sep)
    if parts and parts[-1].strip() == "":
        parts = parts[:-1]
    return parts


def clean_document(doc: str) -> str:
    """Per-document whitespace normalisation PRIMERA applies."""
    return " ".join(doc.replace("\n", " ").split())


def build_input_ids(
    tokenizer,
    documents: List[str],
    max_input_len: int,
    mask_num: int = 0,
    docsep_token_id: Optional[int] = None,
) -> List[int]:
    """Build PRIMERA input ids for a list of documents (concat_start_wdoc_global)."""
    if docsep_token_id is None:
        docsep_token_id = get_docsep_token_id(tokenizer)

    docs = [clean_document(d) for d in documents] or [""]
    per_doc = max((max_input_len - mask_num) // len(docs), 1)

    ids: List[int] = [tokenizer.mask_token_id] * mask_num if mask_num > 0 else []
    for doc in docs:
        enc = tokenizer.encode(doc, truncation=True, max_length=per_doc)
        ids.extend(enc[1:-1])                       # strip <s> / </s>
        ids.append(docsep_token_id)
    ids = [tokenizer.bos_token_id] + ids + [tokenizer.eos_token_id]

    if len(ids) > max_input_len:                    # safety cap; keep </s>
        ids = ids[: max_input_len - 1] + [tokenizer.eos_token_id]
    return ids


def build_global_attention_mask(input_ids: List[int], docsep_token_id: int) -> List[int]:
    """1 on the first token and on every <doc-sep>; 0 elsewhere."""
    mask = [1 if i == 0 else 0 for i in range(len(input_ids))]
    for i, tok in enumerate(input_ids):
        if tok == docsep_token_id:
            mask[i] = 1
    return mask


def build_target_ids(tokenizer, summary: str, max_output_len: int) -> List[int]:
    """Encoder-decoder target: encode the reference summary (keeps <s>/</s>)."""
    return tokenizer.encode(summary, truncation=True, max_length=max_output_len)


def preprocess_example(
    tokenizer,
    document: str,
    summary: str,
    max_input_len: int,
    max_output_len: int,
    mask_num: int = 0,
    doc_sep: str = DOC_SEP_STR,
) -> Dict[str, List[int]]:
    """Turn one raw Multi-News example into model-ready id lists."""
    docsep = get_docsep_token_id(tokenizer)
    docs = split_documents(document, doc_sep)
    input_ids = build_input_ids(tokenizer, docs, max_input_len, mask_num, docsep)
    return {
        "input_ids": input_ids,
        "global_attention_mask": build_global_attention_mask(input_ids, docsep),
        "labels": build_target_ids(tokenizer, summary, max_output_len),
    }
