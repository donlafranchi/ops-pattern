# T147: Six steps, a resume that actually resumes, and saying so

**Scenario:** F061 — someone creates a page worth showing people
**Status:** Open
**Bundle:** launch (`planning/now/initiative-launch.md`)
**Depends on:** T142 (address/neighbourhood step), T144 (category step), T145 (photo step), T146 (default art, so the review step has something honest to preview). **Blocks:** nothing — last ticket in the F061 stretch.

**Serves:**
- **Loop:** 9 (Make a living locally) — the dogfood test's own acceptance frame: "if he can do that on a phone without help... this scenario passed."
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** no new entity — this ticket sequences existing steps and fixes an existing resume-tracking bug.

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** review F061. PROCEED. The review routed a step-count question to the PM as non-blocking; **the PM has since ruled: ship six, do not fold or defer any of them** (option A of the review's three, the recommended one).
- [x] **Gate B — clear.** No new absolute; this ticket sequences T142/T144/T145's steps and fixes a defect in the shipped composer recipe's resume mechanism (`design-language.md` § Multi-step composer, "Resume detection").
- [x] **All three `Serves` lines resolve.**

## What changes

The Page composer's step list, and the resume-tracking bug in the shared multi-step composer recipe.

## Acceptance Criteria

### Six steps, none folded
- [ ] The Page composer has exactly six steps in this order: **Name → Where (address/neighbourhood, T142) → What you do (category, T144) → A picture (photo, T145) → About → Review.**
  _Why: PM ruling, 2026-09-07 — the review flagged this as the largest step count any composer has had and asked whether to fold category+photo into one step or defer photo behind publish. Ruling: ship all six, judge with a real Page in hand rather than in the abstract — the dogfood test is what settles it, not a guess made before anyone has used it._
- [ ] Each step holds exactly one decision class, per `design-language.md` § Multi-step composer — do not merge category and photo into a single step under time pressure.

### Resume returns to the actual next step, including Review
- [ ] The composer's resume-detection ("jumps to `last_completed_step + 1`") is fixed to correctly resume at **any** step, including Review — today it never returns past the third step, so a Member who left at Review re-walks two steps they had already completed.
  _Why: scenario acceptance criteria, § The composer says what it already does — "Today resume never returns past the third step." This is a defect in the existing shipped mechanism, not new scope; fixing it here because six steps makes the bug six times more likely to bite than it was at three or four._
- [ ] Test: a Member who completes steps 1–5 and closes the composer at Review, re-entering, lands on Review with all five prior steps' data intact — not step 3, not step 1.
- [ ] Test: a Member who completes only step 2 and closes, re-entering, lands on step 3.

### The composer says it's saving
- [ ] Every step after the first states, in the helper text or nearby, that progress is saved and the Member can finish later — matching the composer's actual write-on-advance behavior.
  _Why: "the saving is already real and has been since the walkthrough shipped. Nobody knows, so nobody uses it" — scenario acceptance criteria. This is copy, not new mechanism; the write-on-advance contract already exists in the shipped recipe._
- [ ] `design:ux-copy` pass on the exact wording — invite finishing later without implying the Page isn't already "real" once created (it's in `draft` lifecycle state, not limbo).
- [ ] `BUILD-LOG.md` updated.

## Accessibility (M3) — fires, resume behavior change

- [ ] On resume, focus lands on the resumed step's first input, and the step's heading is announced (same pattern T139 uses for its naming step).

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** — fires.
- [ ] **M4** — no migration.
- [ ] **DEVIATIONS.md entry** at close.
- [ ] **Close-out reconciliation.** This is the ticket that closes out F061 — verify every acceptance criterion across T141–T146 renders correctly as one continuous flow before marking this done. Screenshot the full six-step sequence for the PM.

## Notes

- **The resume fix is in the shared recipe, not a Page-composer-only patch.** `design-language.md` § Multi-step composer is the one recipe for four-and-growing consumers; fixing `last_completed_step` tracking there benefits the Sell walkthrough, gathering composer, and product/service composers too. Do not special-case the Page composer.
- **This is not `T136`.** T136 fixes `getDraftGroup` silently discarding a second draft. This ticket fixes the step-index the resume jump computes from. Different bugs, same general area — read T136 before starting so the two aren't conflated in one commit.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
