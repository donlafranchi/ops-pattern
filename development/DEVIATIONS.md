---
id: how-deviations
purpose: Per-ticket log of implementation-vs-spec drift across the build.
layer: how
status: active
---

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

**Why:** `groups.slug` is `NOT NULL UNIQUE` (per migration 014_groups.sql line 51). Two Members opening the Sell walkthrough concurrently with the same brand name would collide on the second INSERT with Postgres 23505. ADR-22's user-visible random-suffix scheme applies to *activated* rows; draft rows need their own collision avoidance because they hit the same UNIQUE constraint. Draft slugs aren't publicly addressable (RLS hides drafts), so the user-facing shape is irrelevant — what matters is no 23505. Surfaced by [F036-review.md § Findings #2](../planning/now/review-F036.md).

**Disposition:** accepted-as-is (fold-in mandatory). The user-visible final slug for activated Groups is a follow-up patch on `group.activate` per ADR-22 — flagged for the next pass; this ticket's responsibility ends at the draft state machine.

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

**Why:** ADR-22 wants a random suffix on Item URLs; adding a `slug` column would mean a migration (+ M4 deploy-checklist) for a b1 surface where the id-fragment satisfies both uniqueness-enough (1-in-4B collision within a single owning scope) and the random-suffix intent. The fragment is parsed in JS after RLS-scoped fetch (PostgREST can't `left(id::text,8)` on a uuid cleanly).

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
