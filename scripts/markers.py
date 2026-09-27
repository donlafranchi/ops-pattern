#!/usr/bin/env python3
"""Markers: facts written inline where they are true, and everything built from them.

The pattern is `process/LIVING-DOCS.md`. Three
inline markers and one file field:

  `[open-question owner=<don|cowork|code> raised=YYYY-MM-DD] question` where raised -> STATUS.md
  `[guards F093.4]` on the check that discharges F093 criterion 4                 -> coverage map
  `[binds tiers=<planning,code|none> surfaces=<a,b>]` ending a DECISIONS.md line  -> constraints/<tier>.md
  `[replaces 2026-09-22: exact old text]`, `[replaces F059: exact old text]`, `[replaces path.md]`
      on a DECISIONS.md line that supersedes something; the old text must be gone and in git
  `[evidence YYYY-MM-DD from=<source>: what was seen]` on a decision a user's action or words changed
  accepted-risks/*.json "owner" and "review_by"                     -> lint fails once review_by passes
  `gates: launch` in a scenario's frontmatter                       -> its Issues, or none

  python3 scripts/markers.py lint [FILE...]           # default: every tracked file, plus the rest
  python3 scripts/markers.py risks [DIR]              # accepted-risk owners and dates only
  python3 scripts/markers.py index [--code DIR]       # open questions, markdown
  python3 scripts/markers.py coverage [--code DIR] [--summary] [F###...]
  python3 scripts/markers.py constraints [--check]    # write, or diff, constraints/*.md
  python3 scripts/markers.py building [--code DIR]    # is `building` backed by code?
  python3 scripts/markers.py gating                   # does every gating scenario have an Issue?

A marker inside backticks is a mention, not a marker. `--code` defaults to a
socialus-web checkout beside this repo, read at CODE_REF (origin/main).
"""
import datetime, glob, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
TODAY = datetime.date.today()
OWNERS = ("don", "cowork", "code")
TIERS = ("planning", "code")
BINDS_FROM = datetime.date(2026, 9, 21)  # every decision on or after this date must say what it binds
WEB = "https://github.com/donlafranchi/socialus-web"
CODE_REF = os.environ.get("CODE_REF", "origin/main")
PLANNING = os.environ.get("MARKERS_PLANNING", "planning")  # fixtures point this elsewhere

# Built from pieces so this file never contains a marker of its own.
B = r"\["
OQ = "open-" + "question"
ANY = {
    "oq": re.compile(B + r"open[- ]?question", re.I),
    "guards": re.compile(B + r"guards?(?=[\s\]])", re.I),
    "binds": re.compile(B + r"binds?(?=[\s\]])", re.I),
    "rep": re.compile(B + r"(replac\w*|supersed[\w-]*)", re.I),
    "ev": re.compile(B + r"evidence\b", re.I),
}
LIST = r"[a-z0-9-]+(?:,[a-z0-9-]+)*"
FULL_OQ = re.compile(B + OQ + r" owner=(\w+) raised=([0-9-]+)\]")
FULL_GUARDS = re.compile(B + r"guards (F\d{3})\.(\d+[a-z]?)\]")
FULL_BINDS = re.compile(B + r"binds tiers=(" + LIST + r")(?: surfaces=(" + LIST + r"))?\]")
FULL_REP = re.compile(B + r"replaces (?:(none)|(\d{4}-\d{2}-\d{2}|F\d{3}): ([^\]]+?)|([\w./-]+\.md))\]")
FULL_EV = re.compile(B + r"evidence (\d{4}-\d{2}-\d{2}) from=(\S+): ([^\]]+?)\]")
CLAIM = re.compile(r"\b(revers(e|es|ed|ing)|replac(e|es|ed|ing)|supersed(e|es|ed|ing)|overrul\w*)\b", re.I)
EVIDENCE_VIEW_BUILT = False  # process/LIVING-DOCS.md: deferred until the first evidence tag lands
DECISION = re.compile(r"^- \*\*(\d{4}-\d{2}-\d{2}) — (.+?)\*\*")


def blank_code_spans(line):
    return re.sub(r"`[^`]*`", lambda c: " " * len(c.group()), line)


def parse_line(path, line):
    """Yield (kind, ok, info). info is an error string, or the parsed marker."""
    bare = blank_code_spans(line)
    for m in ANY["oq"].finditer(bare):
        f = FULL_OQ.match(bare, m.start())
        if not f:
            end = bare.find("]", m.start())
            head = bare[m.start(): end + 1 if end != -1 else m.start() + 60]
            missing = [k for k in ("owner=", "raised=") if k not in head]
            yield "oq", False, (f"missing {' and '.join(missing)}" if missing
                                else "not `[" + OQ + " owner=… raised=YYYY-MM-DD]`") + f": {head.strip()}"
            continue
        owner, raised = f.groups()
        if owner not in OWNERS:
            yield "oq", False, f"owner={owner} is not one of {', '.join(OWNERS)}"; continue
        try:
            d = datetime.date.fromisoformat(raised)
        except ValueError:
            yield "oq", False, f"raised={raised} is not a date"; continue
        if d > TODAY:
            yield "oq", False, f"raised={raised} is in the future"; continue
        text = re.sub(r"(\*/|-->)\s*$", "", line[f.end():]).replace("**", "").strip(" *_-—:\t\r\n")
        if not text:
            yield "oq", False, "no question after the marker"; continue
        if os.path.basename(path) == "DECISIONS.md":
            yield "oq", False, "DECISIONS.md holds answers, not questions — mark it where it was raised"; continue
        yield "oq", True, (owner, d, text)
    for m in ANY["guards"].finditer(bare):
        f = FULL_GUARDS.match(bare, m.start())
        if not f:
            yield "guards", False, "not `[guards F###.N]` — one scenario criterion per marker"; continue
        yield "guards", True, f.groups()
    for m in ANY["binds"].finditer(bare):
        f = FULL_BINDS.match(bare, m.start())
        if not f:
            yield "binds", False, "not `[binds tiers=<planning,code|none> surfaces=<a,b>]`"; continue
        tiers = f.group(1).split(",")
        surfaces = f.group(2).split(",") if f.group(2) else []
        if os.path.basename(path) != "DECISIONS.md":
            yield "binds", False, "a binds tag lives on a DECISIONS.md line and nowhere else"; continue
        if tiers == ["none"]:
            yield "binds", True, ([], surfaces); continue
        bad = [t for t in tiers if t not in TIERS]
        if bad:
            yield "binds", False, f"tier {', '.join(bad)} is not one of {', '.join(TIERS)} (or none)"; continue
        if not surfaces:
            yield "binds", False, "a decision that binds a tier names the surfaces it binds"; continue
        yield "binds", True, (tiers, surfaces)
    dec = os.path.basename(path) == "DECISIONS.md"
    for m in ANY["rep"].finditer(bare):
        f = FULL_REP.match(bare, m.start())
        if not f:
            yield "rep", False, "not `[replaces YYYY-MM-DD: old text]`, `[replaces F###: old text]`, `[replaces path.md]` or `[replaces none]`"; continue
        if not dec:
            yield "rep", False, "a replaces tag lives on a DECISIONS.md line — a supersession is a ruling"; continue
        yield "rep", True, ("none",) if f.group(1) else ("path", f.group(4)) if f.group(4) else (f.group(2), f.group(3).strip())
    for m in ANY["ev"].finditer(bare):
        f = FULL_EV.match(bare, m.start())
        if not f:
            yield "ev", False, "not `[evidence YYYY-MM-DD from=<source>: what was seen]`"; continue
        try:
            d = datetime.date.fromisoformat(f.group(1))
        except ValueError:
            yield "ev", False, f"{f.group(1)} is not a date"; continue
        if d > TODAY:
            yield "ev", False, f"evidence dated {d} is in the future"; continue
        if not dec:
            yield "ev", False, "an evidence tag lives on the DECISIONS.md line it changed"; continue
        yield "ev", True, f.groups()


def read_lines(path):
    try:
        with open(path, encoding="utf-8") as fh:
            return fh.read().splitlines()
    except (UnicodeDecodeError, IsADirectoryError, FileNotFoundError):
        return []


def tracked():
    out = subprocess.run(["git", "ls-files"], capture_output=True, text=True).stdout.split()
    return [p for p in out if not p.startswith("scripts/fixtures/")]


def find_code(argv):
    if "--code" in argv:
        i = argv.index("--code"); c = argv[i + 1]; del argv[i:i + 2]
        return c
    for c in (os.environ.get("CODE_REPO", ""), os.path.join(ROOT, "..", "socialus-web"),
              os.path.expanduser("~/Projects/socialus-web")):
        if c and os.path.exists(os.path.join(c, ".git")):
            return os.path.abspath(c)
    return ""


def code_lines(code):
    """(path, n, line) for every marker-bearing line in the code repo at CODE_REF."""
    if not code:
        return None
    r = subprocess.run(["git", "-C", code, "grep", "-n", "-I", "-i", "-E",
                        B + r"(open[- ]?question|guards?[[:space:]]|binds?[[:space:]]|guards?]|binds?])", CODE_REF, "--"],
                       capture_output=True, text=True)
    if r.returncode > 1:
        return None
    rows = []
    for row in r.stdout.splitlines():
        _, path, n, line = row.split(":", 3)
        if not path.startswith("scripts/fixtures/"):
            rows.append((path, int(n), line))
    return rows


# ------------------------------------------------------------------ scenarios
def criteria(fid):
    """Criterion ids of a current scenario, None if the file is gone."""
    lines = read_lines(f"{PLANNING}/scenario-{fid}.md")
    if not lines:
        return None
    out, inside = [], False
    for l in lines:
        if l.startswith("## "):
            inside = l.strip() == "## Acceptance"; continue
        m = re.match(r"^(\d+[a-z]?)\.\s", l)
        if inside and m:
            out.append(m.group(1))
    return out


def ever_existed(fid):
    r = subprocess.run(["git", "log", "--all", "--oneline", "-1", "--", f"planning/scenario-{fid}.md"],
                       capture_output=True, text=True)
    return bool(r.stdout.strip())


def status_of(fid):
    for l in read_lines(f"planning/scenario-{fid}.md")[:12]:
        if l.startswith("status:"):
            return l.split(":", 1)[1].strip()
    return None


def guard_referent_error(fid, crit):
    have = criteria(fid)
    if have is None:
        return None if ever_existed(fid) else f"{fid} is not a scenario, now or in history"
    return None if crit in have else f"{fid} has no criterion {crit} (it has {', '.join(have) or 'none'})"


# ---------------------------------------------------------------- decisions
def decisions(path="DECISIONS.md"):
    """One dict per DECISIONS.md entry: line, date, headline, binds, replaces, evidence."""
    out = []
    for n, l in enumerate(read_lines(path), 1):
        m = DECISION.match(l)
        if not m:
            continue
        found = [(k, info) for k, ok, info in parse_line(path, l) if ok]
        out.append({"n": n, "date": m.group(1), "headline": m.group(2).strip().rstrip("."),
                    "binds": next((i for k, i in found if k == "binds"), None),
                    "reps": [i for k, i in found if k == "rep"],
                    "evidence": [i for k, i in found if k == "ev"], "line": l})
    return out


def in_history(path, text=None):
    args = ["git", "log", "--all", "--oneline", "-1"] + ([f"-S{text}"] if text else []) + ["--", path]
    return bool(subprocess.run(args, capture_output=True, text=True).stdout.strip())


def replace_errors(path):
    """A decision that replaces something names it, and the thing named is gone from the live file."""
    lines, errs, real = read_lines(path), [], path == "DECISIONS.md"
    live = "\n".join(re.sub(B + r"replaces [^\]]*\]", "", l) for l in lines)
    for e in decisions(path):
        for ref in e["reps"]:
            if ref[0] == "none":
                continue
            where = f"{path}:{e['n']}"
            if ref[0] == "path":
                if os.path.exists(ref[1]):
                    errs.append(f"{where}: replaces {ref[1]}, which still exists — delete it; git holds it")
                elif real and not in_history(ref[1]):
                    errs.append(f"{where}: replaces {ref[1]}, which never existed")
                continue
            target, text = ref
            if target.startswith("F"):
                sp = f"{PLANNING}/scenario-{target}.md"
                if text in "\n".join(read_lines(sp)):
                    errs.append(f"{where}: replaces text still live in {sp} — prune it")
                elif real and not in_history(f"planning/scenario-{target}.md", text):
                    errs.append(f"{where}: replaces text {target} never held — nothing to find in git")
            else:
                if text in live:
                    errs.append(f"{where}: replaces {target}: {text[:40]}…, which is still in {path} — delete it; git holds it")
                elif real and not in_history(path, text):
                    errs.append(f"{where}: replaces {target}: {text[:40]}…, which {path} never held — nothing to find in git")
    return errs


def render_constraints(tier):
    ds = decisions()
    rows = [e for e in ds if e["binds"] and tier in e["binds"][0]]
    untagged = sum(1 for e in ds if e["binds"] is None)
    o = [f"# CONSTRAINTS — {tier} tier", "",
         "> **Generated by `python3 scripts/markers.py constraints` — never edit this file.** A hand edit is",
         "> lost on the next run, and `scripts/lint.sh` fails whenever this file differs from what",
         "> `DECISIONS.md` generates. To change it, change the `[binds …]` tag on the decision.",
         ">",
         f"> Every ratified decision whose tag binds the **{tier}** tier, newest first. `DECISIONS.md` holds",
         "> only live decisions — a superseded one is deleted — so nothing below conflicts with anything",
         "> else here. If two lines ever seem to, the newer wins (`[newer-decision-wins]`).",
         f"> **{untagged} older decisions carry no tag yet and are not listed** — tagging is required from",
         f"> {BINDS_FROM.isoformat()} onward. Absent here is not the same as not binding.", ""]
    o += [f"- **{e['date']}** · {', '.join(e['binds'][1])} — {e['headline']}" for e in rows] or ["None tagged."]
    return "\n".join(o) + "\n"


# ------------------------------------------------------------------- risks
def risk_errors(directory="accepted-risks"):
    errs = []
    for path in sorted(glob.glob(os.path.join(directory, "*.json"))):
        try:
            e = json.load(open(path))
        except Exception as x:
            errs.append((path, f"not valid JSON — {x}")); continue
        if e.get("owner") not in OWNERS:
            errs.append((path, f"owner={e.get('owner')!r} — must be one of {', '.join(OWNERS)}"))
        try:
            due = datetime.date.fromisoformat(e.get("review_by") or "")
        except ValueError:
            errs.append((path, f"review_by={e.get('review_by')!r} is not a date")); continue
        if due < TODAY:
            errs.append((path, f"review_by {due} has passed — argue it again (a new DECISIONS.md line and a "
                               f"new date) or delete the entry"))
    return errs


# -------------------------------------------------------------------- lint
def lint(files):
    errs = []
    for p in files:
        for n, l in enumerate(read_lines(p), 1):
            found = list(parse_line(p, l))
            for kind, ok, info in found:
                if not ok:
                    errs.append(f"{p}:{n}: {info}")
                elif kind == "guards":
                    e = guard_referent_error(*info)
                    if e:
                        errs.append(f"{p}:{n}: {e}")
            if n < 15 and os.path.basename(p).startswith("scenario-") and l.startswith("gates:") \
                    and l.split(":", 1)[1].strip() != "launch":
                errs.append(f"{p}:{n}: `gates:` names what the scenario gates — the only gate is `launch`")
            if os.path.basename(p) == "DECISIONS.md":
                m = DECISION.match(l)
                if m and datetime.date.fromisoformat(m.group(1)) >= BINDS_FROM:
                    if not any(k == "binds" for k, _, _ in found):
                        errs.append(f"{p}:{n}: a decision from {BINDS_FROM} on must end with a `[binds …]` tag")
                    prose = re.sub(B + r"[^\]]*\]", "", blank_code_spans(l))
                    if CLAIM.search(prose) and not any(k == "rep" for k, _, _ in found):
                        errs.append(f"{p}:{n}: says it {CLAIM.search(prose).group(0).lower()} something but names nothing — "
                                    "add `[replaces …]`, or `[replaces none]` if the word is not a supersession")
        if os.path.basename(p) == "DECISIONS.md":
            errs += replace_errors(p)
            if not EVIDENCE_VIEW_BUILT and any(e["evidence"] for e in decisions(p)) and p == "DECISIONS.md":
                errs.append(f"{p}: the first `[evidence …]` tag has landed — build the evidence view deferred in "
                            "process/LIVING-DOCS.md, then set EVIDENCE_VIEW_BUILT")
    return errs


def main():
    argv = sys.argv[1:]
    mode = argv.pop(0) if argv else ""

    if mode == "lint":
        errs = lint(argv or tracked())
        if not argv:
            errs += [f"{p}: {e}" for p, e in risk_errors()]
            # socialus-web's CI checks its markers' grammar but cannot see this private repo, so the
            # claims its checks make about scenarios are checked here, whenever a checkout is at hand.
            for path, n, l in code_lines(find_code([])) or []:
                for kind, ok, info in parse_line(path, l):
                    e = kind == "guards" and ok and guard_referent_error(*info)
                    if e:
                        errs.append(f"socialus-web {path}:{n}: {e}")
            for tier in TIERS:
                path = f"constraints/{tier}.md"
                if not os.path.exists(path) or open(path).read() != render_constraints(tier):
                    errs.append(f"{path}: stale or missing — a decision binds this tier and the file does not "
                                f"say so. Run `python3 scripts/markers.py constraints`")
            for path in ["STATUS.md", "README.md"] + [f"constraints/{t}.md" for t in TIERS]:
                head = "\n".join(read_lines(path)[:8])
                if head and not (re.search(r"generated", head, re.I)
                                 and re.search(r"never (hand-)?edit|hand-edit is lost", head, re.I)):
                    errs.append(f"{path}: a generated file must say in its own header that it is generated and never edited")
        for e in errs:
            print(f"markers: {e}")
        sys.exit(1 if errs else 0)

    if mode == "risks":
        errs = risk_errors(argv[0] if argv else "accepted-risks")
        for p, e in errs:
            print(f"markers: {p}: {e}")
        sys.exit(1 if errs else 0)

    if mode == "constraints":
        stale = []
        for tier in TIERS:
            path, body = f"constraints/{tier}.md", render_constraints(tier)
            if (open(path).read() if os.path.exists(path) else None) != body:
                stale.append(path)
                if "--check" not in argv:
                    os.makedirs("constraints", exist_ok=True)
                    open(path, "w").write(body)
        if "--check" in argv:
            for p in stale:
                print(f"markers: {p} is stale")
            sys.exit(1 if stale else 0)
        print("\n".join(f"wrote {p}" for p in stale) or "constraints: unchanged")
        return

    code = find_code(argv)
    rows = code_lines(code)
    sources = [((p, "local"), n, l) for p in tracked() for n, l in enumerate(read_lines(p), 1)]
    gaps = []
    if rows is None:
        gaps.append(f"the `socialus-web` code at `{CODE_REF}`" + ("" if code else " — no checkout"))
    else:
        sources += [((p, "code"), n, l) for p, n, l in rows]

    def link(where, n):
        path, kind = where
        if kind == "local":
            return f"[{path}:{n}]({path}#L{n})"
        if kind == "code":
            return f"[socialus-web {path}:{n}]({WEB}/blob/main/{path}#L{n})"
        return f"[{path}]({WEB}/issues/{path[1:]})"

    if mode == "index":
        r = subprocess.run(["gh", "issue", "list", "-R", "donlafranchi/socialus-web", "--state", "open",
                            "--limit", "1000", "--json", "number,body"], capture_output=True, text=True)
        if r.returncode == 0:
            for issue in json.loads(r.stdout):
                for n, l in enumerate((issue["body"] or "").splitlines(), 1):
                    sources.append(((f"#{issue['number']}", "issue"), n, l))
        else:
            gaps.append("open `socialus-web` Issues — `gh` could not read them")
        good, bad = [], []
        for where, n, l in sources:
            for kind, ok, info in parse_line(where[0], l):
                if kind == "oq":
                    (good if ok else bad).append((where, n, info))
        good.sort(key=lambda g: (g[2][1], g[2][0]))
        print("## Open questions\n")
        print("Every open-question marker, found by scanning — nobody maintains this list.")
        print("Oldest first. Rule and grammar: `process/PIPELINE.md` § Open questions.\n")
        if not good:
            print("None marked.")
        labels = {"don": "Waiting on Don", "cowork": "Cowork owes an answer", "code": "Code owes an answer"}
        for owner in OWNERS:
            mine = [g for g in good if g[2][0] == owner]
            if mine:
                print(f"\n**{labels[owner]}** ({len(mine)})\n")
                for where, n, (_, d, text) in mine:
                    short = text if len(text) <= 160 else text[:157].rstrip() + "…"
                    if short.count("`") % 2:
                        short = short.replace("`", "")
                    print(f"- {(TODAY - d).days}d · {short} — {link(where, n)}")
        if bad:
            print("\n**Malformed — the lint gates this repo only, so these slipped through:**\n")
            for where, n, err in bad:
                print(f"- {link(where, n)} — {err}")
        if gaps:
            print("\n**Not scanned this run:** " + "; ".join(gaps) + ".")
        return

    if mode == "coverage":
        summary = "--summary" in argv
        wanted = [a for a in argv if re.fullmatch(r"F\d{3}", a)]
        claims, dangling = {}, []
        for where, n, l in sources:
            for kind, ok, info in parse_line(where[0], l):
                if kind == "guards" and ok:
                    e = guard_referent_error(*info)
                    if e:
                        dangling.append((where, n, e))
                    else:
                        claims.setdefault(info, []).append((where, n))
        scen = sorted(os.path.basename(p)[9:13] for p in glob.glob("planning/scenario-F*.md"))
        scen = [f for f in scen if f in wanted or (not wanted and status_of(f) in ("approved", "building"))]
        if summary:
            print("## Guard coverage\n")
            print("Criteria of approved and building scenarios that a check claims with a `[guards F###.N]`")
            print("marker. **Unclaimed is not the same as untested — it means nothing says so, which under")
            print("`[guard-proves-itself]` counts as absent.** Full map: `python3 scripts/markers.py coverage`.\n")
            none = []
            for f in scen:
                cs = criteria(f) or []
                have = [c for c in cs if (f, c) in claims]
                if not have:
                    none.append(f); continue
                miss = [c for c in cs if (f, c) not in claims]
                print(f"- **{f}** · {len(have)} of {len(cs)} claimed" + (f" · unclaimed: {', '.join(miss)}" if miss else ""))
            if none:
                print(f"- **No criterion claimed by any check** ({len(none)}): {', '.join(none)}")
        else:
            for f in scen:
                print(f"## {f} ({status_of(f)})\n")
                for c in criteria(f) or []:
                    where = claims.get((f, c), [])
                    print(f"- **{c}** — " + ("; ".join(link(w, n) for w, n in where) if where else "**no marked check**"))
                print()
        if dangling:
            print("\n**Markers pointing at nothing:**\n")
            for where, n, e in dangling:
                print(f"- {link(where, n)} — {e}")
        if gaps:
            print("\n**Not scanned this run:** " + "; ".join(gaps) + ".")
        return

    if mode == "building":
        print("## Is `building` backed by code?\n")
        print("Each scenario whose frontmatter says `building`, against what names it in `socialus-web`: commits")
        print("and files on main, and branches. Frontmatter is a claim; this is the evidence.\n")
        for p in sorted(glob.glob("planning/scenario-F*.md")):
            f = os.path.basename(p)[9:13]
            if status_of(f) != "building":
                continue
            if not code:
                print(f"- **{f}** · not checked — no `socialus-web` checkout"); continue
            run = lambda *a: subprocess.run(["git", "-C", code, *a], capture_output=True, text=True).stdout.count("\n")
            commits = run("log", CODE_REF, "--oneline", "-i", f"--grep={f}")
            files = run("grep", "-l", f, CODE_REF, "--")
            branches = run("branch", "-r", "--list", f"origin/{f.lower()}-*")
            plural = lambda n, w, s="s": f"{n} {w}{s * (n != 1)}"
            print(f"- **{f}** · " + ("**nothing in the code names it** — no commit, file or branch" if not (commits or files or branches)
                  else f"{plural(commits, 'commit')} on main · {plural(files, 'file')} naming it · {plural(branches, 'branch', 'es')}"))
        return

    if mode == "gating":
        print("## Gating launch — does each have an Issue?\n")
        print("Every scenario whose frontmatter says `gates: launch`, against the `socialus-web` Issues")
        print("naming it. Five approved gating scenarios once had none, and nothing noticed.\n")
        r = subprocess.run(["gh", "issue", "list", "-R", "donlafranchi/socialus-web", "--state", "all",
                            "--limit", "1000", "--json", "number,title,state"], capture_output=True, text=True)
        issues = json.loads(r.stdout) if r.returncode == 0 else None
        for p in sorted(glob.glob("planning/scenario-F*.md")):
            f = os.path.basename(p)[9:13]
            if not any(l.strip() == "gates: launch" for l in read_lines(p)[:15]):
                continue
            if issues is None:
                print(f"- **{f}** · not checked — `gh` could not read Issues"); continue
            mine = [i for i in issues if re.match(rf"{f}\b", i["title"])]
            st = status_of(f)
            print(f"- **{f}** ({st}) · " + (", ".join(f"#{i['number']} {i['state'].lower()}" for i in mine) if mine
                  else "**no Issue**" + (" — approved and gating launch with nothing to build from" if st in ("approved", "building") else "")))
        return

    print(__doc__, file=sys.stderr)
    sys.exit(2)


if __name__ == "__main__":
    main()
