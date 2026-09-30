---
id: F093
title: A signed-out visitor sees that something is happening, and is asked in to read it
status: approved
gates: launch
date: 2026-09-23
depends: [F059, F072]
approved: 2026-09-23 — Don's ruling on socialus-web #200. "Who exists is public. What's happening is not — but that something is happening is public." The body is withheld entirely, not just the time and the place, and the withholding is enforced in SQL.
amended: 2026-09-30 — Don approved: criterion 8 restated. The signed-out front door is name, default photo, description and the withheld card; the location is kept and used, not shown; tags show signed in only.
---
## Story

Someone who has never signed in opens Explore in Sacramento. They see the Pages that are here, each by its front door — name, photo, description — placed on the map without an address. Among them is SacRiver Floaters' tile — its photo, its name, and *3 announcements this week* — one card for the Page, however many it posted. It does not say what the announcements are, or when, or where. It says *the details are for members and followers of this Page*, and under it: *Sign in to become a member.* They can see the place is alive without being handed its diary, and the one thing they can do about it is join.

## Acceptance

1. **An anonymous caller cannot retrieve an announcement body from the database, by any route.** A direct request to the PostgREST endpoint for `page_posts`, using the publishable key that ships in the client bundle, returns no `body` for any row. This is checked by calling the endpoint, not by reading the policy.
2. **The same is true of `starts_at` and `location_id`**, and of any later column carrying what an announcement says or when and where it happens. Withholding the body alone and serving the time would invert the ruling.
3. **Withholding is enforced in SQL.** The signed-out card is served by a read path that never selects the body — a projection, not a filter applied to a row the caller has already been given. **No test of the form "the component does not render it" discharges any criterion here.**
4. **The signed-out card carries exactly five things:** the Page's photo, the Page name, how many announcements that Page has this period, that the details are for members and followers of this Page, and a call to sign in and become a member. Not the body, not the time, not the place, not an excerpt — and not the Page's own location, which beside a count reads as where they happen. A Page with no photo, or a hidden one, shows the same placeholder every tile does.
5. **One card per Page, not per announcement**, carrying that Page's count of announcements for the current period, with the period named in words a reader understands. A count that cannot be read as a period is not a count, and two cards for one Page repeating one count read as broken. A Page with announcements but none this period still has its card, without a nought.
6. **A signed-in member sees no change whatsoever** — same bodies, same times, same places, same ordering, on Explore and on a Page. This scenario adds nothing to and removes nothing from the signed-in surface.
7. **Signed-out Explore still contains post-kind rows.** They render in withheld form; they do not disappear. A signed-out Explore that carries only Pages fails this criterion even though it leaks nothing.
8. **A signed-out visitor sees a Page's front door: its name, default photo, description, and the withheld card, "Sign up to see what's happening"** (placeholder, [public-is-draft]). **No location, tags or founder.** Storing a location and showing it are separate: the Page keeps its location regardless, and it scopes the Page to the metro and places it on the map without being displayed. Signed in, the owner chooses how much location shows — an exact meeting place, or the neighbourhood only — and tags show to signed-in visitors only. Pages remain indexable, front door only, by the search crawlers `robots.ts` admits.
9. **A signed-out visitor who follows an `#announcement-<id>` link — to any of the Page's announcements, not only the latest — lands on a page that resolves.** The Page renders its one withheld card, marked as where they landed, with the CTA on it. **No 404, no blank Announcements section, and no silent scroll to nothing.**
10. **Nothing on the signed-out surface is a link to a body.** A control that navigates to something a signed-out reader cannot read, and only then asks them to sign in, fails this: the ask comes first.
11. **The card is the same for every anonymous reader.** No personalisation, no geolocation-derived variation, nothing derived from a prior visit — there is no member, so there is nothing to vary on.
12. **Every criterion above is discharged by a check that has been observed failing** against a fixture that should fail it, per `[guard-proves-itself]`. A green suite that has never rejected a body-bearing anonymous response does not discharge criterion 1.

## Why

### The body is free text, so withholding columns withholds nothing

**This is the half of the ruling that decides the shape of the work.** The obvious reading of *what's happening is not public* is to withhold `starts_at` and `location_id` — the structured when and where. **It would be theatre.** A Page owner writing an announcement writes *we're meeting Thursday at 2pm at the river*. The when and the where are in the prose, every time, because that is what an announcement is for. **A policy that redacts two columns and serves the sentence containing the same facts has redacted nothing and claimed to have redacted something**, which is worse than not trying: it produces a document saying announcements are private and a database that disagrees.

So the body goes, entirely. **There is no excerpt, no first line, no character-truncated teaser** — a truncated announcement is still an announcement with its most important clause intact more often than not.

### Two doors, which is why this is RLS and not robots.txt

**`robots.txt` and the Vercel firewall defend `www.socialus.org`. The rows are also served from `https://<ref>.supabase.co/rest/v1/`, with a publishable key that ships inside our own JavaScript.** That origin is not behind our firewall and never will be. An agent that reads the bundle — which is what a collecting crawler does — takes the second door and never touches the first.

**That is the whole reason this was an RLS question.** RLS is the only layer sitting in front of both. **A hide in a React component is an inert guard under `[guard-proves-itself]`**: green on every run, and absent the moment anyone asks the database directly. `#178` is the standing demonstration that the second door is real and already being used to count our tables.

### Why *that* something is happening stays public

**Because it is the only reason a stranger signs up.** A directory of Pages tells someone a place exists; a signal that four things are happening this week tells them it is alive, and being alive is the product. **The clean answer — announcements require an account, full stop — was available and was not chosen**, precisely because it turns signed-out Explore into a phone book and removes the thing that converts a visitor.

**What is given up is the operationally useful detail**, which is the part worth scraping and the part an outside agent would summarise instead of sending anyone here. **What is kept is the invitation.** That split is the ruling.

### Not a reversal of 2026-09-18

**The *signed out is read-only* ruling answered what a signed-out person may DO.** Its substance is writes — no follow, no get-updates, no reporting, no messaging — and its reasoning is that an account buys **continuity**, not identity. Its sentence about public Pages and *"their public content"* is a supporting clause, and the crawler question was not in view when it was written. **This ruling reaches a question that one did not reach.** Nothing in the 2026-09-18 entry is withdrawn.

### What this changes in F059

**Criterion 2 — *"complete: nothing is withheld that the reader is entitled to see"* — still holds**, and is worth restating rather than amending: what changed is entitlement, not completeness. **Criterion 4's *what's on today* lens needs its own answer** — a time lens over announcements a signed-out reader cannot read has nothing to order by. Either it is a signed-in lens or it shows Pages with something on. **That is not ruled here and is not this scenario's job.** The **newcomers lens is unaffected**, which matters, because F059 calls it load-bearing for supply.

## Not this

An excerpt, a teaser, a first line, or a character count of the body. A per-Page or per-post opt-out — this is one rule for every announcement. A paywall, a trial, or any tier above member. Blocking search engines from Pages. Anything that changes what a signed-in member sees. Rate-limiting the anonymous card endpoint, which is real work and belongs with `#195`. Closing the `members` leak, which is `#178` and is a bug under any ruling. Terms of service, still flagged and still not drafted.
