#!/usr/bin/env python3
"""Build Pixel Ops into one self-contained page.

Writes:
  dist/artifact.html  page body only (what gets published as the claude.ai artifact)
  docs/index.html     full HTML document, ready for GitHub Pages
"""
from pathlib import Path

ROOT = Path(__file__).parent
JS_ORDER = ["helpers.js", "ops.js", "overrides.js", "home.js", "app.js"]

def build():
    shell = (ROOT / "src" / "shell.html").read_text()
    js = "\n".join((ROOT / "src" / "js" / name).read_text() for name in JS_ORDER)
    import base64
    hero = "data:image/jpeg;base64," + base64.b64encode((ROOT / "src" / "assets" / "hero.jpg").read_bytes()).decode()
    body = shell.replace("/*JS*/", js).replace("__HERO__", hero)
    (ROOT / "dist").mkdir(exist_ok=True)
    (ROOT / "dist" / "artifact.html").write_text(body)
    page = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            '</head>\n<body style="margin:0">\n' + body + '\n</body>\n</html>\n')
    (ROOT / "docs").mkdir(exist_ok=True)
    (ROOT / "docs" / "index.html").write_text(page)
    print(f"built dist/artifact.html and docs/index.html ({len(page):,} bytes)")

if __name__ == "__main__":
    build()
