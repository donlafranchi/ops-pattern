---
id: F059
title: A newcomer browses, and finds the neighbourhood
status: approved
date: 2026-09-13
depends: [F061]
approved: 2026-09-14 — criterion 8 cut, 10 reworded, 6 changed from a named fallback to member choice, address settled at /explore; amended 2026-09-17 — Browse is a showcase, curated lenses replace the ban on category controls
---
## Story

A newcomer opens Browse and sees what is actually here — the Pages near them and what those Pages have posted, most recent first, nothing held back. They type "sourdough" and the list narrows; there are no category buttons to press, because search is how you narrow. One tap swaps the list for a map, from a control sitting with the search box rather than buried between rows of results. A friend's shared link opens on the same metro with the same search, and going back lands where they left off.

## Acceptance

1. Browse is its own surface at `/explore`, reached from its own tab. It is not merged into Home and Home is not merged into it.
2. Browse shows Pages and posts together. It is **complete**: nothing is withheld that the reader is entitled to see.
2b. **Signed in, Browse also carries what is that person's own** — announcements from Pages they follow, and things coming up. This content is **not** tucked away in the member's own area. **Signed out, it is absent**, and the rest of Browse is unchanged.
2c. **The signed-in half is withheld server-side, never rendered and hidden.** A person's following-derived content is theirs; a surface that ships it to every reader and conceals it with CSS has already disclosed it.
3. Ordering is locality and recency, and may carry community response; **never payment, and never what keeps someone scrolling.** Lenses vary what is shown so the surface is not the same every visit — **variety without compulsion**, which is the bar: not addicting, and not boring.
4. **Browse is a showcase, not a catalogue.** It carries **curated lenses** — a small, varying set such as what is on today, local food, household things, art, or free things — each a way to change what is discoverable rather than a filter over one list. A lens is not a taxonomy of item kinds and there is no exhaustive kind picker. **Typed search remains a separate job**: search is for finding something specific, lenses are for being shown something.
5. A single control alternates between list and map, sitting in the same row as search, with nothing inserted between rows of results.
6. Results are scoped to the active metro. A member outside every seeded metro picks one and no metro is picked for them — every US metro is seeded before launch, which is what makes choosing possible.
7. The metro switcher moves a signed-in member's results, not only a signed-out visitor's.
8. Past-dated posts drop out on their own.
9. Each result carries the name the people behind it are actually known by. A brand label that conceals who owns the Page does not satisfy this.
10. A shared link reopens the same metro and the same search; back-navigation restores scroll position.

## Not this

Hood-band ranking inside the metro. An exhaustive kind picker or a filter row — a lens is curation, not a taxonomy. Ranking by what holds attention. **Personal content as a private feed**: Browse shows a person their own announcements and upcoming things, it does not become a personalised ranking of everything else.

**Rewritten 2026-09-13, and back to `draft` because what was approved no longer describes the product.** Two of the old criteria were reversed, not refined: it required `/` to be *"one merged surface… with no separate Explore tab"* (**the merge was rescinded 2026-09-12 — a scope cut for the launch date, not a design conclusion**), and it described *"kind filters"* the same rulings deleted. Its *Not this* also carried the chrome rework as a debt owed for the top-anchored search row; **principle 8 was restated 2026-09-13 and that debt no longer exists**, so the line is gone rather than reworded.

**Amended 2026-09-14, and approved.** **Browse lives at `/explore`** — ruled, no longer open. Criterion 8 is **cut**: criterion 4 removed the category controls, so narrowing is now typed search, and search should rank by relevance rather than preserve an ordering built for a list nobody is filtering. Scroll stability, the thing the old criterion was protecting, is already criterion 10. Criterion 9's name test is **concealment, not incorporation** — a business name is fine; a brand label that hides who owns the Page is not. Criterion 6 no longer names a fallback metro: **a member outside every seeded metro chooses**, because every US metro is seeded before launch and there is therefore always something to choose. The waitlist that choice leads to is F076.

**Amended 2026-09-17, and approved.** Don: *"The explore page is a showcase and should show the signed in user things like announcements and upcoming things instead of hiding it in /you... explore for people not signed is excludes the personal following things. And search is for looking for something specifically. We should have categories like what's going on today etc. it's a way to change what's discoverable... we don't want to be addicting but we also don't want to be boring"*, extended with *"organic local food items or household items or art things etc. or free stuff like dirt or manure"* and *"a horizontal scroll feed where there's additional content off to the right for more choices."*

**Criterion 4 is reversed, not refined** — it banned every category control; curated lenses are now required. The ban was written against a kind-taxonomy filter row, and a lens is a different thing: it varies what is shown rather than subsetting one list, and search keeps its separate job. **The shipped pill row does not survive** — Events / Products / Services / Ideas / Offers / Asks / Initiatives is exactly the exhaustive kind taxonomy both criteria refuse; replaced by lenses, not relabelled. **Lenses run on several axes**: time (*on today*), product category (*local food, household, art*), and **cost** (*free things*) — cost is distinct, and free-to-collect is a neighbourhood case the others do not reach. **"Not ranked by declared interests" is retired as a phrasing**, replaced by what it protected: never payment, never what holds attention. Home carried that distinction and Home is paused.

**Presentation: horizontally scrolling rows**, the off-screen-right content being the point. **This does not reintroduce a fixed-width tile** — uniform card height comes from reserved line heights inside the card and is independent of layout; only width changes, from a reflowing grid to a clamped range, so a card stays fluid and the next one peeks on a phone. **Where personal content lives, so nothing falls between surfaces: Browse is for discovery, the member's own area is for management.** Announcements from Pages a person follows and things coming up appear on Browse; the member's own area keeps what a person acts on — the Pages they run, their settings, and the editable list of what they follow. The *content* surfaces on Browse; the *list* stays where it can be changed.
