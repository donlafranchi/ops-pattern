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
