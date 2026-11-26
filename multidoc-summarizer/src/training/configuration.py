"""Typed configuration for the prototype, loadable from YAML."""
from __future__ import annotations

from dataclasses import dataclass, field, fields
from typing import Any, Dict

import yaml


@dataclass
class ModelConfig:
    name: str = "allenai/PRIMERA"
    gradient_checkpointing: bool = True


@dataclass
class DataConfig:
    base_url: str = "https://huggingface.co/datasets/multi_news/resolve/main/data"
    doc_sep: str = "|||||"
    newline_token: str = "NEWLINE_CHAR"
    train_size: int = 512
    val_size: int = 32
    test_size: int = 64
    seed: int = 42


@dataclass
class TokenizationConfig:
    max_input_len: int = 2048
    max_output_len: int = 256
    mask_num: int = 0


@dataclass
class TrainingConfig:
    learning_rate: float = 2e-5
    weight_decay: float = 0.01
    per_device_batch_size: int = 1
    grad_accum: int = 8
    epochs: int = 1
    warmup_steps: int = 50
    max_grad_norm: float = 1.0
    fp16: bool = True
    bf16: bool = False
    label_smoothing: float = 0.0
    logging_steps: int = 5
    save_steps: int = 25
    eval_steps: int = 25
    seed: int = 42
    resume: bool = False


@dataclass
class GenerationConfig:
    max_length: int = 256
    min_length: int = 32
    num_beams: int = 4
    no_repeat_ngram_size: int = 3
    length_penalty: float = 2.0
    early_stopping: bool = True


@dataclass
class Config:
    model: ModelConfig = field(default_factory=ModelConfig)
    data: DataConfig = field(default_factory=DataConfig)
    tokenization: TokenizationConfig = field(default_factory=TokenizationConfig)
    training: TrainingConfig = field(default_factory=TrainingConfig)
    generation: GenerationConfig = field(default_factory=GenerationConfig)


def _build(cls, values: Dict[str, Any]):
    known = {f.name for f in fields(cls)}
    return cls(**{k: v for k, v in (values or {}).items() if k in known})


def load_config(path: str) -> Config:
    with open(path, "r", encoding="utf-8") as fh:
        raw = yaml.safe_load(fh) or {}
    return Config(
        model=_build(ModelConfig, raw.get("model")),
        data=_build(DataConfig, raw.get("data")),
        tokenization=_build(TokenizationConfig, raw.get("tokenization")),
        training=_build(TrainingConfig, raw.get("training")),
        generation=_build(GenerationConfig, raw.get("generation")),
    )
