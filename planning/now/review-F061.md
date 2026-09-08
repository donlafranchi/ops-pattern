---
purpose: Review — F061, creating a Page worth showing people. Verdict PROCEED with six binding notes; one question routed to the PM.
layer: how
status: backlog
---

# Review — F061: someone creates a Page they'd actually show people

**Scenario:** [`scenario-F061-someone-creates-a-page-worth-showing-people.md`](scenario-F061-someone-creates-a-page-worth-showing-people.md)
**Reviewer:** `review` — 2026-09-07
**Bundle:** launch ([`initiative-launch.md`](../now/initiative-launch.md))
**Verdict:** **PROCEED**, with six binding notes. **One question for the PM that does not block ticketing.**

## Gates

| Gate | State |
|---|---|
| **Gate A** — no unratified absolutes in cited spec | **Clear.** Six absolutes are cited and all six carry a State tag dated 2026-09-07: the geography refusal, the no-automatic-promotion rule, the two default-art constraints, no-verification (all `groups.md`), and the two upload commitments (`policy.md` § Uploaded images, ratified earlier the same day). |
| **Gate B** — nothing the code encodes is unratified | **Clear.** Every absolute this scenario turns into code is on the list above. |
| **Rule 2** — spec section before ratification | **Clear.** New columns, table and event types are specified in `groups.md` § What a Page carries at creation, written before this review. |
| **M1** — architecture | Run below. |
| **M3** — accessibility | Run below; carried to build. |

## Binding notes

### 1. One bucket, and it is not called `item-media`

The upload substrate ticket names the bucket `item-media` because Items were its first consumer. **Pages are now first and Items are deferred.** A bucket called `item-media` holding mostly Page photographs is a name that will mislead every future reader.

**Name it `media`.** The bucket does not exist yet, so this costs nothing now and cannot be done cheaply later.

**The one-bucket-one-module rule stands and is the reason the metadata guarantee is checkable at all.** Every caller — this scenario, the editor, Items when they resume — goes through the same module. A second upload path is how the guarantee holds in one place and not the other.

### 2. The vocabulary belongs in code, not in a database constraint

Twelve terms will become thirteen. **Do not encode them as a Postgres `CHECK` or an enum** — that makes every vocabulary change a migration, and migrations are currently applied to production by hand.

**Store the column as plain text, validate against a named constant in the action handler.** Adding a term becomes a deploy. The index stays on the column either way.

*This is the same reasoning that keeps `group_memberships.role` free text rather than an enum — precedent exists in this schema.*

### 3. Required at creation, nullable in the column — say why in both places

The scenario requires a category and also makes the column nullable. **Both are right and the reason must be written down or a future reader will "fix" one of them.** Nullable because Pages created before this exist and are not being backfilled; required because the handler refuses a publish without one. **Enforcement in the handler, not the constraint.**

### 4. Deleting the placeholder coordinate reaches further than this scenario's surface

The acceptance criterion says no code path writes a default coordinate. **The constant being deleted is in the shared location-create action, which the product, service and gathering composers also call.** That is correct and intended — a fake coordinate is not less fake in an Item composer — **but it means this ticket changes three surfaces it does not otherwise touch.**

**Binding: the item composers' location steps get the same address search, or they lose the ability to create a Location.** Whichever the build chooses, it is a deliberate choice recorded in the ticket, not a discovery at merge time.

### 5. One migration, not three

New category column, new capture table, new photo column, two new event types — **and the editor scenario needs a `group.updated` event type in the same constraint.**

**Fold them into one migration.** Production migrations are hand-applied right now; three separate hand-pushes across two scenarios is three chances to forget one. The drift check ticket exists precisely because that already happened twice.

### 6. Default art is design work with a build wrapped around it

The recipe is written and is buildable as specified. **But it is what the application looks like on its first day, and no one has seen it.** The build should produce it early enough in the ticket that it can be looked at and adjusted, rather than landing on the last day against a deadline. **Flagging the sequencing, not the scope.**

## Architecture (M1)

- **Nothing new-shaped.** Two nullable columns on an existing spine, one capture table with no foreign-key fan-out, one storage bucket, two event types in an existing constraint. **No new entity, no join table, no denormalization.**
- **The capture table is correctly not a category table.** It records what someone typed, keyed to who typed it and when. It has no unique constraint, no status column and no promotion flag — **promotion is a human editing a constant, which is exactly the shape the ratified Intent asks for.** A `status: pending/approved` column would quietly build the automatic path the decision refuses.
- **The category on the spine rather than a join is right for one value.** If a Page ever needs several, that is a join table and a new decision — not a comma-separated string in this column. **Recorded so the shortcut is not taken later.**
- **The geocoding module already exists and is already used by two surfaces.** This wires an existing dependency into a third; it introduces no new external service.

## Accessibility (M3) — carried to build

- **The category step is a radio group**, not a list of buttons: one accessible group name, arrow-key navigation between options, one tab stop for the whole set. Thirteen tappable divs is the failure mode here.
- **Choosing *Something else* reveals a text input** — the input must be focusable immediately and associated with its own label, and the reveal announced rather than silent.
- **The address field is a combobox with a listbox of suggestions.** Suggestions reachable by keyboard, the active option announced, and **the typed address usable without ever seeing the map thumbnail** — the map is confirmation for sighted users, never the only confirmation.
- **The map thumbnail is decorative** and needs a text equivalent beside it: the resolved address as text.
- **Image picker and default art** carry their own accessibility clauses in the design language; both are binding.
- **The refusal on an unresolvable address is an error message associated with the field**, announced, and not colour-alone.

## What the review changed about neighbouring work

Discharged here rather than left for the build to trip over:

- **The Item-photo scenario is deferred and its lane no longer matches its state.** It sits in the approved lane where build can read it. **Moved back to the draft lane with the deferral reason**, and the substrate it owned moves to this scenario.
- **The combined review covering three scenarios is now split**, which the gate check has been warning about since it was written. Each scenario now has a review in its own lane; the parent stays authoritative for the shared reasoning.
- **The editor scenario's boundary is written into both documents**, in the same words, so neither builds the other's half.

## For the PM — one question, not a blocker

**The composer is now six steps: name, address, category, photo, about, review.**

The launch requirement is that a producer signs up *with minimal fumbling*, and six steps is the most this flow has ever had. Three of them are new and all three earn their place — **but they earn it individually, and nobody has judged them as a set.**

**Options, in order of what I'd recommend:**

- **A. Ship six, cut after seeing it.** The steps are each trivial and the composer already saves between them. Judge it with a real Page in hand rather than in the abstract. *Recommended — this is the dogfood test's actual job.*
- **B. Fold category and photo into one step.** "What you do, and a picture." Saves a tap, crowds a small screen.
- **C. Move photo and about behind publish** — publish with name, address, category, then prompt to finish. Fastest path to a live Page; risks a wall of Pages with no photograph, which is the thing default art is compensating for.

**No ruling needed to start ticketing** — the first two tickets are substrate and neither depends on the step count.

## Addendum — neighbourhood mode, added 2026-09-07 before approval

**PM addition, folded into the scenario rather than sequenced after it, because it changes the same composer step the address work is rewiring.** Reviewed on the same pass; **verdict unchanged.**

### What already exists — more than expected

- **`places.kind` already includes `neighborhood`.** It has since the Places schema shipped.
- **Five Sacramento neighbourhoods are already seeded with polygons and derived centroids** — Land Park, Curtis Park, Oak Park, Midtown, East Sacramento — with a GiST index over the geometry. **Nothing needs seeding for the launch market.**
- **`locations.kind` already has `'area'`**, which is exactly this mode. No new column.
- **Place and metro both resolve geographically**, from a point, with no place id on the Location. **A scattered point therefore resolves its neighbourhood, city, county and metro through the path every other Page already uses.** No special case, no second code path.

**This is the cheapest possible version of the feature and it is cheap because of decisions already taken.** Worth naming: the polygon seed, the geographic place resolution and the `area` kind were each built for something else and all three land exactly where this needs them.

### One honest defect in the substrate

**The five neighbourhood polygons are hand-drawn rectangles**, not real boundaries — four corners each. The migration cites the city's open-data neighbourhoods layer as the source, and **the geometry does not match that claim**; the header records a full-resolution backfill as pending.

**Consequence:** a point scattered uniformly inside a rectangle can land in the river, in a freeway, or inside the next neighbourhood.

**Binding note 7: draw points toward the polygon interior, not uniformly across its bounding box.** Costs nothing, and it is the difference between "approximately in Midtown" and "in the American River." **Replacing the five rectangles with true boundaries is a separate half-day and is not required for launch** — recorded so it is a choice rather than an oversight.

**Binding note 8: correct the provenance comment or the geometry, not neither.** A source citation that does not describe what was stored is how a future reader trusts the wrong thing.

### The absolute I ratified this morning had to be amended

The geography Intent as first written said a Location *"either carries geocoded coordinates from the address given, or the step does not complete"* — which **would have forbidden neighbourhood mode outright.**

**Amended, and it is stronger for it:** what is refused is a *fabricated* coordinate — a default, a centroid, a placeholder, any code path that invents a location because none was given. **A Member declining to give a street address is not the platform guessing.** The refusal is about the platform's honesty, not about the Member's precision.

**Recording the near-miss:** an absolute written to close one failure was one hour away from blocking a feature that serves exactly the people the locality-versus-address separation exists to protect. **The State-tag discipline caught it because the Intent had to be read again to be cited.**

### Price

**1 to 1.5 days.** A deterministic point-in-polygon function with its tests (half a day); the second mode on the location step (half a day); address suppression on the public surface and its API responses (a few hours).

**Over a day, so it displaces something rather than being absorbed.**

**Recommendation: it displaces metro scoping.** Both are geography; only one is needed at launch density. Metro was already cut once this morning as *a second feed function against a different table, to filter a sixteen-item corpus*, and neighbourhood mode makes the place-tree path carry the launch market on its own. **Metro scoping returns when there is a second metro to distinguish** — its ticket is written and unbuilt, so nothing is lost by leaving it there.

## Second addendum — position as a precedence, added 2026-09-07

**PM addition: a Page resolves to its neighbourhood until it appears at a Venue, then takes that Venue's address for the duration.** Reviewed on the same pass; **verdict unchanged.**

### The sequencing question, answered plainly

**No dependency. F061 does not need appearances to exist.** The resolver ships with one rule and a branch that nothing yet satisfies.

**But the PM's read needs one correction, and it is the whole reason this had to land now rather than later.**

> *"The resolver ships with one rule at launch and gains the override when appearances land, with no rework."*

**True only if the resolver returns a list from day one.** A resolver that returns *a point* and later must return *two points* — a Page at two markets on the same morning — is a changed return type, and every caller changes with it. **That is rework, and it is exactly the kind that gets discovered at merge rather than named in advance.**

**Binding note 9: the resolver returns a list of pins, each labelled with its source, from the first commit.** At launch every list has one element. Adding the override then appends a branch instead of restructuring the contract.

### The finding that actually matters

**A resolved position cannot be materialized.** The browse index is a materialized view holding a stored point per row; the feed functions read it. **An appearance starting or ending changes a Page's position with no write to the Page** — so any precomputed point is stale from that moment, and no refresh trigger can be attached to an event that is a clock tick rather than a write.

**Resolution belongs in the query layer, beside the time filters already there.** The feed functions already evaluate `starts_at >= now()` at read time; this is the same shape and the same place.

**Binding note 10: no column, cache or view stores a Page's resolved position.** This is the single part of the design that is expensive to retrofit, and it is why the resolver lands in this stretch rather than with appearances.

### The three questions, answered

- **An appearance ending returns the pin automatically, with no cleanup.** It falls out of the time window, exactly as the PM read it — the same mechanism that drops a finished gathering. **If it needs a sweep job, it was built wrong**, and that is now an acceptance criterion rather than a hope.
- **Two overlapping appearances mean two pins, and the anchor is not one of them.** Two pins is consistent with the earlier ruling about a Page with items at two locations. **The refinement: precedence *replaces*, it does not *add*.** A Page at two markets shows at two markets, not at two markets and its neighbourhood — otherwise the anchor leaks back onto the map on the busiest day.
- **The Page states where it currently resolves to, to everyone, not only the owner.** It is already public by virtue of being on the map; showing it only to the owner would conceal it from nobody while pretending otherwise. **Nobody should be surprised by where they are pinned** — now a ratified Intent in `groups.md`.

### What this buys, stated once

**A real address is only ever shown for a place open to the public and belonging to whoever hosts it.** A Page's own address is never revealed by an appearance. **The food truck is at the market on Saturday and in its neighbourhood the rest of the week, and its home is not on the map on either day.**

### Price

**Half a day on top**, giving **1.5–2 days for the whole location piece** — the resolver as a list-returning read-time function with one rule, and the "where you are right now" line on the public surface. **The override itself costs nothing here; it lands with appearances.**

**Still displaces metro scoping and nothing further.** The addition is half a day and the stretch has that much slack; **if it turns out not to, the honest candidate is the composer resume fix**, which is an hour of annoyance rather than a wrong answer on a map.

## Third addendum — a placement is a point or an area, added 2026-09-07

**PM refinement, arriving after approval: a Page with nothing scheduled is an *area*, not a pin. The point appears only when there is an actual intention to meet.**

**Disposition: addendum, not re-approval.** Justified below rather than asserted.

### The miss this exposes in binding note 9, one hour old

**I wrote binding note 9 to stop exactly this class of problem and it only covered one axis.** It required the resolver to return a *list* so that "how many placements" could grow without changing the contract. **It did not require the placement itself to be typed, so "what kind of placement" was still hard-coded to a point.**

**Second contract change in one day, and the note written to prevent the first did not prevent the second.** The correction: **the resolver returns a list of placements, each carrying its source *and* whether it is a point or an area.**

**Cheap now because no code exists.** The lesson worth keeping: when a return type is designed for extension, the question is not *"can it hold more?"* but *"can it hold something different?"*

### Verified against the map before pricing

- **The map already uses a GeoJSON source**, so a polygon is the same data pipe as a point — no new source *type*.
- **But the source has clustering switched on, and Mapbox clustering operates on point features only.** Polygons in a clustered source do not render correctly. **Areas need their own unclustered source plus a fill layer and an outline layer.**
- **Pins are DOM markers, not a symbol layer.** So points and areas are already two unrelated render mechanisms. **The PM's read is right: this is new render work, not a variant of the existing marker.**

### Overlap is the normal case, and it forces the right design

**Five clubs in Midtown must not paint Midtown five times** — that is an opaque blob and a slower map.

**Render one polygon per neighbourhood, not one per Page**, carrying a count, with the Pages listed on tap. **Cheaper *and* more honest**: the map then says *"eleven things going on in Midtown"* rather than drawing eleven identical shapes on top of each other.

### It simplifies the create flow rather than complicating it

**For a Page with no fixed premises the location step asks only for a neighbourhood — no address field at all.** One question instead of two, and the question it drops is the one people hesitate over.

**This also takes some pressure off the six-step concern** below: the location step gets shorter for exactly the Pages most likely to abandon at it.

### The split, and why F061 stays approved

| Half | Where it goes |
|---|---|
| **The model** — a placement is a point or an area; the resolver returns typed placements; the location step branches on whether the Page has premises | **F061, by this addendum.** It changes acceptance criteria without changing the scenario's shape, and it is the half the substrate tickets depend on. |
| **The render** — an unclustered polygon source, fill and outline layers, per-neighbourhood aggregation, tap behaviour | **Not F061.** The scenario's boundaries already say it does not build the map. **A new scenario in the draft lane**, sequenced with the browse work. |

**Re-approval would be the wrong call here** — it would return a scenario to the draft lane, where the build agent cannot read it, in order to record a change that makes its acceptance criteria more precise rather than different in kind. **The pipeline's own test is whether the review's verdict changes. It does not.**

### Price

- **Model half: +0.5 day**, giving **2–2.5 days for the whole location piece.** Partly offset by the create flow getting shorter, not longer.
- **Render half: 1–1.5 days**, and it belongs to the map work. **The displacement question belongs there too, not here** — this addendum spends half a day, which the stretch still holds.
- **Fold the model, route the render.** They are separable and only one is on the critical path.

## Fourth addendum — appearances cannot overlap, 2026-09-07

**PM ruling: a Page cannot be in two places at once. Overlapping appearances are refused at creation. Sequential appearances on the same day are ordinary.**

### Binding note 9 stands — for a narrower and better reason

**Checked before answering, because a note that no longer earns its keep should go.**

**It earns its keep. One case still produces two placements, and it is the one the PM named: a Page with premises that also appears somewhere.**

**A truck whose anchor is a neighbourhood is at the market and not in its neighbourhood — it moved. A bakery with a shop is at its shop *and* at the market — the shop did not go anywhere.** Removing the bakery from the map on a Saturday would send people to a door that is open.

**So: an appearance replaces an area; it adds to an address.** Maximum two placements — the Page's own address if it has one, plus at most one active appearance. **The list stands, bounded at two instead of unbounded.**

### And it corrects something I wrote in the second addendum

I stated **"precedence replaces, it does not add"** as a flat rule. **That is right for an area anchor and wrong for an address anchor**, and I did not distinguish them because at the time placements were not yet typed. **The typing introduced in addendum 3 is what makes the distinction expressible** — the rule is not *replace*, it is *replace an area, add to an address*.

**Third correction to this contract in one day, and each one narrowed it rather than widening it.** Worth noting the pattern: the model has been getting more precise, not more elaborate.

### Is "precedence replaces" now obvious enough to drop?

**No — it goes from subtle to conditional, which is worse.** It needs the one line above stated explicitly wherever the resolver is described, because the intuition cuts the wrong way: *"an appearance is where you are now"* suggests replacement in both cases, and for a shop that is wrong.

### Where the rule is enforced — both, and the constraint is the point

- **A database exclusion constraint is the real enforcement**: same Page, overlapping time ranges, refused. This needs `btree_gist`, which is **not currently enabled** — the schema has only `vector` and `postgis`. One line in a migration.
- **The constraint is only cheap if appearances carry a proper time range.** Today's item-level attachment stores schedule detail in loose JSON, which cannot be excluded against. **This is a design constraint on the appearances work, recorded now: appearance rows carry a range column, or the rule cannot be enforced in the database at all.**
- **The handler checks first, for the message.** A constraint violation is a correct refusal and an unreadable one.

### The message names the conflict

Not *"that overlaps"* — **"You're already at Oak Park Farmers Market on Saturday 14 March, 9am to 1pm."** The person needs to know what they have to move, and they will not remember. **Refusing without naming the conflict makes someone go hunting through their own listings.**

### Does it disturb anything in flight?

**No. Purely forward-looking.** Checked every open ticket: nothing appearance-shaped or resolver-shaped is ticketed. The nine tickets that match the word *appearance* all use it visually — *"one line in DEVIATIONS about appearance"* — and the resolver matches are URL resolvers, a different thing entirely.

**The ruling lands ahead of the work, which is where a ruling should land.**

## Verdict

**PROCEED**, unchanged. Eleven binding notes, note 9 reaffirmed on narrower grounds. No open EXTEND. **F061 remains approved and readable.**
