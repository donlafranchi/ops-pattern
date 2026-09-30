---
id: F061
title: Someone creates a Page worth showing people
status: building
date: 2026-09-10
depends: []
---
## Story

Don opens the composer to make his own business's Page. He types a real address; suggestions come from the same geocoder the rest of the app uses, and a map thumbnail confirms the pin before he continues. He picks or creates a tag in his own words, adds a photo or skips it, writes two sentences, and publishes. If he closes the composer mid-way, it resumes exactly where he left off — including review.

## Acceptance

1. An address search resolves to real coordinates with a confirming map pin before the step completes; an unresolvable address refuses loudly rather than defaulting to a placeholder point.
2. A "give a neighbourhood instead" option is visible on the same step — and neighbourhood-mode Pages do not expose a street address anywhere.
3. The step asks for a **tag**, picked or created in the creator's own words. **No category is offered and no free-text "Something else" field exists.** *(Amended 2026-09-15 — this scenario is `building` and read "exactly one category is required, from twelve terms plus a free-text 'Something else'". **Both were retired 2026-09-13**; `socialus-web` #28 would otherwise build them. The tag step itself shipped in PR #66.)*
4. A Page's map/card placement comes from a single resolver evaluated at read time — nothing precomputed or cached.
5. Resume returns to the first incomplete step, including review, and every step after the first states progress is saved.

## Not this

Editing a Page that's already live (F056). Browse, search, or the map's rendering of any of this (F059, F062). Verification of any kind.
