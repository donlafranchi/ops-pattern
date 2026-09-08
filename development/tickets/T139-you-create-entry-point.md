# T139: `/you/create` — the single producer entry point

**Scenario:** F060 — someone starts something without opening a shop
**Status:** Open
**Bundle:** launch (`planning/now/initiative-launch.md`), track A
**Depends on:** T132 (founder role by kind), T133 (item-create drops the business gate) — both already shipped. Does not depend on T134–T136.

**Serves:**
- **Loop:** 1 (Gather), 2 (Declare something), 7 (Make and be found) — this is the scenario's own centerpiece surface: the door a run-club host walks through without being asked to open a shop.
- **Canonical example:** P1, and the run-club case it does not cover.
- **Primitive shape:** Person → Group (any kind) → Item. No new entity, no new table, no new kind value — both answers create the identical `groups.kind = 'interest'` row; the question is a UI branch, not a data branch.

**Spec contract:** `product/systems/groups.md` § Standing tier + § Casual vs ongoing commercial · `product/foundation/role-language.md` · `playbooks/PLATFORM-PATTERNS.md` § No legal or tax language reaches a person · `product/ui/design-language.md` § Multi-step composer (the recipe this ticket must extend, not fork).

**Why this ticket exists now, a third time.** It was left off the original F060 ticket batch (five tickets, all bug-fix branches, none of them the entry point itself) and then explicitly excluded from T136 by name. Both omissions were correct in scope but left the actual door unticketed. This ticket is that door.

## The flow — two direct actions, no question screen

*(Revised 2026-09-07. The scenario still describes a two-answer question; **this ticket supersedes that wording** and the scenario should be amended to match on its next touch.)*

**"Both" was dropped 2026-09-07.** Any spec or ticket language describing a three-way choice (including earlier drafts of this scenario's own Surfaces section) is stale — the live model is two answers, and selling and hosting are different creation processes rather than one Page doing both.

1. **`/you/sell` becomes `/you/create`.** Not a rename — a fork. Any inbound link to `/you/sell` (the shipped Sell CTA, `/join`) redirects to `/you/create`, preserving any query string.
2. **No classification step.** `/you/create` presents **two labelled actions — "Sell something" and "Host something" — each opening its composer directly.** *(Revised 2026-09-07: the radio question was replaced after checking the shipped pattern. The existing entry points are three plain buttons — Add a product, Add a service, Host a gathering — each opening a composer with no meta-question in front of it. **The question screen would have been the novelty, and the more expensive one**: two buttons reuse a component that exists, a radio group is a new component the design language has no recipe for.)*
3. **Step 2 — "What should we call it?"** A real `<label>`, not a placeholder. Focus moves to this input when the step advances; the step's heading is announced. From the moment a name is typed, every surface in the flow uses that name — never "your Page," "your group," or "your business." The noun **Page** appears only in help text where no name exists yet.
4. **After naming:**
   - **"Something I host"** continues directly into the existing gathering composer's remaining steps (anchor location, schedule) — Priya's flow is name → where it meets → when, and publishing completes it. The Group is created underneath (`kind='interest'`) as part of the same continuous sequence; the Member is not shown a second "create your Group" step.
   - **"Something I make or sell"** completes at the naming step and lands the Member on their new Page — same `kind='interest'` row, nothing more asked. It does **not** route into the existing five-step Sell walkthrough (brand name / anchor / about / ZIP / review) — that walkthrough is the business-claim surface, which is a separate, later, deliberate act this scenario explicitly does not build (see Scope boundary below). The Member reaches "Add a product · Add a service · Host a gathering" from their new Page the same way an existing producer does (per F057's shop-row pattern) — verify the exact landing surface against whatever F057/T131 shipped; do not invent a new one.
5. **Starting a second Page is one tap, not a redirect to the beginning.** On completion, offer *start another*, returning to step 1 with the naming step ready. The Page just created is unchanged by whatever is created next.

## What this ticket does NOT decide or build

- **The business-claim surface itself.** Neither answer, and nothing after naming, asks for a ZIP code, a locality claim, verification, an entity type, or any legal/tax vocabulary (`sole proprietorship`, `LLC`, `EIN`, `DBA`, `incorporate`, `register your business`, `legal entity`, `formation`, `tax`). Claiming to be a local business is a separate, later, deliberate act with its own surface — not built here, not by this ticket.
- **What the nav's create affordance looks like.** This ticket owns where it goes (`/you/create`), not what it is — that's F057/T131's territory, already shipped.
- **The recruitment invitation's hosting/service lanes, or the `/join` rewrite.** The scenario's Surfaces section names both, but they are a distinct component (the pre-producer invitation grid) with their own acceptance criteria — ticket separately if the PM wants them built now.
- **Conversion, or "Both."** Rejected outright per the scenario. A second Page is the only path from one intent to the other.

## Acceptance Criteria

Sourced directly from the scenario's own acceptance-criteria section (grep-verifiable copy checks are noted as such):

- [ ] **Hosting requires no shop.** A Member with no Group of any kind chooses "Something I host," names it, and publishes a gathering under it — created, published, reachable at its public address. No authorization error.
- [ ] **Two labelled actions, no self-classification step.** `/you/create` renders exactly two actions — one to sell something, one to host something — each entering its composer directly. **No screen asks the Member to classify themselves before they have done anything**, and no option, heading or helper text names a category of person.
- [ ] **The entity's own name carries it.** Once named, every surface uses the typed name. The strings *business*, *shop*, *vendor*, *seller*, *listing* do not appear as labels for the entity anywhere in the flow. *(Grep-verifiable.)*
- [ ] **No legal or tax language, anywhere in the flow.** None of the listed terms appear; no field collects entity type, state of formation, or formation date. *(Grep-verifiable.)*
- [ ] **A non-business Page is a real page.** A signed-out visitor opening the new Page's public address sees it render (name, description, image, tagline, items filed under it) — depends on T134, already shipped.
- [ ] **Starting a second Page is one tap, and the first is untouched.** *Start another* returns to step 1 with naming ready, not a redirect to `/you/create`'s start. The prior Page is unchanged.
- [ ] **The old route does not strand anyone.** Any inbound link to `/you/sell` redirects to `/you/create`, preserving the query string.
- [ ] **Nothing gates selling.** Any Page, business record or not, can have a product or service listed under it, created and published exactly as a gathering would be — depends on T133, already shipped.
- [ ] Test: both actions are real buttons with accessible names, reachable in reading order, each its own tab stop. *(The radio-group ARIA criterion is gone with the radio group — **two buttons that do two things need no group semantics, which is why this is simpler by construction rather than by care.**)*
- [ ] Test: focus lands on the naming input when step 2 renders; the step heading is announced.
- [ ] BUILD-LOG.md updated.

## Component note — binding, from the F060 review

**One component, and it must not be new.** The two-way question plus the naming step is a multi-step flow, and `design-language.md` § Multi-step composer already carries the canonical recipe with an explicit rule against forking it ("One recipe, four (and growing) consumers; do not fork"). **Build the choice step inside that recipe** — most likely as a new step-type ("branch step" / single-select) if the recipe doesn't already have one. **If it genuinely does not fit, escalate to `weigh` rather than fork** — the recipe's own instruction, and cheaper now than after a second composer shape exists.

## Accessibility (M3) — required, new route + new component

- The two-way choice is a radio group, not two clickable cards — group semantics, per-option names, arrow-key movement, one tab stop.
- Focus management on step advance (into naming, and from naming into the handed-off composer).
- The naming input has a real label.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** — mandatory, new route + new interactive component.
- [ ] **M4** — no migration (no new kind value, no new table).
- [ ] **DEVIATIONS.md entry** at close.
- [ ] **Close-out reconciliation** at close.

## Notes

**Sequencing.** Build after T137, T133–T136 per the PM's explicit order (2026-09-07) — this ticket is written now so it cannot go missing a third time, not queued to build first.
