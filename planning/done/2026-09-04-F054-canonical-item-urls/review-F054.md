---
purpose: Review — F054 canonical Item URLs and browsable-kind withholding. Verdict PROCEED with three binding notes.
layer: how
status: done
---

# F054 review — A member taps something in the feed and lands on it

**Scenario:** [`scenario-F054-member-taps-an-item-and-lands-on-it.md`](./scenario-F054-member-taps-an-item-and-lands-on-it.md)
**Reviewer:** review
**Date:** 2026-09-04
**Bundle:** b1 (SocialUs v1)
**Verdict:** **PROCEED** — with three binding notes the ticket must carry.

## Verdict summary

The scenario fits the existing systems and the design language without extending either. It adds no table, no column, no event type, and no component. Its two SQL additions are read-only derivations over data that already exists, and the surfaces it touches are all live. Three notes below are binding on the ticket, not optional: the place-path derivation must reuse the existing county-skipping convention rather than invent a second one; the attribution fallback must be uniform across all three resolvers; and one surface can now legitimately render empty and needs its empty state named before build, not during.

**Next skill:** `ticket`.

## Architecture check

### Systems touched

- `product/systems/item.md` — the seven kinds, their URL segments, and which are T1 vs T2. The scenario's withheld set (`ask`, `offer`, `initiative` = T2) matches the spec's own tiering exactly, with one deviation noted below.
- `product/systems/groups.md` — Group-filed Items and the brand resolve-up on the Item page.
- `product/systems/location.md` / `places.md` — the place hierarchy the canonical URL nests under.
- `product/systems/member.md` — the global-handle namespace the fallback path uses.

### Schema fit

| Concern | Status | Notes |
|---|---|---|
| New tables required? | **none** | |
| New columns required? | **none** | The derivation chain (Group → anchor Location → Place → ancestors) is complete as shipped. |
| New event types required? | **none** | The scenario writes nothing. |
| New read-only functions | **two** | `place_url_path`, `group_url_prefixes`. Both SECURITY INVOKER over anon-readable tables — `places` (`places_select_all`), `groups` (listed + active), `locations` (listed/unlisted). No SECURITY DEFINER escape hatch is warranted and none should be introduced. |
| Forward-tier impact | **clear, with one deferral recorded** | Adding an `id8` to the Group URL segment when local name scoping lands is additive, and bare-slug lookups become a fallback. Nothing here forecloses it. The State tag on the pattern entry carries the trigger and horizon. |
| Shell-entity smell | **clean** | The scenario adds no `*_id` pointing at a non-Person/Group entity. It reads `groups.name` where it previously read `items.brand_label` — that is a move *toward* the people-first posture, not away: `brand_label` is a denormalized business display name, `groups.name` is the name of a set of people. |
| Loop fidelity | **matched** | Loop 3's stated pain is *"a no-login locality view organized around what's happening near me, with people I could meet."* A locality view where nine of sixteen things are unopenable does not serve that pain at all; it demonstrates the opposite. Loop 8's *"find them again"* is likewise unserved when the found thing has no address. This scenario is a precondition for both loops, not an enhancement to them. |
| Policy posture present | **n/a** | No data sharing, monetary flow, agent permission, or visibility change. Withholding four kinds narrows what is shown; it does not widen any disclosure. Worth stating explicitly because "hide things from the feed" can look like a visibility decision — it is a completeness decision, and the underlying RLS gates are untouched. |

### Cross-system consistency

- **item.md ↔ groups.md — one real disagreement, and the scenario is on the right side of it.** `item.md` tiers `wonder` as **T1**, alongside product, service, and gathering, and states plainly that a Person can create an Item of kind product, service, gathering, *or* wonder. The scenario withholds `wonder`. That is a deviation from the spec and it should be recorded as one rather than passed over: `wonder` has its child table built and is genuinely closer to shipping than its three companions, but it has no composer, no page, and no response affordance, so at v1 it behaves identically to the T2 three. **Recommendation: withhold it and log the spec deviation**, rather than quietly treat the spec as wrong. When `wonder` ships, `item.md` needs no edit; if it slips past v2, the spec's T1 claim should be revisited.
- **groups.md ↔ item.md — the attribution gap is a genuine spec-level omission, not just a bug.** `groups.md` describes brand resolve-up for `kind='business'` Groups and `item.md` inherits that framing. Neither spec says what an Item filed under an `event_anchored`, `interest`, `place`, or `practice` Group is credited to — and `groups.md` § Group kinds explicitly contemplates `event_anchored` Groups born from recurring Gathering Items, which is precisely the case. The scenario's answer (credit the Group by `groups.name`) is the only one consistent with both specs. It should land in `groups.md` as a sentence, not survive only as code.
- **places.md ↔ the URL table in `CLAUDE.md`** — consistent. The scenario's place path is the same shape `resolvePlacePath` already resolves back, which is the property that makes the URL round-trip.

### Architecture verdict

**PROCEED.** No system needs extending before tickets open. Two spec sentences are owed afterward (see Handoff notes).

## Design check

### Surfaces touched

| Surface | Existing / new |
|---|---|
| Home locality feed | existing |
| Explore list | existing |
| Explore map (pin callout) | existing |
| Member page item list | existing |
| Venue page item sections | existing |
| Item detail pages (product / service / gathering) | existing |

No new surface. No new route. The Group Item routes the scenario targets are already built and already dispatch.

### Components required

| Component | Exists in design language? | Notes |
|---|---|---|
| `ItemFeedCard` | yes | Unchanged. It consumes a href; it does not build one. |
| Item detail pages | yes | Unchanged except the attribution fallback. |
| Empty state for a browse surface | yes — **but see the binding note** | `design-language.md` § venue sections establishes the pattern and the prohibition: honest copy, *no* "be the first" push. |

### CTA placement

Nothing moves. No CTA is added, removed, or repositioned. Checklist 4's trigger fires on the source diff regardless, so the checks below were run rather than waived.

### Tone & copy

No new user-facing copy except any empty state the binding note requires. The existing kind labels (Event / Product / Service) are untouched and remain correct per the naming table.

### Empty / loading / error states

This is the one place the scenario is thin, and it matters more than it looks. Withholding four kinds means a surface that previously rendered something can now render nothing — a Member page whose author posted only a Wonder and an Ask, for instance, or a venue section whose only nearby Items were Offers. The scenario says nothing about that case.

`design-language.md` already settles the copy posture: state the absence plainly, do not push the viewer to create. The ticket must name the empty state for the Member page item list explicitly; the feed and Explore already have empty states from prior tickets and need only to be confirmed to still fire on an emptied-by-filter result rather than only on an empty query.

### Accessibility (M3)

Ran, and the surface is narrow. No new interactive element, no new focus target, no colour or contrast change, no new motion. Two things to verify at build rather than assume:

1. **Accessible names are unaffected.** Cards take their accessible name from title and kind label, not from the href. Changing the href must not change what a screen reader announces. This is a regression check on the existing card tests, not new work.
2. **An emptied list must announce as empty, not as absent.** A container that renders zero children with no empty-state text is silent to a screen reader — the user gets no signal that the query completed. This is the accessibility face of the empty-state note above, and it is why that note is binding rather than cosmetic.

No WCAG 2.1 AA issue identified. No colour-contrast surface in scope.

### Design verdict

**PROCEED**, conditional on the empty-state note being carried into the ticket.

## Apple legibility

Clean, and materially improved by this scenario. Deep-linkability is the check most relevant here: the whole change makes previously-unreachable Items reachable at clean, place-scoped, parameter-free URLs, which is exactly the substrate Universal Links need. No write action is introduced, so the action-handler check is inert. One forward note, advisory only: the Group-filed Item pages are the natural place for schema.org `Event` / `Product` JSON-LD, and they are only now getting real traffic — worth a line in the Apple integration doc's candidate list, not worth a ticket.

## Sibling-consistency findings

**Siblings checked:** F044 (list/map floating pill), F045 (filter icon + bottom sheet), F046 (scroll-to-hide nav) — all in `planning/next/`.

- **No component collision.** All three siblings act on Explore chrome; F054 acts on link construction and list membership. No shared base to extract.
- **One real interaction, and it is favourable.** F044 and F045 both change what Explore shows and how it filters. F054 removes four kinds from Explore's result set. If F045's filter sheet offers kind facets, it must offer the browsable three only — a facet for a kind that can never return a result is a dead control. **Flag to `ticket` and to whoever builds F045:** whichever ships second reads the browsable-kinds list rather than hardcoding a kind list of its own.
- **Vocabulary aligned.** F054 uses Event / Product / Service per the naming table; no sibling calls the same kind by a different name.
- **Loop shape aligned.** All four serve Loop 3 discovery and none forks its mechanic.

## Binding notes for `ticket`

1. **Reuse the county-skipping convention; do not restate it.** The place path must match what `resolvePlacePath` resolves back, including the county-transparency rule. Two independent implementations of one URL convention is how the two halves drift apart, and the failure would be silent — the resolvers ignore these segments, so a wrong path still renders a working page while publishing a false address.
2. **The attribution fallback is uniform across all three resolvers**, not gathering-only. Gathering is where the bug bites today because Group events are the v1 case, but a product or service filed under a non-business Group would fail identically. Fix the class.
3. **One list of browsable kinds, in one place, consumed by every read path.** The value of withholding is that reversing it is one edit. Five hardcoded kind filters in five read helpers is not one edit, and it is how the four kinds come back inconsistently.

## Owed after build (not blocking)

- One sentence in `groups.md` naming what a non-business-Group-filed Item is credited to.
- A deviation entry recording that `wonder` is withheld at v1 despite `item.md` tiering it T1.
