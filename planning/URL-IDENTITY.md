---
id: url-identity
purpose: What a Page's canonical address is made of. Ruled by Don 2026-09-21: slug plus a short non-sequential ID, no geography, no member derivable from it. The decision record, its consequences, and the identity audit behind it.
status: ruled
---

# What a Page's address is made of

**Ruled by Don, 2026-09-21. `socialus-web` #175 is unblocked.** The Place-precedence ruling of the same day stands and is still right about *where a Page appears*; this governs what an address is made of, which is a different question.

## The ruling

**A Page's canonical URL is a cosmetic slug plus a short non-sequential ID** — `joes-pizza-7k3x`. **The ID resolves; the slug may change freely without breaking a link.**

- **No geography in a canonical URL.** Metro today, neighbourhoods later, and an address must survive both.
- **No member identity derivable from a Page URL.** A safety requirement, not tidiness.
- **Metro, neighbourhood, state and city are indexes that forward to the canonical URL**, not alternative homes for it.
- **Metro disambiguates for humans; the ID disambiguates for the system.** Putting a metro ID in the address was considered and rejected: it reintroduces the geographic coupling just refused, it does not separate two same-named Pages *within* one metro, and it moves a Page's address when a business relocates or a boundary is redrawn. **Same-name disambiguation is a display concern** — show *"Joe's Pizza — Davis"* in search results and lens rows, and keep geography out of the address.

**His two constraints, verbatim:** *"addresses/locations will evolve. we need to find a different way. right now we're using metros but one day may use neighborhoods."* and *"I'm concerned about a URL being downstream of a member. I want to keep members safe from people with bad intentions. I don't know that I like a page and a member id being in the same url."*

**Both are violated by what ships today.** The first by construction. The second is worse than a URL problem and is dealt with in § What already leaks.

## What is true today, checked rather than assumed

| | |
|---|---|
| **Page address** | `/p/<place-path>/g/<slug>` — geography is in the canonical URL |
| **Page identity in practice** | **`groups.slug` alone.** `resolveShop(supabase, groupSplit.groupSlug)` looks up by slug; the place segments are peeled off by `splitGroupSlug` and **not validated** |
| **Consequence** | `/p/ca/sacramento/g/mayas-bakery` and `/p/ny/albany/g/mayas-bakery` render the same Page today. Many addresses already exist, with no canonicalisation and no redirect |
| **`groups.slug`** | `not null unique` **globally** (`014_groups.sql:51`) — so a slug-only address needs no migration to be unique |
| **Member address** | `/m/<handle>` — members are already publicly addressable by their own handle |
| **Renaming** | `verbs.md` **forbids** renaming an active Page's slug: *"a moved public URL is a broken link someone already shared"* |

## Enumerability — are the identifiers walkable?

**No sequential identifiers exist on the nouns that matter.** `members.id` and `groups.id` are both `uuid primary key default gen_random_uuid()` — random v4, not walkable, not countable. **Nothing in the schema uses `serial`, `bigserial` or an identity column for a Page or a member.** That is the good news and it was not luck; it is the default the schema was built on.

**What IS guessable is the human half.** `groups.slug` is a name-derived string and `members.handle` is a 4-to-30-character member-chosen word. **Neither is enumerable by counting, both are enumerable by dictionary** — an attacker guesses plausible business names rather than walking integers. **This distinction matters for the ruling:** an opaque id defeats counting, which nothing currently permits anyway; it does **not** defeat guessing a bakery is at `mayas-bakery`, and no scheme can.

## What already leaks, and it is not the URL

**Answering the question straight: yes, a member is currently derivable from public data, by two separate paths, and neither involves the URL scheme.**

1. **`member_public_group_memberships` is a view granted to `anon`** (`029_member_public_projections.sql`) projecting **`gm.member_id` joined to `g.id, g.slug, g.name, g.kind`** for every listed Page. It exists to render `/m/<handle>`, but **a view is queryable in both directions**: given a Page slug, it returns the member ids attached to it. This is a public member-to-Page join table.
2. **`groups.founder_member_id` is `not null` and RLS is row-level, not column-level.** The policy `groups_select_active_or_own_draft` admits any active, listed, non-dissolved row to `anon`. **`browse_feed` is `security invoker` and returns rows to signed-out readers**, which is only possible if `anon` can select `groups` — and no column-level grant narrows that. **So `select founder_member_id from groups` is available to anyone with the public API key.** *(This is inference from the policy and the invoker semantics, not from a query against production — confirming it takes one request, which I cannot make from here. It should be confirmed before anything is designed on top of it.)*

**The consequence for the ruling: a URL change alone does not satisfy Don's second constraint.** It is necessary and nowhere near sufficient. **Any option below is incomplete without closing both of these**, and closing them is independent of which address shape wins.

## The tension with the ratified place rule

**`nouns.md`, ratified 2026-09-09:** a Page's address is public if given — a street address where there are premises, a neighbourhood otherwise — and **the platform will not stop someone entering a home address, but it is shown to anyone who views the Page.** `model.md` says the same: if someone enters a home address anyway, *"it is shown publicly."*

**Geography in the URL sharpens that from a display choice into an identifier.** A neighbourhood shown on a Page is a fact a viewer reads. **The same neighbourhood in the canonical address is carried into every link, every share, every referrer header and every log** — and `policy.md` already treats this category of combination as the doxxing vector it is, stripping GPS from uploads because *"producers often work from home."* **Removing geography from the address is coherent with a refusal already on the books**, not a new caution.

## Why this option and not the other two

**Slug-only was rejected** because the slug would then *be* the address, and `verbs.md` bars moving an address — so a member who names a Page after themselves is permanently stuck with their own name in it, by their own hand. **ID-only was rejected** because it forecloses the SEO-structured public pages on the Later list; a local discovery product whose addresses cannot be read aloud is fighting its own purpose.

**The chosen scheme resolves a refusal rather than colliding with it.** `verbs.md` forbids renaming an active Page's slug — *"a moved public URL is a broken link someone already shared"* — and that refusal exists **because** the slug is currently the address. Once the ID carries identity, a slug may change and every shared link still resolves. **That rule should be amended when this ships, not deleted:** what stays true is that an address may not move; what changes is that the slug is no longer the address.

## What happens to links already shared

**This is cheap today and expensive later, which is the argument for ruling now.** Launch is 2026-10-30 and no member-created Page has a working URL at all — that is #135, the bug underneath all of this. **So there is currently nothing to break.** Whichever option wins, the rule is the same: **old shapes redirect permanently to the canonical form, and are not served as a second copy of it.** The redirect is what makes the place prefix safe to keep as a courtesy segment rather than dangerous as an identifier.

## The ID, specified

- **Random, from a CSPRNG. Not derived** from a member id, a group id, a timestamp or a sequence. **Derivation is what would reintroduce both enumerability and the member link**, so it is the one property that is not a preference.
- **Crockford base32** — digits plus letters, minus `i`, `l`, `o` and `u`. That kills the look-alike pairs (`0`/`O`, `1`/`l`/`I`) for anyone reading an address aloud, and dropping `u` blocks most accidental words.
- **Length: recommend six, not four.** Four characters is 32⁴ ≈ 1.05M values, and a birthday collision becomes likely at roughly 1,200 Pages — which one metro reaches. Six is 32⁶ ≈ 1.07B, likely at roughly 38,000. **Generate-and-retry against a unique index either way**, so a collision is a retry and not a duplicate. *(Don's `joes-pizza-7k3x` example is four. This is the one number worth confirming: four looks better and needs retries sooner.)*
- **Case-insensitive on read, lower-case on write.**

## Slug changes, and slugs that were used before

**The scheme answers most of this by itself, which is the point of it.**

1. **Resolution is by ID alone.** The slug segment is read for display and ignored for lookup.
2. **Any slug plus the correct ID resolves**, and redirects permanently to the canonical form. A stale slug in a shared link therefore keeps working forever with no bookkeeping.
3. **So no slug-history table and no previously-used-slug reservation is needed.** Old slugs do not need reserving because they were not identity. **This is the main operational saving of the scheme and should not be re-engineered back in.**
4. **`groups.slug` global uniqueness becomes meaningless and should be dropped.** With identity on the ID, a unique constraint on a cosmetic field buys nothing and creates a land-grab race over names. *(Schema change — it belongs in the architecture note, not here.)*
5. **Reserved words are not needed for routing.** Pages live under their own segment, so a Page slugged `explore` or `admin` cannot collide with a root route.
6. **The real new risk is impersonation, and it is a moderation matter rather than a uniqueness one.** A freely changeable slug lets someone rename a Page to mimic another; the IDs differ, but people read slugs. **This is member-contributed content that other members see, so `[member-content-takedown]` already covers it** — the report path is the answer, not a uniqueness constraint that would not have stopped it anyway.
7. **Open, and small: may a slug change without limit?** An unbounded rename is a cheap way to cycle through impersonations between reports. A rate limit is the obvious mitigation and nobody has ruled on one.

## Indexes, now that they are not addresses

**State, city, metro and neighbourhood are index hierarchies.** Two rules keep them from becoming addresses again:

- **An index links to canonical URLs and does not render a Page inline at an index path.** Rendering is what created the duplicate-address defect described above.
- **An index path is free to change shape**, because nothing shared points at it. That is the whole benefit of taking geography out of the address: the metro-to-neighbourhood change Don is anticipating becomes an index rewrite with no address churn.

## What is not in scope here

Whether members should be publicly addressable at `/m/<handle>` at all. The two leaks above, which need closing whatever is ruled here and should not wait on it.
