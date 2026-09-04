# T131: The nav goes to two tabs and a create action

**Scenario:** `planning/next/scenario-F059-newcomer-browses-one-surface.md`
**Status:** Open
**Bundle:** b1 (SocialUs v1), workstream 4
**Depends on:** T130

**Serves:**
- **Loop:** 7 (Make and be found) — the loop's pain point is that making a living from a craft "requires being findable beyond the one market day," and the platform's answer starts with declaring the thing at all. Nav placement is the signal: a create action in the nav says making things is a first-class act.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love) — the consumption side; the create affordance serves the P1 producer entering from the same nav.
- **Primitive shape:** Person → nav → existing create walkthrough. No new Item path, no new entity.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — **required.** New interactive element in the primary landmark.
- [ ] **M4** — no migration.
- [ ] **DEVIATIONS.md entry** at close.
- [ ] **Close-out reconciliation** at close.

## Acceptance Criteria

- [ ] `src/components/BottomNav.tsx` `TABS` reduces to two entries — browse (`/`) and You (`/you`); the Explore entry is removed
- [ ] A create affordance sits **between** the two tabs, labelled and reachable by keyboard, routing to the existing create entry (`/you/sell`)
- [ ] The create affordance is a `Link`, not a tab — it carries no `aria-current`, and is not announced as a navigation tab peer
- [ ] `TopNavDesktop` reflects the same two-destination structure
- [ ] The browse tab's `match` predicate covers `/` including query strings; the retired `/explore` and `/map` predicates are removed
- [ ] The 44px bar height, charcoal-700 active state, 20px/1.5-stroke icons and 9px/500 labels from T112 are unchanged
- [ ] Scroll-to-hide (T113) and the pill row's `-translate-y-[var(--nav-height)]` coupling still work with two tabs plus the create action
- [ ] Full-height touch targets preserved (T112's M3 fix)
- [ ] `BottomNav.test.tsx` and `NavVisibilityProvider.test.tsx` updated — both currently assert on `/explore` as a pathname
- [ ] Tests: two tabs render; no Explore tab; create affordance present and keyboard-reachable; active state correct on `/` and `/you`
- [ ] Screenshot at 375×812 in the Completion section
- [ ] BUILD-LOG.md updated

## Notes

**Last in the sequence on purpose.** Removing the Explore tab before `/explore` redirects (T130) leaves the route live and unreachable from the nav — a worse state than either end. Do this after the redirect lands.

**What the `+` opens is not settled, and this ticket deliberately does not settle it.** `decision-surfaces.md` § Open questions 2 asks whether it opens a bottom sheet (kind picker, cheap to dismiss) or a full page (room for the composer, harder exit), and question 1 asks what carries the third nav slot's visual weight now that it is not a peer tab. **Route it at the existing `/you/sell` walkthrough and stop there.** Building a composer sheet inside a nav ticket would be answering a ratified-as-open question by implementation, which is how a decision gets made by whoever shipped first.

**`design-language.md` § CTA placement has no entry for a nav-embedded create action.** Expect this ticket to need a DLS line rather than to find one. If the visual treatment turns out to need a decision rather than a recipe — raised vs. peer vs. re-centred — stop and route to `weigh` rather than picking one; `decision-surfaces.md` § Open questions 1 is exactly that question and it is open.

**Gate B — encodes ratified absolutes:**
- `planning/backlog/decision-surfaces.md` § The two-tab model — the nav carries two tabs and one persistent create action; Explore is retired as a tab (Ratified 2026-09-03).
- `planning/backlog/decision-surfaces.md` § Create is first class — a persistent `+` in the nav, "not a button buried on You, not a contextual affordance in the Home header" (Ratified 2026-09-03).
