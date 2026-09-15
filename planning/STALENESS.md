# Staleness — one rule for everything

**Draft, 2026-09-15.** Don: **"We should date these things and not display things that haven't had any interaction in 90 days. Or show them last."**

**A general rule, not a wonder rule.** It answers the same problem for every entry that can go quiet.

## The rule

**Everything carries a last-interaction date.** A Page, a post, a product, a service, a gathering, a wonder.

**Nothing quiet for 90 days is hidden. It sorts last.** Don offered both; this is the one to take.

- **Hiding something without telling its author is how people find out their listing was invisible for a month.** Sorting last is visible, reversible and honest.
- **`model.md` already rules the same way:** *"Browse is everything… The default is inclusion. Anything excluded needs a reason, recorded."* **Quiet is not a reason to exclude; it is a reason to rank below things that are not.**
- **Sorting last fails softly.** If the date is wrong, something appears lower than it should. If hiding is wrong, something disappears.

**The author can see it has gone quiet, and only the author can.** One line on their own Page, never on a public surface — quiet is not a label the platform hangs on somebody in front of other people.

**Bringing it back is one action: edit it, or announce something on it.** No separate "renew" button, no confirmation, nothing to learn. **Doing the ordinary thing is the revival.**

## What counts as interaction — Don rules, and one answer is forced

**A view must not count.** Not a judgement call: `surfaces.md` says ordering **"may never use what keeps you scrolling,"** and a view is exactly that. **Counting views would turn this into an engagement metric through the back door**, and it would keep a listing alive on strangers glancing at it.

**The short list for him:**

| Candidate | Read |
|---|---|
| **Someone responds** — interest, RSVP, save | **Obviously yes.** |
| **Someone follows or joins** | **Probably yes** — it is a person choosing the thing. |
| **The author announces something on it** | **Probably yes** — the thing is alive because its owner is. |
| **The author edits it** | **Arguable.** A typo fix is not life; a rewritten description might be. |
| **Someone views it** | **No, and the ordering rule forbids it.** |
| **It appeared in a search result** | **No** — same reason, and worse: nobody chose anything. |

## It fits the ordering rule

**Confirmed rather than assumed.** `surfaces.md`: *"Ordering is locality and recency, with the Member's own declared interest tags as a boost — and may also carry genuine community response."*

**Last-interaction sorting is permitted twice over** — it is recency, and if interaction means responses it is genuine community response, which Don ratified on 2026-09-12. **The only thing the rule forbids is what keeps you scrolling, which is precisely why views are out.**

## It replaces the wonder expiry rather than sitting beside it

**Same idea, done generally and done better.** The expiry Don cut on 2026-09-15 **deleted** a wonder after 90 days. **This demotes it after 90 quiet days and lets the author revive it by doing something ordinary.**

**So the removal stands and this is the better version** — one rule for every entry instead of a mechanism bolted onto one of them, and nothing is destroyed.

## Cost

**A `last_interaction_at` column on the things that can go quiet, written by whatever already writes an interaction**, and one clause in the ordering. **No new surface and no job to run** — staleness is computed at read time from a date, the same way locality already is.

**Flagged, not decided:** whether the 90 days is per entry type or one number everywhere. One number is simpler and a gathering that recurs monthly is fine either way; a seasonal producer who lists once a year is not.
