# Setting up a second machine

Checklist. Verified against both repos on 2026-09-22 — where this disagrees with the repos, the repos are right.

**Git is the handoff.** Both machines clone from GitHub, both push, main is the truth.

## 1. Clone as siblings

```
~/Projects/
  ops-pattern/      git@github.com:donlafranchi/ops-pattern.git
  socialus-web/     git@github.com:donlafranchi/socialus-web.git
```

**They must be siblings, and the parent folder's name does not matter.** `scripts/state.sh` (run from the repo root) resolves the code repo at `../socialus-web` and `cd`s to it under `set -euo pipefail` — **not siblings, and `bash scripts/status.sh` dies with `FATAL` before printing anything.** You can override it per-run (`bash scripts/state.sh /path/to/socialus-web`), but nothing else knows about the override, so don't.

**Both repos are private.** You need an account with access on each machine.

## 2. Tooling

| Tool | Why | Version |
|---|---|---|
| `git` | — | any current |
| `gh` | **16 uses across `scripts/`.** `state.sh` aborts with `FATAL: gh not authenticated` | any current, then `gh auth login` |
| `python3` | 5 uses in `scripts/` | 3.x, system Python is fine |
| `jq` | 2 uses in `scripts/` | any |
| Node | `socialus-web` only | **20** — what every workflow uses |
| `npm` | `package-lock.json`, so npm not pnpm/yarn | bundled with Node |
| Supabase CLI | `npm run db:push`, and `supabase start` for the write-bound tests | **2.117.0** — pinned in the workflows |

**Nothing enforces Node 20 locally.** `package.json` has no `engines` and no `packageManager` field, so a machine on Node 22 will install and run and only diverge from CI when something breaks. Set it yourself.

`gh auth login` on each machine. Without it `scripts/status.sh` and `scripts/view.sh` both fail closed.

## 3. Secrets — the only part that is real work

**No `.env` is committed and none should be.** `socialus-web/.gitignore` covers `.env.local`, `.env*.local` and `.env*`.

**The authoritative list is `socialus-web/.env.local.example`** — copy it to `.env.local` and fill it in. Do not treat this file as the list; it will go stale and that one will not.

Values come from:

- **Supabase** — project settings → API, for the URL, the publishable key and the secret key.
- **Mapbox** — account → tokens. Two distinct ones: a public `pk.` token and a server-only geocoding token.
- **Resend** — API key for follow notification email.
- **`CRON_SECRET`** — generate: `openssl rand -hex 32`.
- **`OPERATOR_MEMBER_ID`** — your `members.id`. **Unset authorises nobody, deliberately**, so the moderation surface at `/admin/reports` is closed until you set it.

**Or pull them from Vercel**, which is faster and less error-prone:

```
npx vercel login
npx vercel link          # this checkout is NOT linked — there is no .vercel/project.json
npx vercel env pull .env.local
```

**Never paste a secret into this file, into a scenario, into an Issue, or into a chat.** `SUPABASE_SECRET_KEY` bypasses row-level security entirely.

## 4. Supabase — hosted, not local

**Day-to-day development points at the hosted project.** `NEXT_PUBLIC_SUPABASE_URL` is a `https://<ref>.supabase.co` host and `npm run dev` reads it.

**A local stack is only needed for the write-bound test suites**, which refuse to run against anything that is not explicitly marked disposable. If you want them: `supabase start`, then `supabase status -o env` for the local keys, and set `SUPABASE_TEST_EPHEMERAL=1` in `.env.test.local`. `supabase/config.toml` holds the ports (API 54321, database 54322). That needs Docker; nothing else here does.

**Migrations are applied by Don, not by a merge** — `[production-asks-don]`. A merge that lands ahead of its migration takes production down; that happened on 2026-09-21.

## 5. Windows

- **The `BUILD-LOG.md` symlink is gone.** It was removed in the September revamp; there is no symlink anywhere in `ops-pattern` today. **So `core.symlinks=true` and developer mode are not needed** — skip that.
- **Line endings: neither repo has a `.gitattributes`.** Set `git config --global core.autocrlf input` on the PC before cloning. Without it, Windows checks out CRLF and every `.sh` in `scripts/` fails with `bad interpreter` under WSL or Git Bash.
- **Run the shell scripts under WSL or Git Bash**, not PowerShell. They are `#!/usr/bin/env bash` and use `set -euo pipefail`.
- **Paths in the docs are POSIX and relative.** The sibling layout in step 1 works unchanged on Windows as long as both clones share a parent.

## 6. Claude Code permissions

`.claude/settings.json` in this repo now carries:

```json
{ "permissions": { "allow": ["Bash(gh pr merge:*)", "Bash(gh pr edit:*)"] } }
```

**It is committed on purpose.** `.gitignore` ignores `.claude/*` and re-includes this one file, so it travels to both machines and Code can merge without you unblocking each PR by hand. **`.claude/skills/` stays ignored** — skills are symlinked per-machine by `~/Projects/skills/link.sh`.

## 7. What does not travel

**Per-machine, and nobody should expect otherwise:** scheduled tasks, installed skills, plugins, Claude Code settings outside the committed file above, `gh` auth, and every `.env`. **Set each machine up once; none of it syncs.**

`~/Projects/skills` is its own repo — clone it on the second machine and run `bash ~/Projects/skills/link.sh` to symlink skills into each repo.

## 8. The handoff protocol

- **Push before you stop.** Both repos, every time.
- **Pull before you start.** Both repos, every time.
- **Main is the truth.** Not the laptop you were last on.
- **Branches push too.** A branch left local is work the other machine cannot see.

**One convention to drop: "socialus-web commits stay local until Don says so."** It does not survive two machines — it strands app work on whichever laptop it was written on, which is exactly what this setup exists to prevent. **Recommend dropping it**; `CLAUDE.md` § Commits never encoded it, so nothing needs editing, only the habit. `ops-pattern` already pushes its own doc changes and should keep doing so.

## Verify

```
cd ~/Projects/ops-pattern && bash scripts/lint.sh          # expect: lint: clean
cd ~/Projects/ops-pattern && bash scripts/status.sh >/dev/null && echo ok
cd ~/Projects/socialus-web && npm ci && npm run test && npm run build
```

If `status.sh` fails, the cause is one of three things in this order: `gh` not authenticated, the repos not siblings, or `jq`/`python3` missing.
