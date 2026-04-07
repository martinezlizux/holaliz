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
        # CSS
        (r"((?:assets|../assets)/css/style\.css)(?:\?v=\d+)?", r"\1?v=" + stamp),
        (r"((?:assets|../assets)/css/fontawesome\.css)(?:\?v=\d+)?", r"\1?v=" + stamp),
        # JS
        (r"((?:assets|../assets)/js/script\.js)(?:\?v=\d+)?", r"\1?v=" + stamp),
        (r"((?:assets|../assets)/js/isotope\.min\.js)(?:\?v=\d+)?", r"\1?v=" + stamp),
        (r"((?:assets|../assets)/js/contact-form\.js)(?:\?v=\d+)?", r"\1?v=" + stamp),
        (r"((?:assets|../assets)/js/analytics\.js)(?:\?v=\d+)?", r"\1?v=" + stamp),
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
