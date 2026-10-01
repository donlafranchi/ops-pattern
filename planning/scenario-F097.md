---
id: F097
title: Values shape what's recommended, and nobody can search them
status: draft
date: 2026-10-01
depends: [F071, F096]
---
## Story

Ana cares where her money goes. At signup she is asked how she looks for products and services, and she says she buys local when the people are treated well. So she is offered her values: she ranks price, employee care, eco-responsible and fair trade in that order, and adds a few values tags of her own. Nobody else ever sees them. Over the next weeks Explore recommends a bakery that pays its bakers well and a soap maker who refills jars, mixed in with things she follows and new Pages nearby, and nothing says which of her values matched. The bakery chose to show a "pays a living wage" badge on its Page; the soap maker added the same kind of value privately and shows nothing. Neighbours who bought from the bakery said what they liked, and its Page carries a ribbon for it, not a count. Someone who dislikes one of those values can't search for it and find who holds it.

## Acceptance

1. **A member's values and their ranking are visible to that member only,** and never appear on a Page, in a result, in a URL or to an outside agent.
2. **No search, filter or lens takes a value as input,** for members or for Page owners.
3. **Recommendations blend values with at least two other signals,** and a recommendation never states which value matched.
4. **Values tags are stored apart from other tags.** A Page owner shows or hides each one separately as a badge; hidden is the default, and hiding one removes it everywhere.
5. **Onboarding asks one open question about how the member looks for things;** values are offered only when the answer includes them, and adding any is optional.
6. **Neighbours' endorsements show as a meter, ribbon or banner, never a number.**
7. **Change in values is counted across the metro, never kept as one member's history.**

## Not this

Not launch. Not approved. No values search, no price comparison, no third-party certification checks, no platform-assigned values, no score shown for a person.

## Why

**Safety is the reason values are private and unsearchable.** A search on a value outs everyone who holds it, including a member who doesn't feel safe sharing who they are where they live (Don, 2026-10-01). Blending signals means a recommendation can't be reverse-engineered into one value; it is harder, not impossible, and the copy should say private, not secret-proof.

**A ranked list and open values tags are two layers.** The ranked list is a short platform-owned set saying how someone chooses; values tags say what they care about, in their own words, moderated after like any tag.

**Metro-wide counts, not personal history,** because a stored record of one person's changing beliefs is a liability if it leaks, and the question — should the categories be broader — needs only the totals.

**Background:** `values-shopping-agent-concept_2026-09-30` (chat, 2026-09-30) argued the case against price-only agents. Its price band, weights, certification APIs and team-assigned tags are not carried here.

[open-question owner=don raised=2026-10-01] What do outside agents (ChatGPT, Google) see? A) **Who exists, the description and opt-in badges, with a link to SocialUs — no values, prices or posts.** B) The same plus a price range. C) Everything public in the app. *Recommend A;* it is the 2026-09-21 thin public tier, and prices are what is happening.

[open-question owner=don raised=2026-10-01] Does the meter break the Won't line "the platform never rates, ranks, or labels a person"? A) **Narrow the Won't to people, and allow a Page meter worded as what neighbours said.** B) Show endorsements as words only, no meter. *Recommend A,* with care: a one-person shop's Page is close to that person.

[open-question owner=don raised=2026-10-01] Recommending by values orders results, and the Tag entry says "never a tag that orders results". A) **Values are their own noun, not tags, so the Never stands for tags.** B) Lift the Never. *Recommend A;* written that way in `product/foundation/nouns.md`.

[open-question owner=don raised=2026-10-01] Values can reveal belief, religion or identity, which California privacy law treats as sensitive. Who checks before build? A) **Counsel reviews the values design before it is approved.** B) Build first, review before launch of the feature. *Recommend A.*

[platform none]
