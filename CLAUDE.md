# SocialUs — planning repo

Local discovery app: buy, sell, trade, gather. Launching 2026-10-30 to one metro. App code lives in the sibling repo `socialus-web` (Vercel deploy on push to main; Supabase project `socialus-db`). This repo is planning only.

## Read first, every session

1. `STATUS.md` — what is true now. One screen.
2. `ROADMAP.md` — Now / Next / Later / Won't.
3. `RULES.md` — the six absolutes and the test that admits a seventh. Everything else is a guideline; break one if you can say why.

## Where truth lives

- **How the system works:** the code in `socialus-web`. If the code can answer it, read the code, don't write it down.
- **Why it is that way:** `DECISIONS.md`. One dated line per ruling. Append, never edit.
- **What is decided but not built:** `planning/` scenarios with `status: approved`, and `ROADMAP.md`.
- **What might be built someday:** `IMAGINE.md`. Nothing there is a commitment. Scenarios may not cite it.
- **The product model:** `product/` — nouns, verbs, surfaces, systems. Must match the code. If it doesn't, fix the doc in the same session you notice.

If a directory isn't listed here, don't read it. Anything not in the tree is not current — git history is the archive (`git log`, tag `archive-2026-09`).

## State

- A scenario's state is its frontmatter `status`: `draft` → `approved` → `building`. Shipped scenarios are deleted at sync.
- A ticket's state is its Issue label in `socialus-web`. Tickets never live here.
- `HANDOFF.md` is the one bridge: what is approved for build, one line each. Cowork writes it, Code reads it.

## Who does what

| Who | Owns | Never |
|---|---|---|
| Don | rulings, judgment, domain knowledge | reads more than STATUS + ROADMAP unless he asks |
| Cowork — `plan` `review` `sync` | this repo: scenarios, STATUS, ROADMAP, HANDOFF, DECISIONS | writes to `socialus-web` |
| Code — `ticket` `build` | `socialus-web`: architecture notes, issues, code, PRs | writes to this repo |

Code is the architect. Any ticket touching schema, RLS, or routes starts with a ≤20-line architecture note in the Issue. Cowork reviews it in a comment. Don sees it only if they disagree.

## How to talk to Don

- Bullets, one line each. No preamble, no recap, no narration.
- Name things in plain words; a number in brackets after, if useful.
- Questions reach him as A/B/C with one-line trade-offs and a recommendation. Ask only when a fact only he has is missing, or the call affects the deadline.
- Reports open: `Status: Done | Blocked | Question — one sentence. Next: the ask.` Detail on "expand".
- End with the next action, not a summary.

## Commits

- Cowork commits and pushes its own doc changes here. Message: `docs: what`.
- Code commits in `socialus-web`, branch per ticket, asks before merge to main (it deploys).
- Never cross-commit (guideline — the two-repo split enforces it). Never rewrite history (rule 3).

## Naming

Schema names are durable; UI labels translate them. The table is in `product/foundation/nouns.md`. Language is pro-competition, for all Americans — see `product/foundation/what-this-is.md`.
