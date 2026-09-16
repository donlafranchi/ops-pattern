---
id: F071
title: A stranger searches, and finds someone
status: draft
date: 2026-09-12
depends: [F059]
---
## Story

Mara has just moved and wants good bread. She opens the app and the search box offers a few things people actually look for — *sourdough*, *yoga*, *guitar lessons*. She types "sourdough". Nothing in her neighbourhood has that word on it, but the curated dictionary maps it to the tags *bread* and *bakery*, so she gets the bakers and the jam maker anyway. On a quieter day the same search finds nothing at all, and rather than an empty screen she is shown what *is* near her, so she learns the neighbourhood is thin rather than that the app is broken. She has not signed in and is never asked to. Meanwhile Priya, setting up her bike-repair Page, sees a line telling her which words will find her — including the tags she picked.

## Acceptance

1. Search matches a Page on three sources: the curated term dictionary, the Page's own tags, and the Page's own text — its description, what it offers, and its posts. A Page matching on any one of them is returned.
2. A term in the dictionary returns Pages carrying the tags it maps to, even when no Page contains that word.
3. A search matching a Page's tag returns that Page. Tags are authored by the creator, not picked from a fixed list, and are visible to anyone viewing the Page.
4. There is no category anywhere — not as a control, not as a field a creator fills in. **Tags are the only vocabulary**, and search is the only filter.
5. The pre-search state shows a small set of example searches in plain words, not a category list or a taxonomy.
6. A search with no matches shows what is near the searcher instead of an empty result set, and says in one line that nothing matched the words used.
7. The no-match state never renders as an error, a dead end, or an empty page.
8. Every search behaviour above works for an anonymous visitor: no sign-in wall, no truncated result set, no prompt to register before results.
9. A Page creator sees, at the point of writing their description and on their own Page, one line telling them what makes them findable.
10. No copy in the creator tips carries legal, tax, or entity language, and none promises placement or ranking.

## Not this

Free-text search over posts' bodies ranked by relevance — matching is enough at this size. Autocomplete, spell-correction, or synonym expansion beyond the curated dictionary. A surface for editing the dictionary. Saved searches. Any use of the embedding tables.

**The creator-facing half of tags is NOT in this scenario and needs its own.** Authoring a tag, the store behind it, and **moderating tags that are now public** — member-contributed content other members see, which [member-content-takedown] bars from production without a report-and-takedown path. This scenario covers only that search matches tags that exist.

**The dictionary's automation is not here either.** An LLM agent proposing entries from submitted tags and zero-result searches, and the human approval gate before anything reaches the live dictionary, are their own work.

**Open questions in `DECISIONS.md`, not here** (the three-section format is unbroken across every scenario): what triggers the LLM pass and who approves its output; whether public tags are moderated before or after they appear; and how the dictionary grows.
