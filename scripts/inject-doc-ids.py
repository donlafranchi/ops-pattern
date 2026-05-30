#!/usr/bin/env python3
"""
Reorg-12 Phase A — inject stable YAML `id:` fields into doc front-matter.

ID rule:
  - foundation docs                                 → why-{slug}
  - needs / systems / capabilities / ui / exploration / specs / products → what-{slug}
  - planning / development / standards / playbooks / skills              → how-{slug}

Slug = filename without `.md`, lowercased, hyphens preserved.
For SCREAMING-KEBAB files (e.g. PLATFORM-PATTERNS.md), slug is lowercased: platform-patterns.
For ADR-NNNN-{slug}.md, id is `how-adr-NNNN-{slug}`.
For T###/F###/memo-NNNN files, id is `how-{filename-stem-lower}`.

Idempotent: if `id:` already present, leaves file unchanged.
"""

import argparse
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCAN_DIRS = ["product", "planning", "development", "standards", "playbooks", "skills"]
EXCLUDE_DIRS = {"_attic", "_inbox", "archive", "node_modules", ".git"}

LAYER_PREFIX = {
    # why-
    "product/foundation": "why",
    # what-
    "product/needs": "what",
    "product/systems": "what",
    "product/capabilities": "what",
    "product/ui": "what",
    "product/exploration": "what",
    "product/specs": "what",
    "product/products": "what",
    # how- (everything else under scanned dirs)
}

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)
ID_LINE_RE = re.compile(r"^id:\s*\S+", re.MULTILINE)


def classify(path: Path) -> str:
    """Return the id prefix (why|what|how) for a file path relative to ROOT."""
    rel = path.relative_to(ROOT).as_posix()
    for prefix_dir, prefix in LAYER_PREFIX.items():
        if rel.startswith(prefix_dir + "/") or rel == prefix_dir:
            return prefix
    # default: planning/, development/, standards/, playbooks/, skills/, and unmapped product/ subdirs
    return "how"


GENERIC_STEMS = {"readme", "skill", "index"}


def slugify(path: Path) -> str:
    """Return a unique slug for a doc.

    For generic filenames (README.md, SKILL.md), prepend the parent dir name
    so the slug is unique across the tree.
    """
    stem = path.stem.lower()
    if stem in GENERIC_STEMS:
        parent = path.parent.name.lower()
        return f"{parent}-{stem}"
    return stem


def should_scan(path: Path) -> bool:
    parts = set(path.parts)
    if parts & EXCLUDE_DIRS:
        return False
    return path.suffix == ".md"


def has_frontmatter(text: str) -> bool:
    return text.startswith("---\n") and FRONTMATTER_RE.match(text) is not None


def inject_id(text: str, doc_id: str) -> str:
    """Insert `id: {doc_id}` as the first key inside the frontmatter block."""
    m = FRONTMATTER_RE.match(text)
    if not m:
        return text
    fm_body = m.group(1)
    if ID_LINE_RE.search(fm_body):
        return text  # idempotent
    new_fm = f"id: {doc_id}\n{fm_body}"
    return f"---\n{new_fm}\n---\n" + text[m.end():]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="write changes (default is dry-run)")
    ap.add_argument("--limit", type=int, default=0, help="dry-run: show first N changes only")
    args = ap.parse_args()

    changes = []
    skipped = 0
    no_fm = 0

    for scan_dir in SCAN_DIRS:
        base = ROOT / scan_dir
        if not base.exists():
            continue
        for path in base.rglob("*.md"):
            if not should_scan(path):
                continue
            text = path.read_text()
            if not has_frontmatter(text):
                no_fm += 1
                continue
            prefix = classify(path)
            slug = slugify(path)
            doc_id = f"{prefix}-{slug}"
            # idempotent check
            fm_match = FRONTMATTER_RE.match(text)
            if fm_match and ID_LINE_RE.search(fm_match.group(1)):
                skipped += 1
                continue
            new_text = inject_id(text, doc_id)
            if new_text != text:
                changes.append((path, doc_id, text, new_text))

    # collision check across all planned ids
    seen = {}
    for path, doc_id, _, _ in changes:
        seen.setdefault(doc_id, []).append(path)
    collisions = {k: v for k, v in seen.items() if len(v) > 1}
    if collisions:
        print("ERROR: id collisions detected:")
        for doc_id, paths in collisions.items():
            print(f"  {doc_id}:")
            for p in paths:
                print(f"    - {p.relative_to(ROOT)}")
        sys.exit(2)

    print(f"Files to update: {len(changes)}")
    print(f"Already had id: {skipped}")
    print(f"No frontmatter (skipped): {no_fm}")

    if args.apply:
        for path, doc_id, _, new_text in changes:
            path.write_text(new_text)
        print(f"\nApplied {len(changes)} updates.")
    else:
        sample = changes if args.limit == 0 else changes[: args.limit]
        for path, doc_id, _, _ in sample:
            print(f"  {path.relative_to(ROOT)} → id: {doc_id}")
        print("\n(dry-run — pass --apply to write)")


if __name__ == "__main__":
    main()
