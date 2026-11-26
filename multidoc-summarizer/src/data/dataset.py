"""Script-free Multi-News loader.

``load_dataset("multi_news")`` fails on ``datasets>=3.0``: the canonical repo
``alexfabbri/multi_news`` is script-only (no Parquet branch -- confirmed via the
HF datasets-server and the /parquet API). We read the raw files directly
instead, **without substituting a different dataset**.

Source files (one example per line):
  data/<split>.src.cleaned -> multi-doc text, documents joined by "|||||",
                             literal newlines replaced with "NEWLINE_CHAR"
  data/<split>.tgt         -> the human reference summary
"""
from __future__ import annotations

import hashlib
from typing import Dict, List, Optional, Tuple

from datasets import Dataset, DatasetDict
from huggingface_hub import hf_hub_download

CANONICAL_REPO = "alexfabbri/multi_news"          # "multi_news" is an alias
_RAW_SPLIT = {"train": "train", "validation": "val", "test": "test"}


def _download(split: str, suffix: str, cache_dir: Optional[str] = None) -> str:
    return hf_hub_download(
        repo_id=CANONICAL_REPO,
        filename=f"data/{_RAW_SPLIT[split]}.{suffix}",
        repo_type="dataset",
        cache_dir=cache_dir,
    )


def _read_pairs(src_path: str, tgt_path: str, newline_token: str = "NEWLINE_CHAR") -> Tuple[List[str], List[str]]:
    documents: List[str] = []
    summaries: List[str] = []
    with open(src_path, encoding="utf-8") as sf, open(tgt_path, encoding="utf-8") as tf:
        for src_line, tgt_line in zip(sf, tf):
            doc = src_line.strip().replace(newline_token, "\n")
            summ = tgt_line.strip()
            if doc and summ:
                documents.append(doc)
                summaries.append(summ)
    return documents, summaries


def load_split(split: str, cache_dir: Optional[str] = None, newline_token: str = "NEWLINE_CHAR") -> Dataset:
    docs, summaries = _read_pairs(
        _download(split, "src.cleaned", cache_dir),
        _download(split, "tgt", cache_dir),
        newline_token,
    )
    return Dataset.from_dict({"document": docs, "summary": summaries})


def load_multi_news(
    train_size: int = 512,
    val_size: int = 32,
    test_size: int = 64,
    seed: int = 42,
    cache_dir: Optional[str] = None,
    newline_token: str = "NEWLINE_CHAR",
) -> DatasetDict:
    """Load small, disjoint train/validation/test subsets of Multi-News."""
    sizes = {"train": train_size, "validation": val_size, "test": test_size}
    splits: Dict[str, Dataset] = {}
    for split, size in sizes.items():
        ds = load_split(split, cache_dir, newline_token)
        if size and size > 0:
            ds = ds.shuffle(seed=seed).select(range(min(size, len(ds))))
        splits[split] = ds
    result = DatasetDict(splits)
    assert_no_overlap(result)
    return result


def _fingerprints(ds: Dataset) -> set:
    out = set()
    for doc, summ in zip(ds["document"], ds["summary"]):
        out.add(hashlib.sha1((doc + "\x00" + summ).encode("utf-8")).hexdigest())
    return out


def assert_no_overlap(dataset_dict: DatasetDict) -> None:
    """Fail loudly if an example leaked across splits."""
    seen: Dict[str, set] = {}
    for name, ds in dataset_dict.items():
        fp = _fingerprints(ds)
        for other, other_fp in seen.items():
            inter = fp & other_fp
            if inter:
                raise AssertionError(f"{len(inter)} examples shared between '{other}' and '{name}'")
        seen[name] = fp


def show_raw_examples(ds: Dataset, n: int = 2, max_chars: int = 600) -> None:
    for i in range(min(n, len(ds))):
        ex = ds[i]
        print(f"--- example {i} | docs split on '|||||' -> {len(ex['document'].split('|||||')) - 1} docs ---")
        print("DOCUMENT:", ex["document"][:max_chars].replace("\n", " \\n "), "...")
        print("SUMMARY :", ex["summary"][:max_chars])
        print()
