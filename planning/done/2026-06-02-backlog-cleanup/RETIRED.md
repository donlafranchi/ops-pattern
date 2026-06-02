---
purpose: Provenance for three backlog items archived 2026-06-02 — dead stub, superseded scenario, old draft.
layer: how
status: archived
retired_from: planning/backlog/
---

# Backlog cleanup — 2026-06-02

Three files retired from `planning/backlog/` per the ADR-25 dated-archive convention. Each is dead or superseded; none is referenced by a live ticket or open scenario.

| File | Why archived |
|---|---|
| `USER-STORY-TEMPLATE.md` | Dead redirect stub. The user-story template now lives at [`skills/scope/templates/scenario.md`](../../../skills/scope/templates/scenario.md); the `scope` skill loads it directly. The stub existed only to point there and was marked safe to remove. |
| `scenario-F018-brian-declares-run-club.md` | Superseded by F034. Deferred 2026-05-18 with a REVISE verdict (three blockers); never promoted. The Run Club / recurring-gathering hosting flow is now carried by F034 against the post-naming-pass specs. |
| `scenario-F035-viewer-finds-group-page.md` | Old draft. Split from F025 per the ADR-20 reframe, but the shipped F035 is the rewrite [`scenario-F035-rosa-finds-mayas-shop.md`](../2026-06-02-f035-rosa-finds-mayas-shop/scenario-F035-rosa-finds-mayas-shop.md) (archived under `planning/done/2026-06-02-f035-rosa-finds-mayas-shop/`). This draft predates that rewrite. |
