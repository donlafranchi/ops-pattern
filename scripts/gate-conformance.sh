#!/usr/bin/env bash
# Gate conformance — the scenario → review → ticket chain.
#
# Answers three questions and nothing else:
#   1. Is there a scenario in an approved lane with no review file?
#   2. Does a ticket reference a scenario that is not in an approved lane?
#   3. Did a scenario move lanes without its review moving with it?
#
# It reports and it blocks (non-zero exit on any ✗). It does NOT advance
# anything, write anything, or decide anything. A review is a judgment call,
# and automation that silently performs one is worse than the drop it prevents.
#
# Written 2026-09-07 after the read-firewall was ticked by eye twice in one
# month. Same idiom as harness-conformance.sh on purpose — one house style.
#
# Known gap, found 2026-09-07 (F056): none of the three checks catches an
# approved scenario sitting in next/ or now/ with an OPEN EXTEND from its own
# review. Check 1 only asks "does a review file exist"; Check 2 only asks
# "is the ticket's scenario in an approved lane." A scenario can satisfy both
# while its review still says EXTEND unmet, and nothing here reads the
# review's verdict. F056 rode from backlog/ to next/ alongside F055 and F058
# on 2026-09-04's combined review (PROCEED on F055/F058, EXTEND on F056) and
# nothing caught the mismatch until a PM re-read on 2026-09-07. Related: Check
# 3's fnum() takes the FIRST F-number in a combined review's filename
# (review-F055-F058-*.md -> F055), so a combined review is only ever compared
# against one of the scenarios it covers — a second scenario stranded in a
# different lane from the review would not be flagged either. Not fixed here;
# recorded so the next pass on this script starts from a known list.
set -uo pipefail
cd "$(dirname "$0")/.."

fails=0; warns=0
fail() { echo "  ✗ $1"; fails=$((fails + 1)); }
warn() { echo "  ⚠ $1"; warns=$((warns + 1)); }
pass() { echo "  ✓ $1"; }

APPROVED_LANES="planning/next planning/now"

# F-number from any scenario/review filename: scenario-F060-slug.md -> F060
fnum() { basename "$1" | grep -oE 'F[0-9]{3}' | head -1; }

# --- Check 1: approved scenario with no review ---
echo "## Check 1: every scenario in an approved lane has a review"
c1=0
for lane in $APPROVED_LANES; do
  [ -d "$lane" ] || continue
  for s in "$lane"/scenario-F*.md; do
    [ -e "$s" ] || continue
    f=$(fnum "$s"); [ -n "$f" ] || continue
    if ! ls "$lane"/review-*"$f"*.md >/dev/null 2>&1; then
      # A combined review (review-F055-F058-*.md) counts if it names this F-number.
      if ! grep -rl "$f" "$lane"/review-*.md >/dev/null 2>&1; then
        fail "$f approved in $lane with no review file — rebuild rule 1"; c1=1
      else
        warn "$f is covered only by a combined review — split it into review-$f.md on the next touch"; c1=1
      fi
    fi
  done
done
[ $c1 -eq 0 ] && pass "Every approved scenario has a review in its own lane"

# --- Check 2: tickets referencing unapproved scenarios ---
echo ""
echo "## Check 2: no open ticket references an unapproved scenario"
c2=0
for t in development/tickets/T*.md; do
  [ -e "$t" ] || continue
  # Scenario: lines that point at a planning path, plus bare F-numbers on a Scenario: line.
  refs=$(grep -iE '^\*\*Scenario:' "$t" 2>/dev/null | grep -oE 'F[0-9]{3}' | sort -u)
  for f in $refs; do
    found=""
    for lane in $APPROVED_LANES; do
      ls "$lane"/scenario-*"$f"*.md >/dev/null 2>&1 && found="$lane"
    done
    if [ -z "$found" ]; then
      if ls planning/backlog/scenario-*"$f"*.md >/dev/null 2>&1; then
        fail "$(basename "$t") references $f, which is still in planning/backlog/ — build cannot read backlog"; c2=1
      elif ls planning/done/**/scenario-*"$f"*.md >/dev/null 2>&1 || ls planning/archive/**/scenario-*"$f"*.md >/dev/null 2>&1; then
        warn "$(basename "$t") references $f, which is closed or archived — stale ticket?"; c2=1
      else
        warn "$(basename "$t") references $f, which has no scenario file anywhere"; c2=1
      fi
    fi
  done
done
[ $c2 -eq 0 ] && pass "Every open ticket points at an approved scenario"

# --- Check 3: review stranded in a different lane from its scenario ---
echo ""
echo "## Check 3: reviews sit in the same lane as their scenario"
c3=0
for lane in planning/backlog planning/next planning/now; do
  [ -d "$lane" ] || continue
  for r in "$lane"/review-F*.md; do
    [ -e "$r" ] || continue
    f=$(fnum "$r"); [ -n "$f" ] || continue
    # Combined reviews cover several F-numbers; check the first only, and warn not fail.
    combined=0
    [ "$(basename "$r" | grep -cE 'F[0-9]{3}-F[0-9]{3}')" -gt 0 ] && combined=1
    slane=""
    for l in planning/backlog planning/next planning/now; do
      ls "$l"/scenario-*"$f"*.md >/dev/null 2>&1 && slane="$l"
    done
    if [ -n "$slane" ] && [ "$slane" != "$lane" ]; then
      if [ $combined -eq 1 ]; then
        warn "$(basename "$r") is a combined review in $lane while $f sits in $slane — split on next touch"; c3=1
      else
        fail "$(basename "$r") is in $lane but its scenario is in $slane — a review travels with its scenario"; c3=1
      fi
    fi
  done
done
[ $c3 -eq 0 ] && pass "No review is stranded away from its scenario"

echo ""
echo "─────────────────────────────────────────────"
if [ $fails -gt 0 ]; then
  echo "GATE CONFORMANCE: $fails blocking, $warns advisory."
  echo "Blocking findings are stops, not suggestions. Fix or record a deviation before ticketing or building."
  exit 1
fi
echo "GATE CONFORMANCE: clean ($warns advisory)."
exit 0
