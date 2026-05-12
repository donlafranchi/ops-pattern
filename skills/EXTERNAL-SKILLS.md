# External skills

The pipeline calls in skills that live in Anthropic's plugin marketplaces, not in this repo. They need to be present on your machine so any Claude Code session — Cowork or bare CLI — can invoke them.

This document exists so a fresh setup can wire the full pipeline up in one pass.

## Plugins to install

| Plugin | Marketplace | Why we use it | Skills the pipeline calls |
|---|---|---|---|
| `engineering` | `anthropics/knowledge-work-plugins` | Solo-founder reviewer, ADR writer, deploy gatekeeper | `architecture`, `code-review`, `debug`, `deploy-checklist`, `documentation`, `system-design`, `testing-strategy`, `tech-debt`, `incident-response` |
| `design` | `anthropics/knowledge-work-plugins` | Surface-quality reviewer when no design teammate exists | `accessibility-review`, `design-critique`, `design-handoff`, `design-system`, `ux-copy` |
| `product-management` | `anthropics/knowledge-work-plugins` | Spec writer, problem explorer, research synthesizer | `write-spec`, `product-brainstorming`, `competitive-brief`, `synthesize-research`, `metrics-review` |
| `anthropic-skills` (file-format helpers) | bundled with Cowork; check `claude-plugins-official` for bare-CLI install | Format helpers + planning filter + memory hygiene | `planning-filter`, `consolidate-memory`, `pptx`, `docx`, `xlsx`, `pdf` |

Inside Cowork, all of these are already available — you don't need to install anything. The setup below is for **bare Claude Code** sessions outside Cowork.

`brand-voice` and `marketing` are installed in Cowork but **not used** by the dev pipeline. Use them for marketing/launch content out-of-band.

## Install (bare Claude Code)

The installer in this directory (`./skills/install.sh`) handles both project skills and the knowledge-work plugins:

```bash
# Project pipeline skills only:
./skills/install.sh

# Project pipeline skills + the knowledge-work plugins:
./skills/install.sh --with-plugins
```

Under the hood, `--with-plugins`:

1. Registers `anthropics/knowledge-work-plugins` as a marketplace if not already.
2. Installs `engineering`, `design`, `product-management` from that marketplace.

## Manual install (if the script fails)

```bash
# Register the marketplace once:
claude plugin marketplace add anthropics/knowledge-work-plugins

# Install each plugin:
claude plugin install engineering@knowledge-work-plugins
claude plugin install design@knowledge-work-plugins
claude plugin install product-management@knowledge-work-plugins
```

## Verify

```bash
# project pipeline skills
ls -la ~/.claude/skills/ | grep pipeline-

# plugin skills
claude plugin list
```

Each plugin's skills become callable as `<plugin>:<skill>` — e.g. `engineering:code-review`, `design:accessibility-review`, `product-management:write-spec`.

## When each skill enters the pipeline

The trigger map lives in [`/CLAUDE.md`](../CLAUDE.md) under "Solo-team multipliers — when to call them in." That table is the source of truth for *when* to invoke each external skill. This file is the source of truth for *what* to install.

## Related repositories

- [`anthropics/knowledge-work-plugins`](https://github.com/anthropics/knowledge-work-plugins) — role-based plugin marketplace (engineering, design, product-management, etc.)
- [`anthropics/claude-plugins-official`](https://github.com/anthropics/claude-plugins-official) — Anthropic-maintained plugins (Apollo, Asana, Airflow, ClickHouse, etc.)
- [`anthropics/claude-plugins-community`](https://github.com/anthropics/claude-plugins-community) — community plugins
