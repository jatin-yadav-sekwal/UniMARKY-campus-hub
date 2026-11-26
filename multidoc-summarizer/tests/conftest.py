"""Shared pytest fixtures / path setup."""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest


class FakeTokenizer:
    """Minimal stand-in so preprocessing can be unit-tested without downloads."""

    def __init__(self, docsep_id: int = 5, vocab_size: int = 16):
        self.bos_token_id = 0
        self.pad_token_id = 1
        self.eos_token_id = 2
        self.mask_token_id = 4
        self._docsep_id = docsep_id
        self.vocab_size = vocab_size

    def convert_tokens_to_ids(self, token: str) -> int:
        return self._docsep_id if token == "<doc-sep>" else 3

    def _word_id(self, word: str) -> int:
        return 6 + (abs(hash(word)) % (self.vocab_size - 6))

    def encode(self, text, truncation=True, max_length=None, add_special_tokens=True):
        words = text.split() if text else []
        ids = [self._word_id(w) for w in words]
        if add_special_tokens:
            ids = [self.bos_token_id] + ids + [self.eos_token_id]
        if truncation and max_length is not None and len(ids) > max_length:
            ids = ids[:max_length]
        return ids

    def decode(self, ids, skip_special_tokens=True):
        specials = {self.bos_token_id, self.eos_token_id, self.pad_token_id, self.mask_token_id}
        return " ".join(f"w{i}" for i in ids if not (skip_special_tokens and i in specials))


@pytest.fixture
def fake_tokenizer():
    return FakeTokenizer()
