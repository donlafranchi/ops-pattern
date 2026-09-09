# DECISIONS.md

One dated line per ruling, newest first. Append only — never edit a past line; a reversal is a new line that says what it replaces. Merges the former `planning/DECISIONS.md` (launch-tier log) and `product/foundation/decisions.md` (foundation set), plus the standing decisions from `playbooks/PLATFORM-PATTERNS.md` and `playbooks/DEVELOPMENT-PATTERNS.md`. Those four files are retired; this is the one home.

## Product & platform

- **2026-09-10 — Bottom-anchored controls vs. the shipped top-anchored search row: resolved by what shipped.** The top-anchored row (`design-research-thesis.md`, now deleted) stays as a stated, accepted violation for one release (F059); it reverts when the browse-chrome rework lands. Not a standing exception to the bottom-anchor rule.
- **2026-09-10 — Page-view counts to the owner (F068) will eventually show first names/nicknames, not stay counts-only forever.** Ships counts-only at launch; naming is a later increment on the same capture, using the existing free-text `display_name` field — no new column.
- **2026-09-10 — A member outside every seeded metro (F049) picks their metro from a short list of nearby candidates, rather than a coarse rural fallback or a silent null.** E.g. a Truckee resident sees both Reno and Sacramento and picks. Exact selection mechanism (ZIP-distance, state filter, map) is unresolved — decide at ticket time. Rules out: seeding coarser rural metro polygons, and defaulting a rural member to a null or city/county-only vantage point.
- **2026-09-10 — Atomic scenarios replace the long-form scenario/review format; reviews are folded into the scenario's `approved:` line and deleted.** `planning/*.md` is capped at 40 lines, three sections (Story, Acceptance, Not this). Full history of every retired scenario/review lives in git, tag `archive-2026-09` and every commit since.
- **2026-09-08 — A follower of a business Page never sees other followers, and the Page never shows its follower list publicly — to anyone, including anonymous visitors.** A follower list on a business is a customer list, published; the business may see its own audience, nobody else has a reason to. A social group's members list is a different rule for a different noun — members may see each other.
- **2026-09-08 — A follower and a member are the same row (`relationship: 'member' | 'follower'`, defaulted from Page kind), with identical rights today.** The column exists so the two can diverge later without a migration — interest and belonging are different relationships and must not share a row, or the weaker claim inherits the stronger one's access.
- **2026-09-07 — A bulletin is one-way broadcast; a reaction count is shown to the Page owner, never a roster of who reacted.** A count is the audience answering; a roster is surveillance of the audience — same tap, two different products.
- **2026-09-09 — A Page's address is public if given; a neighbourhood is the private-safe alternative.** *(Supersedes the earlier foundation rule "street addresses never appear on public maps" — the newer, PM-instructed ruling wins. The address field must say it's public before anyone types into it.)*
- **2026-09-09 — The message board is `page_posts`, not `bulletins`.** Reply-capable (`parent_post_id`), authored (`author_member_id`), typed (`kind`) from the first migration, so replies and member-authored posts are later increments, not rewrites. Schedule unchanged: audience is members, 2 days, unticketed.
- **2026-09-09 — Browse: the approved Item-based scenario (F059) is rewritten around Pages, not re-numbered.** Its tickets (T127–T131) were built against the superseded Item model; the rewrite is flagged, not yet done.
- **2026-09-07 — Reports write to a table at launch; no SLA, no moderation flow, no operator queue.** Unblocks photo upload. Copy must not imply a response is coming.
- **2026-09-07 — Seed content is synthetic and display-only.** No real-producer recruitment before launch; not reportable as traction.
- **2026-09-07 — The producer values declaration is cut from launch.** The constraint survives: a values statement, whenever built, is self-declared only, never sourced or inferred.
- **2026-09-07 — "Where they'll be next" ships as one free-text line (≤140 chars) on the shop editor, not structured recurring scheduling.** Structure is a priced v2 buy-back; every producer who fills the sentence re-enters it by hand later.
- **2026-09-07 — Exactly three public promises: surplus returns to the community; every decision weighs member benefit against product benefit; not an extractive platform.** Every other prior commitment (never paying for visibility, member ownership, etc.) is withdrawn. Nothing is published until the PM says so.
- **2026-09-07 — A guidelines tier sits below promises.** Two guidelines ratified: visibility isn't sold by default; participation is never gated behind a fee. Two promise candidates (shared ownership, member/community-first responsibility) drafted, not ratified.
- **2026-09-07 — The business claim, not `groups.kind`, is the friction gate.** Anyone may create a Page to host or sell with no ZIP prompt, verification, badge, or lock; those arrive only with a deliberate local-business claim.
- **2026-09-07 — A person holds as many Pages as they have things going on; Page-type conversion is rejected outright.** Different creation flows per type is correct; nothing ever mutates.
- **2026-09-07 — Correction: nothing gates selling.** Any Page may list an Item; a business record is a claim, not a permission. (Corrects a same-day entry that had reinstated the conflation it was meant to remove.)
- **2026-09-07 — Page creation drops the "both sell and host" option; Pages are created sequentially.** A one-line "start another Page" offer at the end of creation is the load-bearing mitigation.
- **2026-09-07 — A Page is who; an Item is what.** One-time events are Items with a date, filed under a Page — no Page is created for a single occasion.
- **2026-09-07 — The map pins Pages, not Items.** Matching Items group by Page per location; one pin per location, popup lists that Page's Items.
- **2026-09-07 — One Page is one place; no map grouping across locations.** A two-location business is two Pages. Introduces "appearances" (a Page appearing at a Venue) as the one new vocabulary word needed.
- **2026-09-07 — The "Active in the community" badge is removed, no replacement.** A badge derived from a held role is the platform ranking people; same shape as the ownership tier already refused.
- **Everything the platform touches serves the people it touches** — a feature whose value to the platform costs a member is out, however well built.
- **Wealth circulates; it is not extracted** — no selling member data, no revenue line that works better when a member is stuck.
- **Paid visibility passes a member-benefit gate; it isn't banned by fiat.** ("It funds the platform" is the product half of the argument and fails alone.)
- **No engagement optimization, anywhere** — no infinite feeds, engagement-ranked sort, streaks, or pull-back notification loops.
- **The platform never rates, ranks, or labels a person** — no star ratings, reviews, trust levels, ownership tiers, or imported reputation.
- **One word for a person — member; every role is derived, never stored.** No account types, no creator/supporter split.
- **A business is the people doing its work — there is no business entity.** No corporate shells, no ownership transfer, no succession.
- **Groups are joined, never assigned** — no geofenced or auto-populated membership.
- **In public, locality is coarse; precision stays private** — no distance-to-you readouts, no location-scoped feeds or messaging. *(See the 2026-09-09 Page-address entry above for the one narrow public-address exception, PM-instructed.)*
- **Sharing is opt-in, granular, visible, revocable** — no pre-checked boxes, no default-on sharing.
- **The platform records facts; it never performs legal acts or speaks legal language.** No entity type, tax status, or legal/tax vocabulary in any user-facing string, ever — the columns may exist as off-platform fact; nothing may ask.
- **No venture capital** — no priced rounds, no plan that only works at venture scale.
- **Measure what happens inside the app; the north star is time and money together.** No claimed economic-impact multipliers.
- **The platform is the technology layer, never the bank.** A chartered partner holds member funds; the platform holds none, stores no card numbers.
- **What an assistant knows belongs to the member; the assistant never holds the keys.** Context is exportable, deletable, never trained on; credentials are minted per turn at the network edge.
- **A point asserts presence; nothing absent may make that assertion.** Position for a Page is resolved at read time from its Items, never stored or cached.
- **Demand is measured before it's built, including our own** — category "Other" text, not-built-yet taps, and idea-floats are all counted, never auto-promoted to a commitment.
- **Member discoverability defaults to private; outputs (Items, Groups) surface on their own settings.** A business Page stays public for commerce; the Member-behind-it stays separately gated.
- **Membership is the only access-granting verb for a business Page.** No ownership transfer, no succession, no role machinery beyond the membership row; owners are co-equal.
- **Business-Page lifecycle has no auto-dormancy or auto-dissolution** — inactivity affects surfacing only; the only end-state is an owner-called dissolve.
- **The platform does not generate QR codes.** Sharing is phone-to-phone. A producer generating their own business QR stays open as an unbuilt, unscoped idea.
- **No legal or tax language reaches a person**, and entity type/state of formation/formation date never surface in any user-facing copy.
- **One route: `_inbox/` → `planning/backlog/` → `next/` → `now/` → `done/`, decisions distill up into this file.** *(Superseded by this revamp — the lane structure is gone; a scenario's frontmatter `status` is now the only state.)*

## Build & stack

- **The app ships on Next.js App Router + TypeScript + Tailwind v4 + Supabase (Postgres/Auth/Realtime) + Mapbox GL JS on Vercel, Playwright for evals, Vitest for units.** A stack-row swap needs a new decision; tuning within a row doesn't.
- **Every write flows through a named, validated, transactional action handler that commits the data row and its `*_events` row together**, with `acting_member_id` always set and `via_delegation_id` when an agent acted.
- **`public.members.id = auth.users.id`, and the post-signup trigger is the only path to a Member row.** No admin create-user surface, no seed-script bypass.
- **The data layer was rebuilt clean-slate on Person/Item/Location/Group** — no dual-write, no backfill, no rollback window; justified only because `web/` had no live users or data at the time.

## Open — Don rules

- **"Neighbours, not strangers or creators" vs. "everyone who posts is a creator."** A) the north star's refusal is scoped to the word "creator" as a label only — the feeling is fine, just don't call anyone a creator. B) it bars the aspiration too — no reach chrome, no creator-shaped feature, ever. *No recommendation — genuinely a values call.*
- **The flourishing thresholds (40 discretionary hours/week, 1.5× adequacy margin).** A) adopt as the literal north-star targets everywhere. B) keep them illustrative only; drop the specific numbers from anywhere they read as a commitment. *Recommend A — they're already used as targets in one doc; B just leaves the inconsistency standing.*
- **Whether "members share in what they help build" means profit or ownership.** A) profit-sharing — competes with the surplus-to-community promise for the same dollar. B) ownership — draws on something else entirely, doesn't compete. C) park indefinitely; don't ratify either candidate. *No recommendation — this is the one clarification that most changes the shape of the promise set.*
- **Promise 1 — what "surplus returns to the community" actually means.** A) a fixed percentage, decided annually by the founder. B) a member vote or board process decides the number and the mechanism. C) stays internal-only indefinitely; never published as a specific commitment. *Recommend C for now — nothing forces a decision before launch, and a vague public promise is worse than a deferred one.*
