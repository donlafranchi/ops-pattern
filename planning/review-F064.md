---
purpose: Review — F064, demand signals. Verdict PROCEED with three binding notes; the copy is the risk, not the code.
layer: how
status: approved
---

# Review — F064: someone asks for something that isn't built

**Scenario:** [`scenario-F064-someone-asks-for-something-that-isnt-built.md`](scenario-F064-someone-asks-for-something-that-isnt-built.md)
**Ticket:** T152 — **written before this scenario existed. Same finding as F063.**
**Reviewer:** `review` — 2026-09-07
**Verdict:** **PROCEED.**

## Gates

| Gate | State |
|---|---|
| **Gate A / Gate B** | **Clear.** Both absolutes are ratified 2026-09-07: `decisions.md` § 18 (demand measured before built; unique per person) and `groups.md` § Other (no automatic promotion). |
| **M1** | Below. |
| **M3** | **Fires.** New component. Below. |

## Binding notes

### 1. The copy is the deliverable and it is the only real risk here

**The code is a table, a handler and a button.** The thing that can go wrong is a sentence.

**The failure mode is specific: an affordance that collects a tap and gives back a feeling of having been promised something.** "Coming soon," "on the roadmap," "we're working on it," a progress bar, a queue position, a count — **each of these converts a signal into an implied commitment**, and promise-shaped claims were swept out of this repo on 2026-09-07 precisely because they had accumulated without anyone agreeing to them.

**`design:ux-copy` is mandatory, and the acceptance criterion is a review against `promises.md`, not a proofread.** Named in the ticket.

### 2. The subject key needs a closed vocabulary for features and an open one for categories

**These are the same column doing two different jobs and the difference matters.**

- **`subject_kind='category'`** — the key is the member's normalised words. **Open by design.** That is the instrument.
- **`subject_kind='feature'`** — the key names something we chose to surface. **It must be a constant in code, not a string assembled at the call site.** A typo in a feature key silently splits one count into two, and the whole value of the table is that the count is trustworthy.

**Not a schema change — a discipline, and it belongs in the ticket.**

### 3. The category half writes inside the Page transaction; the feature half does not

The scenario correctly requires the typed category to be written **in the same transaction as the Page.** **A signal that lands when the Page write fails is a signal about a Page that does not exist.**

**The feature tap has no such parent** — it is its own transaction. **Two different write paths into one table is fine and should be stated in the ticket** so nobody unifies them into a single helper that takes an optional transaction and gets the boundary wrong.

## Architecture (M1)

- **One table, no foreign key on the subject, and this is the one place that is right.** The subject does not exist as a row. **The contrast with F063 is the useful test: a response points at a real Item and uses the key; a demand signal points at an absence and cannot.**
- **The merge of two capture mechanisms into one table is sound** — same shape, same lifetime, same uniqueness rule. **It removes a table from the plan rather than adding one.**
- **Watch the growth path.** Voting, comments on signals, a most-requested page, an admin screen — **each is a small step and each turns a counter into a product.** The ticket's Notes section names them as out of scope; keep that list.
- **No cascade concern:** signals belong to a member and go when the member goes, which is correct — a want belongs to a person.

## Accessibility (M3)

- **The acknowledged state must be programmatically exposed**, not conveyed by a colour change or a tick glyph alone.
- **The acknowledgement is announced** — someone who cannot see the control change needs confirmation their tap registered, and this is a surface whose *entire purpose* is the member knowing they were heard.
- **The free-text category field has a real label**, not a placeholder doing label duty, and the reveal on choosing *Something else* moves focus to it.
- **The not-yet-built option must not be a disabled control.** A disabled element is unreachable by keyboard and unreadable by a screen reader. **It is an enabled control whose accessible name says the thing is not built yet** — which is also the honest reading for everyone.

## Process finding — same as F063

**T152 was written before this scenario and labelled `substrate`. It is not substrate** — it ships a component members interact with, and the ticket's own M3 line says so.

**The pipeline had a correct home for this all along and I did not use it: the Decision lane** — no F-number, ratified decision as the contract, Gate C redirected to checklist 4, M3 mandatory. **Both tickets were decision-lane work mislabelled as substrate, which is the one thing the substrate lane's own text warns against: *"substrate is not an escape hatch for skipping scenarios."***

**Scenarios are the stronger fix and the PM asked for them, so they exist now.** Recorded so the lane choice is a decision next time rather than a default.

## Verdict

**PROCEED.** Three binding notes. No EXTEND.
