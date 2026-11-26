"""Collator for PRIMERA fine-tuning.

Pads input_ids / attention_mask / global_attention_mask and pads labels with
-100 so the seq2seq cross-entropy ignores padding (equivalent to PRIMERA's
``ignore_index=pad_token_id``).
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional

import torch


@dataclass
class DataCollatorForPrimera:
    pad_token_id: int
    label_pad_token_id: int = -100
    pad_to_multiple_of: Optional[int] = None

    def __call__(self, features: List[Dict[str, List[int]]]) -> Dict[str, torch.Tensor]:
        max_len = max(len(f["input_ids"]) for f in features)
        if self.pad_to_multiple_of:
            m = self.pad_to_multiple_of
            max_len = ((max_len + m - 1) // m) * m

        batch_size = len(features)
        input_ids = torch.full((batch_size, max_len), self.pad_token_id, dtype=torch.long)
        attention = torch.zeros((batch_size, max_len), dtype=torch.long)
        gam = torch.zeros((batch_size, max_len), dtype=torch.long)

        max_lab = max(len(f["labels"]) for f in features)
        labels = torch.full((batch_size, max_lab), self.label_pad_token_id, dtype=torch.long)

        for i, f in enumerate(features):
            n = len(f["input_ids"])
            input_ids[i, :n] = torch.tensor(f["input_ids"], dtype=torch.long)
            attention[i, :n] = 1
            gam[i, :n] = torch.tensor(f.get("global_attention_mask", [0] * n), dtype=torch.long)
            k = len(f["labels"])
            labels[i, :k] = torch.tensor(f["labels"], dtype=torch.long)

        return {
            "input_ids": input_ids,
            "attention_mask": attention,
            "global_attention_mask": gam,
            "labels": labels,
        }
