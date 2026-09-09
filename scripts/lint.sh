#!/usr/bin/env bash
# Fails on: missing `status` in planning/, any root .md outside the nine, any
# link to a path that doesn't exist. Run from the repo root.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

fail=0

# 1. Every planning/*.md carries a status field.
for f in planning/*.md; do
  [ -f "$f" ] || continue
  if ! grep -q '^status:' "$f"; then
    echo "lint: missing 'status:' frontmatter — $f"
    fail=1
  fi
done

# 2. Root .md files are only the nine listed here, plus README.md (generated
#    by scripts/view.sh — never hand-edited, so it's not link-checked below).
allowed="CLAUDE.md RULES.md STATUS.md ROADMAP.md DECISIONS.md HANDOFF.md LESSONS.md IMAGINE.md PIPELINE.md README.md"
for f in *.md; do
  [ -f "$f" ] || continue
  case " $allowed " in
    *" $f "*) ;;
    *)
      echo "lint: root .md outside the nine (+ generated README.md) — $f"
      fail=1
      ;;
  esac
done

# 3. Every relative markdown link in root docs and planning/*.md resolves
#    to a file that exists.
check_links() {
  local f="$1"
  local dir
  dir="$(dirname "$f")"
  grep -oE '\]\([^) ]+\)' "$f" | sed -E 's/^\]\((.*)\)$/\1/' | while read -r link; do
    case "$link" in
      http://*|https://*|mailto:*|\#*) continue ;;
    esac
    link="${link%%#*}"
    [ -z "$link" ] && continue
    target="$dir/$link"
    if [ ! -e "$target" ]; then
      echo "lint: broken link in $f -> $link"
      echo "__FAIL__"
    fi
  done
}

for f in CLAUDE.md RULES.md STATUS.md ROADMAP.md DECISIONS.md HANDOFF.md LESSONS.md IMAGINE.md PIPELINE.md planning/*.md; do
  [ -f "$f" ] || continue
  out="$(check_links "$f")"
  if [ -n "$out" ]; then
    echo "$out" | grep -v '__FAIL__'
    fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  echo "lint: FAILED"
  exit 1
fi
echo "lint: clean"
