"""Streamlit demo: multiple documents in -> one consolidated summary out.

Built AFTER the model works. Run with:
    streamlit run app/app.py
Point it at a fine-tuned checkpoint directory (default: ./multidoc-summarizer/checkpoints/finetuned).
"""
from __future__ import annotations

import os
import tempfile

import streamlit as st

from src.model.inference import GenerationParams, summarize
from src.model.loader import load_model, load_tokenizer
from src.utils.text_processing import validate_documents


def read_uploaded(file) -> str:
    name = file.name.lower()
    if name.endswith(".txt"):
        return file.read().decode("utf-8", errors="ignore")
    if name.endswith(".pdf"):
        from pypdf import PdfReader

        reader = PdfReader(file)
        return "\n".join((p.extract_text() or "") for p in reader.pages)
    if name.endswith(".docx"):
        import docx

        doc = docx.Document(file)
        return "\n".join(p.text for p in doc.paragraphs)
    raise ValueError(f"Unsupported file type: {file.name}")


@st.cache_resource(show_spinner="Loading model...")
def get_model(checkpoint: str):
    tokenizer = load_tokenizer(checkpoint)
    model = load_model(checkpoint, gradient_checkpointing=False)
    return model, tokenizer


def main() -> None:
    st.set_page_config(page_title="Multi-Document Summarizer", page_icon="📰")
    st.title("Multi-Document Summarizer")
    st.caption("Consolidate several documents on one topic into a single summary (PRIMERA, fine-tuned on Multi-News).")

    checkpoint = st.sidebar.text_input(
        "Checkpoint", os.environ.get("MDTS_CHECKPOINT", "checkpoints/finetuned"))
    max_len = st.sidebar.slider("Max summary tokens", 64, 512, 256, 32)
    beams = st.sidebar.slider("Beam size", 1, 8, 4)

    st.subheader("1. Add documents")
    docs = []
    uploads = st.file_uploader("Upload TXT / PDF / DOCX", type=["txt", "pdf", "docx"],
                               accept_multiple_files=True)
    for f in uploads or []:
        try:
            docs.append(read_uploaded(f))
        except Exception as exc:  # noqa: BLE001
            st.error(f"{f.name}: {exc}")

    pasted = st.text_area("...or paste text (one document per '---' line)", height=200)
    if pasted.strip():
        docs.extend(part for part in pasted.split("\n---\n") if part.strip())

    if st.button("Generate consolidated summary", type="primary") and docs:
        try:
            clean = validate_documents(docs)
            model, tokenizer = get_model(checkpoint)
            gen = GenerationParams(max_length=max_len, num_beams=beams)
            with st.spinner("Summarizing..."):
                summary = summarize(model, tokenizer, clean, max_input_len=2048, gen=gen)
            st.subheader("2. Consolidated summary")
            st.write(summary)
            st.download_button("Download summary (.txt)", summary, file_name="summary.txt")
        except Exception as exc:  # noqa: BLE001
            st.error(f"Failed: {exc}")


if __name__ == "__main__":
    main()
