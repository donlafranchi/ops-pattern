#!/usr/bin/env bash
# Harness conformance — cross-checks CLAUDE.md routing table, AGENTS.md, and skills/ for drift.
set -euo pipefail
cd "$(dirname "$0")/.."

fails=0; warns=0
fail() { echo "  ✗ $1"; fails=$((fails + 1)); }
warn() { echo "  ⚠ $1"; warns=$((warns + 1)); }
pass() { echo "  ✓ $1"; }

# --- Check 1: Routing table ↔ skills/ directory ---
echo "## Check 1: Routing table ↔ skills/ directory"
routing=$(grep -E '^\| "' CLAUDE.md | awk -F'|' '{print $3}' | grep -oE '`[a-z-]+`' | tr -d '`' | sort -u)
disk=$(find skills -maxdepth 2 -name SKILL.md 2>/dev/null | sed 's|skills/||;s|/SKILL.md||' | sort -u)
c1_hit=0
for s in $routing; do echo "$disk" | grep -qx "$s" || { fail "$s in routing table but no skills/ directory"; c1_hit=1; }; done
for s in $disk; do echo "$routing" | grep -qx "$s" || { warn "$s in skills/ but unlisted in routing table (sub-routine?)"; c1_hit=1; }; done
[ $c1_hit -eq 0 ] && pass "Routing table and skills/ in sync"

# --- Check 2: SKILL.md + workflow.md presence ---
echo ""
echo "## Check 2: SKILL.md + workflow.md presence"
c2_hit=0
for d in skills/*/; do
  name=$(basename "$d")
  [ -f "$d/SKILL.md" ]    || { fail "$name/ missing SKILL.md"; c2_hit=1; }
  [ -f "$d/workflow.md" ] || { warn "$name/ missing workflow.md"; c2_hit=1; }
done
[ $c2_hit -eq 0 ] && pass "All skill directories have SKILL.md + workflow.md"

# --- Check 3: AGENTS.md consistency ---
echo ""
echo "## Check 3: AGENTS.md consistency"
agents=$(grep -E '^\| `[a-z]' AGENTS.md | awk -F'|' '{print $2}' | grep -oE '`[a-z-]+`' | tr -d '`' | sort -u)
c3_hit=0
for s in $routing; do echo "$agents" | grep -qx "$s" || { warn "$s in routing table but not in AGENTS.md 'team' table"; c3_hit=1; }; done
for s in $agents; do echo "$routing" | grep -qx "$s" || { warn "$s in AGENTS.md but not in routing table"; c3_hit=1; }; done
[ $c3_hit -eq 0 ] && pass "AGENTS.md and routing table consistent"

# --- Check 4: BUILD-LOG.md size ---
echo ""
echo "## Check 4: BUILD-LOG.md size"
if [ -f web/BUILD-LOG.md ]; then
  lines=$(wc -l < web/BUILD-LOG.md | tr -d ' ')
  [ "$lines" -gt 200 ] && warn "web/BUILD-LOG.md is $lines lines (>200) — consider rotation" || pass "web/BUILD-LOG.md is $lines lines"
else
  warn "web/BUILD-LOG.md not found"
fi

# --- Check 5: Rebuild-phase expiry ---
echo ""
echo "## Check 5: CLAUDE.md rebuild-phase expiry"
b1_shipped=0
ls planning/done/ 2>/dev/null | grep -qi 'bundle-1' && b1_shipped=1
[ -f planning/now/bundle-1.md ] && grep -qE '^status:\s*(done|shipped)' planning/now/bundle-1.md 2>/dev/null && b1_shipped=1
[ $b1_shipped -eq 1 ] \
  && warn "b1 appears shipped — review rebuild-phase rules in CLAUDE.md for removal" \
  || pass "b1 still active — rebuild-phase rules apply"

# --- Check 6: Untracked _audit/ files ---
echo ""
echo "## Check 6: Untracked _audit/ files"
if [ -d _audit ]; then
  untracked=()
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    git ls-files --error-unmatch "$f" >/dev/null 2>&1 || untracked+=("$f")
  done < <(find _audit -type f \( -name '*.jsonl' -o -name '*.html' \) 2>/dev/null)
  if [ ${#untracked[@]} -gt 0 ]; then
    warn "${#untracked[@]} untracked audit file(s) in _audit/ (run git ls-files _audit to see)"
  else
    pass "All _audit/ data files tracked (or none present)"
  fi
else
  pass "No _audit/ directory"
fi

# --- Summary ---
echo ""
echo "--- Summary: $fails failure(s), $warns warning(s) ---"
[ $fails -eq 0 ] && exit 0 || exit 1
