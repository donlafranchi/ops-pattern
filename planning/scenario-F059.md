---
id: F059
title: A newcomer browses, and finds the neighbourhood
status: approved
date: 2026-09-13
depends: [F061]
approved: 2026-09-14 — criterion 8 cut, 10 reworded, 6 changed from a named fallback to member choice, address settled at /explore
---
## Story

A newcomer opens Browse and sees what is actually here — the Pages near them and what those Pages have posted, most recent first, nothing held back. They type "sourdough" and the list narrows; there are no category buttons to press, because search is how you narrow. One tap swaps the list for a map, from a control sitting with the search box rather than buried between rows of results. A friend's shared link opens on the same metro with the same search, and going back lands where they left off.

## Acceptance

1. Browse is its own surface at `/explore`, reached from its own tab. It is not merged into Home and Home is not merged into it.
2. Browse shows Pages and posts together. It is **complete**: nothing is withheld that the reader is entitled to see.
3. Browse is **not ranked by the member's declared interests** — that ordering belongs to Home. Ordering here is locality and recency, and may carry community response; never payment.
4. There is no category control anywhere on the surface — no pills, no chips, no filter row. Typed search is the only way to narrow.
5. A single control alternates between list and map, sitting in the same row as search, with nothing inserted between rows of results.
6. Results are scoped to the active metro. A member outside every seeded metro picks one and no metro is picked for them — every US metro is seeded before launch, which is what makes choosing possible.
7. The metro switcher moves a signed-in member's results, not only a signed-out visitor's.
8. Past-dated posts drop out on their own.
9. Each result carries the name the people behind it are actually known by. A brand label that conceals who owns the Page does not satisfy this.
10. A shared link reopens the same metro and the same search; back-navigation restores scroll position.

## Not this

Hood-band ranking inside the metro. Server-side filtering beyond the fetched page. Personalising Browse — that is Home's job, and doing both here collapses the reason two surfaces exist.

**Rewritten 2026-09-13, and back to `draft` because what was approved no longer describes the product.** Two of the old criteria were reversed, not refined: it required `/` to be *"one merged surface… with no separate Explore tab"* (**the merge was rescinded 2026-09-12 — a scope cut for the launch date, not a design conclusion**), and it described *"kind filters"* the same rulings deleted. Its *Not this* also carried the chrome rework as a debt owed for the top-anchored search row; **principle 8 was restated 2026-09-13 and that debt no longer exists**, so the line is gone rather than reworded.

**Amended 2026-09-14, and approved.** **Browse lives at `/explore`** — ruled, no longer open. Criterion 8 is **cut**: criterion 4 removed the category controls, so narrowing is now typed search, and search should rank by relevance rather than preserve an ordering built for a list nobody is filtering. Scroll stability, the thing the old criterion was protecting, is already criterion 10. Criterion 9's name test is **concealment, not incorporation** — a business name is fine; a brand label that hides who owns the Page is not. Criterion 6 no longer names a fallback metro: **a member outside every seeded metro chooses**, because every US metro is seeded before launch and there is therefore always something to choose. The waitlist that choice leads to is F076.
