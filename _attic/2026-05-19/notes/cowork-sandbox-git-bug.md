# Cowork sandbox can't clean up `.git/index.lock`

**Status:** Open. Workaround in place (build agent does not run git; PM commits from Mac terminal). File with Cowork when reporting bugs.

## Summary

When a Cowork agent runs git commands via the workspace bash tool (`mcp__workspace__bash`), the sandbox creates `.git/index.lock` as part of normal git operation but **cannot unlink it on cleanup**. Subsequent agent calls then encounter a stale lockfile and fail. The agent cannot recover — the sandbox lacks permission to remove files inside `.git/`.

Net effect: build agents that try to commit get wedged on the second call and must hand off to the PM, who clears the lock from the Mac terminal.

## Reproducer

From inside a Cowork session with workspace access to a git repo:

```bash
# In the sandbox (mcp__workspace__bash):
cd /sessions/<session>/mnt/<repo>
git status                           # creates .git/index.lock, then tries to remove it
# → output: warning: unable to unlink '/sessions/.../.git/index.lock': Operation not permitted
ls -la .git/index.lock               # → file is still there, 0 bytes
rm -f .git/index.lock                # → rm: Operation not permitted
```

The same `rm` from the host Mac terminal (`/Users/<user>/Projects/<repo>/.git/index.lock`) succeeds without complaint, confirming the permission gap is on the sandbox side, not the host filesystem.

## Why it matters

- Every git command from the agent leaves a stale lock the agent cannot clear.
- Subsequent git commands (from the agent or the user's IDE) fail until the lock is removed.
- Workflows that have the agent run `git add` + `git commit` wedge after the first commit.
- Solo-founder workflows where the agent is the primary committer (the natural use case Cowork seems designed for) hit this on every ticket.

## Current workaround

Documented in this repo's [`CLAUDE.md`](../CLAUDE.md) Commit Rules and [`skills/pipeline-build/workflow.md`](../skills/pipeline-build/workflow.md):

1. Build agent runs a lock pre-flight at session start and asks the PM to clear stale locks (PM has a `clearlock` shell function — see [`#shell-function`](#shell-function) below).
2. Build agent does NOT run `git add` or `git commit`. It produces a commit summary at ticket close; PM runs the actual commit from the Mac terminal.
3. Branch creation (`git switch -c`) is still done by the agent — that doesn't touch `.git/index`.

## Suggested fix direction (for Cowork team)

The sandbox should be able to clean up files it creates inside `.git/`. Either:

- Grant the sandbox process unlink permission on the mounted workspace's `.git/` directory.
- Wrap git in the sandbox so it executes outside the bwrap restrictions on cleanup paths.
- Provide a sandboxed `git` shim that runs the operation, captures output, and exits cleanly with no lock residue.

The bug is reproducible deterministically, so a fix should be testable end-to-end with the reproducer above.

## Shell function — `clearlock`

PM's `~/.zshrc` carries this for one-key recovery from the Mac terminal:

```bash
clearlock() {
  local locks=(
    /Users/don/Projects/movers-makers-shakers/.git/index.lock
    /Users/don/Projects/movers-makers-shakers/web/.git/index.lock
  )
  for f in "${locks[@]}"; do
    if [ -f "$f" ]; then
      rm "$f" && echo "cleared: $f"
    fi
  done
}
```

Generalize the paths for other projects.

## Reproduction environment

- **Date observed:** 2026-05-17
- **Cowork client:** Claude desktop app (Cowork mode, research preview)
- **Host OS:** macOS (MacBook Pro)
- **Repo layout:** two-repo (parent `movers-makers-shakers/` + child `web/`)
- **Bash tool:** `mcp__workspace__bash` (`bwrap`-based sandbox, per process env)
