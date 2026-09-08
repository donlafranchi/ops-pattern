# T145: A photo, optional, at creation — and a way to take it down

**Scenario:** `planning/next/scenario-F061-someone-creates-a-page-worth-showing-people.md`
**Status:** Open
**Bundle:** launch (`planning/now/initiative-launch.md`)
**Depends on:** T120 (storage substrate and upload primitive), T141 (`groups.photo_url` column and event types). **Blocks:** T147. **Release gate:** see below — production deploy waits on T123.

**Serves:**
- **Loop:** 7 (Buy close), 9 (Make a living locally) — a Page with a face is a different proposition than a name and a list.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** Person → Page, one image column. **No new entity.**

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** `planning/next/review-F061.md`. PROCEED.
- [x] **Gate B — clear.** `policy.md:143` (metadata stripped, Ratified 2026-09-07), `policy.md:151` (takedown path before first upload, Ratified 2026-09-07), `groups.md:309` (Page photo subject to both, Ratified).
- [x] **All three `Serves` lines resolve.**
- [x] **Governing DLS recipe.** `design-language.md` § *Image picker* — "One recipe, every caller — the composer's Page photo, the editor's replacement control, and Item photos when they arrive." Used unmodified, 1:1 aspect.

## What changes

One composer step, one write path, one operator-only removal control.

## Acceptance Criteria

### Creation
- [ ] Photo step uses the image-picker recipe unmodified, 1:1 aspect, marked optional. The composer completes without a photo.
- [ ] Picking a photo calls T120's `uploadImage(file, memberId)`; on success the returned URL is written to `groups.photo_url` in the same transaction as the step's progress-write (per the multi-step composer's write-on-advance contract), with a `group.photo_set` event row.
- [ ] A photograph carrying EXIF GPS, run through this path, is stored with **no metadata block in the resulting bytes** — inspected at the byte level, not by asserting the resize function was called (review binding note 2, restated here since this is the second consumer of T120's guarantee).
- [ ] Replacing a photo before publish deletes the previous stored object via `deleteImage`.
- [ ] `BUILD-LOG.md` updated.

### Default state
- [ ] A Page published with no photo renders correctly with no photo-shaped placeholder text — T146 owns what actually fills the frame.

### Takedown
- [ ] A new handler (or an extension of T122's pattern, scoped to `groups` rather than `items`) clears `groups.photo_url`, deletes the storage object, and writes `group.photo_removed` in the same transaction. **Operator-only** — same authorization shape as T122.
- [ ] Rendered as a single inline control on the Page's own surface, visible to the operator only.
- [ ] Test: takedown nulls the column, deletes the object, and the public Page immediately falls back to default art (T146) with no broken-image state.

## Release gate — do not confuse with a build blocker

**This ticket is buildable now.** But per `groups.md § What a Page carries at creation` — "subject to the same two commitments as any uploaded image" — the takedown path must exist **before the first real upload is accepted in production**. `T123` (the report path) is the general precondition F058 established and is currently blocked on a PM operating decision (a named destination), not on engineering. **Do not deploy this ticket's photo-step to production ahead of T123 resolving**, same pattern as T122 § Release gate.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** — fires. New step, new operator control.
- [ ] **M4** — no migration (T141 already shipped the column).
- [ ] **DEVIATIONS.md entry** at close.
- [ ] **Close-out reconciliation.**

## Notes

- **One bucket, one module, still.** Do not add a second upload path for Page photos — call T120's `uploadImage`/`deleteImage` exactly as F056's editor will.
- **Do not build Item photos here.** Deferred per F061 § Boundaries; `items.photo_url` exists from the pending migration and stays unwritten.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
