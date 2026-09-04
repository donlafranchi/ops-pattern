---
purpose: Step one of the v1 storyboard effort — the journeys the product actually implies, where each one breaks today, what onboarding exists, a ranked v1 recommendation, and a storyboard template with one worked example.
layer: how
status: backlog
---

# Initiative: Storyboards for v1 — the journey list first

> **This doc is not a set of storyboards.** It is the list the PM ratifies before any storyboard gets drawn, plus the format proposal and one worked example to react to.
>
> **PM priority driving this:** *"The important part to get right is the storyboarding and onboarding. Members don't really know what this project is so we need to teach and guide them simply and not get in the way."*
>
> **Two constraints held throughout.** (1) No new features are designed here. Where a journey needs a capability that does not exist, it is flagged as a **gap**, not specified. (2) Every journey assumes the **ratified two-tab nav** — Home / **+** / You, with Explore absorbed into Home ([`decision-surfaces.md`](decision-surfaces.md)) — not the three-tab nav in production today.

**On ratification:** this overview moves to `planning/now/` and spawns one child item per approved journey (`initiative-storyboards-v1-{journey}.md`), each carrying that journey's storyboard.

---

## 1. The journeys the product actually implies

Ten journeys fall out of the capability docs, the b1 bundle, and the live routes. Each is named by **who the person is**, **what they arrived wanting**, and **what done looks like**.

### Journeys b1 genuinely supports

| # | Journey | Who / arrived wanting / done | State |
|---|---|---|---|
| J1 | **The curious stranger** | Someone who got a link or heard about it, has no account, and wants to know what this is and whether anything here is for them. Done: they can say what the platform is, and they have seen one real thing near them worth acting on. | **Functions, teaches nothing.** The feed renders for anonymous visitors. No sentence anywhere explains the product. |
| J2 | **The newcomer signs up** | A visitor who decided to make it theirs. Done: an account, a name, a locality that is actually theirs, and a feed about their place. | **Thin.** Works end to end (F030, evals green), but asks one question and defaults the rest. |
| J3 | **The share recipient** | Someone sent a link to a specific event, product, or person. Done: they understand the thing, who is behind it, and what the surrounding platform is. | **Partial and lossy.** 3 of 7 item kinds have a detail page; Member pages are private by default. |
| J4 | **The responder** | A visitor who found something they like. Done: they have followed / RSVP'd / saved it, and can find it again. | **Partial.** Responses store correctly; the payoff surface is pre-rebuild. |
| J5 | **The seller sets up shop** | A market vendor or maker who wants to be findable the other six days. Done: an active Shop with a live product or service on a public page. | **Complete.** The only journey that works end to end (F036 / F038 / F040 / F037, all evals green). |
| J6 | **The returner** | A signed-in Member coming back. Done: they see what is new from the people, groups, and venues they follow. | **Split.** `/you/following` is rebuilt and correct; `/you` around it is pre-rebuild vendor data. |

### Journeys that are aspiration, not b1

| # | Journey | Why it is not a b1 journey |
|---|---|---|
| J7 | **The host** — a neighbor with something happening who wants people to know. Done: a public Event page with a shareable link. | The **capability** ships (F034, merged, evals green). The **journey** does not: the only route to the gathering composer is `/you/sell`, which redirects to `/you` unless the Member has an active **business** Group. A person hosting a run club must first walk through *Sell* and open a shop. That is the People-First Principle inverted at the one surface where it is most visible. |
| J8 | **The wonderer** — floats an idea to test interest before committing (Loop 2, the platform's lowest-activation-energy loop). | No composer, no detail page (`/i/`). A Wonder cannot be created or viewed. Named in b1 scope; not built. |
| J9 | **The group starter** — a set of people who became a unit and want to name it. | No `/g` index and no `/g/new`. Five of six Group kinds cannot be created at all; `business` is creatable only via the Sell walkthrough. Group *pages* render (F035); Group *creation* does not exist. |
| J10 | **Mutual aid — the asker and the offerer** (Loops 5 and 6). | No composer and no detail page for `ask` or `offer`. Schema only. |

**The honest count: six journeys b1 has, four it does not.** J7 is the painful one — the code exists and is unreachable to anyone who is not selling.

---

## 2. Where each journey breaks

Explanation gaps are listed alongside function gaps, because the PM's point is that people do not know what this is — and a working screen that explains nothing is still a broken journey.

### J1 — The curious stranger

- **No product name on mobile.** "SocialUs" appears only in `TopNavDesktop`, which is `hidden md:flex`. On a phone — the ratified primary form factor — the name is not on screen anywhere.
- **No explanation anywhere in the app.** The b1 bundle lists *"The thesis page. Linked from every page; names the squeeze, the antidote, and the platform's commitments."* **No such route exists.** There is a draft at `product/exploration/about-page-draft.md`; nothing is built. **Gap.**
- **The first sentence a stranger reads is a conversion ask.** The top card on Home is "Make this yours — Sign in to set your home locality and follow what you love." It asks before it tells.
- **The scope picker asks a question they cannot answer.** Up to 12 neighborhood names with no map and no context. A stranger who does not recognize "Oak Park" learns nothing from being offered it.
- **Cards carry no explanation of the kind system.** A chip reads "Idea" or "Ask" with no indication of what those mean here.

### J2 — The newcomer signs up

- **Onboarding asks exactly one question: "What should we call you?"** Then it is over.
- **The Member never picks their locality.** `completeOnboardingAction` defaults it server-side. The platform's core promise is *near you*, and the newcomer is never asked where "near" is. (F049, "newcomer picks a hood and a metro at signup", sits in `backlog/`.)
- **A magic link means leaving the app.** Sign-in requires opening an email client and returning. This is the single largest drop-off point in the funnel and no screen acknowledges it.
- **Nothing is taught.** No tour, no first-run explanation, no "here is what you can do." Deferred to T2 in [`landing-page.md`](../../product/capabilities/landing-page.md), but that deferral was made when a thesis page was assumed to exist.
- **There is no landing page.** `landing-page.md` specs a full-screen branded first-visit surface with Sign Up / Log In / Browse as Guest. **It is not built.** `/` is the feed. **Gap.**

### J3 — The share recipient

- **9 of 16 seeded items link to a 404** ([`decision-item-canonical-urls.md`](decision-item-canonical-urls.md)): 4 Group-filed rows (the `/m/` resolvers reject a row with a `group_id`) and 5 rows of the four kinds with no route at all (`ask`, `offer`, `wonder`, `initiative`). Every browse surface emits these links.
- **Member pages are private by default.** An anonymous visitor following a link to a non-public Member gets a 404 — correct privacy behavior, but it means "here's my profile" often does not work.
- **A landed visitor has no way back to an explanation** — there is nothing to go back to.

### J4 — The responder

- Responses on the three shipped item pages work. **The place they show up does not.** `/you` reads `follows`, `supports`, `businesses`, `markets`, `vendor_categories`, `market_vendors` — all pre-rebuild tables. A Member who follows a Member, Group, or Venue sees it in `FollowingSummary` and `/you/following` (both rebuilt), while the tabs directly beneath show vendor-era saved/following lists from a different data model.
- **Two "Following" surfaces exist**: `/following` (vendor-era, still routable) and `/you/following` (current). Both are reachable.

### J5 — The seller sets up shop

- **The flow works. The front door is wrong.** `/join` is headed *"For vendors — Sell at a farmers market? Get listed free."* It is farmers-market-vendor framing for a platform whose thesis is people declaring things where they live, and its "How it works" promises surfaces that no longer exist as described (a map, product search, market-attendance notifications).
- **The signed-out `/you` shell says "Sign in to follow vendors and save your market"** — vendor vocabulary at a primary nav destination.
- `/register-vendor`, `/vendors/[slug]`, `/business/[slug]`, `/you/vendor/*` still build and ship.

### J6 — The returner

- `/you` is the pre-rebuild page described above. Its "Your Market" row and `MarketSelector` belong to a retired model.
- **"Edit profile" on `/m/[handle]` links to `/you`, which has no profile editor.** A Member cannot change their bio, avatar, or contact fields anywhere in the app. **Gap.**
- Under the ratified two-tab model, You becomes the production/organizing side. Today it is a vendor account page.

### Cross-cutting

- **Distance is still on screen.** The venue page renders "X mi away" (`milesLabel`), and Explore's filter sheet still offers a distance filter — both contradict the ratified *"nothing in the product measures or displays miles"* ([`decision-surfaces.md`](decision-surfaces.md) § Distance is out). Storyboards must not draw them.
- **The nav is the old three tabs.** Home / Explore / You, no **+**. Every storyboard assumes Home / **+** / You.
- **Item card media** is in flight on branch `t118` (uncommitted worktree) — treat the card's media block as *becoming* always-present, per the ratified recipe.

### What a signed-out visitor can and cannot do

**Can:** browse Home's locality feed, switch localities, use Explore's search / kind pills / filters / map, open the three item kinds that have pages, open a public Member page, open a Venue page, open a Shop page.

**Cannot:** follow, RSVP, save, say "I'd be in", create anything, message, or read any explanation of what the platform is. Every write path routes to `/auth/login?next=…`.

---

## 3. What onboarding exists today

**Read honestly: almost nothing.** There is no landing page, no tour, no explanation, and one question. In order, from landing to first useful action:

1. **Land on `/`.** The locality feed renders. On mobile there is no product name on screen. There is no statement of what this is.
2. **Top of the feed: "Make this yours."** Sub-line: *"Sign in to set your home locality and follow what you love."* Button: **Sign in** → `/auth/login?next=/onboarding`.
3. **`/auth/login`.** *"Sign in to SocialUs — Enter your email and we'll send you a link. No password — new here or not, this is the way in."* One email field. (`/auth/signup` is a redirect to this page; there is no separate sign-up.)
4. **"Check your email."** The person leaves the app.
5. **They open the link on the same device.** `/auth/callback` → `/onboarding`.
6. **`/onboarding`.** One field: *"What should we call you? — This is the name your neighbors will see."* One button: **Continue**.
7. **Back to `/`.** The same feed, minus the sign-in card. Locality was chosen for them. Nothing else has been asked or explained.

**That is the entire onboarding.** One sentence of value proposition ("Sign in to set your home locality and follow what you love"), one name field, and a redirect back to where they started. A Member finishes onboarding without ever being told what the platform is for, what an Item is, what the kinds mean, or that they can make something.

**The `/join` page is not onboarding for members** — it is a vendor recruitment page. Until today it pointed at `/register-vendor`, a route being deleted; it now points at `/you`, which shows an anonymous visitor an empty shell. Its own source comments the arrangement as interim.

---

## 4. Recommendation — which journeys matter for v1

Ranked by *where a newcomer forms their understanding of what this is* — the PM's stated weighting.

**1. J1 — The curious stranger.** *Storyboard first.* This is the PM's complaint stated precisely: someone arrives and nothing tells them what this is. It is also the cheapest to fix, because it is almost entirely explanation rather than function. Every other journey inherits its failure — a person who never understood the platform does not understand the item page either.

**2. J2 — The newcomer signs up.** *Storyboard second.* Seven steps, one question, an email round-trip, and no teaching. It is the thinnest surface in the product and the one where "teach and guide simply, don't get in the way" is most directly testable. Storyboarding it will force the locality question (F049) to a decision.

**3. J3 — The share recipient.** *Storyboard third.* Realistically the most common first contact — the platform's own sharing model is "phone to phone: a link, copied or sent." It is also where the 404 rate is concentrated. A storyboard here makes the canonical-URL decision unavoidable instead of deferred.

**4. J4 — The responder.** *Storyboard fourth, short.* The first useful action a newcomer takes and the moment an account starts to pay off. Small surface, high leverage, mostly built.

**5. J7 — The host.** *Storyboard fifth, explicitly as a gap document.* Not because it works — it does not — but because storyboarding it is how the business-Group gate gets seen for what it is. The platform's stated identity is people-first, and today a person cannot host a run club without opening a shop. **No new feature is designed here; the storyboard names the missing door and stops.**

**6. J5 — The seller sets up shop.** *Storyboard sixth, scoped to the door only.* The flow itself works and teaches us least. What needs storyboarding is the entry — `/join`'s vendor framing and the vendor vocabulary on `/you` — not the walkthrough behind it.

**7. J6 — The returner.** *Defer until the You rebuild is scoped.* Storyboarding a surface that is about to be replaced wholesale produces a drawing of something nobody will build.

### Cut from v1 — recommend not storyboarding

- **J8 (wonderer), J10 (asker / offerer)** — no composer and no detail page. Storyboarding these is designing features, which this effort has been told not to do. They are the strongest candidates for the *next* round, and J8 in particular is the platform's lowest-activation-energy loop.
- **J9 (group starter)** — same reason: no create surface exists for any Group kind outside the Sell walkthrough.

**Recommended v1 set: J1, J2, J3, J4, plus J7 and J5 as scoped gap/door documents. Six storyboards, four of them full.**

---

## 5. What a storyboard should contain

### Proposed template

Each storyboard is one file. A short header, then one block per frame.

**Header**
- **Person** — a specific someone, not a persona label.
- **Arrived from** — the actual entry vector (a texted link, a search, a flyer).
- **Arrived wanting** — one sentence, in their words.
- **Done looks like** — the observable end state.
- **Nav assumption** — Home / **+** / You (ratified two-tab).

**Per frame**
| Field | What it holds |
|---|---|
| **Frame** | Number + surface + route. |
| **On screen** | What is actually rendered, top to bottom. Present tense, no wishes. |
| **They understand** | One sentence in the person's voice at that moment. This is the field that carries the PM's priority — if it reads "I still don't know what this is," the frame has failed. |
| **They do next** | The single intended action. If there are two, the frame is doing too much. |
| **Drop-off** | The realistic exit, and why. Every frame has one. |
| **State** | `works` / `partial` / `missing`. `missing` names the gap and stops — it does not specify the fix. |

Five fields per frame, six to eight frames per journey. Short enough that the PM can read one in two minutes and say yes or no.

---

### Worked example — J1, The curious stranger

**Person:** Someone at a farmers market whose neighbor said "there's a thing for this, let me send it to you."
**Arrived from:** A texted link to the site root, opened on a phone.
**Arrived wanting:** *"What is this and is there anything on it for me?"*
**Done looks like:** They can say in one sentence what the platform is, and they have opened one real thing near them.
**Nav assumption:** Home / **+** / You.

---

**Frame 1 — Arrival · `/` (Home, signed out)**

- **On screen:** A card reading *"Make this yours — Sign in to set your home locality and follow what you love"* with a **Sign in** button. Below it, the heading *"Near Oak Park"* and a locality picker listing up to twelve neighborhood names. Below that, a two-column grid of cards: a kind chip ("Event", "Product", "Idea"), a title, an owner name, a location line, and a photo where one exists. Bottom of screen: three tabs — Home, Explore, You. **The product's name appears nowhere on a phone.**
- **They understand:** *"Some kind of local listings app. I don't know who runs it, who these people are, or why this exists."*
- **They do next:** Scroll, then tap a card that catches their eye.
- **Drop-off:** High, and silent. Nothing has made a claim worth staying for. The first thing the page said was "sign in."
- **State:** `works` (renders correctly, anonymously) / `missing` (**no statement of what the platform is anywhere in the app — the thesis page named in b1 scope does not exist**).

**Frame 2 — Tapping a card · item detail**

- **On screen:** Roughly half the time, a 404. Nine of sixteen seeded items link to a page that does not exist — four filed under a Group, five of the four kinds with no detail route at all.
- **They understand:** *"It's broken."*
- **They do next:** Back, or leave.
- **Drop-off:** **Terminal.** A 404 on the first tap ends the journey and the impression.
- **State:** `partial` — the three shipped kinds resolve; the rest do not. Decision pending in [`decision-item-canonical-urls.md`](decision-item-canonical-urls.md). **Gap, not specified here.**

**Frame 3 — A card that resolves · e.g. `/m/{handle}/e/{slug}`**

- **On screen:** The Event: title, description, when it recurs, the venue, the host's name linked to their Member page, a hashtag chip or two, and a share affordance. A response action that prompts sign-in.
- **They understand:** *"Okay — a real person put this here, and it's near me. I still don't know what the app is, but I know what this is."* **This is the first frame that teaches anything, and it teaches by example rather than by explanation.**
- **They do next:** Tap the host's name, or tap the response action, or go back to the feed.
- **Drop-off:** Moderate. Interest without a frame to put it in.
- **State:** `works`.

**Frame 4 — Trying to respond**

- **On screen:** Sign-in prompt. Email field. *"No password — new here or not, this is the way in."*
- **They understand:** *"I have to make an account to say I'm interested in a run club. I don't know this app well enough for that yet."*
- **They do next:** Most leave. Some enter an email.
- **Drop-off:** **The largest single drop in the journey.** The ask arrives before any reason to say yes has been given.
- **State:** `works` (functionally) / `missing` (**nothing between arrival and the ask explains the platform — the ask lands cold**).

**Frame 5 — The back button**

- **On screen:** The same feed as Frame 1.
- **They understand:** *"That's it, then."*
- **They do next:** Close the tab.
- **Drop-off:** Terminal.
- **State:** `missing` — **there is no surface to send a curious visitor to.** No About, no thesis, no "what is this." A draft exists in `product/exploration/about-page-draft.md`; nothing is built. **Gap.**

---

**What the worked example shows.** Five frames, and the person never learns what the platform is. Three of the five failures are explanation gaps, not function gaps — no name on mobile, no thesis surface, a conversion ask that precedes any reason to convert. The one function gap (the 404 rate) is already a decision awaiting ratification. **This journey is mostly fixable with words, and that is the finding the PM should react to first.**

---

## Next step

PM reacts to two things: **the journey list and its ranking** (§ 1 and § 4), and **the storyboard format** (§ 5, against the worked example). On ratification, this overview moves to `planning/now/` and one child item per approved journey lands in `planning/backlog/`.
