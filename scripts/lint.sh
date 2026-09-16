#!/usr/bin/env bash
# Fails on: missing `status` in planning/, any root .md outside the eight, any
# link to a path that doesn't exist, a scenario over 40 lines, a scenario
# section outside Story/Acceptance/Not this, or an absolute cited by a slug
# that no longer exists. Run from the repo root.
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

# 1b. Every planning/scenario-*.md is <=40 lines and has only the three
#     allowed sections (Story, Acceptance, Not this), in any subset.
for f in planning/scenario-*.md; do
  [ -f "$f" ] || continue
  lines=$(wc -l < "$f" | tr -d ' ')
  if [ "$lines" -gt 40 ]; then
    echo "lint: scenario over 40 lines ($lines) — $f"
    fail=1
  fi
  bad=$(grep -E '^## ' "$f" | grep -Ev '^## (Story|Acceptance|Not this)$')
  if [ -n "$bad" ]; then
    echo "lint: scenario has a section outside Story/Acceptance/Not this — $f"
    echo "$bad" | sed 's/^/  /'
    fail=1
  fi
done

# 2. Root .md files are only the eight listed here, plus README.md (generated
#    by scripts/view.sh — never hand-edited, so it's not link-checked below).
allowed="CLAUDE.md STATUS.md ROADMAP.md DECISIONS.md HANDOFF.md LESSONS.md IMAGINE.md PIPELINE.md README.md"
for f in *.md; do
  [ -f "$f" ] || continue
  case " $allowed " in
    *" $f "*) ;;
    *)
      echo "lint: root .md outside the eight (+ generated README.md) — $f"
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

for f in CLAUDE.md STATUS.md ROADMAP.md DECISIONS.md HANDOFF.md LESSONS.md IMAGINE.md PIPELINE.md planning/*.md; do
  [ -f "$f" ] || continue
  out="$(check_links "$f")"
  if [ -n "$out" ]; then
    echo "$out" | grep -v '__FAIL__'
    fail=1
  fi
done

# 4. Every bracketed absolute-slug citation resolves to a heading in one of the
#    two ABSOLUTES files. This is the point of slugs: a renamed or deleted
#    absolute breaks the build instead of leaving a citation that reads fine and
#    points at nothing. DECISIONS.md is exempt — it is append-never-edit, so its
#    frozen "rule N" citations cannot be rewritten; the 2026-09-16 line there
#    maps those old numbers to these slugs.
slugs="$(grep -hoE '^### [a-z][a-z0-9-]+$' process/ABSOLUTES.md product/ABSOLUTES.md | sed 's/^### //')"
for hit in $(grep -roE '\[[a-z][a-z0-9]*(-[a-z0-9]+)+\]' --include='*.md' --exclude=DECISIONS.md . | sort -u); do
  slug="${hit##*:[}"; slug="${slug%]}"
  if ! printf '%s\n' "$slugs" | grep -qx "$slug"; then
    echo "lint: [$slug] cites an absolute that does not exist — ${hit%%:*}"
    fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  echo "lint: FAILED"
  exit 1
fi
echo "lint: clean"
