"""Thin client for the Kaggle MCP server (https://www.kaggle.com/mcp).

Calls the *same* MCP tools (save_notebook, get_notebook_session_status, ...)
with their real schemas, over the documented streamable-HTTP transport. Needed
because the OpenCode MCP tool wrapper cannot read a local file, and the
notebook payload must not be transcribed by hand.

Auth: token from --token, else env KAGGLE_API_TOKEN.
Usage:
    python scripts/kaggle_mcp.py push
    python scripts/kaggle_mcp.py status
    python scripts/kaggle_mcp.py output
    python scripts/kaggle_mcp.py download <remoteFile>
    python scripts/kaggle_mcp.py call <toolName> '<jsonArgs>'
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.request

URL = "https://www.kaggle.com/mcp"

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NOTEBOOK = os.path.join(REPO_ROOT, "notebooks", "training.ipynb")

DEFAULT_SLUG = "jatinsekwal/mdts-primera-fine-tuned-on-multi-news"
DEFAULT_TITLE = "MDTS: PRIMERA fine-tuned on Multi-News"


def _token(explicit: str | None) -> str:
    tok = explicit or os.environ.get("KAGGLE_API_TOKEN", "")
    if not tok:
        sys.exit("No token: pass --token or set KAGGLE_API_TOKEN")
    return tok


def mcp_call(tool: str, arguments: dict, token: str) -> object:
    body = json.dumps({
        "jsonrpc": "2.0", "id": 1, "method": "tools/call",
        "params": {"name": tool, "arguments": arguments},
    }).encode("utf-8")
    req = urllib.request.Request(URL, data=body, method="POST", headers={
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "Authorization": f"Bearer {token}",
    })
    with urllib.request.urlopen(req, timeout=180) as resp:
        raw = resp.read().decode("utf-8", errors="replace")

    obj = None
    for line in raw.splitlines():
        line = line.strip()
        if line.startswith("data:"):
            try:
                obj = json.loads(line[5:].strip())
            except json.JSONDecodeError:
                continue
        elif line.startswith("{"):
            obj = json.loads(line)
    if obj is None:
        raise RuntimeError(f"no JSON-RPC payload in response: {raw[:500]}")

    if "error" in obj:
        raise RuntimeError(obj["error"])
    result = obj.get("result", {})
    texts = [c.get("text", "") for c in result.get("content", []) if c.get("type") == "text"]
    text = "\n".join(texts)
    if result.get("isError"):
        raise RuntimeError(f"{tool} error: {text}")
    try:
        return json.loads(text) if text else result
    except json.JSONDecodeError:
        return text


def user_slug(slug: str) -> tuple[str, str]:
    owner, _, kernel = slug.partition("/")
    return owner, kernel


def cmd_push(args) -> None:
    with open(NOTEBOOK, encoding="utf-8") as fh:
        text = fh.read()
    owner, kernel = user_slug(args.slug)
    request = {
        "slug": f"{owner}/{kernel}",
        "newTitle": args.title,
        "text": text,
        "language": "python",
        "kernelType": "notebook",
        "isPrivate": True,
        "enableGpu": True,
        "enableInternet": True,
        "kernelExecutionType": "SaveAndRunAll",
    }
    out = mcp_call("save_notebook", {"request": request}, args.token)
    print(json.dumps(out, indent=2))


def cmd_status(args) -> None:
    owner, kernel = user_slug(args.slug)
    out = mcp_call("get_notebook_session_status",
                   {"request": {"userName": owner, "kernelSlug": kernel}}, args.token)
    print(json.dumps(out, indent=2))


def cmd_output(args) -> None:
    owner, kernel = user_slug(args.slug)
    out = mcp_call("list_notebook_session_output",
                   {"request": {"userName": owner, "kernelSlug": kernel, "pageSize": 100}}, args.token)
    print(json.dumps(out, indent=2))


def cmd_download(args) -> None:
    owner, kernel = user_slug(args.slug)
    out = mcp_call("download_notebook_output",
                   {"request": {"ownerSlug": owner, "kernelSlug": kernel, "filePath": args.file}}, args.token)
    print(json.dumps(out, indent=2))


def _v1(path: str, token: str):
    req = urllib.request.Request("https://www.kaggle.com/api/v1/" + path,
                                 headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req, timeout=180) as resp:
        return json.loads(resp.read().decode("utf-8", errors="replace"))


def cmd_v1status(args) -> None:
    owner, kernel = user_slug(args.slug)
    print(json.dumps(_v1(f"kernels/status?userName={owner}&kernelSlug={kernel}", args.token)))


def cmd_outlog(args) -> None:
    import re
    owner, kernel = user_slug(args.slug)
    data = _v1(f"kernels/output?userName={owner}&kernelSlug={kernel}", args.token)
    raw = data.get("log") or ""
    lines: list[str] = []
    try:
        for entry in json.loads(raw):
            for ln in entry.get("data", "").split("\n"):
                if ln.strip():
                    lines.append(ln.rstrip())
    except (json.JSONDecodeError, TypeError):
        lines = [l for l in raw.split("\n") if l.strip()]
    if args.grep:
        lines = [l for l in lines if re.search(args.grep, l)]
    print(f"[{len(lines)} lines]")
    print("\n".join(lines[-args.tail:]))


def cmd_call(args) -> None:
    payload = json.loads(open(args.jsonArgs[1:], encoding="utf-8").read()) \
        if args.jsonArgs.startswith("@") else json.loads(args.jsonArgs)
    out = mcp_call(args.tool, payload, args.token)
    print(json.dumps(out, indent=2))


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--token", default=None)
    p.add_argument("--slug", default=DEFAULT_SLUG)
    sub = p.add_subparsers(dest="cmd", required=True)

    sp = sub.add_parser("push"); sp.add_argument("--title", default=DEFAULT_TITLE); sp.set_defaults(func=cmd_push)
    sub.add_parser("status").set_defaults(func=cmd_status)
    sub.add_parser("v1status").set_defaults(func=cmd_v1status)
    sub.add_parser("output").set_defaults(func=cmd_output)

    so = sub.add_parser("outlog")
    so.add_argument("--grep", default=None)
    so.add_argument("--tail", type=int, default=60)
    so.set_defaults(func=cmd_outlog)

    sd = sub.add_parser("download"); sd.add_argument("file"); sd.set_defaults(func=cmd_download)

    sc = sub.add_parser("call"); sc.add_argument("tool"); sc.add_argument("jsonArgs"); sc.set_defaults(func=cmd_call)

    args = p.parse_args()
    args.token = _token(args.token)
    args.func(args)


if __name__ == "__main__":
    main()
