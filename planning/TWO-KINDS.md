# Two Page kinds: selling, and gathering

**Draft, 2026-09-15.** Don, across two messages: **"People are either selling something"** / **"gathering one or many times"**.

**This supersedes the six `groups.kind` values, the community-merge proposal, and the separate `event` kind.** Tested below against the tools mapping rather than accepted on sight.

---

## 1 · Two kinds, and recurrence is a property

**Position: two Page kinds — `selling` and `gathering` — with once-versus-many a property of a gathering Page, not a third kind.**

**The test the tools mapping gives: a kind is a difference you cannot derive; a property is one you can.**

| Difference between a one-off and a recurring gathering | Derives from "does it happen again?" |
|---|---|
| No recurrence rule | **Yes — this *is* the property** |
| No group membership | **Yes.** There is no continuing set of people to be a member of |
| No ideas, offers, asks, initiatives filed under it | **Yes.** The Page ends; nothing filed under it outlives the date |
| No appearances at venues | **Yes.** One occasion is one place |
| No dormancy | **Yes.** It is over, which is not the same as dormant |

**Every one of the eight differences I found derives from a single fact.** That is the definition of a property. **A one-time gathering is not a different kind of thing; it is a gathering that happens once.**

**Selling does not derive from anything about gathering.** Prices, rate models, service areas, a business claim, jurisdiction, locality evidence, owner and staff roles, no dormancy — **none of it follows from how often people meet.** That is a genuine kind difference, and it is the only one.

**So: two kinds, one property.** The matrix in `product/systems/page-kind-tools.md` collapses from seven columns to two plus a flag.

---

## 2 · The six existing values

| Value | Goes to | Clean? |
|---|---|---|
| `business` | **selling** | Yes |
| `place` | **gathering** | Yes |
| `interest` | **gathering** | Yes |
| `practice` | **gathering** | Yes |
| `event_anchored` | **gathering** | Yes — it is a gathering that formed out of another gathering. Provenance survives as a nullable column |
| `family` | **see below** | **No** |

### `family` does not fit, and forcing it would be wrong

**A family Page is private, has members, sells nothing, and gathers nobody in the public sense.** Held against Don's sentence honestly, it is neither.

**But it does not need to be a kind, because privacy is already its own axis.** Don ruled today: *"Anything private wouldn't have followers, they have members because you can't follow something."* **That ruling made discoverability the thing that decides the relationship, independent of kind.**

**So `family` collapses into a gathering Page with `discoverability = 'private'`.** Everything that makes a family Page a family Page — members not followers, nothing public, no selling — **falls out of the privacy setting, not out of a kind.** The `BEFORE INSERT` trigger that defaults family to private becomes a default on the setting a person chooses, and nothing is lost.

**Said plainly: `family` is the one value that does not fit the two-kind model directly, and the reason it can go anyway is a ruling Don made hours earlier, not a stretch.**

---

## 3 · What it costs

**The migration is small.** One check constraint goes from six values to two. **The mapping is deterministic** — five of six values have one destination, and `family` needs its rows confirmed as `private`, which the existing trigger has already done for every row it created.

**Data behind it: three seeded social groups**, plus whatever business Pages exist. **Confirm the real counts against production before running anything** — that check has never been run from here.

**Two child tables need re-keying, not rebuilding.** `group_businesses` follows `business` → `selling`. `group_event_anchored` stops being coupled to a kind and becomes nullable provenance on any gathering Page; its deferred foreign key is unaffected.

**What is lost, honestly: the distinction between `place`, `interest` and `practice`.** That distinction is already tags' job, and `event_anchored`'s kind-coupling survives as a column. **Nothing else.**

**One thing to verify rather than assume:** `member_has_standing_presence` is defined as *"≥1 business owner/staff membership OR steward role in any non-business Group."* It survives a rename but the phrase "non-business" now means "gathering", and the view should be read rather than trusted.

---

## 4 · What it deletes — the reason this is worth more than a rename

**Four open questions stop existing:**

- **The community merge** — subsumed entirely. `place`, `interest`, `practice` and `event_anchored` become one thing without needing their own proposal.
- **`event` as a separate Page kind** — subsumed. Recurrence is a property, so `PAGE-KIND-EVENT.md` is answered rather than pending.
- **The farmers-market gap**, open since `model.md` recorded that a market *"fits none of them cleanly"* — a market convenes people, so it is a gathering Page. **Gone.**
- **The `event_anchored` misleading-name flag** — the value disappears.

**Two things get much smaller but survive:**

- **The label layer.** Still needed, because *run club* and *supper club* are still the words a person uses. **But the mapping problem nearly vanishes** — every label points at one of two kinds instead of one of seven, which is a judgement almost nobody can get wrong.
- **The "Other" explainer (F088).** Explaining seven kinds needed a page. **Explaining two may need a sentence**, and the scenario should be re-read on that basis before it is built.

**The tools mapping survives and improves** — two columns and a flag is a document somebody reads, where seven columns was a document somebody skims.

---

## 5 · What this overturns, quoted

**Three ratified things. The first is the one that matters.**

> **`nouns.md`:** *"A Page may sell, host, or both, and needs no business record to do either — the business record is a claim about the Page, not a permission."*

**Two exclusive kinds contradicts "or both".** Don's sentence says a person is *either* selling *or* gathering; this rule says one Page may do both. **They cannot both stand, and this is the one thing his two messages do not settle.** Three ways out, and it is his call: a Page that does both is two Pages (which fits *"Pages are created sequentially, never simultaneously"* but breaks *"or both"*) · selling and gathering are capabilities a Page may hold together rather than exclusive kinds · or the rule is amended and "or both" goes.

> **`groups.md`:** *"**Affiliate** (community kinds — `place`, `interest`, `practice`, `event_anchored`, `family`): members gather, share, follow, attend, host. **Operate** (`business`): members make, sell, serve, host commercially."*

**Superseded, and in the same shape as the new model** — affiliate is gathering, operate is selling. **This ruling is closer to a simplification of that split than a reversal of it.**

> **`nouns.md`:** *"**Social group** — a named, self-selected set of people. Six Page kinds: five affiliate … and one operate."*

Becomes two.

**One ratified rule that survives and gets more load:** *"A Group never changes kind. A run club that wants to formalize as an LLC ends the old Group and starts a new one."* **With two kinds, the gathering-that-starts-selling case is no longer an edge — it is the main path from patron to creator, and it is exactly what Don said this product is for.** The no-conversion rule should be re-examined on its own merits, not assumed to survive unchanged.
