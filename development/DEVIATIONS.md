---
id: how-deviations
purpose: Per-ticket log of implementation-vs-spec drift across the build.
layer: how
status: active
---

> **Frozen as of 2026-06-03.** Phase 2+ entries have been atomized to [`development/deviations/`](deviations/) — one file per ticket, so parallel sessions can append entries without write-conflicts. This file retains the original Phase 2 content as a historical anchor and remains the source of the Phase 1 archive link.

# DEVIATIONS.md — Implementation Drift Log

When implementation diverges from spec, log it here with context.

## Rotation policy

Fulfills `pipeline-process-audit-2026-05-22.md` **R6** — the audit's E2 finding (605-line single file, unreadable in one pass, no archive policy). Mirrors `JOURNAL.md`'s pattern.

- **Live file** carries entries for the **current rebuild phase** only.
- **At each phase boundary**, the PM rotates closed-phase entries to `development/archive/DEVIATIONS-phase-{N}.md` and resets the live file's TOC.
- **Soft cap on live file:** ~400 lines. `pipeline-router` flags above that.
- **Empty entries are still mandatory** per the rebuild rule — a one-line "no deviations" with a `Why:` qualifies as an entry.
- **Archive index:** a short table below links every archived phase file.

## Archive

| Phase | Tickets covered | File |
|---|---|---|
| Phase 1 (substrate floor + b1.x sprint close) | T041 → T066 | [`archive/DEVIATIONS-phase-1.md`](archive/DEVIATIONS-phase-1.md) |

---

## Phase 2 entries

## 2026-06-02 — T076 — Sacramento-region polygon + centroid seed (substrate)

**Deviation 1 — polygons are simplified bounding approximations, not full-resolution TIGER 2023 geometry.** The AC cites Census TIGER/Line 2023 (counties/state/places) + City of Sacramento Open Data (neighbourhoods) as the polygon sources. Full-resolution shapefiles can't be fetched/embedded in this build environment, so the migration embeds axis-aligned bounding-box approximations of each place, with the authoritative source URLs documented in the migration header for a future replay. The boxes give the reverse-geocoder correct **coverage** and correct **smallest-covering-polygon ordering** for the launch market (verified by `tests/places-reverse-geocode.test.ts`: downtown Davis→Davis, Folsom→Folsom, Roseville→Roseville, Oak Park boundary→Oak Park deterministically; rural Placer→Placer County; off-coast→null). Each row's `place_events.payload` carries `seed_method='approx_bbox'` so the approximation is auditable. **Flagged for spec revision — see SPEC-PATCHES.** Full-res replay is owned by the future **S-metro** ticket (polygon-library backfill).

**Deviation 2 — Placer County is backfilled (`place.updated`), not inserted (`place.created`).** The AC's "Seed — Placer County" bullet assumed Placer did not yet exist. T058 (`017_places.sql`) already seeded all five Sacramento-metro counties including Placer (slug `placer`, not `placer-county`). Inserting a duplicate would violate `uniq_places_parent_slug`. The existing row already satisfies the AC's stated *why* — anchoring Roseville under a county per the `kind='city' ⇒ ancestor_state_id NOT NULL` invariant — so this migration backfills Placer's polygon instead. Slug stays `placer` (consistent with the four sibling counties), not the AC's `placer-county`.

**Deviation 3 — the "centroid-distance tiebreak in 022" referenced by the AC does not exist yet.** The AC's reverse-geocode test bullet references "the centroid-distance tiebreak in `022_places_reverse_geocode.sql`," but 022's `place_for_coords` resolves purely by `ST_Area` ascending (smallest covering polygon) with no centroid tiebreak. This ticket adds the `centroid` column + GiST index that a future tiebreak would use, but does not modify `place_for_coords`. To keep resolution deterministic without a tiebreak, the five neighbourhood polygons are seeded **non-overlapping** (verified by a grid-sweep assertion in `tests/places-reverse-geocode.test.ts`), so every Sacramento-city point hits at most one neighbourhood.

**Deviation 4 — vitest assertions are pure-JS geometry + static SQL, not live DB.** The AC describes DB-behaviour assertions (`ST_Contains`, recursive-CTE parent walks, `place_for_coords` spot-checks). The repo's vitest harness has no Postgres (jsdom only); live PostGIS containment lives in Playwright evals (`evals/phase-1/`). Following the established split, the new vitest files parse the WKT out of the migration and run point-in-polygon / smallest-covering-polygon / centroid-containment in JS (genuine geometry verification, not text matching), plus static SQL-shape checks for the schema/event/correlation-id structure. The live-DB containment + recursive-CTE walk belong to the downstream `test`-skill Playwright run.

**Impact:** Greens the polygon-seed half of F036's locality-step prerequisite (`F036…spec.ts:266`). Schema adds `places.centroid` + `idx_places_centroid`. Reverse-geocoder now resolves the launch market by polygon (was empty geometry → always Mapbox fallback before). No UI, no runtime/action-layer code. `npm run check:action-layer` clean; the 42 new tests pass.

**Pre-existing suite state (not caused by T076):** `npm test` shows 16 failing tests on `main` *before* this change — stale frozen migration-list snapshots (`migrations-phase-0/t042/t045…t050`, `auth-signup-route-t044` — they `toEqual` a hardcoded list never updated past ~012) and flaky subprocess-spawning conformance tests (`ci-enforcement-rule-*`, `ci-conformance-json`, `eval-bootstrap` — shift run-to-run, 6 on main vs 5 on t76 in isolation). T076 adds zero net regressions; its own 42 tests pass. Not fixed here — out of scope for a substrate seed; surfaced for a dedicated tidy/tech-debt pass.

**Escalation:** None — all four deviations are scoped substrate decisions with the full-res replay assigned to S-metro and the spec-patch candidates queued.

**Resolution:** Shipped as scoped; this entry + the SPEC-PATCHES entries close the loop.

---

## 2026-06-02 — T074 — F035 public Shop page: two forward-deps + founder source + direct-to-build

**Deviation 1 — Beat 2 "Claimed local owner" badge ships render-path-only, no data.** The badge's data source (`member_business_jurisdictions` table + `public.zip_is_proximal_to_location()`) is S-jurisdictions substrate that ships with F037 and does not exist yet. `resolveLocalOwnerBadge()` is the single render seam; it returns `null` until the substrate lands, so the badge never renders and the surface stays clean (no negative space). Only the negative branch of Beat 2 is testable now.

**Deviation 2 — Beat 4 follow persistence deferred to F042.** The scenario's Data Captured describes a `member_follows` row with `target_kind='group'` / `target_id=$group_id`. The shipped `member_follows` (T048) is member→member only — composite PK `(follower_member_id, followed_member_id)`, no polymorphic target. There is no group-follow substrate. The scenario's own Assumptions assign it to F042. T074 renders the Follow CTA affordance (correct label, logged-in vs anonymous variants) and defers the write; tapping surfaces a non-destructive "coming soon" status. **Flagged for spec revision — see SPEC-PATCHES.**

**Deviation 3 — founder read from `groups.founder_member_id`, not a `group_memberships role='founder'` lookup.** The scenario's Data Captured note says "group_memberships where role='founder'". The shipped schema carries `founder_member_id` directly on the groups spine (T055), which is what T070/T073 write. Used the spine column — single source of truth, matches the immutable-founder design.

**Deviation 4 — built directly from `planning/now/` without the `next/` → reviewed → eval-spec → tickets sequence.** PM instructed a direct build of F035 (moved backlog → now, ticket T074 written, TDD in one pass). Gate A was already PASS in the scenario; `review-F036.md` already covered the `/p/.../g/[slug]` surface as a sibling. No `review-F035.md` produced; M2/M3 ran inline during build.

**Impact:** F035 read surface is shippable and self-contained. Badge lights up when F037/S-jurisdictions ships (resolver-body change only). Follow persists when F042 lands a group-follow handler (swap the click handler in `FollowShopButton.tsx`). Greens the F035 Group-page dependency (`:167`) in F036's eval suite. Playwright F035 eval-run is the downstream `test`-skill step.

**Escalation:** None — both forward-deps were anticipated by the scenario's Assumptions / Out-of-Scope sections.

**Resolution:** Shipped as scoped; this entry + the SPEC-PATCHES group-follow entry close the loop.

---

## 2026-06-01 — T073b — Sell-walkthrough eval-driven fixes

**Verdict:** M2 self-review PROCEED. Six applied fixes. F036 eval: **5 passing, 4 failing** (was 2/9 before). Remaining four fails are forward-deps on unbuilt upstream — logged separately under "T073 — F036 forward-dep gaps" below.

### Applied — `MultiStepComposer.dialogLabel` prop + Skip `role="link"`

**What:** Dialog `aria-labelledby` previously pointed at the per-step `<h3>` title, so the dialog's accessible name shifted with each step and matched the step's input label (e.g., both dialog and brand input were named "Brand name"). Replaced with `aria-label={dialogLabel}` + a stable default; SellWalkthrough passes `"Set up your shop"`. Skip button gained `role="link"` to match the DLS recipe ("text link, center").

**Why:** Playwright's `getByLabel('Brand name')` resolved to BOTH the dialog and the brand input on every test — strict-mode violation, no eval reached step 1 input fill. Per DLS § Multi-step composer Skip is semantically a link; my T073 ship rendered it as a button. Eval `getByRole('link', ...)` couldn't resolve.

**Disposition:** accepted-as-is. Unit tests updated to use `role: 'link'` for Skip — not a silent test rewrite to match wrong impl; the new role IS the right impl per DLS, the old tests were protecting the wrong behavior.

### Applied — `sellCreateLocationAction` switched to action-layer pg pool

**What:** Original used the supabase server client (session-bound, RLS-enforced). `locations` has no INSERT RLS policy — all writes are designed to go through the action layer. Eval surfaced `new row violates row-level security policy for table "locations"` on every inline-add. Switched to `withTransaction()` (service-role-effective DB connection).

**Why:** The proper fix is a `location.create` action handler (substrate ticket flagged in SPEC-PATCHES). T073b's pg-pool insert mirrors what that handler will do; swap is ~3 lines when it lands.

**Disposition:** flag-for-spec-revision — `location.create` handler still missing (SPEC-PATCHES already queues it).

### Applied — `sellActivateAction` URL builder rewritten

**What:** Original joined `groups → locations → places` via a non-existent FK (`locations` has no `place_id`). The PostgREST relational join silently returned null and tripped `shop_url_unresolved` on every activation. Rewrote to call `public.place_for_coords(lat, lon)` against the location's geography centroid + walk the `parent_id` chain recursively to assemble the slash-joined place path.

**Why:** I assumed a relational link that doesn't exist — the design uses `place_for_coords` against the geography column (per `022_places_reverse_geocode.sql`). Anchor: my own original T073 spec was unaware of this.

**Disposition:** accepted-as-is.

### Applied — `/you/sell` index uses `<button>` not `<Link>`

**What:** Per-Shop CTA was rendered as `<Link href="#">` (role=link). Eval expects `role=button`. Until F038 ships the real composer, the CTA is now a disabled `<button>` (semantically a button; intentionally inert).

**Why:** F038 lands the real composer; until then the surface is a forward-looking placeholder, but its ARIA role still needs to match the eventual surface (button → opens composer, not link → navigates).

**Disposition:** accepted-as-is.

### Applied — Anchor-picker auto-select uses local `addedLocations` state

**What:** `onSaved` tried to look up the new entity's label via `available.find()` — but `available` is the parent's snapshot at composer mount, so the just-created id is never in it. Refactored: `onSave` (where the result is in hand) appends `{id, label}` to a local `addedLocations` state + sets the selection. `onSaved` just closes the drawer.

**Why:** Eval :327 asserts the new Location's label is visible after the drawer closes. Without local state extension the picker had no row to render.

**Disposition:** accepted-as-is.

## 2026-06-01 — T073 — F036 forward-dep gaps surfaced by eval run

**Verdict:** Four scenario Then-clauses cannot pass at b1 because their upstream surfaces haven't shipped. Surfaced by the F036 eval run after T073b made the walkthrough drive end-to-end. These belong on T073 (the scenario's parent ticket) — T073b just exposed them by getting the walkthrough far enough to reach the assertions.

### Accepted-as-is — :112 + :167 fail at F035 Group-page rendering

**What:** Eval Then-clauses `getByRole('heading', { name: /Oak Park Sourdough/i })` + `expect(page).toHaveURL(/p\/.+\/g\/oak-park-sourdough/)` rely on F035 (Group public page) rendering the just-activated Shop. The walkthrough now drives end-to-end and the URL resolves; F035 hasn't shipped, so the destination page renders nothing.

**Why:** F035 is the explicit dependency named in the F036 scenario's `## Assumptions` section ("F035 (Group public page) ships alongside this scenario so the walkthrough completion has a destination"). T073's contract was "ship the surface + handler wiring; the eval verifies the scenario's Then-clauses end-to-end" — the upstream F035 has to land before the Then-clause that asserts the destination page is satisfied.

**Disposition:** accepted-as-is — waits on F035.

### Accepted-as-is — :224 fails at `Add a product / service / gathering` on /you

**What:** Eval asserts post-onboarding /you renders "Add a product", "Add a service", "Add a gathering" buttons from the active business-Group state. /you currently surfaces only the Sell CTA + a "Continue setting up your shop" affordance; the per-kind item composers are F038/F040/F034.

**Why:** F036's scenario explicitly says selling-tool affordances "appear from her active membership — no profile toggle" but doesn't itself ship the composers — those are F038 (product), F040 (service), F034 (gathering). T073's `/you/sell` index stub has the wired buttons-per-Shop; the /you home page additions are the upstream composers' surface work.

**Disposition:** accepted-as-is — waits on F038 + F040 + F034.

### Accepted-as-is — :266 fails at `Group settings | Manage shop | Settings` link

**What:** After completing the walkthrough with Locality skipped, eval looks for a Group settings / Manage shop link on the destination page. F035 owns the Group public page chrome; F037 owns the Locally-Owned claim lifecycle surface. Neither ships in T073's scope.

**Why:** Scenario AC "she can return to the locality claim via Group settings later (F037 covers the claim lifecycle)" puts both halves upstream of T073.

**Disposition:** accepted-as-is — waits on F035 + F037.

### Accepted-as-is — `places.geography` polygons unseeded at b1 (T058 substrate gap)

**What:** None of the `places` rows seeded by `017_places.sql` have a `geography` polygon — only name + parent hierarchy. `public.place_for_coords()` returns zero rows for every coordinate, so any surface that resolves a place from a Location (T073's `sellActivateAction` URL builder; future surfaces in F035 and the producer feed) cannot resolve at b1.

**Why:** T058's seed scope didn't include polygons (the polygon stamping was deferred to a follow-up). The F036 fixture stamps a tiny test polygon around Oak Park as a localized workaround; the real seed lives outside T073.

**Disposition:** flag-for-spec-revision — SPEC-PATCHES entry queues the polygon seed.

## 2026-06-01 — T073a — Sell-side `locations` column-name fix-forward

**Verdict:** No deviations beyond the schema-alignment itself.

### What
Two files referenced `locations.display_name` (a column that does not exist) and `sellCreateLocationAction` omitted three NOT NULL columns (`member_id`, `slug`, `geography`). Fix-forward landed those references against the actual 007_locations.sql schema. Added one regression unit test that captures `.select()` args so the wrong column name would fail.

### Why
The bugs shipped clean in T073 because the unit tests mocked the supabase chain — `.from().select()` returned `{data: [], error: null}` no matter what columns were named. The first writer to exercise the real schema was the F036 fixture seed (landed by `test` skill), which immediately surfaced the column mismatch. Lesson for future PRs: when mocking a query chain, capture the call args and assert on the table + column names, not just the resolved data.

### Disposition
accepted-as-is. The regression test added to `SellCta.test.tsx` is the structural guard going forward.

## 2026-06-01 — T073 — `<SellWalkthrough>` + `/you` Sell CTA — M2 trail

**Verdict:** M2 self-review PROCEED after three fix-now landings (one logic bug, one URL-builder guard, one toast-lifecycle leak). Three deferrals + two flag-for-spec-revision entries cover substrate gaps the surface had to work around.

### Applied — Critical: back-edit-brand double-create guard in `SellWalkthrough.onAdvance`

**What:** The brand-step `onAdvance` originally checked `state.draftGroupId` only; that field is never populated because the composer is uncontrolled and `createDraft`'s response can't reach the composer's `setState` from `onAdvance`. A user who tapped Back to step 1 and re-submitted brand would re-fire `group.create` and orphan a second draft Group.

**Why:** Self-review caught it before commit. Fixed by also consulting `shadowDraftId` — the component-scoped state we already kept for steps 2–4. Test `back-edit brand does not double-create the draft` locks it in. The composer's API doesn't expose a clean way to push state back from `onAdvance`; this shadow is the smallest viable workaround. Anchor: `src/components/sell/SellWalkthrough.tsx:onAdvance step='brand'`.

**Disposition:** accepted-as-is.

### Applied — Critical: `sellActivateAction` refuses to return a guessed URL

**What:** Initial URL builder fell back to `/p/place/g/shop` when the place join returned nothing. F035 would 404; the user's Shop would appear lost.

**Why:** The handler's success is the moment the Shop becomes findable; a broken URL there is worse than an error toast. Now throws `shop_url_unresolved` with copy that points the user back to `/you`. The Shop row still exists; the user can refresh and we'll re-resolve once the place data lands. Anchor: `src/app/you/sell/actions.ts:sellActivateAction`.

**Disposition:** accepted-as-is.

### Applied — Suggestion: toast auto-clear on `SellCta`

**What:** Success toast had no timeout — it pinned to the screen indefinitely (until next navigation).

**Why:** Polite-region screen-reader announcement is the load-bearing accessibility behavior; visual persistence is just noise. 4s timeout matches the OS-native toast lifecycle. Anchor: `src/components/sell/SellCta.tsx:useEffect on toast`.

**Disposition:** accepted-as-is.

### Flag-for-spec-revision — Locality (Tier 0) step is UI-only at b1 (no `member_business_jurisdictions` substrate)

**What:** T073 acceptance line 36 says step 4 writes a `member_business_jurisdictions` row with `verification_source='self_attested'`. That table does not exist — F037 owns the substrate. The step UI captures the ZIP and discards it on submit. The scenario AC "Given Maya skips the Tier 0 locality step → no row, no badge" passes either way; the "Given Maya fills in the ZIP" path silently no-ops at b1.

**Why:** The review explicitly says "F036 does NOT need that substrate" (review-F036.md § cross-system consistency) — direct contradiction with T073's acceptance text. Two sources of truth diverged. Implementation chose surface continuity (keep the step visible so the future F037 retro-fit doesn't have to add a new step + change the indicator count) over silently dropping the step. Wired into SPEC-PATCHES so F037's surfacing brings the persistence path.

**Disposition:** flag-for-spec-revision — F037 substrate + a follow-on micro-ticket to wire the locality-step write once `member_business_jurisdictions` ships.

### Flag-for-spec-revision — `sellCreateLocationAction` writes directly to `locations` table (no `location.create` handler)

**What:** Ticket acceptance: "Anchor-Location step's '+ Add a new Location' sub-flow wires `<AddEntityDrawer>` to `location.create` handler". The `location.create` action handler does not exist in the action registry. The server action inserts directly into `locations` via the Supabase server client.

**Why:** RLS gates the insert, so it's not a credential-boundary violation, but it does bypass the action layer's audit-event invariant — no `location.created` event row writes. Acceptable at b1 for the inline-add path because there's no consumer of `location.created` yet, but the substrate gap is real. Wired into SPEC-PATCHES.

**Disposition:** flag-for-spec-revision — `location.create` handler is a substrate ticket that ships in a near-term sprint; once it lands, swap `sellCreateLocationAction`'s body for a handler call (~3 lines).

### Deferred — Anchor-Location picker may render empty at b1 (no Member↔Location relationship)

**What:** `member_location_affinities` was retired by T061 and `member_place_interests` (T062) replaces it for *places*, not for *Locations*. The picker queries `locations` with `.limit(20)` — at b1 it returns whatever Locations RLS exposes to the viewer, which is unlikely to be a curated "your Locations" list. The "+ Add a new Location" path covers the gap.

**Why:** Producing a Member-curated Location list would require either a new join table (`member_location_anchors`?) or a re-read of which Locations the Member founded. Both are outside T073's scope; the AddEntityDrawer path keeps the walkthrough completable.

**Disposition:** revert-on-next-pass — once a Member↔Location anchor model lands, swap the picker's data source.

### Deferred — `/you/sell` index stub renders only `Add a product` (services + gatherings later)

**What:** T073 acceptance line 48: "lists the Member's active business Groups + an 'Add a product' CTA per Group, deferring product/service/gathering composers to F038/F040/F034". The current stub renders one "Add a product" link per Shop with `href="#"`. Service + gathering CTAs are not surfaced at all.

**Why:** Per the ticket itself — those composers are forward-tickets. Adding non-functional buttons now would conflict with the "no orphan CTAs" rule. The stub is intentionally minimal; F038/F040/F034 will extend it.

**Disposition:** accepted-as-is — F038 surfaces the product composer; this stub gains a wired CTA then.

### Deferred — Full focus-trap on `<SellWalkthrough>` (inherits from T071/T072 a11y follow-up)

**What:** Composer + drawer both delegate to their underlying T071 / T072 components' focus management (mount focus + ESC + restore). Full Tab-trap within the dialog is the deferred item that was already filed under T071's M3 trail.

**Why:** Same rationale as T071/T072 — basic a11y is satisfied; full-trap is a shared follow-up. No new debt introduced by T073.

**Disposition:** accepted-as-is.

## 2026-05-31 — T072 — `<AddEntityDrawer>` sub-flow — M2 + M3 trail

**Verdict:** M2 self-review PROCEED after one a11y addition (aria-live=assertive on the submit error). M3 satisfied at the basic level. Two deferrals carry the same disposition as T071's a11y follow-up.

### Applied — A11y critical: `role="alert"` + `aria-live="assertive"` on submit error

**What:** The submit-error `<p>` now carries `role="alert"` and `aria-live="assertive"` so screen readers announce the failure without the polite-queue delay.

**Why:** Submit errors are time-sensitive (user just tapped Save and is waiting). Polite-live or no-live would leave the failure unannounced until the next focus event. Standard a11y baseline for modal submit failures.

**Disposition:** accepted-as-is.

### Deferred — Parent composer "paused" visual styling

**What:** The DLS spec says "parent stays mounted at -8px vertical offset and 60% opacity per the DLS spec." The drawer correctly stacks above the parent (z-[60] over z-50), but does NOT apply the offset/opacity transformation to the parent.

**Why:** Either the drawer reaches up via a context to dim/offset the parent (coupling), or the parent has to detect a drawer-mounted state (also coupling). Neither approach is clearly better; the cleanest is probably an `AddEntityDrawerActiveContext` that any wrapper can read to apply paused styling. The visual contract isn't critical for the b1 acceptance — the drawer correctly stacks above; the "paused-not-gone" framing is a polish item. Pair with the T073 build to see which approach surfaces naturally.

**Disposition:** flag-for-ticket-rewrite — bundle into the T073 ticket or a small follow-up. Until then, the parent renders un-paused behind the drawer (still visible, no offset).

### Deferred — Full focus-trap (Tab cycling within the drawer)

**What:** Same shape as T071's deferred focus-trap. Initial focus moves to the dialog and restores on unmount, but Tab can escape to the underlying page DOM (which is inert behind the overlay).

**Why:** Same rationale as T071's entry — non-trivial implementation; the underlying page is currently behind a `bg-black/40` overlay so the practical risk is "Tab eventually escapes into invisible elements" not "user touches a sibling control."

**Disposition:** flag-for-ticket-rewrite — pair with the same a11y-cleanup follow-up that T071 flagged. That ticket should extract a shared focus-trap utility usable by both `<MultiStepComposer>` and `<AddEntityDrawer>`, and either land it as a `web/src/components/ui/` primitive or wire it directly into both consumers.

## 2026-05-31 — T071 — `<MultiStepComposer>` base — M2 + M3 trail

**Verdict:** M2 self-review returned PROCEED after two a11y gaps closed in the same loop (ESC dismisses + focus restoration on unmount). M3 design-accessibility scope satisfied at the basic level; full focus-trap deferred. 13/13 vitest GREEN; zero new TS errors; lint + action-layer conformance clean.

### Applied — A11y critical: ESC + focus restoration

**What:** Added an `Escape` keydown listener that fires `onAbandon`, plus a mount-time `activeElement` snapshot whose ref restores focus when the composer unmounts.

**Why:** Standard modal a11y baseline. The ticket Notes named focus management as a requirement; ESC dismissal is a standing user expectation for dialogs. Surfaced by self-review before commit.

**Disposition:** accepted-as-is.

### Deferred — Full focus-trap (Tab cycling within the dialog)

**What:** The composer establishes initial focus on the dialog and restores it on unmount, but does NOT prevent the user from Tab-bing out of the dialog into the underlying page DOM.

**Why:** A full focus-trap requires tracking the set of tabbable descendants + intercepting Tab/Shift+Tab at the dialog boundary — non-trivial, and the underlying page is currently inert behind the overlay (`fixed inset-0 z-50 bg-black/40`), so the practical risk is "Tab eventually escapes into invisible elements" rather than "user touches a sibling control." The b1 acceptance bar from F036 (Maya completes the walkthrough on touch) is met without it.

**Disposition:** flag-for-ticket-rewrite — a future a11y-cleanup ticket should add (a) full focus-trap to `<MultiStepComposer>` and (b) extract a shared `<Drawer>` / `<Modal>` primitive under `web/src/components/ui/` that both this composer and `AuthGateModal` consume.

### Deferred — No `web/src/components/ui/` Drawer/Modal primitives extracted

**What:** The ticket's acceptance text said "Uses existing `Drawer` / `Modal` primitives if present in `web/components/ui/`; create them if absent (cite as deviation)." No `ui/` directory exists; rather than create one-consumer primitives, the composer was built inline matching the pattern in `web/src/components/AuthGateModal.tsx` (bottom-anchored-on-mobile overlay with stop-propagation on the inner card).

**Why:** Creating shared primitives for a single consumer is premature abstraction. The composer + AuthGateModal are now the two consumers of the pattern; a third surface (e.g., the F072 `<AddEntityDrawer>` sub-flow) is the natural trigger for extracting a shared base.

**Disposition:** flag-for-ticket-rewrite — pair with the focus-trap follow-up above. T072 will likely be the third consumer; if its review surfaces the duplication, the extract lands there. Otherwise a dedicated UI-primitives cleanup ticket post-b1.

## 2026-05-31 — T070 — Groups lifecycle_state + draft handlers — M2 trail

**Verdict:** M2 `engineering:code-review` returned **REQUEST CHANGES** with 2 criticals + 7 suggestions. PM disposition stamped in [`planning/now/review-F036.md` § "T070 M2 code-review (2026-05-31)" § "PM disposition (2026-05-31)"](../planning/now/review-F036.md). All criticals applied pre-commit (fix-now per Rebuild Phase rule 3); three suggestions folded in the same loop; four deferred. Final state: 40/40 vitest GREEN, action-layer conformance OK, zero new tsc errors in T070 files.

### Applied — Critical #1: TOCTOU re-assertion of `lifecycle_state = 'draft'` in `update_draft` UPDATEs

**What:** Both UPDATEs in `web/src/actions/group/update-draft.ts` now carry `AND lifecycle_state = 'draft'` in their WHERE clauses — the `groups` UPDATE inline, the `group_businesses` UPDATE via an EXISTS subquery against the parent row. `rowCount === 0` surfaces a concurrent `group.activate` race as `ValidationError`.

**Why:** Without the re-assertion, a concurrent `group.activate` between the handler's initial `SELECT … lifecycle_state` check and the subsequent UPDATE would silently mutate an *active* row. `activate.ts` already had the symmetric guard on its own promote UPDATE; `update_draft` was missing it. Surfaced by [F036-review.md § Findings #1](../planning/now/review-F036.md).

**Disposition:** accepted-as-is (fold-in mandatory). Matches the TOCTOU pattern in `member.create` and `activate.ts`.

### Applied — Critical #2: Random 4-byte hex suffix on draft slugs

**What:** `web/src/actions/group/create.ts` and `update-draft.ts` append a 4-byte random hex suffix to every draft `groups.slug` value (via `node:crypto.randomBytes(4).toString('hex')`).

**Why:** `groups.slug` is `NOT NULL UNIQUE` (per migration 014_groups.sql line 51). Two Members opening the Sell walkthrough concurrently with the same brand name would collide on the second INSERT with Postgres 23505. The user-visible random-suffix scheme applies to *activated* rows; draft rows need their own collision avoidance because they hit the same UNIQUE constraint. Draft slugs aren't publicly addressable (RLS hides drafts), so the user-facing shape is irrelevant — what matters is no 23505. Surfaced by [F036-review.md § Findings #2](../planning/now/review-F036.md).

**Disposition:** accepted-as-is (fold-in mandatory). The user-visible final slug for activated Groups is a follow-up patch on `group.activate` — flagged for the next pass; this ticket's responsibility ends at the draft state machine.

### Folded — Suggestion #3: `group.member_removed` removed from migration's CHECK

**What:** Migration `023_groups_lifecycle_state.sql` previously extended `group_events.event_kind` CHECK with `'group.member_removed'`. The extension has been reverted; the CHECK now lists only the kinds with a producer in T070's scope. Inline note in the migration directs the future `group.member_remove` handler ticket to extend the CHECK in its own migration.

**Why:** Per [F036-review.md § Findings #3](../planning/now/review-F036.md), pre-creating an event slot without a producer is misleading and risks an orphan kind in the CHECK. One-line edit; free window before commit.

**Disposition:** accepted-as-is (fold-in suggestion).

### Folded — Suggestion #5 + #7: Extracted `GROUP_KINDS` + `DRAFT_NAME_PLACEHOLDER` to `src/actions/group/constants.ts`

**What:** New file `web/src/actions/group/constants.ts` exports `GROUP_KINDS` (closed enum of the six kinds) + `GroupKind` type + `DRAFT_NAME_PLACEHOLDER`. `create.ts` and `activate.ts` now import from `./constants` instead of declaring locally.

**Why:** Per [F036-review.md § Findings #5 + #7](../planning/now/review-F036.md), the kind list duplicated the migration's `groups.kind` CHECK and was referenced from multiple handlers; the placeholder was duplicated between `create.ts` and `activate.ts`. Single source of truth pre-empts schema drift if a new kind ever lands.

**Disposition:** accepted-as-is (fold-in suggestion).

### Deferred — Suggestions #4, #6, #8, #9

Per [F036-review.md § PM disposition](../planning/now/review-F036.md):

- **#4** — Owner-check race comment in `update-draft.ts` is theoretical at b1 (no `group.member_remove` handler exists). Add the comment when that handler lands.
- **#6** — Conditional `UPDATE` after `INSERT` for `anchor_location_id` in `create.ts` is one extra DB round-trip per draft create on a low-traffic path. Not worth re-running M2.
- **#8** — Cleaner test-context construction via `makeContext` helper is low-value polish.
- **#9** — `create.ts` hardcoding `lifecycle_state = 'draft'` is YAGNI; flag when a real caller needs `'active'` at create time.

## 2026-05-31 — T068 — Stryker test-runner scope fix

**Deviation:** Two items.

1. **T065 too-broad exclude — `flag-for-spec-revision`.** T065's `vitest.stryker.config.ts` excluded the entire `tests/**` directory to dodge 12 DB-bound `migrations-*.test.ts` failures. The blanket exclude also dropped the pure-logic suites in `tests/` that already cover the files Stryker mutates (`places-resolve-path.test.ts`, `reverse-geocode.test.ts`, `geocoding.test.ts`, `slugify.test.ts`, etc.). Result: the T065 baseline (30%) misread "tests not being run" as "tests don't exist." Disposition: **corrected-in-T068** — narrowed exclude to `tests/migrations-*.test.ts`. Post-fix baseline: 58.05% total.

2. **5 pre-existing stale test files surfaced — `deferred-to-T069`.** Widening Stryker's include surfaced 5 stale assertion failures that also fail under plain `npx vitest run tests/` (not Stryker-isolation, pre-existing bugs):
   - `tests/auth-signup-route-t044.test.ts` — frozen "5 migrations" list, dir has 22.
   - `tests/ci-conformance-json.test.ts`
   - `tests/ci-enforcement-rule-1.test.ts`
   - `tests/ci-enforcement-rule-4.test.ts`
   - `tests/eval-bootstrap.test.ts`

   Each added to `vitest.stryker.config.ts` exclude with `// stale — T069` suffix for a clean grep target. Disposition: **deferred-to-T069** (fix assertions, remove excludes).

**Why:** T068's scope was config-narrowing + re-baseline. Fixing 5 unrelated stale tests in the same ticket would have been scope creep; quarantining them without note would have violated the "do not silently quarantine" rule. Each named entry + DEVIATIONS pointer keeps the trail visible.

**Impact:** `npm run mutate` now exercises the real test suite. Residual 0% on `action-context.ts` (sentinel Proxy, low-ROI) and `categories.ts` (static data + 1-line fallback) are honest gaps, not artifacts of test runner config.

**Escalation:** None. Build agent applied the config change; T069 is a follow-up ticket for the stale assertions.

**Resolution:** Config landed in `vitest.stryker.config.ts`. New baseline captured in T068 Completion + BUILD-LOG.

---

## 2026-05-30 — T067 — No deviations

**Deviation:** None against spec. All 12 listed workflow.md files updated with identical Final Report block; CLAUDE.md § Report shape, playbook entry, and AGENTS.md cross-ref landed exactly as scoped.

**Why:** No skill needed a custom report shape — the template applies uniformly. The build/workflow.md "You produced" replacement preserved the surrounding Hand off context. No drift surfaced during execution.

---

**Format:**

```markdown
## {Date} — {Ticket} — {Title}

**Deviation:** {What differs from spec}

**Reason:** {Why}

**Impact:** {What changes for downstream?}

**Escalation:** Escalated to {Planning / Product}

**Resolution:** {How was it resolved?}
```

(Log entries as they occur)

---

## 2026-06-02 — T077 — `schedule_kind='permanent'` mapped to `'ongoing'`

**What:** F038's Data-Captured table specifies `item_locations.schedule_kind='permanent'` for a pickup point. The `item_locations.schedule_kind` CHECK (015_items.sql) only permits `one_time | recurring | ongoing | by_appointment` — `'permanent'` is not a valid value. The handler defaults a pickup attachment to `'ongoing'`.

**Why:** The scenario author conflated Location *permanence* (`location_permanent` kind) with the Item↔Location *schedule* enum. A permanent pickup point is best modeled as `'ongoing'` availability. Using a non-enum value would fail the CHECK at insert.

**Disposition:** flag-for-spec-revision — the F038 scenario's Data-Captured row should read `schedule_kind='ongoing'`. SPEC-PATCHES entry filed.

## 2026-06-02 — T077 — Cross-Member pickup Location attaches as `status='approved'`

**What:** `item.create` / `item.attach_location` insert `item_locations` with `status='approved'` unconditionally. The schema reserves `status` (`pending|approved|declined`) for cross-Member Location attachments (attaching to a Location you don't own should be `'pending'` until the Location owner approves).

**Why:** No Location-ownership read model exists at b1 — T061 retired `member_location_affinities`, and the anchor model is thin. The composer only offers the Member's own/just-added Locations, so `'approved'` is correct for every b1 path. The `'pending'` flow needs an owner-approval surface that isn't in b1 scope.

**Disposition:** accepted-as-is — revisit when a Location-ownership/approval surface lands (forward-dep). M2-noted.

## 2026-06-02 — T078 — Product written atomically at publish; composer steps are collect-only

**What:** Unlike the SellWalkthrough (which persists each step via `group.update_draft`), `<ProductComposer>`'s `onAdvance` is a no-op; the entire product is written in one `item.create` call at the final Publish step.

**Why:** F038's "Composer writes Item + child + Location in one transaction" Then-clause requires a single atomic write. A product has no half-built-draft lifecycle at b1 (no draft-Item composer-resume contract like Groups have), so per-step persistence would add a draft-Item state machine the scenario doesn't call for.

**Disposition:** accepted-as-is — matches the scenario's one-transaction criterion.

## 2026-06-02 — T079 — id8-fragment Item addressing (no `slug` column on `items`)

**What:** The Item URL slug is `toSlug(title)-<first 8 chars of items.id>`; the resolver matches the trailing fragment against `items.id`'s first 8 chars. `items` has no `slug` column.

**Why:** The intended design wants a random suffix on Item URLs; adding a `slug` column would mean a migration (+ M4 deploy-checklist) for a b1 surface where the id-fragment satisfies both uniqueness-enough (1-in-4B collision within a single owning scope) and the random-suffix intent. The fragment is parsed in JS after RLS-scoped fetch (PostgREST can't `left(id::text,8)` on a uuid cleanly).

**Disposition:** accepted-as-is — if Item-slug vanity URLs or collision-hardening are wanted later, add a `slug` column then. M2-noted (collision 1-in-4B).

## 2026-06-02 — T080 — No deviations

**What:** Generalized `item.create` to kind in (product, service, gathering) with a kind-branched child insert, and made the `/you/sell` composer row data-driven. Product behavior is byte-identical (same child insert + params); spine, owner-check, brand_label, location attach, and publish stay kind-agnostic.

**Why:** Prep ticket so F040 (service) and F034 (gathering) branch the shared spine in parallel without colliding.

**Disposition:** no deviations. `made_at_place_id` is nulled for non-product to respect the existing `items_made_at_only_on_products` CHECK — that constraint was already in the schema; no spec change implied.

## 2026-06-02 — T084 — Gathering files under Group/Member at b1; venue-scoped `/l/<location>/e/` URL deferred to F033

**What:** F034's scenario centers the entry on the venue page ("Host something here") and specifies a venue-scoped URL `/p/[…place]/l/[location-slug]/e/[slug]`. At b1 the composer is reached from the `/you/sell` shop row (the data-driven COMPOSERS array, like the product composer) and files the gathering under the Group (`/p/…/g/<slug>/e/<slug>`) or, with no anchor, under the Member (`/m/<handle>/e/<slug>`). The venue `/l/<location>/e/` path is not built.

**Why:** F033 (venue page with the "Host something here" CTA + a Location resolver) has not shipped — there is no Location public page or `/l/` resolver to host the venue-scoped URL or the entry CTA. Mirroring the shipped F038 product surface (Group/Member filing through `/you/sell`) gives the gathering composer a working entry + canonical URL now, without inventing the F033 Location surface ahead of its scenario.

**Disposition:** flag-for-spec-revision — when F033 lands the venue page + `/l/` resolver, add the venue entry CTA and the `/p/…/l/<location>/e/<slug>` URL form (the resolver already keys off the owning scope; a `splitGatheringSlug` arm for the `/l/` marker is the addition). SPEC-PATCHES queued against F034 § Surfaces + § Completion URL.

## 2026-06-02 — T084 — `item.create` gathering arm extended with `whatToBring`

**What:** Added `whatToBring` to `itemCreateInput` and the `item_gatherings` insert. T080 generalized the handler but its gathering insert omitted the `what_to_bring` column (the table has it).

**Why:** F034 § Data Captured lists "What to bring" as an optional composer field, and the column already exists in migration 015. T080's comment assigns the gathering arm to F034 ("each composer ticket owns its arm"), so filling the missing column is in-scope rather than a shared-handler redesign.

**Disposition:** no deviation from spec — closes a gap between the T080 scaffold and the F034 Data-Captured table. M2-noted.

## 2026-06-02 — T085 — No deviations beyond the inherited id8 addressing

**What:** `resolveGathering` reuses the T079 `parseIdFragment` id8-fragment addressing (no `slug` column on `items`). The group-path query does **not** constrain `groups.kind='business'` (the product resolver does), so a gathering filed under any Group kind resolves.

**Why:** id8 addressing is the established b1 Item-URL contract (see T079 entry). Not constraining group kind is intentional — gatherings are not business-only (event_anchored/interest Groups host them in future); the slug + `group_id` match is the gate.

**Disposition:** no new deviation. M2-noted.

## 2026-06-02 — T081 — Service rate_model honors shipped schema enum, not the scenario list

**What:** F040 § Data-Captured lists `rate_model` as `flat / hourly / per-session / free`. The shipped CHECK (`015_items.sql`) is `hourly / flat / quote / membership`. The build honors the durable schema: composer offers Per-hour / Flat rate / Request-a-quote / Membership. "per-session" has no schema slot (conceptually `flat`); "free" is modeled as `rate_cents = NULL` (mirrors product's free path), not a `rate_model` value.

**Why:** No new migration at b1 (task constraint + the column is fine). The enum is durable; the scenario's Data-Captured row is the spec text that drifted. SPEC-PATCHES filed against the scenario row.

**Disposition:** flag-for-spec-revision — SPEC-PATCHES entry appended. M2-noted.

## 2026-06-02 — T081 — service_area_geography as a PostGIS buffer-circle; MultiPolygon edge unguarded

**What:** `item.create` writes `service_area_geography` via `st_buffer(st_setsrid(st_makepoint(lon, lat), 4326)::geography, radius_m)` — a circle from center + radius. The column type is `geography(Polygon,4326)`; `ST_Buffer` returns a single Polygon for normal radii but could in principle yield a MultiPolygon near a pole/antimeridian, which the column type would reject.

**Why:** Radius is UI-bounded (miles) and centers are real Locations, so the pathological case is not reachable at b1. Guarding it (or widening the column to MultiPolygon) is deferred.

**Disposition:** accepted-as-is — revisit if a service area ever spans a pole/antimeridian. M2-noted (low-sev).

## 2026-06-02 — T082 — Anchor Location doubles as the service-area center

**What:** F040 § Edge Cases allows a pure area-only service (no anchor Location). The composer instead requires one center Location, which is also written as the `item_locations` anchor and supplies the circle's center coords. Pure area-only (no anchor) is deferred.

**Why:** A circle needs a center point; capturing a free-floating map center is a heavier picker (deferred to b2 polygon editor per F040 § Out of Scope). Reusing the Location picker keeps the b1 surface to the product composer's shape.

**Disposition:** accepted-as-is — area-only-without-anchor returns with the b2 service-area polygon editor. M2-noted.

## 2026-06-02 — T083 — Service-area renders as static text at b1 (no Mapbox circle)

**What:** `<ServicePublicPage>` renders the service area as a static statement ("Available around {anchor} and the surrounding area") gated on `hasServiceArea`. The resolver reports `hasServiceArea` (geography non-null) but does not recover the circle geometry; the Mapbox circle render is deferred.

**Why:** Mirrors the product page's static pickup marker (T079) — the real-map surface is a later concern. The geography's load-bearing job (feed-area intersection per F040's last AC) is exercised by the Playwright eval against live Supabase, not the page render.

**Disposition:** accepted-as-is — Mapbox service-area circle lands with the richer map surfaces. M2-noted.

## 2026-06-02 — T075 — member_business_jurisdictions Tier 0 substrate

**What (4 deviations):**
1. **`places.msa_code` + `locations.place_id` did not exist.** The ticket assumed both columns existed (per T060/T066) for the `locations.place_id → places.msa_code` proximity join. Neither did — `places` had no metro column and `locations` carried only `geography`. Both columns were added (nullable) in migration `025_zip_metro_crosswalk.sql`. `places.msa_code` is populated for the four CBSA-40900 county subtrees (Sacramento/Placer/El Dorado/Yolo + descendants — 11 rows). `locations.place_id` has no population path at b1, so the function returns null-safe-false for every current Location.
2. **`zip_metro_crosswalk` got RLS (ticket said "no RLS").** web/CLAUDE.md Rule 3 + `tests/rls-coverage.test.ts` require RLS on every public table. Enabled RLS + a public-read `using (true)` SELECT policy — honors the ticket's "public read" intent while satisfying the hard CI rule. Seed/refresh writes run as table owner and bypass RLS.
3. **Seed inlined, not `\i`/`\ir`-included.** The ticket allowed either; the Supabase migration runner applies files via a Postgres driver (not psql), so a backslash include would fail on `supabase db push`. The 90-row Sacramento INSERT is inlined into migration 025; the standalone `seeds/zip_metro_crosswalk_sacramento.sql` is kept as the canonical manual-reload + national-expansion artifact (mirrors the inline block).
4. **Owner-role soft-delete column is `left_at`, not `removed_at`.** The ticket note said "`group_memberships.removed_at is null`"; the shipped schema (014_groups.sql) uses `left_at`. Handlers use `left_at is null` + `role='owner'` + `groups.kind='business'`.

**Also folded `.set`/`.update` into one handler** per the ticket's own § Action handlers guidance: update is a soft-replace inside `.set`, preserving the audit chain in the historical row. No separate `.update` handler.

**Why:** Deviations 1–3 are forced by the divergence between the ticket's assumptions and the shipped schema/CI rules; each is the conservative, CI-conformant choice. The function is null-safe-false so the missing `locations.place_id` population never produces a false-positive badge.

**Verification:** Both migrations applied + rolled back against live local Supabase (90 seed rows, 11 places stamped, RLS=on, function created). The SQL contract test (`supabase/tests/zip_is_proximal_to_location.sql`) passed all 5 cases live ("T075 OK"). 40 vitest file-shape/input/source tests green.

**Disposition:** flag-for-spec-revision — two SPEC-PATCHES entries appended (`location.md` missing `place_id`; `places.md`/`location.md` missing `msa_code`). M2 PROCEED (2 issues found + fixed before commit: crosswalk RLS, inline seed).

---

## 2026-06-02 — F030 newcomer signup + locality feed (T086–T089)

### T086: `member.interests.add` is a new handler; place-interest handlers registered late

**What:** The scenario assumed the interest-write handler existed; it did not. Added `member.interests.add`. Also registered `member.place_interest.add` / `.remove` (built in T062 but never added to the action registry).

**Why:** T062 shipped the place-interest handlers but the registry (`src/actions/index.ts`) only listed member.create/group/item/jurisdiction handlers — onboarding could not invoke them. No migration: `member.interest_added` already exists in the `member_events` event_kind CHECK (010/018/024).

**Disposition:** accepted-as-is.

### T087: feed is a SQL function over a Place polygon, not a `.from()` query

**What:** The locality feed runs through a new `public.locality_feed_items()` SQL function (migration 027) called via `supabase.rpc(...)`, rather than a Supabase `.from()` builder.

**Why:** The feed filters `discoverable_items.nearest_location_geography` by `st_intersects` against a `places` polygon — PostGIS spatial predicates can't be expressed through the `.from()` builder. Matches the existing SQL-function pattern (`place_for_coords`, `zip_is_proximal_to_location`). Descendant Places sit inside the ancestor polygon, so containment covers the hierarchy without a recursive walk.

**Disposition:** accepted-as-is.

### T088: b1 IP geolocation deferred → launch-locality default; old HomeFeed unmounted from `/`

**What:** AC1 specifies an "IP-geolocated locality." b1 ships a launch-locality default (`sacramento`) plus the scope picker instead of real IP geolocation. The pre-rebuild `HomeFeed` (events/vendor_bulletins) is unmounted from `/`; the new `LocalityFeed` replaces it. Feed cards link via the Member-scoped Item URL (`/m/<handle>/<seg>/<slug>-<id8>`) rather than the Group place-path URL.

**Why:** IP→geo is an infra dependency (no provider wired at b1); the scenario's own edge case ("IP-geolocation fails → show picker") sanctions a picker fallback. The Member-scoped Item route exists for every kind (T079/T082/T083), so the feed need not resolve each Item's Group place-path to produce a working link. `HomeFeed` stays in the tree (other surfaces may import it); only `/` is repointed.

**Disposition:** flag-for-spec-revision — IP geolocation + Group-scoped feed URLs are b2 refinements.

### T089: profile fields write directly (no `member.update` handler / event)

**What:** `saveProfileAction` writes `members` (display_name/handle/bio/pronouns/avatar) via the session-bound owner-update-RLS client, with no `member.updated` event. Locality + interests go through the action layer (events emitted). The handle-suggestion surfacing mutates the composer's shared state object before throwing (forced re-render shows the chips).

**Why:** No `member.update` handler exists, and profile edits are not declarations (unlike place-interest / interest, which are). Building a member.update handler is out of F030 scope. The mutate-then-throw pattern is the only seam to pass async server-validation results back into the framework-agnostic `MultiStepComposer` (same shape as T073's shadowDraftId).

**Disposition:** flag-for-spec-revision — `member.md` should decide whether profile edits emit `member.updated`.

### F030 eval: authored, not run in-sandbox

**What:** The Playwright eval (`evals/features/F030-…spec.ts`) + fixture (`evals/fixtures/F030-newcomer.ts`) are written but not executed here — the sandbox has no running Next.js dev server or live Supabase. The fixture refreshes the `discoverable_items` MV by inserting an `item.published` event (the 016 trigger) and seeds its own Place polygon (independent of the unmerged T076 region seed).

**Why:** Live verification is the downstream `test` (run-mode) step on the user's machine, same hand-off as prior tickets. Pre-existing brittle test `auth-signup-route-t044 › contains all five Phase 0 migrations` (`toEqual` on the migrations dir, broken since T055 per BUILD-LOG:101) counts 26 vs 25 after adding migration 027 — unrelated to this work; queued under T069.

**Disposition:** accepted-as-is.

### T090: email-first signup — returning-user detection via an enumeration-exposing RPC; profile still not event-sourced

**What:** PM redirected the auth method (supersedes T089's "magic-link primary"): email/password is now primary via a single email-first page (`/auth/signup`) that detects new vs returning users; magic-link is secondary. Detection uses a new SECURITY DEFINER RPC `public.email_is_registered(email)` (migration 028) reading `auth.users`, granted to anon.

**Why:** `members` has no email column (the T044 hook mirrors auth.users → members by id), so new-vs-returning detection must read `auth.users` — only reachable via SECURITY DEFINER (same pattern as 002/006/009). Granting it to anon exposes email enumeration, but the requested two-phase UX ("set a password" vs "enter password") is inherently enumerable regardless of mechanism; scope is limited to a boolean and no other auth data leaks. The old signup page's `AuthMethods` component stays in use on `/auth/login` (no orphan).

**Disposition:** flag-for-spec-revision — `member.md`/`policy.md` should record the deliberate enumeration tradeoff for the email-first flow, and the prior "magic-link primary" note (STAGE-LEDGER / T089) is superseded by "email/password primary, magic-link secondary."

### T091/T092 (F032): public Member-page projections — anon-readable views (migration 029); group-membership visibility gated on group discoverability

**What:** F032 needs two reads the base-table RLS does not grant an anonymous (or non-co-member) viewer: (1) `member_has_standing_presence` (the badge view, created in `014_groups.sql`) had **no GRANT**, so the PostgREST `anon`/`authenticated` roles could not read it at all; (2) `group_memberships` RLS is owner/co-member only (`memberships_select_self` + `memberships_select_co_member`) — a public page listing a Member's *listed* Group memberships has no read path. Migration `029_member_public_projections.sql` (additive) grants the standing view to anon/authenticated and adds a privacy-preserving public projection view `public.member_public_group_memberships` (regular view → runs with owner privileges, bypasses base-table RLS; its WHERE clause is the gate: active explicit memberships in non-dissolved, **listed** Groups only). The b1 interpretation of "listed membership" = `groups.discoverability = 'listed'`; `members.stakeholder_visibility` and per-membership visibility remain reserved substrate with no surface.

**Why:** The scenario requires anonymous read of the standing badge and listed Group memberships. The substrate (`member_follows`, the `member.followed`/`member.unfollowed` event kinds) already existed (T048 / `002_members.sql`), so no table change was needed — only the read projections. A regular view + grant is the same pattern `member_has_standing_presence` already uses (and `discoverable_items` in `016`). Place-interests are never queried (privacy commitment); unlisted/private Groups never surface.

**Disposition:** flag-for-spec-revision — `member.md` should document the public Member-page read surface (the `member_public_group_memberships` projection + the standing-view grant) and ratify that "listed membership = group discoverability='listed'" is the b1 visibility gate (vs. a future per-membership / `stakeholder_visibility` control).

### T092 (F032): self-view "Edit profile" links to `/you`; no profile-edit surface built

**What:** On the Member's own `/m/[handle]` page, the Follow CTA is replaced by an "Edit profile" link pointing at `/you`. No dedicated profile-edit page was built (it is explicitly Out of Scope in the scenario).

**Why:** F032 is a viewer-side read+follow surface; the edit-profile flow is a separate scenario (the scenario's Out of Scope names it as "deferred or absorbed into F030's onboarding surfaces"). `/you` is the existing member-home landing.

**Disposition:** accepted-as-is.

### T092 (F032): pre-existing repo build breakage (scripts/ tsc) unrelated to this work

**What:** `npm run build` fails at the type-check phase on `scripts/check-action-layer-conformance.ts:122` (`Dirent<NonSharedBuffer>` mismatch from an `@types/node` drift). Confirmed identical failure on `main` with F032 changes stashed; F032's own code reports "✓ Compiled successfully." Likewise the `tests/migrations-t04x` / `migrations-t050` / `auth-signup-route-t044` directory-listing snapshots (`toEqual` on the migrations dir) fail because they hardcode a frozen historical file list — already stale since 013+, not a F032 regression (queued under T069).

**Why:** Out of F032 scope; an environment/@types tech-debt item. Flagged for a separate fix.

**Disposition:** accepted-as-is (flag-for-separate-ticket — see spawned task).

### T093/T094 (F041): QR card generator — built on `t-f041`, not merged

**What (1) — post-create affordance satisfied transitively, not as a dedicated CTA.** F041 AC "Post-create composer affordance" ("Want a QR card for this? [Get one]" on the post-create screen) is fulfilled because every composer (F034/F038/F040) already redirects to the new Item's page, where the owner now sees the "Get a QR card" button. No separate post-create CTA was added.
**Why:** Avoids gold-plating a second surface for the same action; the Item page is the durable home for re-requesting the card anytime (AC "producer can re-request anytime"). A dedicated inline CTA can be added later if telemetry shows owners miss it.
**Disposition:** accepted-as-is.

**What (2) — QR encodes an absolute URL from `NEXT_PUBLIC_SITE_URL`, not the request origin.** The handler accepts an optional `baseUrl`; the server action passes `process.env.NEXT_PUBLIC_SITE_URL || 'https://movers-makers-shakers.com'`. A scanned QR must open an absolute URL, and a *printed* card should point at the canonical production domain (a request origin would bake in `localhost` during dev/eval).
**Why:** Matches the existing OG-URL convention (`vendors/[slug]`, `business/[slug]`). The handler stays origin-agnostic (no baseUrl) for unit tests.
**Disposition:** accepted-as-is.

**What (3) — PNG generated inside the action transaction; canonical-URL CTE duplicated.** `generateQrCardPng` runs inside `withTransaction` (so it shares the read + event-append tx), holding the connection marginally longer. The group place-path recursive CTE is copied from `you/sell/product/actions.ts § resolveDestinationUrl`.
**Why:** Acceptable at b1 (no rate limit, low traffic). Both are minor — moving PNG generation outside the tx and extracting a shared `resolveItemCanonicalUrl` helper are clean follow-ups, not blockers.
**Disposition:** flag-for-separate-ticket (tech-debt; extract shared canonical-URL resolver + move PNG gen off the tx).

**No spec divergence requiring a SPEC-PATCH.** `item.qr_card_requested` event_kind and the `qrcode` dep already existed; no migration.

### T095 (F032 re-cycle): Member discoverability default = private

**What (1) — `members_public_read` was NOT tightened (M2 reversal of the ticket's RLS criterion).** The ticket specified updating `members_public_read` so anon only sees `is_discoverable=true ∧ profile_visibility='public'` rows. Built that way first; M2 code-review caught a critical regression and it was dropped in-loop. The gate now lives entirely in the `resolve_member_page_visibility` SECURITY DEFINER verdict function (the `/m/[handle]` page), the robots-`noindex` meta (external index), and the search-origin path (`p_via_direct_link=false`).

**Why:** `resolve-product.ts` / `resolve-service.ts` / `resolve-gathering.ts` read `members` directly and embed `owner:members!member_id(handle, display_name)`, returning `null` (→404) when the owner row is withheld. With the new `members_only` default, the tightened policy made **every individually-sold public Item 404 for anonymous viewers** — the opposite of "outputs surface, people opt in." Verified under the live `anon` role: a `members_only` member's row returned 0 rows. The verdict function (SECURITY DEFINER over `member_privacy`) gates the page without touching attribution; validated across the full anon/auth/self matrix.

**Disposition:** accepted-as-is (the RLS floor is unnecessary for T095's goals); the direct-`members` enumeration vector is flagged for a follow-up that must migrate attribution reads onto a bypass-RLS projection first — see SPEC-PATCHES.

**What (2) — F032 fixture target (Nadia) seeded discoverable+public; the ticket's "flip Beat 1 to 404" was not applied to Nadia.** The ticket suggested seeding the F032 target with `is_discoverable=false` and changing Beat 1 (anon read) to expect 404.

**Why:** F032 is literally "a viewer *finds* a member's public page and follows them" — the scenario premise requires the target to be findable, and Beats 2–4 (anon follow CTA, signed-in follow, self-view) all need her page to render. The ticket's own Notes concede F032's clauses "apply when the target's `is_discoverable=true`." Resolved by making Nadia an opted-in producer (discoverable+public) and adding *new* gating members/beats instead: CONSUMER (`members_only` default → anon 404, signed-in renders) and VAULT (`private` → signed-in tombstone, anon 404), plus a robots-meta assertion.

**Disposition:** accepted-as-is.

**What (3) — `discoverability-gates.test.ts` not created; prompt-on-acquisition steward path + prompt UI not built.** Ticket asked for a unit file covering each search/autocomplete/directory gate, a steward-role acquisition trigger, and a `/you` prompt surface.

**Why:** No member search/autocomplete/directory surface and no steward-assignment handler exist in the codebase at b1 — there is nothing to gate or hook. The business-Group-founder path (`group.create`) is the one real acquisition path and is wired; the helper is generic for future paths. The prompt UI is explicitly b2-deferrable per the ticket (substrate shipped: `member_prompts` + the enqueue hook, both unit-tested). `/you` is still the legacy vendor client page, an awkward host for the new-architecture prompt.

**Disposition:** flag-for-separate-ticket (enumeration hardening; prompt UI; search-surface gate when those surfaces land) — see SPEC-PATCHES. The `member.md` § Policy posture "default `public`" drift is now corrected — **landed 2026-06-03 (b1e10eb)**, block reads default `members_only`.

### T095 Revision 2 (PM-directed 2026-06-03): Group-attribution for items

**What (4) — Layered the Group-attribution model on top of the existing Revision 1 ticket on the same branch (`t095`), not a separate ticket.** PM directive 2026-06-03 after reviewing Revision 1's M2 disposition: "Business Group items attribute to the Group, not the Member." Rather than open a parallel ticket, the revision extends T095's acceptance criteria, migration, code, and tests in place.

**Why:** The Revision 1 close-out flagged the seller-privacy-vs-item-visibility loop (a `members_only` seller's items 404 for anon if RLS hides them) as a follow-up enumeration-hardening ticket. The PM resolved it instead by decoupling item attribution from member visibility entirely: a Group is always public-by-default, so attributing items to the Group eliminates the cross-Member members read for the common case. This is the structurally cleaner answer and the one the PLATFORM-PATTERNS entry "outputs surface, people opt in" implicitly endorsed. One commit on one branch keeps the privacy + attribution shift atomic.

**Disposition:** accepted-as-is. The work folds into T095 as Revision 2; the same branch carries both. Remaining cross-Member reads at b1: (a) Shop "Founded by" lookup (handle/display/avatar), (b) individual-Item attribution (gathering hosted as Member with no Group). Both use the new `member_public_discoverability` projection for `is_discoverable`; the base members embed for handle/display_name persists for those two paths. The full enumeration-hardening (migrate those last two paths onto a SECURITY DEFINER projection that exposes only handle/display_name/avatar) is now the **only** remaining enumeration follow-up — narrower than before — and stays in SPEC-PATCHES.

**What (5) — `member.md` does not yet describe the Item-attribution model.** The Revision 2 code change is fully ratified by the PLATFORM-PATTERNS entry "outputs surface, people opt in" + the kind='business' Group-public-by-default clause. But `member.md` § Privacy controls / § Policy posture talks about profile visibility + discoverability without enumerating how the Group-attribution model fans out across Item kinds.

**Why:** The platform pattern entry is the load-bearing decision; the spec gap is a documentation/discoverability issue, not a ratification gap. Spec patches typically describe what landed in code so future builds find the contract in one place.

**Disposition:** **landed 2026-06-03 (b1e10eb)** — `member.md` § Privacy controls now documents the Item-attribution model (Group-filed → Group; individual → Member with `is_discoverable`-gated link; selling publicly is consent to attribution), and `groups.md` + `item.md` were updated to match. No open spec gap remains for the attribution model.

**What (6) — Plain-text attribution Playwright beats deferred.** The unit tests cover the plain-text fallback path (Member + isDiscoverable=false → `<span>`); no Playwright beat asserts the same path end-to-end. The eval fixtures opt seeded canonical sellers / founders INTO discoverability so the existing link assertions hold.

**Why:** Adding the negative-branch beat to each of F034 / F038 / F040 + F035 requires a second fixture seed per scenario (a non-discoverable variant), roughly doubling the fixture surface for marginal end-to-end coverage. The unit tests already lock the conditional render; the missing piece is a real-DB integration assertion, which the live `resolveProduct` / `resolveShop` projections-view path already exercises.

**Disposition:** flag-for-separate-ticket — add plain-text-attribution Playwright beats once a non-discoverable member fixture pattern is shared (likely at the b1.5 polish sweep).

---

## T103 — Metro-polygon discovery overlay + `members.home_metro_id` (2026-06-11)

**What (1) — Home-metro derivation hooks `member.place_interest.add/remove`, not the spec's `member.locality.set` / `home_location_id` path.** The ticket AC (§ Handler modification) and `member.md` §151/§534 name a `member.locality.set` action handler that writes `members.home_location_id`, with the backfill joining `locations.geography`. Neither exists in code: `member.locality.set` was never built, and `home_location_id` is a vestigial column never populated (last touched in migration 009; no write path). The real locality model is `member.place_interest.add` (scope `primary_home`) → `member_place_interests.place_id` → `places` (which carry `centroid` since T076). I wired `home_metro_id` resolution into the `primary_home` arm of `place-interest-add.ts` (resolve from the new Place's centroid) and `place-interest-remove.ts` (recompute from any remaining `primary_home`, → null after removal), and the migration's backfill (§5) joins the active `primary_home` interest → `places.centroid`.

**Why:** Same observable intent the ticket and STAGE-LEDGER specify ("home-metro resolution at coordinate-save"; existing Members get a resolved metro so F031's wider-scope opt-in works immediately), against the data model that actually exists. Inventing a `member.locality.set` handler + a `home_location_id` population pipeline is a separate, larger scope (and `home_location_id` references `locations`/Venues, while Members pick a Place at onboarding — a different entity). Keeps derivation in the action layer with no trigger.

**Disposition:** flag-for-spec-revision — see SPEC-PATCHES (reconcile `member.md` §151/§534 + the ticket's Handler-modification AC with the shipped `place_interest`→`places.centroid` derivation path; decide whether `member.locality.set`/`home_location_id` are still wanted or should be retired from the spec).

**What (2) — Seeded CSA polygon is an approx axis-aligned bounding box, not full-resolution TIGER 2023 CSA geometry.** Same approach and precedent as T076 (`seed_method='approx_bbox'`). The six-county Sacramento-Roseville CSA (code 472) is stored as one rectangle covering Yolo→El Dorado/Tahoe (lon) and southern-El-Dorado→northern-Yuba/Sutter (lat).

**Why:** b1 substrate needs correct *coverage* (downtown Sacramento resolves to metro 472; out-of-region points resolve null) and the `resolve_home_metro` smallest-by-area tiebreak, both verified by the SQL contract test. Full-resolution CSA geometry is a data-fidelity refinement, not a substrate requirement; the authoritative replay is deferred. Provenance + approximation recorded in `metadata.seed_method`.

**Disposition:** flag-for-spec-revision — see SPEC-PATCHES (full-res CSA replay, folded with T076's pending full-res place-polygon replay).

**What (3) — Behavioral verification is the `resolve_home_metro.sql` contract test + static-shape Vitest guards, not live Vitest tests.** The ticket Tests section lists Vitest files asserting DB state (seed row exists, centroid inside polygon, handler populates `home_metro_id`). Docker/local Supabase is unavailable in this build environment, so — following the T075 precedent — DB-touching behavior lives in `supabase/tests/resolve_home_metro.sql` (the four contract cases: inside→id, outside→null, null→null, overlap→smallest) plus `migrations-t103.test.ts` / `actions-t103.test.ts` static-shape guards. The separate `tests/metro-polygons-seed.test.ts` file is folded into `migrations-t103.test.ts` (seed presence + the D3 no-region-row invariant are asserted there).

**Why:** Matches the established no-Docker pattern (migrations are static-shape-guarded in Vitest; live-DB behavior is `.sql` contract tests run against a migrated DB + Playwright evals). The contract test is authored and ready to run when Supabase is up; F031 (the surface ticket) exercises the handler end-to-end via Playwright.

**Disposition:** accepted-as-is. Live-DB run of `resolve_home_metro.sql` is the downstream `test`-skill / deploy-checklist step.

**No other deviations.** Schema, GiST index, RLS (public-read, no client writes), `SECURITY INVOKER` function + grants, and the `members.home_metro_id` FK + partial index match the ticket AC exactly.

---

## T112 — Bottom nav visual refresh (2026-09-02)

**What (1) — Icon spec taken from the ticket + thesis §2 (20px / 9px / 3px), not from the F046 scenario text (24px / 10px / 4px).** The F046 acceptance criterion "Nav visual treatment matches thesis spec" still carries the pre-update numbers, and its Given/When/Then narrative twice cites the retired 52px bar. The ticket flags this explicitly ("The F045 scenario's assumptions section mentions '52px bottom nav' — this is stale").

**Why:** thesis §2 was updated 2026-09-02 with a State-tagged ratified Intent line ("44px is the floor that keeps labels legible at 9px"). The icon and label sizes are stated there as *proportional to* the 44px bar; carrying 24px icons into a 44px bar would leave 44 − 24 − 4 − 10 = 6px of total vertical padding and break the ratified proportion. Ticket AC is the narrower, later, and internally consistent source.

**Disposition:** flag-for-spec-revision — **Type A** (upstream authoring error, not an architectural decision). `planning/next/scenario-F046-member-scrolls-and-nav-hides.md` needs its "Nav visual treatment" criterion and its two "52px" prose references reconciled to 44px / 20px / 9px / 3px. Fix inline at `tidy`; no `decision-*` stub warranted.

**What (2) — Active "filled icon variant" implemented as `fill="currentColor"` on the outlined lucide glyph, not a separate filled icon import.** The ticket notes "lucide supports both via separate imports like `Home` / `HomeIcon`" — it does not; lucide-react 1.11.0 ships an outline-only set (`home.mjs` and `house.mjs` are both outlined, and there is no filled sibling for `search` or `user`).

**Why:** Passing `fill="currentColor"` on the same glyph produces the filled active state the AC asks for while holding the 1.5 stroke weight constant, and it keeps one icon import per tab. Matches the Instagram precedent for a solid active magnifier. Switching icon sets to obtain true filled variants is a larger change than a visual-refresh ticket should carry.

**Disposition:** accepted-as-is.

**What (3) — Three new nav colour tokens are component-scoped rather than the thesis §3 charcoal ramp.** Shipped `--color-charcoal` (#3C3C3C), `--color-nav-inactive` (#717171), `--color-nav-border` (#EBEBEB). Thesis §3 specifies a full six-step ramp (`--color-charcoal-900` … `--color-charcoal-50`) that also *replaces* `--color-fg`, `--color-fg-muted`, `--color-border` app-wide.

**Why:** the two non-charcoal values this nav needs (#717171, #EBEBEB) are thesis §2's expected values for `--color-fg-muted` and `--color-border`, but the live tokens are #6B6B6B and #E5E3DD. Repointing those two globals would restyle every surface in the app from inside a nav ticket. Scoped tokens keep the blast radius at the nav; the ramp migration is its own ticket.

**Disposition:** flag-for-spec-revision — **Type B** (real architectural decision: when and how the charcoal ramp replaces the existing neutral tokens app-wide, and what happens to the three interim nav tokens). Stub filed at `planning/backlog/decision-charcoal-ramp-migration.md`.

**What (4) — Two out-of-component files edited: the sticky mobile CTA strips on the vendor and business pages.** Both pinned themselves with a hardcoded `calc(64px + env(safe-area-inset-bottom))` to sit on top of the old 64px nav; both now read `calc(var(--nav-height) + env(safe-area-inset-bottom))`.

**Why:** not scope creep — a direct regression of this ticket's change. Shrinking the bar to 44px would have left both strips floating with a 20px white gap beneath them. Routing the offset through a token means the next height change cannot silently break them again. Caught by the M2 code-review gate.

**Disposition:** accepted-as-is.

**Note — Tailwind v4 gotcha, same class as T111.** `--nav-height` was first declared inside `@theme inline` and was silently dropped: Tailwind v4 only emits theme keys in a recognised namespace (`--color-*`, `--spacing-*`, …), so `var(--nav-height)` resolved to nothing and the sticky strips' `bottom` computed to `auto`. Moved to the plain `:root` block. Caught by live browser verification, not by unit tests or the build — neither can see it.

**No other deviations.** Height, colours, icon geometry, label type, border, background, three-tab structure, scroll-to-top re-tap, and the desktop breakpoint all match the ticket AC.

---

## T113 — Scroll-to-hide bottom nav (2026-09-02)

**What (1) — The nav stays in the accessibility tree while translated off-screen; it is not `aria-hidden` or `inert`.** The AC says the bar "slides out of view," which could be read as removing it.

**Why:** translating the bar off-viewport is a visual affordance for a scrolling reader. Assistive-tech users do not scroll to reclaim viewport, so marking the primary navigation landmark hidden would take away access rather than protect it (WCAG 2.1 AA 2.1.1 / 4.1.2). `focus-within:translate-y-0` covers the one real hazard — a keyboard user tabbing into an off-screen control — by pulling the bar back the moment a tab link takes focus, so the focus ring is never stranded.

**Disposition:** accepted-as-is.

**What (2) — Keyboard-open detection is `visualViewport` vs `innerHeight`, not a focus listener on inputs.** The AC says "when the virtual keyboard opens, nav hides"; the ticket's Notes suggest no mechanism.

**Why:** focus on an input is not the same event as the keyboard actually appearing — hardware keyboards, dismissed software keyboards, and non-text focus all break the proxy. The viewport gap is the physical fact the AC cares about. The asymmetry is documented at the hook: iOS holds `innerHeight` and shrinks the visual viewport, so the gap opens and the bar hides; Android shrinks the layout viewport instead, so no gap opens and none is needed — the bar has already moved clear of the keyboard. Platforms with no `visualViewport` report false and follow scroll alone.

**Disposition:** accepted-as-is.

**What (3) — Overlay pause is a document-level MutationObserver on `[aria-modal="true"]`, not a per-modal call into a pause API.** The AC says hide/show pauses while a modal or bottom sheet is open.

**Why:** every modal in the app already carries `aria-modal="true"` (`AddEntityDrawer`, `MultiStepComposer`), so the observer costs nothing at the call sites and cannot be forgotten by the next overlay someone writes. `[data-nav-pause="true"]` is the explicit opt-in for a sheet that is not a dialog. The alternative — editing each overlay — widens this ticket's blast radius and leaves a standing trap.

**Disposition:** accepted-as-is.

**What (4) — Route-change reset is a render-time state adjustment keyed on the pathname, not a `useEffect`.** The ticket's edge-case note says "reset `navVisible` to `true` on navigation."

**Why:** `react-hooks/set-state-in-effect` rejects a synchronous `setState` in an effect body, and it is right to — the effect version paints one frame of hidden nav before correcting itself on a tab switch. The React-documented adjust-during-render pattern lands the correct value in the first paint. Ref re-anchoring stays in an effect, since `react-hooks/refs` forbids touching refs during render.

**Disposition:** accepted-as-is.

**Note — F046's stale visual numbers, already flagged under T112, were not touched.** The scenario's "Nav visual treatment" criterion still carries 52px / 24px / 10px / 4px, and its prose twice cites the retired 52px bar. That is T112's open Type A finding; T113 implements only the scroll-behavior criteria and does not re-flag it. _Closed 2026-09-03: F046 and F045 both reconciled to 44px / 20px / 9px / 3px._

**No other deviations.** Threshold, transition timing, initial visibility, fixed positioning, cross-tab consistency, reduced motion, modal pause, keyboard hide, jitter debounce, desktop exemption, and the context export for T114 all match the ticket AC.

---

## T114 — Kind-filter pill row on Explore (F045)

**What (1) — The kind pills filter a vendor list that has no `items.kind`, so every non-All pill resolves to zero rows.** The AC says "tapping a kind pill filters results immediately… Events → `gathering`, Products → `product`," etc. `/explore` still reads `businesses` / `vendor_categories` / `market_vendors` — the pre-rebuild marketplace surface. Vendor rows carry no item kind, so the filter seam is in place and honest but has nothing to match. The component, the `?kind=` URL state, and the `filtered` seam all ship; the results do not change except to empty.

**Why:** the alternative was to improvise an items-backed Explore inside this ticket — a second query against `discoverable_items`, item cards, item map pins — which is a feature, not a pill row, and overlaps T116. `build` escalates rather than improvises. The seam is one commented line, so the ticket that makes Explore items-backed deletes it and the pills start working with no rework to the component.

**Routing:** Type B — a real architectural decision (when does Explore stop being vendor-backed?). Needs a `decision-*` stub in `planning/backlog/` and a ticket. No ticket currently covers it; T115 and T116 both assume the items surface exists.

**Disposition:** escalated to PM.

**What (2) — Desktop keeps its market/category/day filter chips; only the mobile chip row was removed.** The AC says remove the dedicated filter buttons rendered between the search bar and results.

**Why:** the pill row is `md:hidden` — thesis §5 specifies a bottom-anchored thumb-zone row, which is a mobile pattern, and the scenario's own desktop edge case says the pills "may move to a horizontal bar below the search row" (may, not must). Removing the desktop chips now would leave desktop with no kind filter and no secondary filters until T115 lands its dropdown panel — a functional regression with no replacement. Mobile loses its chips as instructed because the pills replace them there.

**Disposition:** accepted-as-is; T115 owns the desktop filter surface.

**What (3) — The nav-height shift is an animated `translate`, not an animated `bottom`.** The AC specifies `bottom: calc(44px + env(safe-area-inset-bottom))` when the nav is visible and `bottom: env(safe-area-inset-bottom)` when hidden.

**Why:** the effective geometry is identical (verified live at 375x812 — pills at 724–768 with the nav up, 768–812 with it down), but `bottom` animates on the main thread and forces layout each frame on a fixed footer. Tailwind v4's `transition-transform` covers `transform, translate, scale, rotate`, so the row shares the nav's 200ms ease-out exactly. Same reasoning T113 applied to the nav itself.

**Disposition:** accepted-as-is.

**What (4) — `--color-charcoal-100` is #E8E8E8, not the #EBEBEB the ticket names.** The ticket's hairline parenthetical says #EBEBEB.

**Why:** thesis §3 defines the ramp and explicitly notes charcoal-100 is "slightly warmer than the current #EBEBEB" — #EBEBEB is the legacy `--color-nav-border` value the ramp replaces. Followed the design source of truth. Three units; no perceptual difference, but the token now means one thing.

**Disposition:** accepted-as-is. Type A — the ticket's parenthetical wants the inline fix.

**Note — two accepted M3 findings.** The unselected pill's #E8E8E8 border is 1.2:1 against white, below 1.4.11's 3:1 for UI component boundaries; accepted because identity and state are carried by the fill (11.03:1) and the label (14.16:1), not the border, and the hairline value is spec-ratified. The tabpanel precedes the tablist in DOM order, which inverts the usual tabs pattern; accepted because DOM order matches visual order, which is what 2.4.3 actually asks for, and `aria-controls` gives AT the jump path.

**No other deviations.** Pill set and order, schema mapping, selected/unselected treatment, 44px row height, hairline top border, instant selection, `navVisible` consumption, 200ms timing, content padding, Explore-only rendering, `role="tablist"`/`role="tab"`/`aria-selected`, and `?kind=` URL state all match the ticket AC.

---

## T117 — Rewire Explore from the dead vendor tables to `discoverable_items` (substrate)

**Resolves T114 What (1).** The kind pills now filter real Items. Verified live at 375×812 against the seeded database: All = 16, Events = 3, Products = 4, Services = 4, Ideas = 2, Offers = 1, Asks = 1 — each matching the MV's own kind distribution exactly.

**What (1) — Item detail links 404 for 9 of the 16 seeded Items.** The AC does not name link resolution, but Explore is now the primary path to those pages, so the gap is worth stating plainly. `itemHref` (T088, shared with the Home locality feed) always builds the Member-scoped path `/m/<handle>/<seg>/<slug>-<id8>`. Two classes miss:
- **Group-filed Items** (4 rows) — `resolve-product` / `resolve-service` / the gathering resolver treat the Member path as the *individual-seller* path and reject a row carrying a `group_id`. Their canonical URL is the Group place-path, which `itemHref` does not build.
- **Kinds with no page yet** (5 rows — `ask`, `offer`, `wonder`, `initiative`) — no route exists under `/m/[handle]/` for `/a/`, `/o/`, `/i/`, `/initiative/`. Only `/p/`, `/s/` and `/e/` shipped (T079 / T082 / T083).

**Why:** this is pre-existing behaviour of a shared component — the Home locality feed produces the identical links today, and `item-url.ts` says so in its own header ("Group-scoped canonical URLs are a later refinement"). Fixing it means either building four Item pages or teaching `itemHref` to resolve Group place-paths; both are features with their own scenarios, and `build` escalates rather than improvises. T117 changes no linking behaviour — it only makes the existing gap visible on a second surface.

**Routing:** Type B. Stub filed at `planning/backlog/decision-item-canonical-urls.md`.

**What (2) — Market and day filters removed from Explore rather than rewired.** The ticket says rewire the query; it does not say delete controls.

**Why:** both read `markets` / `market_vendors` through `MarketContext`. Neither table exists — PostgREST answers `PGRST205` — so `allMarkets` is always empty and both filters are structurally incapable of matching a row. Leaving two visible controls that silently no-op is worse than removing them. `MarketContext` itself is untouched: the provider stays mounted in `layout.tsx` and `/you` still consumes it. Home does not — `page.tsx` renders `LocalityFeed` off `discoverable_items` (T087/T088). **Disposition:** accepted-as-is; T115 owns the replacement secondary-filter surface.

**What (3) — Category options are derived from the result set, not from a fixed vocabulary.** The prior chip enumerated `CATEGORY_ORDER` (`bread`, `produce`, `honey-jams`, …).

**Why:** no Item uses those slugs. Items carry their own vocabulary — `community`, `repair`, `garden`, `food`, `crafts`, `education`, `sustainability`. Hardcoding a replacement list would be inventing an Item taxonomy, which is `explore`'s job. Deriving the options keeps the filter honest and empties itself if the data changes. Consequence worth naming: the menu is scoped to the current kind, so switching kinds can leave an active category chip whose option is no longer listed. The chip's ✕ and Clear filters both recover. **Disposition:** accepted-as-is.

**What (4) — Map coordinates are decoded from hex EWKB in the client, not added to the MV.** No AC named a mechanism.

**Why:** PostgREST serializes `geography(Point,4326)` as hex EWKB, and neither `discoverable_items` nor `locations` exposes a readable lat/lng — `032_venue_distance.sql` documents that gap and worked around it with an RPC. The alternative here was a fourth drop-and-rebuild of the MV plus its six indexes to add two `st_x`/`st_y` columns, for a ticket whose stated shape is "no schema change." A 30-line pure decoder with 10 unit tests is smaller and reversible. Verified live: 16 pins across all seven kinds. **Disposition:** accepted-as-is. If a later ticket needs server-side distance sorting on Explore, the columns become worth the migration.

**What (5) — The `RecruitmentGrid` no-filters default view is gone.** The ticket did not name it.

**Why:** it existed because Explore had nothing real to show. Explore's default is now the browse index, which is the point of the ticket. The component stays in use on `/you`; its other importer, `HomeFeed`, is orphaned dead code. **Disposition:** accepted-as-is.

**Note — `MarketPill` is now orphaned.** Removing the market filter left it with no consumer. Not deleted: the retirement of the whole vendor/market surface is one coherent sweep, not a fragment of a read-surface rewire. Folded into the backlog stub above. That sweep's scope: `MarketPill` (orphaned by this ticket), `HomeFeed.tsx` (orphaned since T087/T088 — it still queries `events` / `businesses` / `markets`, but nothing imports it; Home is `LocalityFeed`), `VendorCard`, the `Vendor`/`Market` types, and `MarketSelector` + the `markets` reads still live in `/you`.

**Note — `EXPLORE_LIMIT` is 100 with no pagination.** Moot at 16 seeded rows; the result count would understate past 100. T115/T116 own the filter and view surfaces and are the natural home for paging.

**Three fixes applied pre-commit at the M2 gate.** (a) `hexToBytes` validated the whole string against `/^[0-9a-fA-F]+$/` — a per-byte `parseInt` accepts `'0z'` as 0 rather than NaN, which would have turned malformed hex into a plausible coordinate. (b) The MV read is `.catch()`-guarded — a rejected fetch (not a PostgREST error row) previously left `loaded` false and stranded the tab on "Loading…" forever; regression test added and confirmed red without the fix. (c) The map pin colour is `var(--color-accent)`, not a hardcoded `#0fab8e`, per `web/CLAUDE.md` § Design System; verified live as `rgb(15, 171, 142)`.

**No other deviations.** MV as the read surface, server-side `item_kind` filtering, All showing every published Item, per-kind pill correctness, `ItemFeedCard` reuse, result count in items, previous-results-during-refetch, search across Item fields, and the empty state all match the ticket AC.

---

## T115 — Filter icon, bottom sheet, and active-filter chips on Explore

**Resolves T114 What (2) and T117 What (2).** Desktop now has the full filter surface (the sheet renders as a right-anchored dropdown panel), and the market/day controls T117 removed are replaced by distance / schedule / category / sort in the sheet.

**What (1) — The location pill is display-only; tapping it opens no locality picker.** Thesis §5 says the pill "opens a bottom-sheet location picker (the existing Locality Selector component)."

**Why:** F045's acceptance criteria place a location pill in the search row and specify nothing about its behaviour — the picker is thesis-level scope with no AC behind it. The "existing Locality Selector" the thesis points at is `MarketSelector`, which reads the retired `markets` table; wiring it back into Explore would undo T117. A real picker needs a Place-scoped Explore (`?place=`), which no ticket covers. Rendering a `<button>` that does nothing would be worse than a label, so the pill is a `<span>`.

**Disposition:** accepted-as-is. The picker belongs with the Explore place scope; folded into the canonical-URL/place stub rather than improvised here.

**What (2) — Distance is measured from the locality centroid, not from the device.** No AC names an origin.

**Why:** the seeded `places.centroid` (026) is readable by anon, needs no permission prompt, and names the same locality the pill displays — so "within 5 mi" means "within 5 mi of where you're browsing," which is what the location pill has just told the member. Browser geolocation would add a privacy-touching affordance F045 does not ask for. When no centroid resolves, the radius options and the "Nearest" sort are disabled with an explanatory line rather than silently emptying the surface. Items with no approved Location are excluded while a radius is active — proximity cannot be verified for them.

**Disposition:** accepted-as-is.

**What (3) — Explore resolves the launch-locality default, not the member's `primary_home`.** `resolveFeedPlace` supports member-home precedence; Explore passes no `memberPlaceId`.

**Why:** reading the member's home client-side means `auth.getUser()` plus a `members` read on every Explore mount, for a surface that has no place scope to honour it with. Home does this server-side because it *is* place-scoped. **Disposition:** accepted-as-is; lands with the Explore place scope.

**What (4) — "Recurring" is backed by a second read of `item_gatherings`, not by an MV column.** `recurrence_rule` is not projected into `discoverable_items`.

**Why:** projecting it means a fifth drop-and-rebuild of the MV and its six indexes for one radio option, on a ticket whose gates record M4 as N/A. `item_gatherings` reads through `select_via_parent`, which resolves to the same published/listed gate the MV encodes, so the id-only read sees exactly the rows a browse may see. Verified live: `?schedule=recurring` returns the two seeded recurring gatherings. **Disposition:** accepted-as-is.

**What (5) — Scroll position is restored on every Explore mount, not only on back navigation.** The AC frames restoration as back-navigation behaviour.

**Why:** in the App Router a client-side back is not a page load, so distinguishing it from a nav-bar tab switch means tracking history direction in app state. For a browse surface, returning the member where they left off is the same behaviour either way and is what comparable surfaces do. The App Router's own restoration cannot serve the AC at all — the results arrive async, so at restore time the page is one viewport tall. **Disposition:** accepted-as-is.

**What (6) — The mobile List/Map toggle stays in a fixed bottom row.** Thesis §5's wireframe puts it inline, scrolling with content.

**Why:** that is T116's ticket, still open on this surface. T115 shrank the cluster from two rows to one (the search input moved to the sticky top bar) and left the toggle where it was, so T116 has a single, obvious change to make. Desktop already gets the inline treatment via `md:static`. **Disposition:** accepted-as-is; T116 owns it.

**What (7) — Kind pills remain `md:hidden`, so desktop still has no kind filter.** F045's desktop edge case says the pills "may move to a horizontal bar below the search row."

**Why:** "may," not "must," and the pill row is T114's component — changing its desktop rendering would rework T114's tests inside a ticket that owns the secondary filters. The desktop gap is pre-existing, not introduced here. **Disposition:** carried forward; T116 or a desktop-parity ticket owns it.

**What (8) — "Clear all" is charcoal-900, not the accent token every other link on the surface uses.**

**Why:** `--color-accent` is 2.9:1 on white and `--color-accent-hover` 4.29:1 — both below 1.4.3's 4.5:1 for 14px text. This ticket introduces the control, so it cannot ship failing. Charcoal-900 is 14.16:1 and is the sheet's own palette (selected options and "Show results" are already charcoal), so inside the sheet it reads as more consistent, not less. The 57 pre-existing accent-as-text instances elsewhere in the app are untouched — re-theming a token app-wide is not a build-agent call.

**Routing:** Type B. Stub filed at `planning/backlog/decision-accent-token-contrast.md`.

**Note — the focus ring stays accent.** At 2.9:1 against white it is marginally under 1.4.11's 3:1, but every focus ring in the app is accent, and inconsistent focus colours on one page are worse for the member than a marginal ratio. Folded into the same stub. Verified live under a real keyboard Tab: `outline: 2px solid rgb(15, 171, 142)` at 2px offset, `:focus-visible` and `:has()` both matching.

**Note — three accepted M3 findings.** The unselected sheet option's #E8E8E8 border is 1.2:1 against white — same finding T114 accepted, same reason (identity and state carry on fill at 11.03:1 and label at 14.16:1). The chip's ✕ is a 32px control grown to the chip's full 42px height by a `::before`, which clears 2.5.8's 24px floor but not the 44px the project prefers for thumb-zone controls; the chip row is at the top of the page, not the thumb zone, and a 44px control would force the row taller than the results it annotates. Disabled distance options at 2.6:1 are exempt from 1.4.3.

**Five fixes applied pre-commit at the M2 gate.** (a) "Clear all" moved off the sub-AA accent token and given a 44px target — it was 20px tall. (b) The sheet locks `document.body` scroll while open; `aria-modal="true"` asserts the rest of the page is inert, and letting the results scroll behind the sheet made that assertion false. (c) The category options union in the current selection — switching kinds could drop a still-selected category from the sheet, leaving a filter the member could only clear from the chip row. (d) `sortExploreItems` keys each item once instead of once per comparison; the "Nearest" comparator called haversine O(n log n) times. (e) The backdrop carries `aria-hidden="true"`.

**No other deviations.** Sticky search row with the three elements in thesis order, the three-slider filter glyph, the dot indicator, the sheet's four filter groups and "Show results" / "Clear all", half-height and internally scrollable, removable chips below the search bar with no chip for kind, the chip row vanishing at zero filters, wrapping rather than scrolling, URL round-trip for kind plus every secondary filter, focus trap and focus return, and `aria-label="Open filters"` / `"Remove [filter] filter"` all match the ticket AC.

---

## T116 — Inline List/Map toggle on Explore

**Closes the F044/F045 surface.** The fixed control cluster T115 shrank to one row is gone entirely; Explore's bottom is now nav + kind pills, and the view toggle rides in the content.

**What (1) — `?view=` is no longer read or written.** Explore has carried a `view` query param since before T114, and T115 kept it.

**Why:** F044 says it twice — "No URL change — the toggle is ephemeral state" (§ Surfaces) and "Persisting the toggle preference across sessions (b2)" (§ Out of Scope) — and the ticket AC repeats it. Following the spec costs a shareable `?view=map` link, which is a real if small loss; the param is gone from `ExploreFilters` rather than left write-only, so nothing quietly half-supports it. Every filter param still round-trips. **Disposition:** accepted-as-is, AC-mandated. If shareable map links turn out to matter, restoring the param is a one-line change in `exploreQueryString` plus the mount-time read.

**What (2) — The toggle interrupts the grid after exactly 4 cards.** The AC says "after the initial batch of result cards (3–5 cards)."

**Why:** four is the only number in that range that completes a row at both 2 columns (mobile) and 4 (`lg:`), so the toggle never lands beside a half-empty row. It does not complete a row at the `md:` 3-column breakpoint — no number in 3–5 completes rows at 2, 3 and 4 simultaneously, so one breakpoint has to give, and `md:` is the narrowest band of the three. **Disposition:** accepted-as-is.

**What (3) — In map view the toggle sits below the map, not "after 3–5 cards."** The AC's position rule assumes cards.

**Why:** there are none in map view. Below the map keeps the toggle in the same relative place — after the results — rather than jumping to the top when the member switches. The map is `h-[70vh]` (was `calc(100vh-260px)`) so the toggle lands on screen without a scroll at every viewport height; verified at 812px, toggle at 669–713 with the pills at 724. **Disposition:** accepted-as-is.

**What (4) — The transition is a 200ms fade-in on the incoming pane, not an overlapping crossfade.** The AC says "crossfade (CSS opacity transition)."

**Why:** a true crossfade needs both panes painted at once, which means either mounting Mapbox on every Explore visit or stacking two panes in a container sized to the taller of them — the map would inherit the list's full scroll height. The ticket's own note sets the bar at "a simple CSS transition on opacity with 200ms duration is sufficient." Implemented as a keyframe in `globals.css` on a pane keyed by view, with `prefers-reduced-motion` honoured. Naming it accurately here because the AC's word is "crossfade" and this is not one. **Disposition:** accepted-as-is.

**What (5) — The toggle is an `<li role="presentation">` inside the results grid.** No AC names the markup.

**Why:** it has to interrupt the grid to sit after four cards, and a bare `<div>` between `<li>`s is invalid inside a `<ul>`. `role="presentation"` keeps the wrapper out of the list's item count, so assistive tech still reports 16 results rather than 17. The tablist inside keeps its own role — `presentation` does not cascade to interactive descendants. **Disposition:** accepted-as-is.

**What (6) — Two tablists now point at `#explore-results`.** T114's kind pills already did.

**Why:** both genuinely control that region, and `aria-controls` is the honest statement of that. The panel's `aria-labelledby` stays on the kind tab, which is the more informative label — "Events" says more about what is in the panel than "List" does. **Disposition:** accepted-as-is.

**Caught by live verification — a T114 bug fixed in passing.** The selected tab in *both* tablists had an invisible focus ring. Neither component set `outline-color`, so it fell to the UA default `currentColor`, which on a selected pill is white — a white ring drawn against the white page. A keyboard user tabbing onto the selected kind pill or the selected view tab saw nothing. Both now set `outline-[var(--color-accent)]` **unconditionally**, with only the style and offset under `focus-visible:`; that way the colour is in the computed style whether or not the element is focused, so the regression is catchable by a test and a screenshot rather than only by a keyboard user. Confirmed under a real keyboard Tab: `outline: 2px solid rgb(15, 171, 142)` at 2px offset on the selected tab. The `KindFilterPills` change is one line in a component this ticket does not otherwise own; leaving a known invisible focus ring on the adjacent tablist of the surface under M3 review was the worse option.

**Note — the accent ring is 2.9:1 on white**, marginally under 1.4.11's 3:1. Same call as T115: every ring in the app is accent, and inconsistent focus colours on one page are worse for the member than a marginal ratio. Folded into `planning/backlog/decision-accent-token-contrast.md`.

**Note — F044 has no `review-F044.md`.** Neither does F045. Rebuild rule 1 makes `review` mandatory on every approved scope, and both scenarios went `plan-approved` → `ticketed` on 2026-09-02 without one. Not something `build` can fix after the fact; flagged for the PM. Nothing in either build surfaced an architectural problem review would have caught.

**No other deviations.** Inline placement in the document flow, the removed fixed cluster, `[List] · [Map]` as compact text, centring, 24px above and below, charcoal-700/white active and white/charcoal-900/charcoal-100 inactive, both switch directions, session-only state resetting to List, the toggle rendering with zero results, desktop centring in the content column, and `role="tablist"` with two `aria-selected` tabs all match the ticket AC.
