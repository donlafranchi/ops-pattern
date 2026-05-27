---
purpose: Accuracy review of rebuild-plan.md before Phase 2 ticketing opens. Cross-checks claimed Phase 1 state against STAGE-LEDGER + DEVIATIONS + SPEC-PATCHES + tickets shipped, and flags stale references in Phase 2/3 narrative.
layer: how
status: active
---

# rebuild-plan.md — accuracy re-review (2026-05-27)

**Reviewed doc:** [`planning/rebuild-plan.md`](../rebuild-plan.md)
**Reviewer:** `review` (Cowork)
**Trigger:** PM ratification 2026-05-27 — verify Phase 2 + 3 still accurate against shipped-Phase-1 reality before drafting Phase 2 tickets.
**Verdict:** **REVISE** — plan structure and intent intact; 6 mechanical patches required before Phase 2 ticketing opens, plus the SPEC-PATCHES drain (load-bearing).

**Next skill:** `explore` first (drain SPEC-PATCHES + apply rebuild-plan patches), then `scope` (Phase 2 scenario authoring).

---

## Verdict summary

The four-phase shape, the clean-slate framing, the people-first invariants, the loop fidelity, and the no-Business-entity discipline are all intact. The doc has held up well across the ADR-20, ADR-21, ADR-22, ADR-23 ratification wave and the b1.x substrate sprint.

What's drifted is mechanical: stale skill names (sed miss), retired handlers still listed in Phase 1's handler block, pre-ADR-20 URL patterns in the Phase 2 narrative, Phase 2 exit criterion referencing scenarios that were scrapped or deferred, and ADR-13/14 still marked "pending" when DECISIONS.md shows them Accepted. None of these are strategic rethinks; they're patches.

The load-bearing blocker is upstream of the rebuild-plan itself: **3 SPEC-PATCHES open since 2026-05-19** against `item.md` and `member.md`. Per the SPEC-PATCHES gate, `explore` must drain these before any phase opens. Phase 2 ticketing reads stale specs unless drained.

---

## Architecture check

### Phase 1 — reality vs. claim

**Claim (line 378):** "Phase 1 — DONE 2026-05-19. All schema, RLS, evals shipped... Eval state: 142/142 Phase 1 green... Tickets T041–T057 complete."

**Reality (per STAGE-LEDGER + DEVIATIONS):**

| Claim | Reality | Drift |
|---|---|---|
| Phase 1 closed 2026-05-19 | Phase 1 substrate closed 2026-05-19; b1.x substrate-sprint extension (T058–T066) shipped 2026-05-25 covering places + ADR-21 substrates + ADR-22/23 URL refinements | Phase boundary is fuzzy — the "DONE 2026-05-19" label collapses two distinct work units |
| 142/142 evals green | 191/191 post-T066 (107/107 unit + 191/191 Phase 1 Playwright evals) | Eval count stale by 49 tests |
| Tickets T041–T057 complete | T041–T053, T065 in `done/`; T054–T057 + T058–T066 (12 tickets) still in `development/tickets/` (open dir) per STAGE-LEDGER `done` | Tidy gap — tickets shipped but not moved. Not a rebuild-plan issue but worth flagging during Phase 2 cleanup |
| Migration sequence 001–016 (Phase 0 + Phase 1) | Actual: 007 locations → 008 RLS → 009 members_phase1 → 010 member interests → 011 affinities → 012 agent assistance → 013 delegations CHECK → 014 groups → 015 items → 016 discoverable_items → b1.x added 017–022 | Plan's 001–006 Phase 0 numbering is descriptive only; actual migration ordering deviates. Acceptable as plan-vs-execution drift; the BUILD-LOG + DEVIATIONS are authoritative for the actual sequence |

**Conclusion:** Phase 1 + b1.x substrate sprint together constitute "Phase 1 reality." The plan's Phase 1 narrative has been edited to *mention* ADR-21 substrates (lines 80, 133, 134, 135) but the "DONE 2026-05-19" status block at line 378 hasn't been updated to reflect the b1.x extension. **Patch the status block.**

### Stale references (mechanical patches)

| # | Line | Issue | Patch |
|---|---|---|---|
| **P1** | 184 | `pipeline-ticket` (retired skill name) | → `ticket` |
| **P2** | 380 | `pipeline-product` → `pipeline-plan` (both retired) | → `explore` → `scope` |
| **P3** | 177 | Member handler list includes 5 retired handlers: `member.location_affinity.add` / `.remove` (ADR-21 retired table) + `member.maker_mode.toggle` / `.activate` / `member.maker.full_stop` (ADR-12 SUPERSEDED 2026-05-12) | Drop the 5 retired handlers; add ADR-21 handlers: `member.place_interest.add` / `.remove` / `.promote` / `.demote`; `member.saved_search.create` / `.update` / `.remove` |
| **P4** | 34 | `ADR-13 pending` | → `ADR-13 Accepted` (DECISIONS.md row 53 confirms) |
| **P5** | 35 | `ADR-14 pending` | → `ADR-14 Accepted` (DECISIONS.md row 54 confirms) |
| **P6** | 198–205, 232 | Phase 2 routes named flat (`/e/[event]`, `/l/[slug]`, `/g/[slug]`) — pre-ADR-20 | Rewrite to place-scoped form per ADR-20 + ADR-23: `/p/{...place}/e/[event-slug]`, `/p/{...place}/l/[slug]`, `/p/{...place}/g/[slug]`. Member page (`/m/[handle]`) stays flat — that's the one intentional exception |
| **P7** | 232 | Phase 2 exit criterion: "F018-F021 scenarios pass evals end-to-end" — F019–F021 scrapped per PRE-PRIMITIVES-AUDIT-2026-05-11; F018 deferred per STAGE-LEDGER | Rewrite: "fresh Phase 2 scenarios authored at Phase 2 open under current primitives pass evals end-to-end. F018 is a rewrite candidate when the b1 work-map recommends pulling it in." |

P1–P5 + P7 are one-line edits. P6 is the bigger lift — every Phase 2 route name in lines 198–232 changes shape, and the resolve-up rendering description (line 199–205) needs to note that the `/p/...` prefix is supplied by the route resolver, not encoded in the spec text per resource.

### Phase 2 — Group-anchor reframing under ADR-21

**Issue:** Phase 3 line 251 — "Onboarding suggestion step — when a Member sets a home Location, surface listed Groups anchored to that Location with a tap-to-join."

Under ADR-21, Member geography belonging is Place-shaped (`member_place_interests.scope_kind='primary_home'`), not Location-shaped. Groups still anchor to a Location (per `groups.md` § `anchor_location_id`), but the Member's "home" is a Place. The onboarding suggestion needs the Place → containing Locations → Groups-with-anchor-in-those-Locations traversal, not a direct Member.home_location → Group match.

**Patch:** rewrite line 251 to: "Onboarding suggestion step — when a Member sets a `primary_home` Place, surface listed Groups whose `anchor_location_id` resolves to a Location inside that Place (or a child Place) with tap-to-join. Skippable; defaults to no memberships."

### Spec-coherence: SPEC-PATCHES drain (LOAD-BEARING BLOCKER)

3 patches open since 2026-05-19 (8 days):

| Patch | Spec | Issue |
|---|---|---|
| SPEC-PATCH-0001 | `item.md` § State machine | `items.state` enum text carries two divergent vocabularies; schema + T056 reconciled to `draft / published / withdrawn / fulfilled / closed`. Spec must match. |
| SPEC-PATCH-0002 | `member.md` § Delegations | Partial-index predicate diverged from T050 implementation. |
| SPEC-PATCH-0003 | `member.md` + `groups.md` + `policy.md` | T049 flagged three docs for review against shipped behavior. |

Per the SPEC-PATCHES gate in `planning/SPEC-PATCHES.md`: "`explore` drains this queue as the first action when invoked for any phase-boundary work. The Open list must be empty (or every entry must have an explicit `deferred-until {trigger}` annotation with PM approval) before phase work proceeds."

**Phase 2 ticket-writing reads `item.md`, `member.md`, `groups.md`, `policy.md`** — exactly the specs with open patches. Without the drain, Phase 2 tickets encode divergent vocabulary and the same drift cascades to Phase 2 build. **This is the load-bearing blocker on Phase 2 ticketing**, separate from any rebuild-plan patches.

### Loop fidelity

Plan maps cleanly to current loops in `member-journey.md`:
- Loop 1 (Find people) — Phase 2 Member pages + Phase 3 `/explore` + Group browse.
- Loop 2 (Wonder) — Phase 3 Wonder composer + Idea pages.
- Loop 3 (Land here, no-login) — Phase 3 anonymous `/explore` path.
- Loop 4 (Gather regularly) — Phase 2 Gathering composer + venue-page CTA.
- Loop 7+ (Pool / Federate) — out of scope (correctly deferred).

No loop drift. The "no-login Loop 3 non-negotiable" framing (line 74) stands.

### Shell-entity check

Plan introduces no Vendor / Business / Merchant / Operator shell entities. All business presence is kind='business' Group + Member. The Phase 1 narrative explicitly drops `businesses`, `markets`, `vendor_*`, `bulletin_*` tables (lines 56–57) and the Phase 2 "Sell" CTA creates a Group, not a Business entity (line 216). Clean.

### Policy posture

Phase 2 + Phase 3 surfaces that touch privacy (no-login `/explore`, Member visibility on `/m/[handle]`, DM substrate scope, Group visibility) all defer to ADR-9 + `policy.md`. The anti-Nextdoor commitment is preserved in messaging-scope language (no `location_id` on `member_threads`, per line 131). No new policy gaps introduced.

### Architecture verdict

**REVISE.** Structure intact; patches P1–P7 are mechanical; SPEC-PATCHES drain is the load-bearing prerequisite for Phase 2 ticketing.

---

## Design check

### Surfaces in Phase 2 + Phase 3

| Surface | Plan describes | Reality |
|---|---|---|
| `/m/[handle]` Member page | Items grouped by `brand_label`, Group memberships per privacy | Aligned with `community-platform.md` + `member.md` |
| Item kind-specific URLs | Resolve-up rendering with owner + brand + multi-location badge | Aligned with `item.md` naming table — but route shapes need ADR-20 prefix (P6) |
| Venue page `/l/[slug]` | "Host something here" → gathering composer pre-attached; "What's happening here" section | Aligned with `community-platform.md`; route shape needs ADR-20 prefix (P6); "Follow this venue" CTA correctly remapped to `member_saved_searches` per ADR-21 (line 204) — this part is current |
| Group page `/g/[slug]` | Header, Members per privacy, Items filed under the Group, anchored Location | Aligned with `groups.md`; route shape needs ADR-20 prefix (P6) |
| `/explore` | No-login browseable, filterable by kind/category/distance/schedule, reads `discoverable_items` exclusively | Aligned; no-login matrix RLS coverage already in Phase 1 evals |
| `/g` + `/g/new` | Group browse + create flow with 6 kinds | Aligned with `groups.md` |
| `/why` thesis page | Static, links from every page footer | Pattern in `community-platform.md` |

### Composer model

Plan: surface-specific composers per loop, no unified `/new` picker (line 207). Aligned with the established UX principle (memory: "Unified Item picker is not the right UX — prefer surface-specific CTAs per loop"). Phase 2's "Sell" CTA opens a kind='business' Group walkthrough (no Maker mode gate) — aligned with ADR-12 SUPERSEDED.

### CTA placement

Patterns named in Phase 2 (line 209–211 — venue "Host something here," seller-profile "Add a product," `/you` "Offer a service") match `design-language.md` venue-page primary-CTA pattern and `community-platform.md` `/you` affordance section. No drift flagged.

### Item-level QR card

Phase 2 line 218 describes the affordance as Member-requestable on any Item, kind-agnostic, Item-canonical-URL resolving. Aligned with the established memory ("QR cards are Item-level Member-requestable; not Location-gated, not vendor-booth-only").

### Design verdict

**PROCEED.** No design drift introduced by Phase 2 + 3 surfaces that wouldn't already be caught by `design:design-critique` / `design:accessibility-review` at scope time per the M3 gate.

---

## Recommendations for next steps

**Order of operations to clear Phase 2 for ticketing:**

1. **`explore` drains SPEC-PATCHES queue** (load-bearing). 3 patches against `item.md` + `member.md` + `groups.md` + `policy.md`. Each patch lands a spec edit + commit hash in the queue.
2. **`explore` applies P1–P7 to `rebuild-plan.md`.** All mechanical; one commit `docs(pipeline): rebuild-plan refresh — drop retired handlers, ADR-20 URL patterns, Phase 1 b1.x extension`.
3. **(Optional polish, separate commit if at all):**
   - Update Phase 1 "DONE 2026-05-19" block to note b1.x sprint extension shipped 2026-05-25 (T058–T066, 191/191 evals).
   - Update migration-narrative line 99 to point to BUILD-LOG / DEVIATIONS for the actual shipped sequence.
   - Refresh M1–M4 gate language at line 333 to match current DEV-PATTERN (M2 left of commit).
4. **`scope` opens Phase 2 scenario authoring** against the current primitives + the patched specs. First scenario candidates per the plan: product composer, service composer, gathering composer (F018 rewrite or net-new), Member page. The b1-work-map gates which slice ships next.
5. **`review` per Phase 2 scenario** before any ticket drafts. Per Rebuild phase rule 1 — `review` is MANDATORY on every approved scope in this phase.

**Substrate cleanup (separate from rebuild-plan patches):**

- Move T054–T066 from `development/tickets/` to `development/tickets/done/` (per STAGE-LEDGER `done` rows). `build` agent normally handles this at ticket close — flag for the next `tidy` pass to catch the backlog.

**Out of scope for this review:**

- Re-litigating Phase 2 + 3 scope content. The four-phase shape stands; this review is accuracy maintenance, not strategic rethink.
- The bundle-lifecycle rename of `rebuild-plan.md` itself. Per PM clarification 2026-05-27, the file stays at `planning/rebuild-plan.md` with phases inline; ticket-writer will draft Phase 2 tickets from inline sections rather than child phase docs.

---

## Decisions captured

No new ADR candidates. All findings are mechanical drift patches against an active doc; no new architectural commitments surfaced.

---

## Out of band

**STAGE-LEDGER stamp:** N/A for doc reviews (the ledger tracks F-number + substrate concepts moving through stages; this is a re-review of a planning doc).

**JOURNAL entry:** "Reviewed rebuild-plan.md (2026-05-27) — verdict: REVISE; 7 mechanical patches + SPEC-PATCHES drain required before Phase 2 ticketing. See `planning/reviews/intent-rebuild-plan-2026-05-27.md`."
