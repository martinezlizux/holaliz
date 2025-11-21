#!/usr/bin/env python3
"""
Cache bust helper: bumps ?v= timestamp on CSS assets across HTML files.
"""
from __future__ import annotations

import datetime as _dt
import pathlib as _path
import re as _re


def main() -> None:
    stamp = _dt.datetime.utcnow().strftime("%Y%m%d%H%M%S")
    root = _path.Path(__file__).resolve().parents[1]
    html_files = list(root.rglob("*.html"))

    patterns = [
        (r"(assets/css/style\.css\?v=)\d+", r"\g<1>" + stamp),
        (r"(\.\./assets/css/style\.css\?v=)\d+", r"\g<1>" + stamp),
        (r"(\./assets/css/style\.css\?v=)\d+", r"\g<1>" + stamp),
        (r"(assets/css/fontawesome\.css\?v=)\d+", r"\g<1>" + stamp),
        (r"(\.\./assets/css/fontawesome\.css\?v=)\d+", r"\g<1>" + stamp),
        (r"(\./assets/css/fontawesome\.css\?v=)\d+", r"\g<1>" + stamp),
    ]

    for file in html_files:
        text = file.read_text()
        new_text = text
        for pattern, repl in patterns:
            new_text = _re.sub(pattern, repl, new_text)

        if new_text != text:
            file.write_text(new_text)
            print(f"Updated cache stamp in {file.relative_to(root)} -> {stamp}")


if __name__ == "__main__":
    main()
