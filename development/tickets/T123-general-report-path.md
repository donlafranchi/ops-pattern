# T123: A member can tell the operator something

**Scenario:** F058 — a member reports an image and the operator takes it down — the report half.
**Status:** Open — **BLOCKED on a PM operating decision.** Not a Gate B block.
**Bundle:** b1 (v1 workstream 9)
**Depends on:** nothing in code
**Blocks:** nothing mechanically — but see § Why this is blocking.

**Serves:**
- **Loop:** 11 (Steward what we built).
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
- **Primitive shape:** Person → a message to the operator. **Not a declaration, not a vote, not an Item.**

## Why this is blocking

`bundle-1.md` calls this *"the smallest item here and the only one whose absence has no workaround."* Still true. What changed on 2026-09-04 is that its absence now blocks something else: photo upload's stated moderation answer is *"the operator handles it via the report path,"* and that answer is only true if the path exists.

**The blocker is not engineering.** The ship condition — a real destination a human reads, and a rough response commitment — is a PM operating decision and was unnamed as of 2026-09-04. **It now gates two workstreams. It cannot be the item that slips.**

> *A report channel nobody answers is worse than no report channel. It teaches members that telling the operator anything is pointless, and that lesson is expensive to unlearn.*

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** `planning/next/review-F055-F058-self-serve-producer.md`. PROCEED on F058; **binding note 5 applies to this ticket specifically.**
- [x] **Gate B — clear.** No unratified absolute is encoded here. The shape (free text, no public counter, routes to a person) is already ratified in `decision-producer-values-declaration.md` § 3.
- [x] **All three `Serves` lines resolve.**
- [x] **Cited spec last-changed dates.** `product/foundation/policy.md` — `Tue Sep 1 08:27:03 2026 -0700`.
- [ ] **Governing DLS recipe named.** Bottom sheet — **exists**, shipped in T115. The **⋯ overflow menu does not exist in the DLS.** Small, but it is a new pattern that will spread; name it with the picker recipe (review binding note 4) rather than inventing it here.

## What changes

A `reports` table, a `report.create` handler, a ⋯ menu on Item and shop pages, and a bottom sheet with a text area.

## Acceptance Criteria

- [ ] Migration `0NN_reports.sql`: `reports` — `id`, `reporter_member_id`, `subject_kind` (`'item' | 'group'`), `subject_id`, `body text not null`, `reason text` (nullable, light), `created_at`, `resolved_at` (nullable), plus soft-delete per the project's no-hard-deletes rule.
- [ ] **⚠️ Review binding note 5 — this is a new lineage, not a revival.** A pre-rebuild `reports` table exists in `web/scripts/001-create-tables.sql` — the script `INFRASTRUCTURE.md` still points new developers at, and which opens with three `cascade` drops. It is in the deletion sweep. **Do not edit that file. Do not reuse its columns** (`pillar`, `personal_witness`, `source_url` — a values-attestation shape from the retired product, not a report shape). Normal forward migration in `supabase/migrations/` only.
- [ ] RLS: a member INSERTs their own rows; **nobody SELECTs** through the client. The operator reads out of band.
- [ ] `report.create` handler, registered in `src/actions/index.ts`, emitting an event in the same transaction.
- [ ] **Delivery to a real destination.** Whatever the PM names. The destination is recorded in `operations/RUNBOOK.md` alongside the response commitment. **A row in a table nobody reads does not satisfy this criterion.**
- [ ] ⋯ menu on Item detail pages and producer shop pages, accessible name *"More options"*, one item: **Report to the operator**.
- [ ] Bottom sheet: the *"This goes to a person, not a queue"* line, a text area, an optional one-line reason, **Send**. Focus trapped, escape closes, focus returns to the ⋯.
- [ ] Confirmation after send. **Nothing else on the page changes.**
- [ ] **No public state, verified by test:** no counter, no badge, no flag, no ordering change, no notification to the reported party. The reported thing renders byte-identically before and after.
- [ ] Repeat reports store as separate rows. No dedupe, no counter, no rate limit in v1.
- [ ] Sign-in required. Anonymous reporting is out of v1 and the trade is recorded: a signed-in-only channel misses the unconverted visitor; an anonymous one is a spam surface with no rate-limit substrate behind it.
- [ ] Tests: handler; RLS (a member cannot read others' reports); the sheet's a11y contract; the no-visible-state assertion.
- [ ] Screenshot at 375×812.
- [ ] `BUILD-LOG.md` updated.

## Workflow gates

- [ ] **PM operating decision** — destination + response commitment. **Blocks the start.**
- [ ] **Checklist 4** — fires. All five items.
- [ ] **M2 `engineering:code-review`** before commit.
- [ ] **M3 `design:accessibility-review`** — fires. New menu, new sheet, new form.
- [ ] **M4 `engineering:deploy-checklist`** — fires. New migration.
- [ ] **DEVIATIONS entry.**
- [ ] **Close-out reconciliation.**

## Notes

- **Free text with a light reason, not a taxonomy.** Ratified. At this density the operator learns more from what people write than from categories guessed in advance; a taxonomy, if ever warranted, is derived from the free text.
- **Deliberately absent:** automated classification, a queue UI, triage, assignment, appeals, strikes, suspensions, hash matching. None of it is v1 and none of it should be implied by shipping this.
- This is also the front door to the impersonation path `decision-business-identity-impersonation.md` flagged as needed and unscoped. One small feature covers bad actors, impersonation, and ordinary feedback.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
