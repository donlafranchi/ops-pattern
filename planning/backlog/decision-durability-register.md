---
purpose: Proposal — how a reader tells a binding commitment from this version's answer, how the doc set stays bounded without shredding provenance, and what gets re-derived at a version boundary. Sorts 2026-09-03's decisions as the test.
layer: how
status: backlog
---

# Decision: telling binding commitments from this version's answers

**Awaiting `weigh`.** Nothing below is ratified. The mechanism is one line per decision; the amendment it needs is three sentences in `DECISION-PATTERNS.md`.

---

## 1. The framing, tested

> *If we changed this, would we be building a different product, or the same product differently?*

**Right about the number of buckets. Wrong about the axis.** That test measures **magnitude** — how much would have to be rebuilt — and magnitude does not track how binding a statement is. Two cases from 2026-09-03 break it in opposite directions:

- **Retiring Explore and going to two tabs** is a large change. It reverses two shipped tickets, relocates a third, and rewrites a surface. By the magnitude test it reads constitutional. It is not remotely binding — it is a bet about where people look for search, and the right kind of evidence would reverse it next month.
- **"A Member choosing Online is told, at the moment they choose it, that Online Items rank last."** One line of composer copy. By the magnitude test it is trivia. It is the most binding thing decided all day: it is what separates a ranking rule from a dark pattern, and no amount of engagement data should be allowed to remove it.

Magnitude and bindingness come apart, and they come apart hardest on exactly the cheap-but-load-bearing commitments most worth protecting.

**The cut that holds is what kind of argument overturns it.**

> *Name the observation that would make us change this. If you can name one, it is a bet. If the only thing that would change it is deciding to be a different kind of company, it is a commitment.*

Run it on the PM's own two examples and it agrees: the 44px nav falls to a thumb-reach study; "business identity is local" does not fall to any observation, because what a global namespace would cost — verification, dormancy adjudication, claim caps — is machinery `groups.md` already refuses on principle. Run it on the two cases that broke the magnitude test and it separates them correctly.

Two further notes on the framing:

- **"Version-level" is a red herring.** What ships in b1 versus b2 is already tracked by bundles and `bundle-1-themes.md`. Durability is not scope. A commitment can be b1-only in scope; a bet can span every version. Do not build a second scope tracker.
- **A third tier is not needed and would not be used.** Every decision is either falsifiable by observation or not. Nothing on 2026-09-03 sat between.

## 2. The structure already exists — and the marker is inflated, not missing

Checked before proposing anything new, per the PM's instruction. Three findings.

**Finding 1 — `product/foundation/` is not underused, it is unreferenced.** Nine active docs, every one `layer: why`, every one carrying an `owns:` list of named concepts (`member-flourishing`, `the-decision-test`, `three-filter-test`, `opt-out-default`, `accountable-participation-commitment`, `no-business-entity`, …). Outside `playbooks/` and two archived files, almost nothing in `planning/` cites them. The register is built and stocked. Nothing points at it.

**Finding 2 — the durability marker already exists.** A State-tagged `Intent (Ratified YYYY-MM-DD)` line is the repo's marker for *this statement is load-bearing and was earned*. `DECISION-PATTERNS.md` § How to spot an unearned absolute defines it precisely, and `CLAUDE.md` rebuild rule 10 makes it mandatory on absolutes. It is the right marker.

**Finding 3 — it is over-applied, and 2026-09-03 is where that happened.** Census:

```
planning/backlog/decision-surfaces.md          22
product/systems/groups.md                       6
product/systems/member.md                       4
product/systems/business-jurisdiction.md        4
product/systems/discovery.md                    3
…everything else                                ≤2 each
```

**One day's decision doc carries more State-tagged Intents than the entire rest of the live repo combined.** Every call in it got one — the two-tab nav, the word "hood," the metro switcher, alongside the Online warning and the copy-not-reference rule. That is the inflation the PM described, and it is measurable rather than a matter of feel. When everything carries the marker for "binding," the marker stops carrying information, which is precisely how the stale 52px line and the false "Home queries dead tables" line survived being read.

The fault is not that the marker is missing. It is that nothing asks the author to *earn* it, so the honest instinct — record the reasoning behind every call — spends it on everything.

**A near miss worth noting.** Six of the 22 Intents end with a reversibility clause of their own: *"Reversible at the price of a copy sweep."* *"Reversible in both directions."* The instinct is already there, in prose, unqueryable, and absent from the entries where it matters most. `DECISION-PATTERNS.md` even asks for it — *"the Intent paragraph **implicitly** carries reversibility"* — and the word doing the damage is *implicitly*.

## 3. The mechanism — one line, two shapes

Every decision, and every entry in `PLATFORM-PATTERNS.md` / `DEVELOPMENT-PATTERNS.md`, carries one line:

```
Overturned by: evidence — <the observation that would make us change this>
Overturned by: memo — reverses <commitment>, <doc> § <section>
```

That is the whole scheme. Three rules follow from it:

1. **`evidence` is the default and the expected majority.** Writing the falsifier is the work — it takes one sentence and it is where a bet gets caught pretending to be a principle. If no observation can be named, that is the signal the statement is a commitment.
2. **A State-tagged `Intent` line is reserved for the `memo` shape.** Evidence-shape decisions keep their rationale in prose; they do not get the tag. This is the only behaviour change, and it makes `grep -rn "Intent (Ratified"` an accurate census of what is binding. Today it is not.
3. **A `memo` line must name a commitment that already exists** — in a `layer: why` doc's `owns:` list, or as a State-tagged Intent in the owning system spec. If it does not exist, write it (two to four sentences, in the owning doc) as part of ratifying. That authoring step is the explicit act on the way in, and it is rare: most decisions serve a commitment already written.

**Naming note.** Not `Serves:` — tickets already use that word for the Loop / canonical-example / primitive-shape block, and reusing it would collide.

## 4. Where each kind lives

**Nothing moves.** No new directory, no promotion process, no migration.

| | Lives in | Marked by |
|---|---|---|
| **Commitments** | `product/foundation/` (`layer: why`, named in `owns:`), plus State-tagged Intents in the owning system spec for system-local commitments | a State-tagged `Intent (Ratified …)` line |
| **Bets** | wherever they already live — `planning/backlog/decision-*.md`, the pattern docs, system spec bodies | an `Overturned by: evidence` line, no Intent tag |

Commitments that belong to one system stay in that system's spec — the provenance prohibition in `item.md`, the no-address-store commitment in `location.md`. Forcing them into `foundation/` would be a migration project with no reader benefit. What makes something constitutional is the State tag plus the memo requirement, not the directory.

## 5. How a commitment gets overturned

**A bet** is superseded by a new decision that marks the old one in place — existing practice, and `decision-surfaces.md` did it correctly on 2026-09-03 when the three-tab model retired.

**A commitment requires a memo** in `playbooks/memos/` — the machine already exists (26 memos, live, numbered). Three requirements make it an act rather than a drift:

- The memo names the commitment and the doc that owns it.
- The memo lists every decision whose line reads `Overturned by: memo — reverses <this commitment>`. One grep; those are the decisions that lose their footing the moment the commitment does.
- The commitment's State tag is struck **in place**, in the owning doc, in the same commit.

A commitment cannot be reversed by a decision doc, a ticket, or an edit in passing. That is the asymmetry the PM asked for, and it costs nothing except that the reversal has to be written down as a reversal.

## 6. How patterns fit

**Same split, same line, no separate scheme.** A pattern entry gains `Overturned by:` as a fourth field beside Decision / Intent / Touches.

The PM's examples point at a *different axis* that is already handled and should not be re-mechanised:

- **Scope** — does this govern everything or one surface? The design language governs every surface; Explore's filter sheet governs one. That is already encoded by **where the doc sits**: a cross-cutting spec in `product/ui/` versus a scenario in a planning lane. It needs no marker.
- **Durability** is orthogonal to scope, and this is the useful part: **`design-language.md` is global in scope and entirely bets in durability.** All nine of its principles are falsifiable by observation, "no tinted backgrounds" included. It reads constitutional because it is old and applies everywhere — not because anything binding is at stake.

That resolves checklist 5's last item from a standoff into a decision. The PM's image placeholder against the DLS is bet versus bet: one held for a year, one formed this week, neither binding. It gets settled on the merits by whoever is deciding, and the settlement is a pattern-doc edit rather than a memo. Had the DLS line been a commitment, the answer would have been the opposite and automatic.

Expect `DEVELOPMENT-PATTERNS.md` to come out almost entirely `evidence`. How we build is falsifiable throughout. A development pattern claiming `memo` deserves a second look.

**Tested against what happened next, 2026-09-04.** The DLS conflict did get settled as this section predicts — as a decision (T118, the Item card always renders a media block), not as a memo, and the DLS was edited rather than defended. Two of the three new `Intent (Ratified 2026-09-04)` lines it landed in `design-language.md` end with their own reversibility clause — *"Reversible in principle… a Principle 1 question rather than a card question"* and *"Reversible — a fixed-width variant would be a new recipe alongside this one."* By the test in § 1 those are bets, and under the mechanism in § 3 they would carry `Overturned by: evidence` and **no** State tag. The author's instinct wrote the falsifier unprompted; only the marker failed to discriminate. That is the inflation reproducing itself one day later, in a doc that had two tags and now has three — and it is the cheapest possible confirmation that the fix belongs on the marker rather than anywhere else.

## 7. Today's decisions, sorted

The real test. 24 decisions from 2026-09-03, sorted; the ambiguous ones are named as ambiguous rather than filed quietly.

### Commitments — `Overturned by: memo` (4)

| Decision | Commitment it encodes | Where the commitment goes |
|---|---|---|
| A Member choosing **Online is warned at the moment of the choice** that Online ranks last; Online Items get **no map pin at all** | *When the platform imposes a cost on a Member, it says so at the point of the choice; and it does not render a claim it knows to be false.* Both halves are one commitment — the doc's own words are that a fallback pin "would be a lie rendered in the most literal surface the platform has" | **new** → `policy.md` (`owns:` gains it; sits beside the three-filter test) |
| **Neighborhood-level entry is the privacy mechanism, and the coarse option is not optional** | *A Member can participate at a grain coarse enough that participating costs them nothing.* Remove it and the entire at-my-house class of neighborly exchange disappears | **new** → `policy.md`; strengthens the existing b1 no-address-store commitment in `location.md` / `member.md` rather than duplicating it |
| **The hood is copied onto the Item at creation; the Item owns it. Editing or removing a profile hood never moves an existing Item** | *A Member's record of what they did is theirs and does not silently change when their profile does.* | **exists** → `item.md` § Provenance claims already carries a State-tagged Intent of this shape (Ratified 2026-05-23); extend it, do not write a second |
| **Feed ranking never excludes** — proximity drives order, not presence | *The platform does not make a Member invisible for a data gap.* The ranking bands themselves are a bet (see below); this half is not | **new** → `discovery.md`, beside the existing feed Intent |

### Bets — `Overturned by: evidence` (17)

Grouped; each would fall to a nameable observation.

**Surface architecture** — falls to: Members cannot find search, or create rates drop.
1. Two tabs plus a persistent create action; Explore retired and absorbed into Home.
2. Create is first class — a `+` in the nav, never nested. *(Closest of the bets to a commitment; see § ambiguous.)*
3. TikTok-style category top slider in Home at b2.
4. Bottom nav at 44px. *(Ratified 09-02, still in play.)*

**Location model** — falls to: Members ask "how far?" and the map handoff does not serve them; or metro-scoped feeds run empty at launch density.

5. Distance removed from the product; hierarchy is the only proximity concept; the address hands off to a map app.
6. Distance-band ranking, nearest first, Online last. *(The band mechanism only — "nothing excluded" is the commitment above.)*
7. Geocode once at entry into a stored hierarchy rather than resolving on read.
8. Metro is the feed's vantage point; hoods union within a metro.
9. The browse switcher becomes a metro switcher.
10. Metros are core-plus-ring and mostly non-overlapping; straddling accepted in dense corridors.
11. Picking a metro is an intentional act, not an ambient one. *(See § ambiguous.)*
12. Location is entered at creation, three choices, Member's call. *(The entry mechanism; the coarse option is the commitment above.)*
13. Online is one of the three choices. *(The option; the warning is the commitment above.)*
14. A Member keeps a plural set of saved hoods that pre-fills creation.
15. A Member picks a hood and a metro at signup.

**Identity and voice** — falls to: same-name collisions confuse Members inside one metro; or "hood" tests badly in a launch market.

16. Business names scope to a hood or metro; no global namespace, no platform handle. *(The mechanism. See the split below.)*
17. The user-facing word is "hood." *(Explicitly copy-only; the doc already says internal identifiers must not chase it.)*

**Process** — falls to: the gate costs more than it catches.

18. No platform-generated QR codes.
19. Push to origin after every merge; a push to main deploys.
20. Preview deployments deferred; screenshots stand in.
21. The five process checklists, this scheme included.

*(21 numbered above plus the 4 commitments is 25 line items across 24 decisions — "business identity is local" and "Online" each split, and the split is the point.)*

### The one decision that splits, and why it is the best evidence for the scheme

**"Business identity is local."** The PM called this near-constitutional. Half of it is:

- **Commitment:** *no globally scarce namespace — nothing the platform could auction and nothing a squatter can hoard.* Not falsifiable by observation. It is the anti-extraction stance applied to names, and reversing it means accepting the verification / dormancy-adjudication / claim-cap machinery that `groups.md` refuses. → belongs in `people-first.md`, whose existing `owns:` covers exactly this territory.
- **Bet:** *scoping names to a hood or a metro is how we get there.* Fully falsifiable — two "Joe's Pizza" cards in one Sacramento feed with no disambiguator is the observation, and the doc already lists it as open question 1.

Written as one sentence, the mechanism inherits the commitment's weight and becomes unrevisable, or the commitment inherits the mechanism's revisability and quietly erodes. Split, the hood-scoping can be replaced next month by a better mechanism without anyone having to relitigate whether the platform sells names. **This split is the scheme's whole payoff, and it is invisible without the line.**

### Genuinely ambiguous (2 of 24)

- **"Create is first class."** The stated Intent is *"the platform's whole thesis is that Members declare things"* — which is `primitives.md`, a commitment. But the decision is about **nav placement**, and nav placement is falsifiable. Reading: bet, serving a commitment nobody proposes to reverse. If it were binding, no nav redesign could ever move the `+`, which is not what anyone means.
- **"Picking a metro is an intentional act, not an ambient one."** Sits next to a genuine commitment — `discovery.md`'s refusal of a stored behavioural graph, and the "inferring hoods from behaviour" flag that explicitly defers to `weigh` and `policy.md`. But the decision as written is about *when the platform asks*, not about *what it stores*. Reading: bet. The commitment underneath is already written and already binding, which is why the flag correctly stopped rather than deciding.

**Two ambiguous out of twenty-four, and both resolve on one reading.** That clears the PM's bar. The three splits are not ambiguity — they are the scheme finding seams that a single sentence was hiding.

## 8. Bounding the set — what a length limit does and does not fix

### The honest answer first: a limit does not fix drift

The two failures that motivate this — a scenario saying 52px beside a ratified 44px, a ticket claiming Home queried dead tables months after it stopped — are **contradiction** failures, not **volume** failures. A 200-word doc holds a stale 52px perfectly well. Trimming to a cap does not reconcile anything; it selects something to remove, and nothing about a length rule makes the removed thing the wrong one.

The pressure a cap creates points the wrong way twice. Under a word budget the cheapest cut is the **newest** material (least attached to) and the **longest** material (the reasoning). That is precisely the provenance the PM wants protected — the QR alternative, the hashtag handle, creator-inheritance — recorded on 2026-09-03 specifically so the rejected option survives with the reason it lost.

**Checklist 1 does the real work.** Its first item — *name what already ships that this contradicts* — and its supersession-in-place item are what force reconciliation, and they do it at **write time**, when the author knows which version is right. A cap acts at maintenance time, applied by someone who does not. **The limit is secondary and should be sized and framed as secondary.**

### What a bound does fix, and it is worth having

**Accumulation without contradiction.** Nothing in checklist 1 stopped `decision-surfaces.md` from reaching 528 lines and 22 State-tagged Intents in one day, because none of those 22 contradicted each other. Nothing stops `product/systems/` from its current 80,000 words across 13 docs.

That harm is second-order and real: **sprawl degrades the contradiction check itself.** The grep in checklist 1 returns more hits, the reader skims further, and the reconciliation that was supposed to be forced gets eyeballed instead. The bound's job is to keep checklist 1 effective, not to replace it.

### Not per-document words, not per-tier totals

- **Per-document word caps** are wrong because natural size varies more than tenfold for good reasons — `standards/` is 496 words *in total*; `item.md` is a primitive spec. One number governing both is either meaningless or destructive.
- **Per-tier word budgets** are worse: they create cross-document horse-trading, where trimming one spec buys room in another. That converts a local editing decision into a negotiation, which is how the rule stops being followed.

**Bound the working set a reader has to hold** — and the durability scheme above already produces the right countable.

### Rule 1 — the census cap

> **No document carries more than 7 State-tagged `Intent (Ratified …)` lines of its own.** Landing an 8th forces a demotion: either the weakest becomes a bet (drop the tag, keep the prose) or it relocates to the doc that actually owns it.

Enforced by `grep -c "Intent (Ratified" <file>` — count the tags the doc *owns*, not citations of other docs' tags.

**Why 7, and not a round number.** It is the observed ceiling of a healthy doc plus one. `groups.md` carries 6 — the platform's most-contested primitive, six kinds, the consolidation decision, the lifecycle refusal. The rule is therefore *no document may be more decided than the most-decided system spec*. Live census against that bar:

```
decision-surfaces.md                22   ← the only violation, by 3x
groups.md                            6
member.md / business-jurisdiction    4
design-language.md / discovery.md    3
…everything else                    ≤2
```

**One violation in the entire live tree.** That is the shape a good rule has: invisible on well-run docs, unmissable on the one that sprawled. It costs one grep, folded into checklist 1's existing Intent step — no new gate.

### Rule 2 — the drain rule, which is the PM's rule in its correct form

The deeper defect in `decision-surfaces.md` is not its length. It is that the file is `status: ratified`, sits in `planning/backlog/`, and is still the **load-bearing copy** of 22 decisions — in a lane `build` is firewalled from reading. Twenty-two ratified decisions are stranded where nothing downstream can act on them.

> **A `decision-*.md` marked `status: ratified` is drained within one working session.** Each commitment moves to its owning spec; each bet moves to a pattern-doc entry or a scenario; the file compacts to a ledger and archives with its parent work.

**"New info forces old info out" is right, and the direction is down the pipeline — not into the bin.** Nothing is deleted. The durable statements move to where they are read; the file that carried them shrinks to a record of what happened.

**The compaction format already exists in this repo and was approved yesterday.** `playbooks/process-checklists.md` § *Considered and cut — do not re-derive* is eight lines standing in for two full amendment sections, and each entry carries three things:

1. what was rejected,
2. why it lost,
3. **the observation that would justify revisiting it.**

That is the template. Generalized, a drained decision doc becomes one line per decision — *what was decided · what it replaced · `Overturned by:` · where it now lives* — plus one line per rejected alternative in the § Considered and cut shape. **Cap the compacted ledger at 40 lines.** QR, the hashtag handle, and creator-inheritance each keep their line and their reason; the full argument stays in git history, reachable from the pointer. Provenance is preserved by *pointing*, not by *retaining*.

**Where it bites, and that is the versioned tier — correct.** Foundation docs are never drained; they are the destination. Rule 2 applies only to `planning/` decision docs, which is exactly where the PM said the constraint should be sharpest.

### What this costs, honestly

- **Rule 1: free.** One grep inside a checklist step that already exists.
- **Rule 2: about an hour per ratified decision doc, and it is not new work.** Draining `decision-surfaces.md` is the distribution step the pipeline already owed — those 22 decisions have to reach specs and scenarios before anything can be built from them. Calling it overhead misreads it: it is deferred delivery, and the interest on it is that `build` currently cannot see a single decision made on 2026-09-03.
- **The real risk is Rule 2 being skipped when busy**, which is how compaction rules usually die. Mitigation is the cheapest one available: a drift-check row in `orient` — `grep -l "status: ratified" planning/backlog/decision-*.md`, non-empty is a flag, not a gate. `orient` already runs at session start and already flags without blocking. **Two files are flagged today.**

**Do not add a third rule.** Two is what gets followed.

## 9. The version boundary — what actually gets re-derived

The stronger claim: the global project set should be *genuinely different* from the current version set, with a deliberate rethink at each version boundary rather than inheritance by default.

### What is not practical, said plainly

**Rebuilding the versioned tier from scratch against the constitution at each boundary is not practical and should not be proposed.** It means re-deriving 80,000 words of system specs from `principles.md`. Nobody performs that twice; it gets abandoned mid-pass, leaving a half-rebuilt set that is strictly worse than an inherited one. And most of it *should* be inherited — the Item spine does not get re-derived because b1 shipped. Re-derivation for its own sake is how a doc set acquires a second contradictory layer, which is the failure this whole thread is about.

### What is practical, and it is the step that would have caught today

The re-derivation worth performing is over the **bets**, not the specs — and the durability scheme hands you the agenda for free. Every `Overturned by: evidence` line names the observation that would change it. That is not documentation; it is a checklist with the questions pre-written.

> **The bet review.** At each version boundary, walk the entries in force in `PLATFORM-PATTERNS.md` and `DEVELOPMENT-PATTERNS.md` — **33 today**, 17 and 16 — and ask one question of each: *you said X would change this. Did X happen?*
>
> Three outcomes, one line each: **reaffirm** (re-date it), **revise** (edit the entry), **retire** (pull it, with a line in the version's release record saying what replaced it).

Thirty-three yes/no questions against a written falsifier is one session. That is the whole difference between a re-derivation someone performs and one someone intends to.

**The tell worth watching for.** A bet that survives two consecutive boundaries without its falsifier ever having been *checkable* is mis-filed. Either the observation was written unobservably — rewrite it — or the statement is a commitment wearing a bet's clothes, and it should be promoted with a proper commitment sentence in a `layer: why` doc. That single rule keeps the register honest in both directions: the census cap stops commitments inflating, the two-boundary tell stops them hiding.

**It plugs into machinery that already exists.** `CLAUDE.md` already specifies shipped-version cuts — `{owning-dir}/archive/vN-{slug}/RELEASE.md` plus one line in `planning/RELEASES.md`. The bet review's output is a section of that RELEASE.md. No new artifact.

### Does this deliver "genuinely different sets"? Partly — and here is the precise version

After a bet review, `product/foundation/` is **unchanged**, by design, and the pattern docs carry a fresh per-entry verdict and date. The two tiers become visibly different in the one way that matters to a reader:

> **Constitutional dates move only by memo. Versioned dates move at every boundary.**

A reader hitting a statement dated three versions ago in a pattern doc knows something is wrong — it should have been reaffirmed or retired. A reader hitting a foundation commitment dated 2026-05 knows nothing is wrong; that is what a commitment looks like. **The date becomes the signal**, and it is generated by a step someone actually performs rather than asserted by a filing convention.

What the PM cannot have is a from-scratch re-derivation. What he gets instead is a versioned tier where nothing stays in force without being re-affirmed against a written falsifier — which is the same guarantee, obtained at a cost someone will pay twice.

## 10. What ratifying this costs

**To adopt:** three sentences replacing the *"implicitly carries reversibility"* paragraph in `DECISION-PATTERNS.md` § Architect for reversibility, and one line added to checklist 1 in `process-checklists.md`.

Proposed replacement text:

> Every decision carries one line: `Overturned by: evidence — <the observation that would change this>` or `Overturned by: memo — reverses <commitment>, <doc> § <section>`. Evidence is the default; naming the falsifier is the work, and failing to name one is the signal that the statement is a commitment rather than a bet. A State-tagged `Intent (Ratified …)` line is reserved for the memo shape — a bet does not get one, and a commitment cannot be reversed except by a memo that strikes its State tag in place and lists every decision citing it.

**Ongoing cost:** one line per decision, one grep at ratify time, and a drain session per ratified decision doc (§ 8). No new directory, no tiers, no promotion process, no migration.

**One-time backfill, optional and worth doing:** `decision-surfaces.md` keeps 4 State-tagged Intents and loses 18. That single edit restores the census to something a reader can trust, and it is the cheapest way to test whether the scheme changes how the doc reads.

**One `orient` drift row** — `grep -l "status: ratified" planning/backlog/decision-*.md`, non-empty is a flag. Two files today.

**Three commitment sentences to author on ratification** — the Online-warning honesty commitment and the coarse-location commitment into `policy.md`, and the no-scarce-namespace commitment into `people-first.md`. The fourth extends an existing Intent in `item.md` rather than adding one.
