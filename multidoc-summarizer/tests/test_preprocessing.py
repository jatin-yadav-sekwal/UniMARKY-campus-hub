"""Unit tests for PRIMERA preprocessing conventions (no heavy deps)."""
from src.data.preprocessing import (
    build_global_attention_mask,
    build_input_ids,
    build_target_ids,
    clean_document,
    get_docsep_token_id,
    preprocess_example,
    split_documents,
)


def test_docsep_id(fake_tokenizer):
    assert get_docsep_token_id(fake_tokenizer) == 5


def test_split_documents_drops_trailing_artifact():
    raw = "doc one text|||||doc two text|||||"
    assert split_documents(raw) == ["doc one text", "doc two text"]


def test_clean_document_collapses_whitespace():
    assert clean_document("a\n\n b\t c ") == "a b c"


def test_build_input_ids_structure(fake_tokenizer):
    docs = ["alpha beta", "gamma delta", "epsilon"]
    ids = build_input_ids(fake_tokenizer, docs, max_input_len=64)
    assert ids[0] == fake_tokenizer.bos_token_id
    assert ids[-1] == fake_tokenizer.eos_token_id
    assert ids.count(5) == len(docs)  # one <doc-sep> per document
    assert len(ids) <= 64


def test_per_document_budget_not_global_truncation(fake_tokenizer):
    # 4 very long docs, tiny budget -> every doc still contributes content.
    docs = [" ".join(["w"] * 500) for _ in range(4)]
    ids = build_input_ids(fake_tokenizer, docs, max_input_len=128)
    assert ids.count(5) == 4
    assert len(ids) <= 128


def test_global_attention_mask_positions(fake_tokenizer):
    ids = [0, 7, 5, 8, 5, 2]
    mask = build_global_attention_mask(ids, docsep_token_id=5)
    assert mask[0] == 1                      # first token
    assert mask[2] == 1 and mask[4] == 1     # both <doc-sep>
    assert sum(mask) == 3


def test_preprocess_example_shapes(fake_tokenizer):
    out = preprocess_example(
        fake_tokenizer,
        "a b c|||||d e f|||||",
        "reference summary here",
        max_input_len=64,
        max_output_len=16,
    )
    assert set(out) == {"input_ids", "global_attention_mask", "labels"}
    assert len(out["input_ids"]) == len(out["global_attention_mask"])
    assert out["labels"][0] == fake_tokenizer.bos_token_id
    assert out["labels"][-1] == fake_tokenizer.eos_token_id
