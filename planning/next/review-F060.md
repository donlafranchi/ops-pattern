---
purpose: Review — F060, the producer entry-point fork. Verdict PROCEED with one EXTEND owed on the Groups spec and four binding notes.
layer: how
status: next
---

# Review — F060: someone starts something without opening a shop

**Scenario:** [`scenario-F060-someone-starts-something-without-opening-a-shop.md`](scenario-F060-someone-starts-something-without-opening-a-shop.md)
**Reviewer:** `review` · 2026-09-07
**Bundle:** launch ([`../now/initiative-launch.md`](../now/initiative-launch.md))
**Verdict:** **PROCEED — with one EXTEND owed on [`groups.md`](../../product/systems/groups.md) before the ticket that touches Group kind or the spine columns can build.**

---

## Verdict summary

The scenario is right about the important thing: **this is a conformance fix, not a design change.** The Groups spec already says a Member without a business Group sees the universal composer and that the shop walkthrough fires only off the Sell verb. The build shipped one path and never built the other. Restoring what the spec says is a much cheaper argument than proposing something new, and the four blocking branches are correctly identified and correctly sized — one of them is a single clause.

**Two things the scenario asserts rather than resolves, and both need to land before code.**

1. **It promises not to make the community-to-commercial transition impossible, while choosing a Group kind that the spec locks at create.** Priya's singlets are named in the story and then scoped out. That is fine as scope; it is not fine as silence — the spec currently says kind is immutable, so as written the scenario ships a wall it has promised not to build.
2. **The role vocabulary diverges between spec and code, and two of the four branches sit on that divergence.** Fixing it twice, differently, in two tickets is the failure mode.

Neither is a defect in the thinking. Both are places where the scenario inherited an unresolved question and did not say so.

---

## Architecture check

### Systems touched

Groups (kind selection, activation path, public page resolution, standing tier), Items (the create authorization clause), the action layer (one handler condition, no new handler), and the URL layer (one new route, one redirect). **No new entity, no new table, no new kind value, no new event type** — confirmed against the migration set.

### Schema fit

**Sound, with one correction.** Mapping the three answers onto `business` and `interest` uses values already in the CHECK constraint, and the non-business activation path already exists and is looser than the business one. Choosing `interest` over `event_anchored` is right for the stated reason — `event_anchored` describes a Group seeded by a specific gathering, a different origin story.

**The correction: the three columns are a schema change and the review has to treat them as one.** Moving `tagline`, `image_url` and the free-text `where_next` line from the business child table to the `groups` spine is the right call — it is what lets a run club have a face — but it is an `alter table` on the spine, it is an M1-gated change, and **two tickets currently believe they own it.** See binding note 3.

### Cross-system consistency

- **The item-create fix is exactly one clause and the ownership condition must survive it.** Dropping `and g.kind = 'business'` while keeping the membership-and-role check is correct. Dropping both would let any Member file an Item under any Group, which is a far larger hole than the one being closed.
- **The public-page generalization has a working precedent in the repo**: the gathering resolver already handles non-business Groups and falls back to the Group's own name. The product and service resolvers should copy that shape rather than invent a second one.
- **The standing-tier fix reaches beyond this scenario's surface.** Amending the view so a non-business founder qualifies changes who carries the "Active in the community" badge for every existing Member, not just new ones. That is a behaviour change with a migration, and it should not ride along inside an entry-point ticket.

### Architecture verdict

**PROCEED.** The blast radius is smaller than the scenario's ambition suggests, and the four branches are the whole of it. The claim that nothing else reads Group kind — no RLS policy, no feed function, no browse filter, no follow path, no URL derivation — was spot-checked and holds.

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

1. **The kind question gets answered in the spec before it gets encoded in code.** The scenario promises the community-to-commercial transition stays possible; the Groups spec says kind is locked at create. **Land the posture first** — either kind becomes changeable through a named handler, or it stays locked and the transition is a new Page with the old one pointing at it. Both are defensible; shipping the create flow without picking one is not. **This is the EXTEND, and it blocks only the ticket that writes a kind value.**

2. **Settle the role vocabulary once.** Group creation assigns founders `owner` for every kind; the Groups spec's role table and the standing-tier view expect `steward` on non-business kinds. Branch 1 (the item-create ownership check) and branch 4 (the standing badge) both stand on this. **One decision, applied in both places, in one ticket — not two tickets each guessing.**

3. **One migration for the three spine columns, and it is named in exactly one ticket.** The shop editor's migration is unwritten and the entry-point work now needs the same columns. Whichever lands first owns them; the other must not add its own. **This is the cheapest possible moment to get it wrong and the most expensive to unpick.**

4. **The standing-badge fix is its own ticket.** It changes a badge for existing Members and carries a migration. Bundling it into the entry-point work hides a product change inside a routing change, and the deviations log should carry it by name.

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
