---
purpose: Review — F060, the producer entry-point fork. Verdict PROCEED. The EXTEND was discharged by the PM's claim-not-Page ruling; the standing-badge note is paused.
layer: how
status: building
---

# Review — F060: someone starts something without opening a shop

**Scenario:** [`scenario-F060-someone-starts-something-without-opening-a-shop.md`](scenario-F060-someone-starts-something-without-opening-a-shop.md)
**Reviewer:** `review` · 2026-09-07
**Bundle:** launch ([`../now/initiative-launch.md`](../now/initiative-launch.md))
**Verdict:** **PROCEED.** *(Amended 2026-09-07: the EXTEND is discharged and the standing-badge note is paused — see § Amendments.)*

---

## Verdict summary

The scenario is right about the important thing: **this is a conformance fix, not a design change.** The Groups spec already says a Member without a business Group sees the universal composer and that the shop walkthrough fires only off the Sell verb. The build shipped one path and never built the other. Restoring what the spec says is a much cheaper argument than proposing something new, and the four blocking branches are correctly identified and correctly sized — one of them is a single clause.

**Two things the scenario asserted rather than resolved. One is now settled, one is still live.**

1. ~~It promised not to make the community-to-commercial transition impossible while choosing a Group kind the spec locks at create.~~ **Settled 2026-09-07 — see § Amendments.** The lock moved to the business claim, so there is no wall.
2. **The role vocabulary diverges between spec and code, and the item-create branch sits on that divergence.** Still live. Fixing it twice, differently, in two tickets is the failure mode.

---

## Architecture check

### Systems touched

Groups (kind selection, activation path, public page resolution, standing tier), Items (the create authorization clause), the action layer (one handler condition, no new handler), and the URL layer (one new route, one redirect). **No new entity, no new table, no new kind value, no new event type** — confirmed against the migration set.

### Schema fit

**Sound, and superseded in one place by the PM's rulings of 2026-09-07.** The kind mapping no longer gates anything — `groups.kind` is a descriptive label and the gate is the business claim. Choosing `interest` over `event_anchored` still holds for the stated reason: `event_anchored` describes a Group seeded by a specific gathering, a different origin story.

**Corrected 2026-09-07 — an earlier version of this paragraph said the business record "gates selling," which reinstated the conflation this scenario exists to remove, one paragraph after removing it. It was wrong.**

**Nothing gates selling.** Any Page may list an Item; listing is not a business activity. **The business record is a claim, not a permission** — it grants nothing a Page without one lacks. Friction attaches to the claim, because the claim is what a large business would want to fake. **The locality claim sits on top and gates the local-owner badge alone** — and because the walkthrough's ZIP step is skippable, a business with no locality claim is a state the shipped product already produces.

**Re-derived from the code: the business record legitimately gates nothing.** Its only reads across the whole codebase are `display_name` (a label) and the activation validation that requires a business draft to have one — self-referential, and correctly part of the heavier creation process rather than a permission. **Removing the three conditions is the fix; repointing them at a different row is not.**

**The correction: the three columns are a schema change and the review has to treat them as one.** Moving `tagline`, `image_url` and the free-text `where_next` line from the business child table to the `groups` spine is the right call — it is what lets a run club have a face — but it is an `alter table` on the spine, it is an M1-gated change, and **two tickets currently believe they own it.** See binding note 3.

### Cross-system consistency

- **Item create — remove the condition; keep the ownership check.** The authorization question is *is this caller an active owner of this Group*, and Group kind is irrelevant to it. The business record is read separately, for the brand label; when absent it is null, which the downstream group-name fallback already handles. **Dropping the ownership check as well would let any Member file an Item under any Group** — a far larger hole than the one being closed.
- **Product and service resolvers — remove the condition.** They look up the owning Group by slug; kind has no bearing on that. **The decisive evidence is in the repo twice**: the gathering resolver performs the identical lookup with no kind filter, because that filter was removed when Group-filed events were unbroken. Same function shape, one with the bug and one without.
- **The Group public page — remove the condition, fall back to the spine name.** It filters to business because it renders business child fields, but its required fields are name, founder, description and items; the badge and the owner claim are already optional. A Page with no business record renders with `groups.name` in place of the business display name.
- ~~The standing-tier fix reaches beyond this scenario's surface.~~ **Moot — badge work paused 2026-09-07.** The finding (it would change the badge for every existing Member and carries a migration) is why it should not have ridden along inside an entry-point ticket, and is recorded for whenever it resumes.

### Architecture verdict

**PROCEED.** The blast radius is smaller than the scenario's ambition suggests, and — after the badge pause — three branches are the whole of it. The claim that nothing else reads Group kind — no RLS policy, no feed function, no browse filter, no follow path, no URL derivation — was spot-checked and holds.

---

## Design check

### Surfaces touched

One new route carrying a three-way choice and a naming step; the existing composers behind it unchanged; the recruitment invitation gaining two lanes; the product's front door rewritten; one redirect.

### Components required

**One, and it must not be new.** The three-way question plus the naming step is a multi-step flow, and the design language carries a canonical multi-step composer recipe with an explicit rule against forking it. **Build the choice step inside that recipe.** If it genuinely does not fit — a single-select branch step is not obviously in the recipe today — the design language's own instruction is to escalate rather than fork, and that escalation is cheap now and expensive after two composers exist.

### Design verdict

**PROCEED**, with the component note binding. One caution the scenario earns: *"What are you starting?"* with three answers is a good question and a bad radio group if it renders as three clickable cards with no group semantics. See accessibility.

---

## Binding notes — the ticket and the build carry these

1. ~~**The kind question gets answered in the spec before it gets encoded in code.**~~ **DISCHARGED 2026-09-07 — see § Amendments.** The PM ruled that the lock belongs to the business claim, not to the Page, which removes the wall rather than deciding how to open it.

2. **Settle the role vocabulary once.** Group creation assigns founders `owner` for every kind; the Groups spec's role table and the standing-tier view expect `steward` on non-business kinds. Branch 1 (the item-create ownership check) stands on this; branch 4 did too before the badge pause. **One decision, applied once — not two tickets each guessing.**

3. **One migration for the three spine columns, and it is named in exactly one ticket.** The shop editor's migration is unwritten and the entry-point work now needs the same columns. Whichever lands first owns them; the other must not add its own. **This is the cheapest possible moment to get it wrong and the most expensive to unpick.**

4. ~~**The standing-badge fix is its own ticket.**~~ **PAUSED 2026-09-07 — badge work is out of scope. Do not ticket it, do not migrate it.** The finding stands and is recorded in the scenario for whenever it resurfaces.

5. **The copy criteria are testable and should be tested, not eyeballed.** Two acceptance criteria are grep assertions — no *business / shop / vendor / seller / listing* as entity labels, no legal or tax vocabulary anywhere in the flow. **Write them as a test over the rendered strings.** A criterion that says "verifiable by grep" and is then verified by reading is the exact failure this project has recorded twice this month.

---

## Sibling check

- **The You producer-state scenario** renders the create control; this one owns where it goes. **Order is fixed: that one first.** Both say so, and neither should absorb the other.
- **The shop editor** shares the three spine columns. Binding note 3 governs.
- **The Explore-into-Home merge** would relocate the create affordance, and it is cut from launch — so three tabs stay and there is no conflict. If it is un-cut, only the affordance's location moves, not its destination.
- **The vendor retirement sweep** — `/join`'s rewrite lands here, and the sweep's delete phases stay gated on the shop editor, unchanged.

## Accessibility (M3) — pre-flight

Run properly at build. Three things flagged now because they are cheap to design in and expensive to retrofit:

- **The three-way choice is a radio group and must have radio-group semantics** — a name for the group, a name for each option, arrow-key movement between them, and one tab stop for the set. Three clickable divs pass a mouse test and fail everything else.
- **Focus moves to the naming step's input when the step advances**, and the step's heading is announced. A multi-step flow that leaves focus on a button that no longer exists strands a keyboard user silently.
- **The naming input needs a real label**, not a placeholder. Placeholder-as-label disappears on first keystroke, which is when it is most needed.

## Handoff

**Owed before the affected tickets build:** the Groups spec gains a section on Group kind at create — whether it can change, and by what path (the EXTEND). **Not owed before the entry-point ticket that only routes and renames.**

**Next skill:** `ticket`, in Claude Code. Four tickets suggested by the boundaries above: the fork and route, the four code branches, the spine-column migration, and the standing badge on its own.

---

## Amendments — 2026-09-07

**The EXTEND is discharged, and it was discharged by a better answer than either option the review offered.**

The review asked the PM to pick between two ways of handling an immutable Group kind: make it changeable, or make the transition a new Page. **He rejected the framing.** The lock exists to protect a *claim* — the friction was designed to make it harder for a large business to pass as small and local — and the current build had inverted it into a toll on everyone, including a person hosting a run club who is claiming nothing.

**So the resolution is neither option: `groups.kind` stops being the gate.** The gate becomes the presence of a business claim. A Page created by a host or a seller carries no claim, so there is nothing to lock and nothing to unlock; becoming a business later is *additive* — a child row and a jurisdiction claim appear beside the Page — rather than a rewrite of an immutable column. **The Groups spec's immutability rule survives untouched, because nothing needs to mutate.**

**What this changes in the scenario, concretely:** the three-way answer no longer maps *Something I make or sell* onto the business kind. All three answers create the same kind of Page. **Selling is not the same as being a business**, and the build had been conflating them.

**What it changes for the tickets:** the predicate swap is from `kind = 'business'` to *has a business claim*, in the same places the four branches already touched — the same edit count, a different condition. **Branch 4 is out entirely** with the badge pause, so the work is three branches, not four.

**One thing this review should have caught and did not.** It treated the immutable-kind rule as a fixed constraint to design around, and asked which of two workarounds to take. The rule was fine; **the thing to question was why an unclaimed Page was being given a kind that mattered at all.** Recorded because the review's job is to find exactly that, and a binding note that offers two wrong options reads as thoroughness.

