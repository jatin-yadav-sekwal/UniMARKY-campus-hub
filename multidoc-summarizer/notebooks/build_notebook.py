"""Generate notebooks/training.ipynb from notebooks/training_src.py.

Keeps one readable Python source (training_src.py) and derives the notebook,
so the two never drift. Cells are separated by `# %%` markers; `# %% [markdown]`
opens a markdown cell whose body lines are prefixed with `# `.

Usage:  python notebooks/build_notebook.py
"""
from __future__ import annotations

import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "training_src.py")
OUT = os.path.join(HERE, "training.ipynb")

_MARKER = re.compile(r"^# %%(.*)$")


def _md_line(line: str) -> str:
    if line.startswith("# "):
        return line[2:]
    if line.strip() == "#":
        return ""
    return line


def build() -> dict:
    with open(SRC, encoding="utf-8") as fh:
        lines = fh.read().split("\n")

    raw_cells: list[tuple[str, list[str]]] = []
    cur_type = None
    cur: list[str] = []

    def flush():
        nonlocal cur_type, cur
        if cur_type is not None:
            raw_cells.append((cur_type, cur))
        cur_type, cur = None, []

    for line in lines:
        m = _MARKER.match(line)
        if m:
            flush()
            tag = m.group(1).strip()
            cur_type = "markdown" if tag.startswith("[markdown]") else "code"
            continue
        if cur_type is not None:
            cur.append(line)
    flush()

    cells = []
    for idx, (ctype, body) in enumerate(raw_cells):
        cell_id = f"cell-{idx:02d}"
        if ctype == "markdown":
            text = "\n".join(_md_line(l) for l in body).strip("\n")
            if text.strip():
                cells.append({"cell_type": "markdown", "id": cell_id, "metadata": {},
                              "source": text.splitlines(keepends=True)})
        else:
            text = "\n".join(body).strip("\n")
            if text.strip():
                cells.append({"cell_type": "code", "id": cell_id, "metadata": {}, "execution_count": None,
                              "outputs": [], "source": text.splitlines(keepends=True)})

    return {
        "cells": cells,
        "metadata": {
            "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
            "language_info": {"name": "python"},
        },
        "nbformat": 4,
        "nbformat_minor": 5,
    }


def main() -> None:
    nb = build()
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(nb, fh, indent=1)
        fh.write("\n")
    n_code = sum(1 for c in nb["cells"] if c["cell_type"] == "code")
    print(f"wrote {OUT}: {len(nb['cells'])} cells ({n_code} code)")


if __name__ == "__main__":
    main()
