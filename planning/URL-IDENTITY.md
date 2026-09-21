---
id: url-identity
purpose: What a Page's canonical address is made of, given two constraints Don set on 2026-09-21 — no geography in it, and no member derivable from it. Options for Don to rule on. Not a ruling.
status: open
---

# What a Page's address is made of

**Blocks `socialus-web` #175.** The Place-precedence ruling of 2026-09-21 is still right about *where a Page appears*; it is now insufficient, because Don has ruled on what an address may contain.

**His two constraints, verbatim:** *"addresses/locations will evolve. we need to find a different way. right now we're using metros but one day may use neighborhoods."* and *"I'm concerned about a URL being downstream of a member. I want to keep members safe from people with bad intentions. I don't know that I like a page and a member id being in the same url."*

**Both are violated by what ships today.** The first by construction. The second is worse than a URL problem and is dealt with in § What already leaks.

## What is true today, checked rather than assumed

| | |
|---|---|
| **Page address** | `/p/<place-path>/g/<slug>` — geography is in the canonical URL |
| **Page identity in practice** | **`groups.slug` alone.** `resolveShop(supabase, groupSplit.groupSlug)` looks up by slug; the place segments are peeled off by `splitGroupSlug` and **never validated** |
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

**`nouns.md`, ratified 2026-09-09:** a Page's address is public if given — a street address where there are premises, a neighbourhood otherwise — and **the platform will not stop someone entering a home address, but it is shown to anyone who views the Page.** `model.md` says the same: *"Never a home address, and if someone enters one anyway, it is shown publicly."*

**Geography in the URL sharpens that from a display choice into an identifier.** A neighbourhood shown on a Page is a fact a viewer reads. **The same neighbourhood in the canonical address is carried into every link, every share, every referrer header and every log** — and `policy.md` already treats this category of combination as the doxxing vector it is, stripping GPS from uploads because *"producers often work from home."* **Removing geography from the address is coherent with a refusal already on the books**, not a new caution.

## Options

**A · Slug is the canonical address.** `/g/<slug>`, geography demoted to indexes that redirect.
- **For:** no migration — the slug is already globally unique. Shortest URLs. Readable, shareable, good for the SEO work on the Later list.
- **Against:** **the slug cannot then be changed**, because it is the address and `verbs.md` bars moving an address. A member who names a Page after themselves is stuck with it. **This is the option that leaves a member's own name permanently in the address by their own hand.**

**B · An opaque id is canonical; the slug is cosmetic.** `/g/<slug>-<short-id>` or `/g/<id>`, slug freely changeable, geography an index that redirects.
- **For:** **it resolves the rename refusal rather than colliding with it** — once the id carries identity, a slug may change without breaking a shared link, which `verbs.md` currently has to forbid outright. Defeats counting. Survives a metro-to-neighbourhood change with no address churn.
- **Against:** longer, uglier URLs. **The short id must be random, not derived** — a sequential or hash-of-member id would reintroduce exactly what this exists to prevent. Two things to keep consistent instead of one.

**C · Opaque id only, no human-readable part.** `/g/<id>`.
- **For:** the strongest version of both constraints. Nothing in the address is derived from anything.
- **Against:** unshareable by voice, unmemorable, and **it forecloses the SEO-structured public pages already on the Later list**. A local discovery product whose addresses cannot be read aloud is fighting its own purpose.

## What happens to links already shared

**This is cheap today and expensive later, which is the argument for ruling now.** Launch is 2026-10-30 and no member-created Page has a working URL at all — that is #135, the bug underneath all of this. **So there is currently nothing to break.** Whichever option wins, the rule is the same: **old shapes redirect permanently to the canonical form, and are never served as a second copy of it.** The redirect is what makes the place prefix safe to keep as a courtesy segment rather than dangerous as an identifier.

## What is not in scope here

Whether members should be publicly addressable at `/m/<handle>` at all. The two leaks above, which need closing whatever is ruled here and should not wait on it.
