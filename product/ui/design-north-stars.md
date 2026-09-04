---
id: what-design-north-stars
purpose: The two big-picture design references — Airbnb for style, TikTok (partially) for UX — what each means concretely, where they conflict, and the rule that specific features are decided case by case against best practice rather than copied.
layer: what
status: active
---

# Design North Stars

> Airbnb for style. TikTok for parts of the UX, not the engagement loop. Everything below the big picture is decided case by case. Read this before a design decision; read [`design-language.md`](design-language.md) for what the decision has to be built out of. This doc is directional; that one is binding.

## 1. Airbnb — the style reference

"Look like Airbnb" is not actionable. Six things are what's being pointed at: **photography-forward cards** (the photo is the card, everything else below it), **generous whitespace** (gaps do the separating), **restrained color with one accent** (the feed is monochrome; the content supplies the color), **quiet typography** (one family, few weights, early ceiling), **soft corners**, and **minimal chrome** (hairlines at boundaries, shadows only for things that float).

**Where we already agree.** All six have a home in `design-language.md` — Principles 4, 7, 1, 8, and 6 respectively, and Principle 1 names Rausch Red as the model. On these, "Airbnb" is shorthand for a decision we already made. Cite the principle, not the reference.

**Where we diverge — flagged, not resolved:**

- **Our accent is not their accent.** Pistachio is low-saturation and doesn't register the way a high-chroma red does. [`design-evolution-report.md`](design-evolution-report.md) concluded "used liberally, but only on white." [`card-feed-design-proposals.md`](card-feed-design-proposals.md) §6 concludes the opposite — cut to two roles, because eight green touchpoints read as haze. **Two active docs, opposite instructions, same question.** → `weigh`.
- **Our cards carry a hairline; Airbnb's don't.** Ratified 2026-09-04. Airbnb can let whitespace alone separate cards because every card has a photo supplying its own edge. Ours may not — see §5.
- **Bottom-anchored controls.** Principle 9 follows Maps, not Airbnb's top search pill. Where they disagree, Principle 9 wins; it was ratified against user feedback, not inherited.
- **No 2025-era Airbnb.** The super-app redesign's 3D icons, depth, and spring physics are already ruled out. We take the 2015–2023 discipline, not the exuberance.
- **No guest/host split.** Every Person is one primitive. Selling tools appear conditionally.

## 2. TikTok — the UX reference, partially

"Partially" is doing real work. What's borrowed is narrow and already ratified:

- **The top slider as category sub-nav** (b2 Home: Buy / Do / Learn). Note what changed in the borrowing — TikTok's slider switches *algorithms*; ours switches *intent categories*. Same gesture, different thing behind it, deliberately, because we don't have an algorithm and aren't building one.
- **The 44px nav proportion.** A tight, icon-dominant bar that gives content the viewport.

That is the whole list. **Not borrowed:** the infinite algorithmic feed (Home ranks by location hierarchy — a stated rule a Member can learn, not a model that learns them; pagination is "Show more"), engagement mechanics, and numeric badges. The governing line is *calm over engagement*, which is the UI expression of the no-engagement-optimized-feed commitment in [`../foundation/people-first.md`](../foundation/people-first.md). That commitment is constitutional; a reference app doesn't reopen it.

**This is the most important tension in this document.** TikTok's patterns are good substantially *because the engagement loop pays for them* — infinite content makes a full-bleed feed viable, an algorithm makes a slider meaningful, addictiveness makes tight density worth it. We are taking the surface patterns and refusing the engine. That's a specific bet: that the ergonomics are separable from the loop. It is not obviously true. So for every further TikTok borrow, ask: **does this still work when nothing is optimizing for my attention?** If it works because it's addictive, we don't take it.

## 3. Where the two conflict

Airbnb is slow, deliberate, high-trust, search-led — twenty minutes to spend four hundred dollars. TikTok is immediate, ambient, low-commitment, feed-led — opened in a checkout line. We have both postures, sometimes on one tab. The two-tab model (Home + create + You) makes it resolvable by splitting on *what the Member is doing*, not on which app we're imitating.

| Situation | Winner | Why |
|---|---|---|
| Home browse feed at rest | **TikTok** | Ambient posture, no goal. Density and quiet beat ceremony. |
| Item detail page | **Airbnb** | Where a Member decides to show up or spend. Slow down: generous, one primary action. |
| Create flow | **Airbnb** | Declaring a thing puts your name on it. Considered, stepped, forgiving — not a quick post. |
| Search, filters, map/list toggle | **Airbnb** | The Member has a goal. Legible controls, not gestural ones. |
| Nav and structural chrome | **TikTok** | Ratified. The chrome is furniture. |
| Anything with a counter, badge, or streak | **Neither** — `people-first.md` wins | Not a design question. |

One line: **TikTok wins the browse; Airbnb wins the commit.** Where a surface does both, ask which posture the Member is in, not what the surface is called.

## 4. Everything below the big picture is case by case

Neither reference decides specific features. The map/list toggle — a single inline control rather than a full-width segmented bar — came from evaluating the pattern against our constraints, not from copying anyone.

**How the decision gets made:**

1. **Name the ratified constraints first.** If a principle or a decision in force answers it, it's answered. Stop.
2. **State the alternatives concretely** — "fixed segmented bar / inline text toggle / floating pill," not "make it better."
3. **Test each against *our* conditions**, not the reference app's: small inventory, mixed kinds, partial photo coverage, mobile-first, thumb reach, PWA safe areas.
4. **When it's close, pick the reversible one** (per [`../../playbooks/DECISION-PATTERNS.md`](../../playbooks/DECISION-PATTERNS.md)).
5. **If it introduces an absolute or contradicts a ratified decision, `weigh` runs before it ships** — not after.

**Evidence, strongest first:** (1) our own deployed app, looked at — the 2026-09-03 retrospective found that documents checked against documents failed and documents checked against reality held; (2) a ratified decision or principle here — it already survived the argument; (3) an interaction convention *with its stated reason* (thumb zones, WCAG contrast, touch minimums) — cite the reason, not the convention; (4) a specific behavior in a specific product, described concretely — "Airbnb's filter icon is three sliders, universally recognized" is evidence, "Airbnb does it" is not; (5) a mockup comparison at real viewport size.

**Not evidence:** "it's best practice," "every app does this," "it's modern." If the reason can't be stated in one sentence naming our Members and our constraints, it isn't one.

## 5. What we have that neither reference does

**Airbnb assumes professional photography. TikTok assumes infinite content. We have neither.** Ignoring this is what produces designs that look broken on real data.

1. **Local.** One metro, often one neighborhood. No long tail to fall back on. A design that needs twenty cards to look right will look empty here for a long time.
2. **Small-inventory.** A feed can legitimately hold four things. Empty and near-empty aren't edge cases — they're the launch condition, and they must look intentional rather than failed.
3. **Most Items have no photograph.** Ideas, Asks, Offers, Initiatives often have nothing to show, and coverage may never approach full. **Any recipe legible only at 100% photo coverage is wrong for us.** This is precisely the card problem: the always-present media block with a neutral kind field (ratified 2026-09-04) exists because a card whose height depends on whether someone had a camera gives the grid a ragged rhythm that reads as breakage.
4. **Neighbours, not strangers or creators.** Airbnb carries trust chrome because you're transacting with a stranger; TikTok carries reach chrome because creators compete for an audience. Proximity and a real name do that work for us — so we can drop a layer both references need, and should.

**The test:** before shipping any card, feed, or list design, render it with four items, none with photographs. If it looks broken, it *is* broken — not because the data is wrong, but because the design assumed conditions we don't have.

## Open tensions — resolve, don't silently pick a side

- **Accent quantity in the feed** — the two contradicting docs in §1. → `weigh`.
- **Card containment** — `card-feed-design-proposals.md` §5 proposes shadows; the 2026-09-04 hairline decision partly resolves it and Principle 6 partly forbids it. Confirm closed, or route the remainder.
- **Stale sections in the thesis** — [`design-research-thesis.md`](design-research-thesis.md) §2, §5, §6 and its appendix are written against three tabs (Home/Explore/You) and a distance filter, both retired 2026-09-03. Read them for their *reasoning*, which holds; not for their *conclusions*, which don't.

## Related

[`design-language.md`](design-language.md) — the binding tokens, principles, and recipes. [`design-research-thesis.md`](design-research-thesis.md) — long-form research behind the Airbnb read; partly stale on nav. [`design-steal-sheet.md`](design-steal-sheet.md) — the wider set; Letterboxd, Linear, and Are.na are the craft references, Airbnb and TikTok the big-picture two. No conflict: the steal sheet is about craft and calm, this doc about style and posture. [`../foundation/people-first.md`](../foundation/people-first.md) — why the engagement loop is refused.
