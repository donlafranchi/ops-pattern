# SocialUs screen inventory: summary

2026-10-01 · Cowork (design) · Read-only. Source: `socialus-web` origin/main @ b362559. Production: www.socialus.org, signed out, measured at 360–1920px. Full detail: `socialus-screen-inventory.xlsx` (same folder). Owner Page: see `owner-page-spec.md`.

**Verified vs assumed:** 23 of 152 rows were seen in production (signed-out pages, redirects, 404s, dev gate). Everything else (signed-in, follower, member, owner, operator, every sheet/modal/wizard step) is read from code. Member (`/m/*`) and item pages couldn't be reached signed out: nothing links to them.

## Screen count by type (152 rows, 26 routed pages)

| Type | Rows | Pages |
|---|---|---|
| form/wizard | 37 | 2 (+20 wizard steps, 8 overlays) |
| empty/error | 35 | 0 (27 empty/error states) |
| redirect/system | 21 | 0 |
| detail | 16 | 9 |
| auth | 13 | 2 |
| browse/list+map | 9 | 1 |
| dashboard/manage | 9 | 4 |
| dev | 5 | 4 (404 in prod) |
| feed | 4 | 3 (all orphaned or unreachable) |
| settings | 3 | 1 |

## Screen sizes

Nothing uses `lg:`/`xl:`/`2xl:`, and 105 of 126 component files have no responsive rule. Every content page is one column 384–768px wide. A Page fills 53% of a 15" laptop and 30% of a 27" monitor. Explore is the opposite: its grid has no cap (7 columns at 1920) while the search bar above it stops at 1024px. See the "Screen sizes" tab for each screen at 6", 8", 11", 13", 15", 16" and 27".

## Top 10 structure problems

1. No wide layout anywhere. Single 384–768px columns on every content page.
2. On Explore, the List/Map toggle scrolls away and moves: it sits after card 4 (1769px down on a phone) and under the map in map view.
3. Explore's header is capped and its grid isn't, so the edges don't line up. List and map never sit side by side, "7 results" appears twice, and there's no h1.
4. Create goes in a circle: Create → /you/sell → back to /you → "Tap Create". The working entry is labelled "Sell".
5. The nav changes order by size (phone Explore·Create·You, desktop Explore·You·Create). It also never hides, even on auth, onboarding, admin or inside wizards.
6. Sign-in is asked for in five different wordings, and all of them go to the same page.
7. /you is three overlapping views: a Following strip, an always-empty Following tab, an always-empty Saved tab, plus Settings hidden in a tab and a profile link that dead-ends.
8. There's no shared page shell. Not-found is Next's default, every page title is "SocialUs", h1 comes in 5 sizes, and there are 12 different max-widths.
9. Creating a Page and editing it don't match: different labels, links stored as URLs vs handles, tags can't be edited, and Save scrolls away beside a "Done" that drops changes.
10. Dead ends and leftovers are visible: products on a Page aren't links, /p/[place] shows placeholder text, the "Where is this made?" step is empty, "follow vendors" copy remains, and /following is shadowed by a redirect.

## Token inconsistencies

- No token utilities are used (`bg-accent` 0×). All 382 refs use `x-[var(--color-*)]`.
- A parallel grey system runs alongside the tokens: 348 raw palette classes (neutral 251, gray 37, red 25, zinc 22, amber 12), plus `bg-white` 54× and black scrims at 4 opacities.
- `--color-danger` is used 5× but never defined. Errors otherwise use red-500/600/700.
- The radius scale is inverted: `rounded-lg` (1rem) is now bigger than `rounded-xl` (0.75rem). Inputs are 1rem, buttons and cards 0.75rem.
- Charcoal is used as a CTA fill on 5 sheet buttons, against its own rule. Selected states come in 3 colours.
- The 6 ownership tokens are never used, and their hex values are duplicated in map-config.
- There are 27 arbitrary text sizes (9–26px) and 9 arbitrary shadows. Button weights mix medium and semibold.
- `--nav-height` is used once. Nav clearance is hand-typed (pb-24 ×12, bottom-20, 64px), and 44px targets are written 3 ways.
- There are ~10 separate sheet/modal builds (switching at sm: vs md:), 5 inline toasts beside an unused Toast, 4 Follow buttons and 4 area pickers.
