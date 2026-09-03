---
purpose: Decision — `--color-accent` is below WCAG AA as text on white and marginally below AA as a focus ring; pick the fix.
layer: how
status: backlog
---

# Decision: `--color-accent` contrast on white

**Raised by:** T115 (Explore filter icon + bottom sheet) — DEVIATIONS § T115 What (8).
**Type:** B — a design-token decision, not an authoring error.
**Blocks:** nothing today; every new surface hits it and has to route around it locally.

## The observation

`--color-accent` is `#0fab8e`. Measured against white:

| Use | Ratio | Requirement | Verdict |
|---|---|---|---|
| 14px text (`text-[var(--color-accent)]`) | **2.90:1** | 1.4.3 — 4.5:1 | fails |
| Focus ring (`ring-`/`outline-`) | **2.90:1** | 1.4.11 — 3:1 | fails, marginally |
| `--color-accent-hover` `#0a8a72` as 14px text | **4.29:1** | 4.5:1 | fails |
| White on `--color-accent` fill (buttons) | 2.90:1 inverted → **2.90:1** | 4.5:1 | fails |

The text case is live in **57 places** across `web/src` (`text-[var(--color-accent)]`) — links, empty-state actions, section labels. The fill case is the primary CTA recipe, which `design-language.md` §Buttons asserts is "AA-contrast on the darker pistachio-500 fill"; that assertion does not hold at the current token value.

T115 routed around it locally: the sheet's "Clear all" uses `--color-charcoal-900` (14.16:1). It left the 57 existing instances and the accent focus ring alone, because re-theming a DLS token app-wide is not a build-agent call.

## The decision to make

1. **Darken the token, or add a paired one.** `#0fab8e` needs to reach roughly `#0a7a66` for 4.5:1 on white. Darkening `--color-accent` itself changes every button fill and pin colour; adding `--color-accent-text` (AA-safe, text and links only) leaves brand fills alone and is the smaller blast radius. The cost is a second token to remember.
2. **Focus rings** — accept 2.90:1 for consistency (every ring in the app is accent today), or move rings to charcoal, or to the same new text token. Inconsistent focus colours across one page are worse for a member than a marginal ratio, so this should be decided once and applied everywhere, not per surface.
3. **The button recipe** — white on `#0fab8e` is 2.90:1. Either the fill darkens or the label goes charcoal. This one is not marginal.

## What it touches

- `web/src/app/globals.css` — the `@theme inline` accent tokens.
- `product/ui/design-language.md` §Buttons — the AA claim needs to match whatever lands.
- 57 `text-[var(--color-accent)]` call sites plus the `.btn-primary` recipe.
- `standards/accessibility.md` — still a stub; this is the first concrete AA requirement worth writing into it.

## Recommended path

Add `--color-accent-text` at an AA-safe darkness, sweep the 57 text call sites onto it, decide focus rings once, and fix the button recipe. Then write the contrast floor into `standards/accessibility.md` so the next surface does not have to rediscover it. Needs `weigh` before it lands — it changes what the platform looks like, and the ratified DLS claim in `design-language.md` is currently false.
