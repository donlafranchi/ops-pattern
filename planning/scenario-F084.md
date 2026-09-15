---
id: F084
title: Every word the app says lives in one file
status: draft
date: 2026-09-15
depends: []
---
## Story

Don wants to change a sentence. Today that means finding which of ninety-odd component files holds it, editing TSX, and hoping it isn't also written slightly differently somewhere else. After this, there is one file. He says which words should change, an agent edits that file, and it deploys. Nothing is hunted for, because there is nowhere else for words to be.

## Acceptance

1. **No component file contains a user-facing string literal.** Every rendered word is imported from the copy module.
2. The module is **typed**: a missing or misspelled key fails the build, never at runtime in front of a member.
3. Changing any wording is an edit to **that one file and nothing else** — no component touched.
4. **No rendered text changes during the extraction.** The app reads identically before and after; this moves words, it does not rewrite them.
5. Strings with values in them (counts, names, dates) are **functions taking typed arguments**, never assembled by concatenation at the call site.
6. The person-noun check of `product/foundation/nouns.md` can run against **the module alone** and produce the same verdict as scanning the whole app.

## Not this

Rewriting, shortening, or improving any string — that is F083 and Don's own writing, and doing it here would hide a copy change inside a mechanical one. Copy in the database with an editing screen — that is option B and was not chosen. Extracting strings from files already slated for deletion. Translation or locale support.

## What it costs, and when

**Roughly 458 strings across 93 of the app's 129 component files.** Mechanical, low-risk, and large: **~3–4 days**, dominated by verification rather than typing, because criterion 4 means every touched surface has to read the same afterwards.

**Do the vendor-route retirement first.** The three densest files — the old producer signup, the vendor page, the vendor form — hold about **60 strings between them and are already scheduled for removal**. Extracting them would be work thrown away twice.

**Sequence with the lint, don't land them together.** The module first, then the check pointed at it: scanning one typed file is a far simpler and more reliable check than walking every JSX text node and rendered prop. **But if this scenario slips past launch, ship the lint in its broader form anyway** — the person-noun rule has had no hook twice now (`LESSONS.md` 17, 26), and waiting for the easier version is how it goes a third time.

**Launch or right after is Don's call.** It is the enabler for every other copy change, so it wants to be first — but three or four days of mechanical work against a launch plan with ~28% slack is a real bite, and nothing a member sees gets better on the day it lands.
