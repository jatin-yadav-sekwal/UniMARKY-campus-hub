# Multi-Document Text Summarization (PRIMERA fine-tuned on Multi-News)

Consolidate several documents covering the same topic into **one** concise,
non-repetitive summary.

- **Model:** `allenai/PRIMERA` — the *general pretrained* checkpoint (`LEDForConditionalGeneration`).
  We fine-tune it ourselves on Multi-News. We do **not** start from `allenai/PRIMERA-multinews`.
- **Dataset:** Multi-News (`alexfabbri/multi_news`), loaded **without** the deprecated
  HF loading script (script-only dataset; `load_dataset("multi_news")` fails on `datasets>=3.0`).
- **Framework:** PyTorch + Hugging Face Transformers.
- **Eval:** ROUGE-1/2/L on a held-out test subset, base vs fine-tuned.

## Layout

```
multidoc-summarizer/
├── notebooks/            # training.ipynb (generated from training_src.py)
├── src/data/             # preprocessing.py (PRIMERA-exact), dataset.py (script-free loader)
├── src/model/            # loader.py, inference.py
├── src/training/         # train.py, collator.py, configuration.py
├── src/evaluation/       # evaluate.py
├── src/utils/            # text_processing.py
├── configs/              # training_config.yaml
├── app/                  # app.py (Streamlit, built last)
├── tests/
├── requirements.txt
```

## PRIMERA input format (verified, do not substitute generic LED preprocessing)

`<s> doc1_tokens <doc-sep> doc2_tokens <doc-sep> … </s>`

- `<doc-sep>` = token id **50265** for `allenai/PRIMERA`.
- Each document is tokenised **separately** with a fair budget
  `(max_input_len - mask_num) // n_docs`, BOS/EOS stripped, then the `<doc-sep>` id appended.
- **Global attention = first token + every `<doc-sep>` token.**

## Kaggle

Kaggle work is driven through the Kaggle MCP integration (`save_notebook`,
`get_notebook_session_status`, `list_notebook_session_output`,
`download_notebook_output`). See the report in the session for the exact
workflow and the current auth blocker.

## Results (prototype)

Notebook: <https://www.kaggle.com/code/jatinsekwal/mdts-primera-fine-tuned-on-multi-news>

Base `allenai/PRIMERA` vs our fine-tune, scored on the **same 64 held-out test
examples** with identical decoding (beam 4, len-penalty 2.0, no-repeat-3):

| Model | ROUGE-1 | ROUGE-2 | ROUGE-L |
|---|---|---|---|
| PRIMERA (pretrained) | 43.41 | 14.05 | 20.92 |
| **PRIMERA (fine-tuned, ours)** | **45.92** | **16.92** | **22.90** |
| Δ (ft − base) | +2.51 | +2.87 | +1.99 |

Training: 512 examples, 1 epoch, lr 2e-5, per-device batch 1 × grad-accum 8,
fp16, gradient checkpointing, `max_input_len` 2048 / `max_output_len` 256.
Genuine gradient updates (`weights_updated=true`, mean |Δparam| ≈ 7.8e-5),
checkpoint + tokenizer saved and reloaded (`LEDForConditionalGeneration`).

Caveat: 64 examples × 1 epoch is indicative, not conclusive; the base R1 43.4 is
above the paper's zero-shot 41.7, so this subset is on the easy side.

### Deeper evaluation (`scripts/deep_eval.py`, `scripts/bootstrap_ci.py`)

- Per-example wins (fine-tuned vs base): ROUGE-1 **42/64**, ROUGE-2 **45/64**, ROUGE-L **46/64**.
- Paired bootstrap (10 000 resamples):
  - ROUGE-1 +2.70  [95% CI +0.99, +4.43]  p(gain≤0)=0.0013
  - ROUGE-2 +2.73  [95% CI +0.60, +4.79]  p=0.0072
  - ROUGE-L +2.19  [95% CI +0.34, +3.93]  p=0.0107
  → the gain is **statistically significant** on this subset (CI excludes 0).
- Output length (words): base 182.4, fine-tuned 178.3, reference 205.1.
- Truncation (prediction ends mid-sentence): base **42/64**, fine-tuned **26/64**.
- Repetition: 0 repeated 3-grams for both — but this is *forced* by
  `no_repeat_ngram_size=3`, so it says nothing about repetition quality.

### Streamlit app

`app/app.py` verified end to end (upload TXT/PDF/DOCX, paste multiple docs,
generate, download). Note it runs **CPU-only** locally, so a summary takes
minutes, and it is **out of domain** for technical PDFs (trained on news).


