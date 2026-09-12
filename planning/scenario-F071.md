---
id: F071
title: A stranger searches, and finds someone
status: draft
date: 2026-09-12
depends: [F059]
---
## Story

Mara has just moved and wants good bread. She opens the app and the search box offers a few things people actually look for — *sourdough*, *yoga*, *guitar lessons*. She types "sourdough". Nothing in her neighbourhood has that word on it, but the curated dictionary maps it to Food & Drink, so she gets the bakers and the jam maker anyway. On a quieter day the same search finds nothing at all, and rather than an empty screen she is shown what *is* near her, so she learns the neighbourhood is thin rather than that the app is broken. She has not signed in and is never asked to. Meanwhile Priya, setting up her bike-repair Page, sees a line telling her which words will find her.

## Acceptance

1. Search matches a Page on three sources: the curated term dictionary, the category a matched term maps to, and the Page's own text — its description, what it offers, and its posts. A Page matching on any one of them is returned.
2. A term in the dictionary returns Pages in its mapped category even when no Page contains that word.
3. Categories appear nowhere as a control — no pill row, no chip row, no filter surface. Search is the only filter.
4. The pre-search state shows a small set of example searches in plain words, not a category list or a taxonomy.
5. A search with no matches shows what is near the searcher instead of an empty result set, and says in one line that nothing matched the words used.
6. The no-match state never renders as an error, a dead end, or an empty page.
7. Every search behaviour above works for an anonymous visitor: no sign-in wall, no truncated result set, no prompt to register before results.
8. A Page creator sees, at the point of writing their description and on their own Page, one line telling them what makes them findable.
9. No copy in the creator tips carries legal, tax, or entity language, and none promises placement or ranking.

## Not this

Free-text search over posts' bodies ranked by relevance — matching is enough at this size. Autocomplete, spell-correction, or synonym expansion beyond the curated dictionary. A surface for editing the dictionary. Saved searches. Any use of the embedding tables. **Two things this scenario deliberately does not settle — who authors the dictionary and how it grows — are open questions in `DECISIONS.md`.**
