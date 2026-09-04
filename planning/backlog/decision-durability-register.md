---
purpose: Proposal — how a reader tells a binding commitment from this version's answer. Tests the constitutional/versioned framing, substitutes a sharper cut, names the one-line mechanism, and sorts 2026-09-03's decisions as the test of whether it works.
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

## 8. What ratifying this costs

**To adopt:** three sentences replacing the *"implicitly carries reversibility"* paragraph in `DECISION-PATTERNS.md` § Architect for reversibility, and one line added to checklist 1 in `process-checklists.md`.

Proposed replacement text:

> Every decision carries one line: `Overturned by: evidence — <the observation that would change this>` or `Overturned by: memo — reverses <commitment>, <doc> § <section>`. Evidence is the default; naming the falsifier is the work, and failing to name one is the signal that the statement is a commitment rather than a bet. A State-tagged `Intent (Ratified …)` line is reserved for the memo shape — a bet does not get one, and a commitment cannot be reversed except by a memo that strikes its State tag in place and lists every decision citing it.

**Ongoing cost:** one line per decision. No new directory, no tiers, no promotion process, no migration.

**One-time backfill, optional and worth doing:** `decision-surfaces.md` keeps 4 State-tagged Intents and loses 18. That single edit restores the census to something a reader can trust, and it is the cheapest way to test whether the scheme changes how the doc reads.

**Three commitment sentences to author on ratification** — the Online-warning honesty commitment and the coarse-location commitment into `policy.md`, and the no-scarce-namespace commitment into `people-first.md`. The fourth extends an existing Intent in `item.md` rather than adding one.
