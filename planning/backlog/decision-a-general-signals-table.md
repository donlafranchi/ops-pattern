---
purpose: Proposal — should there be one general signals table? Straight answer on whether the event log already does this, and a recommendation of two tables rather than one or five.
layer: how
status: awaiting-ruling
---

# Proposal — a general signals table

**Timeboxed to two hours, 2026-09-07. A proposal, not a build.** We are a day into a build stretch and this does not become an architecture project.

## Does the event log already do this? No.

**Straight answer, and the reasons are structural rather than stylistic.**

There are **five** event tables — items, groups, members, locations, places — each with a foreign key to its own entity, a closed `event_kind` CHECK enumerating that entity's verbs, an acting member, a jsonb payload, and monthly partitions.

**Four reasons they cannot serve as the signals store:**

1. **Two of the four subject types have no event table to hang off.** A signal about *a category that doesn't exist yet* and a signal about *an unbuilt feature* have no entity. There is no `category_events`, and there never should be — **you cannot write an audit row about a thing that has no row.**
2. **An event log cannot express uniqueness.** *One signal per person* is a constraint on current state. **An append-only log deliberately has no current state** — that is what makes it an audit trail. Enforcing "only one" inside it is fighting its purpose.
3. **Monthly partitions are the wrong shape for the question.** *"What have people asked for, ranked"* scans every partition ever written. Events are optimised for *"what happened to this entity"*, which is a partition-pruned, FK-indexed lookup. Opposite access pattern.
4. **Each `event_kind` is a closed enum per entity.** A new signal kind becomes a migration on a CHECK constraint — and migrations here are applied to production by hand.

**The clean way to say it: the event log records *that an act occurred*. A signal is *a want that persists*.** Different lifetime, different uniqueness, different query. A view over events could answer *who tapped*; it could not answer *is this still true* and could not stop double-counting.

**And the drift risk the question rightly raises cuts the other way:** signals still emit their event rows. **The event log stays the audit; the signals table is the state.** That is the same row-plus-event invariant every other write here follows — not a second write path for the same fact.

## Is one table right for all five? No — two.

### The two that genuinely are one thing

**The category *Other* capture and the feature-interest tap are the same record wearing two hats.** Both are: *a person, a thing that does not exist as a row, a moment, and one per person.*

**Merge them.** Proposed `demand_signals`:

| Column | Note |
|---|---|
| `member_id` | who |
| `subject_kind` | `'category'` or `'feature'` — extend by adding a value, not a table |
| `subject_key` | **text, deliberately not a foreign key.** The subject does not exist; that is the entire point |
| `subject_text` | nullable — the member's own words, when they typed some |
| `created_at` | when |
| unique | `(member_id, subject_kind, subject_key)` |

**This is the unification worth doing, and it is worth doing precisely because the subject is not an entity.** A text key is honest here rather than lossy — there is nothing to point at.

**It also simplifies work already scoped:** the feature-signal ticket and the category-suggestion capture become **one table instead of two**, in one migration. **Still half a day.**

### The three that are not

- **RSVP and interest** are a relationship to a row that exists. **Use the foreign key.** It cascades, it joins, and the count is a page-level read on a hot path.
- **Follows** are a subscription that drives a feed and defines a broadcast audience. Hot path on every feed read.
- **Saves** are a private bookmark — different visibility model entirely.

## The risk, named honestly

**A general signals table is the abstraction that feels right and then answers no specific question well.** Where it would be worse than purpose-built tables:

- **A polymorphic `subject_id` with no foreign key loses referential integrity.** Nothing stops it pointing at a deleted Item or at nothing at all. **No cascade delete, so orphans accumulate silently** — and orphaned signal rows inflate exactly the counts the table exists to produce.
- **The queries diverge immediately and want different indexes.** *"How many people are coming to this gathering"* wants `(subject, kind)`. *"What categories are people asking for"* wants text aggregation over a normalised column. *"Who follows this Page"* is on the hot path of every feed read. **One table serves none of them well and needs an index per access pattern, which is the cost the single table was supposed to avoid.**
- **A shared table means a shared CHECK vocabulary**, so every new signal kind is a migration touching a constraint that RSVP also depends on. **Coupling the roadmap-tap surface to the gathering page's write path is a bad trade.**

**The general version earns its place only where the subject genuinely has no row.** That is two cases, and it is the proposal above.

## One finding this exposed, worth its own look

**"Following" is already three substrates wearing one hat**, stitched together by one reader whose own comment says its job is to stop the distinction leaking into divergent queries:

- **People** → the follows table.
- **Pages** → a *group membership* row with `source='explicit'`.
- **Venues** → a *saved search* with a location set.

**So following a Page is not a follow — it is a membership.** That is real fragmentation of one concept, and **the ruling that you follow Pages and not listings is an opportunity to simplify it rather than a change that adds to it** — it removes the fourth case before it is built.

**Not scoped here.** Merging follows touches three shipped surfaces and belongs in its own pass, after launch. **Recorded so it is a known shape rather than a surprise.**

## Recommendation

1. **Build `demand_signals`** — the two non-entity cases, one table, half a day, folded into the migration already going out.
2. **Leave RSVP, follows and saves on their own substrates.** Purpose-built is correct where the subject is a row.
3. **Log the follows fragmentation as a post-launch simplification**, not a launch change.
4. **Do not build a general polymorphic signals table.** It would cost more than the three tables it replaces and answer every question worse.
