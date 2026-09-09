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

## 2026-09-09 — The Page is the message board, and bulletins is increment one

**Decision.** The message-board proposal is **ratified as written**. The table is **`page_posts`, not `bulletins`**. The three first-migration columns land in the **first** migration, not a later one: the nullable **`parent_post_id`** self-reference, a real **`author_member_id`**, and **`kind`** (`'bulletin'` only at launch). Responses go to `page_post_responses` with a nullable `option_id`.

**Intent — the PM's words.** *"I never want to have to do a migration and a rewrite."* The three columns cost nothing today and are the difference between the board being an **increment** and being a **rewrite**. `parent_post_id` is the load-bearing one: a reply is a post with a parent, so adding it later is a migration *plus* a rewrite of every read path that assumed a flat list. `author_member_id` keeps the schema from encoding *the author is the owner*, so member-posting later relaxes a check rather than adding a column. `kind` avoids a hand-applied CHECK-constraint change on production.

**What this does not authorise.** **Only the shape is ratified, not the schedule.** Bulletins remains where the 2026-09-08 scope cut left it — in scope, audience **members** not followers, 2 days, unticketed. Replies and member-authored posts stay behind their own gates: **increment two needs no new decision, increment three needs the operator concept**, which does not exist anywhere in the code.

**Touches.** [`backlog/decision-page-as-message-board.md`](backlog/decision-page-as-message-board.md) (marked ruled) · the bulletins scenario [F066] and its review, both held in `backlog/` · `now/initiative-launch-scope-cut.md` § IN.

---

## 2026-09-09 — Browse: rewrite the existing scenario around Pages, don't open a second one

**Decision.** The approved Item-based browse scenario — *a newcomer browses one surface instead of two* [F059], in `planning/next/` — is **rewritten around Pages**. **No new F-number is opened.** The rewrite itself is not authorised by this entry; this records the routing call only.

**Intent — the PM's words.** *"So we don't have two items."* Two scenarios describing the same surface is how the surface ends up with two owners, and this repo has already paid for that once — F059 was drafted as F054 while another session held F054, and the wrong-numbered copy survived a commit. One concept, one number, one file.

**What it costs, stated plainly.** F059 was reviewed (REVISE, revision applied), ticketed [T127–T131] and Gate-C-passed against the **Item** model. Rewriting it invalidates parts of that work rather than adding to it: the five tickets were written against `discoverable_items` and the feed RPC's projection, and **a scenario in `next/` is one `build` may pick up.** Until the rewrite lands, F059 reads as approved and buildable while describing a model that was superseded on 7 September.

**Immediate consequence — not yet actioned.** F059 in `next/` carries no banner saying a rewrite is pending. **Recommended: a status banner on the scenario before any session picks it up.** Flagged to the PM, not written, because writes this session were scoped to the decision log.

**Touches.** [`stage-ledger/F059.md`](stage-ledger/F059.md) (stamped) · `next/scenario-F059-newcomer-browses-one-surface.md` · `next/review-F059.md` · tickets T127–T131 · `now/initiative-launch.md` § Fortnight 2.

---

## 2026-09-09 — A Page's address is a public location, and the copy has to say so

**Decision.** A Page gets a **street address if it has a specific location, or a neighbourhood if it does not.** The qualifier, recorded verbatim at the PM's instruction:

> **We mean a PUBLIC location, not a home address. We won't stop someone entering a home address, but it is shown to anyone who views the Page — it does not stay private.**

**Intent.** The choice is between being findable and being private, and it is the Member's to make — the platform does not adjudicate which addresses are safe to publish, and it does not silently withhold one that was entered. **What it owes instead is that nobody is surprised.** An address field that reads as a form field, filled in by someone assuming an address is administrative data, publishes a home to strangers on the strength of a wrong assumption the interface created.

**The copy consequence, which is a build requirement and not a note.** **The address field needs wording that makes public visibility unmistakable before anyone types into it** — at the point of entry, not in a confirmation afterwards and not in a settings page. The neighbourhood alternative must be visible in the same moment, so the choice is legible as a choice.

**Standing rule, recorded here and not yet a pattern entry.** **No legal or tax language in any user-facing string, ever.** The PM states this as standing rather than launch-tier, which means it belongs in [`../playbooks/PLATFORM-PATTERNS.md`](../playbooks/PLATFORM-PATTERNS.md) — and rebuild rule 9 requires `weigh` before any new pattern entry lands. **Recorded here so it is not lost; it needs `weigh` to reach its proper home.** In the meantime it binds: warning copy on the address field says what is public, not what is lawful.

**What is still open.** This settles what a Page's address *is*; it does not settle which composers ask for it. The non-business Page creation flow collects no location at all today — see the stub below.

**Touches.** [`backlog/decision-non-business-page-address-step.md`](backlog/decision-non-business-page-address-step.md) (marked ruled on the address-shape question) · the shipped location step [T142] and `<LocationPlaceFields>` · the create entry point [T139] · `now/initiative-launch.md` § Fortnight 1.

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

---

## 2026-09-07 — A guidelines tier, and two promise candidates drafted

**Decision.** Introduce a tier below promises. **Promises are absolute and few; guidelines are strong defaults departed from only with a recorded reason** that clears the member-benefit gate. The paid-placement material becomes a guideline, not a promise — **wiggle room, not a ban.**

**Two guidelines landed.** *We don't sell visibility* — ranking, placement and reach are not for sale by default. *Never price out the small or the unsuccessful* — people can participate meaningfully without paying; fees follow success and never gate entry. The second **merges two monetization refusals** that were the same commitment stated from two directions.

**Two promise candidates drafted, deliberately not ratified.** That members share in what they help build, and that the platform's responsibility runs to members and communities rather than outside capital. **Silent on amount and mechanism by design** — the moment a number appears, the first becomes a financial instrument rather than a commitment.

**Recorded as a knowing reversal, with both dates.** Member-ownership was withdrawn earlier the same day because it was the agent's promise and nobody had agreed to it; the PM reinstated a version he wrote himself later the same day. **The content overlaps; the authority is what changed**, and flattening the two events into one would erase the lesson that produced the audit.

**The hedge is preserved and is load-bearing.** *"We don't plan on having shareholders"* is a plan, not a never. Candidate B therefore splits: **firm on whose interests come first, a stated plan on corporate structure.** Hardening the second half would turn a statement about who the platform serves into a statement about how it may be financed.

**Finding — the two money commitments are not the same and they compete.** Promise 1 returns *surplus* to a *place*, collectively. Candidate A rewards *participants*, individually, by contribution. **The same dollar cannot do both.** Ratifying both without a priority order commits the surplus twice. The one clarification that changes everything: whether *share* means a cut of profit or a share of ownership — if ownership, they draw on different things and do not compete at all.

**Everything stays internal.** Nothing published, nothing user-facing.

**Touches.** `product/foundation/promises.md` (guidelines tier, two guidelines, two candidates, reversal record, overlap finding, ownership-wording flags) · `product/foundation/monetization.md` (two refusals merged) · `product/foundation/settled.md` § 3 · `product/systems/payments.md` (three lines) · `product/needs/producer-roadmap.md` (one Won't entry)

---

## 2026-09-07 — The lock belongs to the business claim, not to the Page

**Decision.** `groups.kind` stops being the gate. **The gate is the presence of a business claim.** Anyone creating a Page to host or to sell gets no ZIP prompt, no locality claim, no verification, no badge and no lock. Those arrive only when someone deliberately claims to be a local business, and they are the price of that claim.

**Intent.** *(Ratified 2026-09-07 by the PM directly.)* The friction was designed to make it harder for a large business to pass itself off as small and local. **The build inverted it into a toll on everyone** — the only door to publishing anything was the shop walkthrough, so a person hosting a run club had to open a shop and answer business questions to convene a run. Restoring the original purpose costs less than working around the inversion.

**What it resolves.** The review's open EXTEND asked whether Group kind should become mutable or whether the community-to-commercial transition should be a new Page. **Neither.** With kind demoted to a descriptive label, an unclaimed Page has nothing to lock, and becoming a business is additive — a child row appears beside the Page. The Groups spec's immutability rule is untouched because nothing mutates.

**What it costs.** Every read currently keyed on `kind = 'business'` swaps to *has a business claim* — the same places the entry-point work already had to touch, a different predicate. **Selling and being a business stop being the same thing in code**, which is correct and is a behaviour change worth watching for in review.

**Also recorded this ruling:** the standing badge is **paused** — not ticketed, not migrated. And candidate B's no-outside-shareholders half is upgraded from a plan to firm intent, with the union framing as the model the revenue thinking is now built against.

**Touches.** `planning/next/scenario-F060-*` § Data captured + § blockers + § scope · `planning/next/review-F060.md` § Amendments · `planning/stage-ledger/F060.md` · `product/foundation/promises.md` § Candidate B · `product/foundation/monetization.md` § Non-equity revenue paths

---

## 2026-09-07 — Many Pages per person; conversion is rejected

**Decision.** A person holds **as many Pages as they have things going on** — a business, a run club, a supper club, simultaneously, no limit implied. **Conversion is rejected outright**, not deferred: turning one Page into another destroys the first thing, and people have several irons in the fire. Creating a second Page is the model. **Different creation processes per type are correct** — a business Page asks more questions than a group Page.

**Intent.** *(Ratified 2026-09-07 by the PM directly.)* The build assumed one producer identity per person because its only door was the shop walkthrough. Many-Pages is how a real person actually shows up in a place, and it makes the previous session's hardest question disappear rather than answering it: **nothing ever needs to mutate, because nobody ever converts.** The Groups spec's kind-immutability rule is not worked around, not amended, and never reached.

**Two gates, not one — confirmed against the schema.** A `group_businesses` row means *this is a business* and gates selling, the public-page resolvers and the item-create clause. A locality claim means *this business says it belongs to this place* and gates the local-owner badge alone. **The walkthrough's ZIP step is skippable, so a business with no locality claim is a state the shipped product already produces** — conflating the gates would make every business that skipped it invisible.

**What it costs.** Less than expected. The schema imposes no limit already, the sell index iterates shops rather than assuming one, and no switch-context surface exists to rework. **Three small things break and all sit inside tickets already being written** — the draft-resume path calls multiple drafts "pathological" when they are now normal, the Sell CTA's branching reads business-only, and the You scenario's shop row is written singular.

**Parked, raised not decided:** aggregating messages and activity across a person's several Pages. **It becomes real the moment anyone holds two**, which is now the ordinary case — recorded so it reads as an anticipated consequence rather than a surprise. Not in launch; no messaging surface exists.

**Touches.** `planning/next/scenario-F060-*` § Data captured + § The Story + § scope + § Parked · `planning/stage-ledger/F060.md`

---

## 2026-09-07 — Correction: nothing gates selling

**What was wrong.** Earlier the same day this log recorded that a `group_businesses` row "gates selling, the public-page resolvers and the item-create clause." **That reinstated the exact conflation the entry-point work exists to remove**, one paragraph after removing it: the report said selling and being a business stop being the same thing, then made the business record the permission to sell. Both cannot be true.

**Whose error.** The agent's, in the report and the review; the PM endorsed the two-gate split without catching that the second gate had quietly become a permission. **Recorded as a correction with its reasoning rather than a silent edit, because the failure mode — restating a conflation in the language used to remove it — is easy to repeat.**

**Corrected model.**

- **Nothing gates selling.** Any Page may list an Item. **Listing is not a business activity** — a person selling jam, a kid selling bracelets, someone clearing out records.
- **The business record is a claim, not a permission.** It means *I am a business*. It grants nothing and unlocks nothing by itself.
- **Friction attaches to the claim**, because the claim is what a large business would want to fake. That is its entire purpose.
- **The locality claim sits on top** and gates the local-owner badge only.

**Re-derived from code — what the business record actually gates: nothing.** Its only reads anywhere are `display_name`, used as a brand label for display, and the activation check that requires a business draft to carry one — self-referential, and correctly part of the heavier creation process rather than a permission.

**The three branches, each with the reason from the code.**

- **Item create — remove the condition.** The authorization question is *is this caller an active owner of this Group*; kind has no bearing on it. The brand label is a separate optional read, null when absent, already handled downstream.
- **Product and service resolvers — remove the condition.** They resolve a Group by slug; kind is irrelevant. **The gathering resolver already does the identical lookup with no filter**, because that filter was removed when Group-filed events were unbroken. The same function exists twice in the repo, once with the bug and once without.
- **Group public page — remove the condition, fall back to the spine name.** It filters to business because it renders business child fields; its required fields are name, founder, description and items, and the badge and owner claim are already optional.

**The PM's expectation is confirmed: remove the gates, do not repoint them.**

**On money — checked, not assumed.** No payment, ledger, transaction, order, invoice or payout table exists; no Stripe, checkout, payout or tax-reporting code exists anywhere in the app. Payments are a b2 spec and the launch scope keeps transactions off-platform. **So there is no legitimate requirement for a business record today.** If money ever flows through the platform, tax-reporting thresholds and payout identity checks may make one genuinely required — **that would be a real external constraint rather than a design choice, and it is the one case worth revisiting this in.**

**Touches.** `planning/next/scenario-F060-*` § acceptance criteria (three replaced) · `planning/next/review-F060.md` § Schema fit + § Cross-system consistency · `planning/stage-ledger/F060.md`

---

## 2026-09-07 — "Both" is dropped; Pages are created sequentially

**Decision.** The create question carries **two answers** — *something I make or sell* · *something I host*. **"Both" is dropped.** Someone who does both makes a second Page later, never at the same time.

**Intent.** *(Ratified 2026-09-07 by the PM.)* Selling and hosting have different creation processes — the business path deliberately carries the claim friction, the host path carries none. **One Page doing both leaks business friction onto the hosting side**, which is the inversion the entry-point work exists to fix.

**Also ruled: people create Pages sequentially, not simultaneously**, and Pages have varying lifespans — a business for years, a season of selling for months, something short enough to last until one event. **Most people hold one at a time.** A Page is an organizing entity: where conversations happen and items and dates get posted.

**What it costs, and the mitigation that is not optional.** A market vendor who also hosts a monthly meetup manages two Pages instead of one — **real friction on exactly the small producer the platform exists to protect.** The mitigation is recorded as an acceptance criterion rather than a recommendation: *start another* is offered in a line at the end of creation, returning to the question with the name step ready, never a redirect to the beginning. **Cut that line and the case for dropping "Both" gets materially worse.**

**Open and blocking tickets:** whether a one-time event is a Page or an Item with a date — [`backlog/decision-page-vs-listing.md`](backlog/decision-page-vs-listing.md), with both prices costed.

**Touches.** `planning/next/scenario-F060-*` § The Story + § acceptance criteria · `planning/backlog/decision-create-both-option.md` (ruled) · `planning/stage-ledger/F060.md`

---

## 2026-09-07 — A Page is who; an Item is what

**Decision.** **One-time things are Items. Long-duration things are Pages.** A one-time event is an Item with a date, filed under a Page — **no Page is created for a single occasion.** The canonical definition: **a Page is the person or people behind the listing.** Long-lived things appear on the map. **Anything in the past does not appear** — time-based, automatic, no manual cleanup.

**Intent.** *(Ratified 2026-09-07 by the PM.)* For a one-time event a Page and a listing collapse into the same thing, and letting a Page *be* a single event would make browse and the map index Pages that are really listings. **A follower graph on ephemeral Pages is worthless** — following something that ends next Tuesday buys nothing.

**Landed in the foundation set** — `nouns.md` § Page is the canonical definition and every other doc gets checked against it.

**What "in the past" means mechanically.** An Item with a date drops off once the date passes. **An Item with no date — a product, a service — never drops off.** A gathering with no date at all does not surface, because nothing can tell whether it has happened. **This rule is already implemented** in the three feed functions; it is **not** applied on the browse path, which reads the index directly — so past gatherings currently appear in Explore and on the map. One predicate, about an hour.

**Retirement is in scope and is a day.** The substrate exists and five read paths already behave correctly — row-level security, the browse index, the public URL, path derivation, and the following list. **Missing: the dissolve handler and a control to call it.**

**Touches.** `product/foundation/nouns.md` § Page (new canonical definition) · `product/foundation/settled.md` § 13 · `planning/next/scenario-F060-*` · `planning/backlog/decision-page-vs-listing.md` (ruled)

---

## 2026-09-07 — The map's unit is the Page; Items are the data source

**Decision.** A pin represents a **Page**, not an Item. Items remain the data source: matching Items are grouped by Page, one pin per Page **per location**, and the popup lists that Page's matching Items. **Search sourdough, see the bakers — not individual loaves.** Past-dated Items drop out first, so the grouping only ever sees what is current.

**Intent.** *(Ratified 2026-09-07 by the PM.)* It follows directly from *a Page is the person or people behind the listing* — **the map should answer *who*.** It also solves a problem nobody has hit yet: a producer with twenty items would otherwise cover the map in pins.

**The reason it is cheap, and it is the reason the earlier blocker dissolves.** Mapping Pages looked expensive because only the business path collects a location, so a run club would have no coordinates — and asking every Page for one would have put friction back on the host path that was just cleared. **Deriving the pin's location from the Page's Items removes that entirely.** No Page is ever asked where it is.

**Price: well under a day, and it does not need its own decision.** The browse payload **already carries `group_id`, `group_slug`, `brand_label`, owner handle and display name, coordinates and the start date per Item** — everything the grouping needs. So this is a client-side reduce over an array the map already receives, plus a popup that lists items instead of showing one. **No query change, no migration, no new endpoint.** Roughly an hour for the time filter and two to four for the grouping and popup.

**One gap found while pricing it.** The browse select list carries `brand_label` but **not** `group_name` — and `brand_label` is null for every non-business Page. **A run club's pin would render with no name.** One column added to the select string; minutes, but it is the difference between a labelled pin and a blank one.

**Answers to the four questions asked.**

- **A Page whose Items sit at different coordinates gets one pin per location.** Correct, and the PM's read is right: the pin answers *where can I find them*, and a producer at two markets is genuinely in two places. **The grouping key is Page-per-location, not Page** — grouping by Page alone would force either an arbitrary choice of location or a centroid, and a centroid between two markets puts the pin in a river.
- **With nothing searched: every Page with current Items.** This falls out rather than being built — the map receives the filtered set, and an empty filter is everything.
- **Past-dated Items drop out of the grouping automatically**, because the grouping runs over the already-filtered array. **A Page whose only Item was last weekend's market has no Items, so no group, so no pin.** Exactly the intended behaviour.
- **An Item with no date never drops out** — a product or a service has no date to pass.

**Touches.** `product/foundation/nouns.md` § Page (map unit + the intent sentence) · the browse read path (time filter, one predicate) · the map component (group-by-Page-per-location, popup as a list) · the browse select list (`group_name`)

---

## 2026-09-07 — One Page is one place; map grouping stopped

**Decision.** **Each business location is its own Page** — a two-location bakery is two Pages. A seller with a fixed location is mapped there. **A creator with no fixed location is found through the Pages of the places they appear at**, not pinned at an address they do not have. **No grouping on the map, at all.**

**Intent.** *(Ratified 2026-09-07 by the PM.)* One Page to one place makes pins **one-per-Page by construction**, so the grouping had nothing left to do. The earlier decision is superseded rather than wrong — a different model made the work unnecessary. **Roughly 2–4 unspent hours; the reversal cost nothing** because the pricing had been reported and not started.

**Inventory finding — more of this is built than anyone expected.** Venues are a shipped first-class surface with their own public pages and two content sections, in three kinds including **recurring-temporary — literally a market that happens on Saturdays.** And **the vendor-at-venue join already exists**: `item_locations` carries a schedule kind, schedule detail, an approval status whose own schema comment says it is for *"cross-Member Location attachments (pending approval)"*, and an end date. **It was built for a producer's pickup point and it is exactly the shape a food truck at a market needs.**

**The gap is a read, not a model.** *What's happening here* on a venue page filters to Items belonging to **the venue's own Page**, so a visiting vendor's Items fall through to *what's happening nearby* — a radius query rather than the attachment. **The relationship is stored and then not read.** No composer can attach to someone else's venue, and no approval surface exists anywhere in the app.

**Proposed vocabulary: one new word, not four.** The four patterns are already expressible with Page, Venue and Item; only the relationship needs naming. **A Page has *appearances* at Venues.** Naming the relationship rather than the entity is what holds the term count at one — *itinerant Page* or *mobile seller* would put a type back on the person, which is the pigeonhole this whole day removed.

**Price, and the schedule flag.** **Item-level appearances, auto-approved: half a day** — one read-function change plus venues in the composer's location step. **Owner approval: plus 1–2 days**, and no notification path of any kind exists. **Page-level appearances independent of Items: plus 1–2 days of genuine new modelling.** Full shape 3–5 days. **This is the first real scope addition of the session and it lands in week one of eight; the half-day fits, 3–5 days does not without something leaving.** The honest candidate to drop is the shop editor's free-text *where they'll be next* line, which appearances make redundant — close to even in days, strictly better in outcome.

**Touches.** `product/foundation/nouns.md` § Page · `planning/backlog/decision-place-taxonomy.md` (new, awaiting ruling) · the map grouping work, stopped

---

## 2026-09-07 — The "Active in the community" badge is removed

**Decision.** **Removed.** Not paused, not redesigned to require real activity — gone. **No replacement is built**: no activity counter, no interaction count, no "active since."

**Intent.** *(Ratified 2026-09-07 under promise 3, as a foundation matter rather than a scope cut.)* **A badge derived from holding a role is the platform telling people who counts.** That is the same shape as the ownership tier and the sourced values badge, both already refused. Activity could be counted from actual activity — messages, interactions with a Page or a listing — **but no signal was asked for, and building one would cross the same line from the other side.** It also stays consistent with the standing refusal to put a response counter on a person's own work.

**What comes out — about half a day, and the doc sweep is the bulk of it.**

- **One chip** on the public Member page, and the field feeding it on the read path.
- **One view dropped** — the standing-presence derivation, declared with the Groups schema and granted to the public roles.
- **Four eval touches** — the member-page spec's badge assertion, the fixture that seeds a managing role purely to earn it, and two view tests.
- **Docs across roughly a dozen live files**, including the standing-tier gate quoted in the root router.

**Does the view removal break any join? No.** It is a view with exactly one reader — the member-page resolver — and nothing joins to it in SQL. A later migration mentions it only in a comment, as a technique reference. One `drop view if exists`; the grant dies with the object.

**Does anything still read the `steward` role? Yes — one consumer, so the role is not orphaned.** The standing view was one of two readers and is going. The survivor is the **one-time discoverability prompt**, which enqueues when a Member first acquires a managing position. **Worth naming, not fixing now:** after the role fix landed, every non-business founder is a steward, so that condition is now equivalent to *"took a managing role in any Group"* and the role check is a proxy for something it could say directly.

**One stale rationale created by this.** The role-fix ticket's own text argues that its downstream readers "already branch on `steward` and are correct today." **That is still true, but one of the two consumers it cites is about to be deleted** — the ticket's conclusion survives, its supporting evidence halves.

**Touches.** `product/foundation/settled.md` § 5 · `planning/backlog/decision-standing-badge-requires-activity.md` (ruled; the question it asks is moot) · the member page and its resolver · a view-drop migration · evals and fixtures · the docs carrying the standing tier
