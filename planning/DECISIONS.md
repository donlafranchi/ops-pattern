---
purpose: Dated log of launch-tier decisions — the calls made against the 2026-10-30 launch, with what each unblocks and what it costs. Reverse-chronological.
layer: how
status: active
---

# DECISIONS.md — launch-tier decisions

> **Scope of this file, and one flag.** The repo's standing convention routes decisions to [`../playbooks/PLATFORM-PATTERNS.md`](../playbooks/PLATFORM-PATTERNS.md) (what the platform IS) and [`../playbooks/DEVELOPMENT-PATTERNS.md`](../playbooks/DEVELOPMENT-PATTERNS.md) (how we build), with reversals as memos. **This file is deliberately narrower: version-tier calls scoped to the 2026-10-30 launch, which expire or get revisited after it.** Nothing here belongs in the constitutional tier, and nothing here overrides a ratified pattern entry. If a decision below hardens into a standing commitment, it moves to a pattern doc and this entry points there.
>
> Launch plan: [`now/initiative-launch.md`](now/initiative-launch.md).

---

## 2026-09-07 — Reports: park the policy, keep the table

**Decision.** Reports write to a table at launch. **No response SLA, no moderation flow, no operator queue, no destination commitment.**

**Intent.** The report path was carrying a ship condition — *a report channel nobody answers is worse than none* — that made an operating promise the precondition for a code feature, and that promise was blocking nine days of upload work behind an hour of decision. Parking the policy separates the two: the table and the write path ship, the promise is made later when someone is actually reading them. *(Versioned bet — revisit when the first report arrives, or at the first sign of a bad actor.)*

**What it unblocks.** The two upload absolutes proceed. `weigh` runs on metadata-stripping and takedown-before-upload; photos, the shop image, and link previews come off the blocked list.

**What it costs, stated plainly.** A member who reports something gets no acknowledgement and no visible outcome. **The copy must not imply otherwise** — no "we'll look into it," no "thanks, we're on it." The takedown handler still ships, because *never serve an image you cannot take down* is a constraint on the platform, not a promise to the reporter.

**Touches.** `now/initiative-launch.md` § The eight weeks · the general report path ticket [T123] · `backlog/scenario-F058-*.md`.

---

## 2026-09-07 — Seed content is display-only

**Decision.** Seed content is **synthetic and for display**. No owner, no target number, no recruitment of real producers before launch.

**Intent.** Content acquisition was the one risk in the plan with no recovery path and no engineering lever, and it was sitting on the critical path of a launch whose job is to prove the surfaces work. Synthetic data demonstrates the product; real producers validate it. Those are different milestones and only the first one has a date. *(Versioned bet — revisit the week after launch.)*

**What it costs.** Nothing shipped in the eight weeks can be read as evidence that real people will post. **Do not report seeded density as traction.** Synthetic rows must be distinguishable to the operator, and the launch metrics baseline starts from zero regardless of what is on screen.

**Touches.** `now/initiative-launch.md` § The eight weeks (fortnight 4) and § The five checks.

---

## 2026-09-07 — The producer values declaration is cut from launch

**Decision.** Cut. No `values_statement` column, no editor field, no public rendering at launch. **Confirmed by PM after the recommendation.**

**Intent.** It serves none of the three launch requirements, it needs `weigh` on a permanent never-sourced constraint before a line of code, and as free text it is unfilterable — so it does no discovery work on a launch-density corpus anyway. *(Versioned bet — the feature is deferred; the constraint below is not.)*

**The constraint survives the cut.** A values statement, whenever it ships, is **self-declared only — never sourced, never inferred, never attached from an external dataset**. Deferring the feature does not weaken that, and no schema added in the meantime may include a source, provenance, or import column that would make sourcing possible later.

**Touches.** `now/initiative-launch.md` § The cut list · the edit-shop ticket [T126] loses the field, keeps image and tagline · `backlog/decision-producer-values-declaration.md`.

---

## 2026-09-07 — "Where they'll be next" is one free-text line

**Decision.** One optional free-text field, **≤140 characters**, on the shop editor, rendered under the shop name on the public page. Example content: *"Saturdays 8–1, Midtown Farmers Market."* **Delegated call, made on the fastest-to-ship rule.**

**Intent.** Structured recurring-location scheduling means a recurrence editor, a venue picker, an occurrence resolver and a display rule — days of work for a field whose whole job at launch is to answer *where do I find you this week*. A sentence answers it. And the column rides the migration that is already adding the shop tagline and image, so the marginal cost is one `alter table` line and one input. *(Versioned bet — revisit when a producer asks to be findable by "who's at the market on Saturday," which needs structure.)*

**What it costs.** Not queryable, not filterable, not on the map, and it goes stale silently — nothing reminds a producer to update it. Accepted: a stale sentence a person wrote beats an empty structured field nobody filled in.

**Known cost, acknowledged 2026-09-07 — not a surprise later.** The structured recurring schedule is a **v2 buy-back, and it is priced now**: a recurrence editor, a venue picker, an occurrence resolver, a display rule, and a backfill that cannot be automated because a free-text sentence does not parse into a schedule. **Every producer who fills in the sentence at launch will have to re-enter it by hand when structure arrives.** That is the trade being made deliberately — days saved before launch, a migration nobody can do for the producer afterwards. **What it buys back when it lands:** "who's at the market on Saturday" as a query, gatherings and market appearances on the same calendar, and a map that can show where a producer will be rather than only where they are.

**Rejected alternatives.** Structured recurring location (`location_recurring_temporary` exists with one row and no producer surface) — correct shape, wrong month. Reusing the About paragraph — conflates who you are with where you are, and no card can display it.

**Touches.** `now/initiative-launch.md` § Gaps · the edit-shop ticket [T126] migration and form.

---

## 2026-09-07 — Three promises, and everything else withdrawn

**Decision.** The platform makes **three** public-voice promises and no others: revenue is ordinary and surplus returns to the community; every decision is weighed on member benefit against product benefit; we are not an extractive platform. **Every other commitment in the docs is withdrawn.** Ratified by the PM directly, not through `weigh`.

**Intent.** Early in the project the agent wrote public-voice commitments into the repo that the PM never consented to, and later documents began citing them as constitutional. A promise nobody agreed to is worse than no promise — it binds the project to language it cannot defend and did not choose. *(Constitutional in effect; lives at [`../product/foundation/promises.md`](../product/foundation/promises.md), not in this file.)*

**What it costs.** The withdrawn set included the strongest producer-facing lines the project had — never paying for visibility, leaving stronger than you arrived, eventual member ownership. **The pitch is quieter now, and true.**

**Two consequences worth naming.**
- **Paid visibility is no longer banned by fiat.** It is gated on promise 2, which is a real test: a mechanic must show the member-side benefit and the member-side cost. "It funds the platform" is the product half and fails.
- **Promise 1 is internal-only** until "above what it costs to operate" has a defensible meaning — who decides, over what period, and what returning it concretely means. **A money promise gets held to the letter, so it does not get published loose.** Three options and a recommendation are in the promises doc.

**Nothing is published.** The app is not launched, so every promise-shaped string in the repo is a draft. Removed lines are removed, not retracted — there is nobody to retract them to. **What gets published, and when, is the PM's call**; until he says otherwise the assumption is that nothing is.

**Touches.** `product/foundation/promises.md` (new) · `product/archive/foundation/platform-promise.md` (withdrawn) · `product/foundation/settled.md` § 3 + contradictions · `product/foundation/people-first.md` § paid visibility · `web/src/app/join/page.tsx` · `web/src/components/RecruitmentGrid.tsx`
