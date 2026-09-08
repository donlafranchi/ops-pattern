#!/usr/bin/env bash
# Migration drift check — does remote match local?
#
# Answers one question: is every migration in web/supabase/migrations/ also
# applied on the linked remote project? Shells `supabase migration list`,
# which prints a Local | Remote | Time table, and reports any migration
# present locally but absent remotely.
#
# Reports and blocks. Never applies. Same idiom as gate-conformance.sh: the
# fail/warn/pass helpers, numbered checks, non-zero exit on any real gap.
#
# Written for T140, after two migrations sat unapplied for an unknown
# period with nothing asking whether they had been run.
#
# Honest degrade (T140 acceptance criterion): if the CLI is missing or the
# project is not linked, this warns and exits 0 — it never claims clean
# when it cannot actually check, and it never fails the session over an
# environment gap that isn't a migration gap.
#
# Known limitation, recorded 2026-09-08: `supabase migration list -o json`
# was tried against this project's real linked remote and the installed
# CLI (v2.90.0) ignored the flag and printed the same plain-text table as
# the default. So this script parses that table's text, not JSON. If a
# future CLI version's table formatting changes (column order, spacing,
# header text), this script's parsing breaks — and it is written to fail
# toward "cannot verify" (warn, exit 0) rather than toward a false "clean",
# per the same honest-degrade acceptance criterion.
set -uo pipefail
cd "$(dirname "$0")/../web" || { echo "  ✗ cannot find web/ from this script's location"; exit 1; }

fails=0; warns=0
fail() { echo "  ✗ $1"; fails=$((fails + 1)); }
warn() { echo "  ⚠ $1"; warns=$((warns + 1)); }
pass() { echo "  ✓ $1"; }

echo "## Migration drift: does remote match local?"

if ! command -v supabase >/dev/null 2>&1; then
  warn "supabase CLI not found on PATH — cannot check drift. Install it before trusting this report."
  echo ""
  echo "─────────────────────────────────────────────"
  echo "MIGRATION CONFORMANCE: unknown (CLI missing)."
  exit 0
fi

output=$(supabase migration list 2>&1)

if echo "$output" | grep -qi "have you run supabase link\|cannot find project ref"; then
  warn "project is not linked (supabase link has not been run) — cannot check drift."
  echo ""
  echo "─────────────────────────────────────────────"
  echo "MIGRATION CONFORMANCE: unknown (not linked)."
  exit 0
fi

# Data rows look like "   038   | 038    | 038        " — three
# pipe-separated columns. The local/remote columns are migration versions,
# which for this project are purely numeric (NNN, or a 14-digit timestamp
# for older-style migrations elsewhere) — requiring digits-only on the
# first column is deliberate, not incidental: it excludes the header row
# ("Local | Remote | Time (UTC)") on purpose, rather than by the coincidence
# that "Local" and "Remote" both happen to be non-empty text. A separator
# row of dashes never matches either.
rows=$(echo "$output" | grep -E '^[[:space:]]*[0-9]+[[:space:]]*\|.*\|')

if [ -z "$rows" ]; then
  warn "could not parse 'supabase migration list' output — format may have changed. Cannot verify drift; not claiming clean."
  echo "--- raw output, for a human to read ---"
  echo "$output"
  echo "─────────────────────────────────────────────"
  echo "MIGRATION CONFORMANCE: unknown (unparseable output)."
  exit 0
fi

gaps=0
seen_versions=""
while IFS='|' read -r local_col remote_col _time_col; do
  local_v=$(echo "$local_col" | xargs)
  remote_v=$(echo "$remote_col" | xargs)
  [ -z "$local_v" ] && continue
  seen_versions="$seen_versions $local_v"
  if [ -z "$remote_v" ]; then
    match=$(ls supabase/migrations/"${local_v}"_*.sql 2>/dev/null | head -1)
    name=$(basename "${match:-${local_v}_unknown.sql}")
    fail "$name is local but not applied to the remote project — run 'npm run db:push' after review"
    gaps=$((gaps + 1))
  fi
done <<< "$rows"

# Cross-check: every migration file on disk must have produced a row above.
# `supabase migration list` scans local files itself — trusting its output
# for "is this applied" is fine, but silently trusting it for "did every
# file even get listed" is the false-clean gap a truncated response or a
# future CLI change could open. A file with no row at all is neither pass
# nor fail — it's unverified, and unverified must not read as clean.
missing=0
for f in supabase/migrations/*.sql; do
  [ -e "$f" ] || continue
  v=$(basename "$f" | grep -oE '^[0-9]+')
  [ -n "$v" ] || continue
  case " $seen_versions " in
    *" $v "*) ;;
    *) warn "$(basename "$f") never appeared in 'supabase migration list' output — cannot verify its remote status"; missing=$((missing + 1)) ;;
  esac
done

if [ $gaps -eq 0 ] && [ $missing -eq 0 ]; then
  pass "Every local migration is applied to the remote project"
fi

echo ""
echo "─────────────────────────────────────────────"
if [ $fails -gt 0 ]; then
  echo "MIGRATION CONFORMANCE: $fails blocking, $warns advisory."
  echo "A migration sitting unapplied is a production defect waiting to be discovered by a user. Push it or explain why not."
  exit 1
fi
echo "MIGRATION CONFORMANCE: clean ($warns advisory)."
exit 0
