"""Load the PRIMERA checkpoint (general pretrained) and its tokenizer."""
from __future__ import annotations

from typing import Dict

from transformers import (
    AutoTokenizer,
    LEDConfig,
    LEDForConditionalGeneration,
)

DEFAULT_CHECKPOINT = "allenai/PRIMERA"          # general pretrained (NOT -multinews)


def load_tokenizer(name: str = DEFAULT_CHECKPOINT):
    return AutoTokenizer.from_pretrained(name)


def load_model(name: str = DEFAULT_CHECKPOINT, gradient_checkpointing: bool = True):
    config = LEDConfig.from_pretrained(name)
    model = LEDForConditionalGeneration.from_pretrained(name, config=config)
    if gradient_checkpointing:
        model.gradient_checkpointing_enable()
        model.config.use_cache = False
    return model


def describe(model, tokenizer) -> Dict[str, object]:
    """Sanity facts to log before training."""
    return {
        "model_class": type(model).__name__,
        "hidden_size": model.config.d_model,
        "encoder_layers": model.config.encoder_layers,
        "decoder_layers": model.config.decoder_layers,
        "vocab_size": model.config.vocab_size,
        "max_encoder_positions": model.config.max_encoder_position_embeddings,
        "attention_window": model.config.attention_window,
        "num_parameters": sum(p.numel() for p in model.parameters()),
        "trainable_parameters": sum(p.numel() for p in model.parameters() if p.requires_grad),
        "docsep_token_id": tokenizer.convert_tokens_to_ids("<doc-sep>"),
        "bos_token_id": tokenizer.bos_token_id,
        "eos_token_id": tokenizer.eos_token_id,
        "pad_token_id": tokenizer.pad_token_id,
    }
