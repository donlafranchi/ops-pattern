#!/usr/bin/env bash
# The open-question marker: `[open-question owner=<don|cowork|code> raised=YYYY-MM-DD] the question`.
# The rule it enforces is `process/PIPELINE.md` § Open questions.
#
#   bash scripts/open-questions.sh lint [FILE...]   # default: every tracked file here
#   bash scripts/open-questions.sh index [CODE]     # markdown index; CODE = socialus-web checkout
#
# `lint` exits 1 on any malformed marker. `index` never fails: what it cannot
# read it names. A marker inside backticks is a mention, not a marker.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

MODE="${1:-}"; shift || true
case "$MODE" in lint|index) ;; *) echo "usage: $0 lint [FILE...] | index [CODE]" >&2; exit 2 ;; esac

CODE=""
if [ "$MODE" = index ]; then
  for c in "${1:-}" "${CODE_REPO:-}" "$ROOT/../socialus-web" "$HOME/Projects/socialus-web"; do
    [ -n "$c" ] && [ -d "$c/.git" -o -f "$c/.git" ] && CODE="$(cd "$c" && pwd)" && break
  done
  FILES=()
elif [ $# -gt 0 ]; then
  FILES=("$@")
else
  FILES=()
  while IFS= read -r f; do FILES+=("$f"); done < <(git ls-files | grep -v '^scripts/fixtures/')
fi

MODE="$MODE" CODE="$CODE" python3 - "${FILES[@]+"${FILES[@]}"}" <<'PY'
import datetime, json, os, re, subprocess, sys

MODE, CODE = os.environ["MODE"], os.environ["CODE"]
OWNERS = ("don", "cowork", "code")
ANY = re.compile(r"\[open[- ]?question", re.I)
FULL = re.compile(r"\[open-question owner=(\w+) raised=([0-9-]+)\]")
TODAY = datetime.date.today()

def check(path, n, line):
    """Yield (ok, info) per marker on the line; info is an error or (owner, raised, text)."""
    bare = re.sub(r"`[^`]*`", lambda c: " " * len(c.group()), line)
    for m in ANY.finditer(bare):
        rest = bare[m.start():]
        f = FULL.match(rest)
        if not f:
            head = rest[: rest.find("]") + 1] if "]" in rest else rest[:60]
            missing = [k for k in ("owner=", "raised=") if k not in head]
            why = f"missing {' and '.join(missing)}" if missing else "not `[open-question owner=… raised=YYYY-MM-DD]`"
            yield False, f"{why}: {head.strip()}"
            continue
        owner, raised = f.group(1), f.group(2)
        if owner not in OWNERS:
            yield False, f"owner={owner} is not one of {', '.join(OWNERS)}"; continue
        try:
            d = datetime.date.fromisoformat(raised)
        except ValueError:
            yield False, f"raised={raised} is not a date"; continue
        if d > TODAY:
            yield False, f"raised={raised} is in the future"; continue
        text = line[m.start() + f.end():]
        text = re.sub(r"(\*/|-->)\s*$", "", text).replace("**", "").strip(" *_-—:\t\r\n")
        if not text:
            yield False, "no question after the marker"; continue
        if os.path.basename(path) == "DECISIONS.md":
            yield False, "DECISIONS.md holds answers, not questions — mark it where it was raised"; continue
        yield True, (owner, d, text)

def scan(lines_by_source):
    good, bad = [], []
    for where, n, line in lines_by_source:
        for ok, info in check(where[0], n, line):
            (good if ok else bad).append((where, n, info))
    return good, bad

def local_lines(paths):
    for p in paths:
        try:
            with open(p, encoding="utf-8") as fh:
                for n, line in enumerate(fh, 1):
                    yield (p, "local"), n, line
        except (UnicodeDecodeError, IsADirectoryError, FileNotFoundError):
            continue

if MODE == "lint":
    good, bad = scan(local_lines(sys.argv[1:]))
    for (p, _), n, err in bad:
        print(f"open-question: {p}:{n}: {err}")
    sys.exit(1 if bad else 0)

# ------------------------------------------------------------------ index
tracked = subprocess.run(["git", "ls-files"], capture_output=True, text=True).stdout.split()
tracked = [p for p in tracked if not p.startswith("scripts/fixtures/")]
sources, gaps = list(local_lines(tracked)), []

WEB = "https://github.com/donlafranchi/socialus-web"
if CODE:
    r = subprocess.run(["git", "-C", CODE, "grep", "-n", "-I", "-i", "-E", r"\[open[- ]?question", "origin/main", "--"],
                       capture_output=True, text=True)
    for row in r.stdout.splitlines():
        _, path, n, line = row.split(":", 3)
        if path.startswith("scripts/fixtures/"):
            continue
        sources.append(((path, "code"), int(n), line))
    if r.returncode > 1:
        gaps.append("the `socialus-web` code at `origin/main`")
else:
    gaps.append("the `socialus-web` code — no checkout")

r = subprocess.run(["gh", "issue", "list", "-R", "donlafranchi/socialus-web", "--state", "open",
                    "--limit", "1000", "--json", "number,body"], capture_output=True, text=True)
if r.returncode == 0:
    for issue in json.loads(r.stdout):
        for n, line in enumerate((issue["body"] or "").splitlines(), 1):
            sources.append(((f"#{issue['number']}", "issue"), n, line))
else:
    gaps.append("open `socialus-web` Issues — `gh` could not read them")

def link(where, n):
    path, kind = where
    if kind == "local":
        return f"[{path}:{n}]({path}#L{n})"
    if kind == "code":
        return f"[socialus-web {path}:{n}]({WEB}/blob/main/{path}#L{n})"
    return f"[{path}]({WEB}/issues/{path[1:]})"

good, bad = scan(sources)
good.sort(key=lambda g: (g[2][1], g[2][0]))
print("## Open questions")
print()
print("Every open-question marker, found by scanning — nobody maintains this list.")
print("Oldest first. Rule and grammar: `process/PIPELINE.md` § Open questions.")
print()
if not good:
    print("None marked.")
for owner in OWNERS:
    rows = [g for g in good if g[2][0] == owner]
    if not rows:
        continue
    print()
    print(f"**{ {'don': 'Waiting on Don', 'cowork': 'Cowork owes an answer', 'code': 'Code owes an answer'}[owner] }** ({len(rows)})")
    print()
    for where, n, (_, d, text) in rows:
        age = (TODAY - d).days
        short = text if len(text) <= 160 else text[:157].rstrip() + "…"
        if short.count("`") % 2:
            short = short.replace("`", "")
        print(f"- {age}d · {short} — {link(where, n)}")
if bad:
    print()
    print("**Malformed — the lint gates this repo only, so these slipped through:**")
    print()
    for where, n, err in bad:
        print(f"- {link(where, n)} — {err}")
if gaps:
    print()
    print("**Not scanned this run:** " + "; ".join(gaps) + ".")
PY
