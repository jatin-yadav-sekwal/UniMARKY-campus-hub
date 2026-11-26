"""End-to-end inference-pipeline test on a tiny randomly-initialised LED model.

Skipped automatically when torch/transformers are unavailable (e.g. this
Windows sandbox); it runs on Kaggle / any env with the requirements installed.
"""
import pytest


def test_summarize_pipeline(fake_tokenizer):
    torch = pytest.importorskip("torch")
    pytest.importorskip("transformers")
    from transformers import LEDConfig, LEDForConditionalGeneration

    from src.model.inference import GenerationParams, normalize_inputs, summarize

    docs = ["The city council approved the budget on Tuesday.",
            "The budget was approved by the council after debate.",
            "Council passes budget in Tuesday vote."]
    assert len(normalize_inputs(docs)) == 3
    assert len(normalize_inputs("a b|||||c d|||||")) == 2

    config = LEDConfig(
        vocab_size=fake_tokenizer.vocab_size,
        d_model=16,
        encoder_layers=1,
        decoder_layers=1,
        encoder_attention_heads=2,
        decoder_attention_heads=2,
        encoder_ffn_dim=16,
        decoder_ffn_dim=16,
        max_encoder_position_embeddings=64,
        max_decoder_position_embeddings=64,
        attention_window=[8],
    )
    model = LEDForConditionalGeneration(config)

    gen = GenerationParams(max_length=8, min_length=1, num_beams=1,
                           no_repeat_ngram_size=0, length_penalty=1.0, early_stopping=True)
    out = summarize(model, fake_tokenizer, docs, max_input_len=64, gen=gen, device="cpu")
    assert isinstance(out, str)
