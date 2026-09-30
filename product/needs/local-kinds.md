---
id: what-local-kinds
purpose: The kinds of local enterprise a metro actually contains — the seed vocabulary for the initial tag list, and the working set for testing whether a surface holds real variety. Not a taxonomy anyone picks from.
layer: what
status: draft
---

# Local kinds

**This is a seed list, not a category system.** `nouns.md` § Tag is ratified and
explicit: a tag is *"created, not picked from a fixed list"*, and the **Won't**
line bars *"a coarse category a creator picks alongside it"*. Nothing here
reverses that, and nothing here should ever become a dropdown.

What it is for, both sanctioned by existing rulings:

1. **Seeding the initial tag list.** `DECISIONS.md` 2026-09-13 retired
   "Something else" and ruled *"its rows seed the initial tag list"*. A tag
   store that opens empty asks the first hundred creators to invent a
   vocabulary from nothing; one that opens with real words gives them something
   to recognise or reject. These are candidate words.
2. **A working set.** Six sample Pages are not enough to know whether Browse,
   the map or a card holds up. This is the variety a real metro has.

**Status is `draft` because half of it is proposed rather than observed.** Every
row below is marked. Don can accept or cut the proposed half without touching
the borrowed half.

---

## Borrowed — present in the code that was retired

These existed in `socialus-web` before the vendor deletion (#124) and are
recorded here because the code that held them is gone. They are observed, not
invented.

### The twelve retired categories

`groups.category` still carries these; the column loses its writer when the
category step goes. **Eight were live in `lib/categories.ts`:**

| Category | Emoji |
|---|---|
| Bread & Baked | 🍞 |
| Produce | 🥬 |
| Honey & Jams | 🍯 |
| Soap & Body | 🧼 |
| Candles | 🕯️ |
| Plants & Flowers | 🌸 |
| Crafts | 🎨 |
| Meat & Eggs | 🥚 |

**These are a farmers-market stall list, and that is the shape of the problem.**
They describe what someone sells at a Sunday market, not what a local enterprise
is. That narrowness is a large part of why the category step is being retired.

### The recruitment groupings, and their examples

From `RecruitmentGrid` — ten groupings with worked examples. The **groupings**
are the more useful half: they are how a person would sort local enterprise
before anyone imposed a schema.

| Grouping | Examples present in the code |
|---|---|
| Food Makers | Home Baker, Fermenter, Preserves & Honey Maker, Cooking or Baking Instructor |
| Growers | Eastside Urban Farm, Mushroom Grower, Backyard Orchardist, Native Plant Landscaper |
| Animal Products | Beekeeper, Small-Flock Egg Producer, Wool Producer |
| Home & Body Goods | Soap & Skincare Maker, Candlemaker |
| Textile & Fiber | Knitter or Crocheter, Sewing & Mending Teacher |
| Wood & Metal Makers | Furniture Maker, Jeweler, Leatherworker |
| Repair & Restoration | Shoe & Leather Repair, Watch & Clock Repair, Bicycle Mechanic |
| Traditional Trades | Independent Auto Mechanic |
| Teachers & Workshops | Fermentation Workshop |
| Local Service Providers | Independent House Cleaner |

### Ownership tiers

Six, from the retired `OwnershipTier` union, rendered as a dot plus a sentence:

| Tier | Sentence shown |
|---|---|
| `coop` | Worker or member owned |
| `independent` | Locally owned and operated |
| `mission-driven` | B Corp / Public Benefit Corporation |
| `local-franchise` | Locally owned franchise |
| `challenger` | Competing against market consolidation |
| `pe-corporate` | Private equity or corporate owned |

**This is a different axis from everything else on this page** — it describes
*who owns a thing*, not *what it does*, and it was the only one the retired UI
gave a coloured badge. `StatusDot` keeps the shape. Whether the platform
re-adopts the axis at all is unruled; the extractive tier in particular is a
judgement the platform would be making about a business, which is a heavier act
than a tag.

---

## Proposed — added here, observed nowhere

**Everything below is mine, not Don's and not the code's.** The borrowed list is
a farmers market; a metro is not. These extend the recruitment groupings to what
a city actually holds, keeping that structure because it is the part that was
working.

*Food and drink*
- Café · coffee roaster · bakery · butcher · fishmonger · cheesemonger · greengrocer
- Brewery · cidery · winery · distillery · taproom
- Food truck · caterer · meal-prep cook · pop-up kitchen
- Restaurant · diner · deli · takeaway

*Growing and land*
- Market garden · CSA · nursery · seed grower · beekeeper *(borrowed)*
- Landscaper · arborist · garden designer · permaculture practitioner

*Making*
- Ceramicist · glassblower · woodworker · blacksmith · print studio
- Tailor · cobbler · upholsterer · sign painter · framer
- Instrument maker · bookbinder · candle and soap maker *(borrowed)*

*Repair and maintenance*
- Bike shop · auto mechanic *(borrowed)* · appliance repair · electronics repair
- Locksmith · cobbler · watchmaker *(borrowed)* · tool sharpening
- Plumber · electrician · carpenter · roofer · painter and decorator

*Body and health*
- Barber · hairdresser · nail technician · tattooist
- Massage therapist · physiotherapist · acupuncturist · yoga or pilates studio
- Independent pharmacy · optician · dentist · veterinarian

*Learning and practice*
- Music teacher · language tutor · driving instructor
- Craft workshop *(borrowed)* · cookery school · art class
- Dance school · martial arts dojo · climbing or fitness gym

*Care*
- Childminder · nursery · after-school club
- Dog walker · pet sitter · groomer
- Home care · cleaner *(borrowed)*

*Goods and retail*
- Bookshop · record shop · game shop · toy shop
- Hardware store · garden centre · fabric and yarn shop · art supplies
- Charity shop · vintage and secondhand · repair café

*Places people gather*
- Pub · bar · music venue · cinema · theatre
- Community centre · library · place of worship · allotment
- Makerspace · co-working space · studio collective

*Services*
- Photographer · designer · web developer · bookkeeper
- Solicitor · estate agent · travel agent
- Printer · courier · removals

---

## What this is not, and what it might become

**Not a dropdown.** A creator writes their own word. If this list ever appears
in a composer as options, the ratified tag rule has been broken.

**Not an ordering.** `nouns.md` § Tag: *"Won't — a tag that orders results."*

**Should it become a schema enum or a lookup table?** Probably a **table, and
not an enum** — but not yet, and not on this document's say-so.

- An **enum** is wrong: every addition is a migration, and this list is
  explicitly expected to grow from what creators write.
- A **lookup table** seeding the tag store is plausible — rows a creator's tag
  can match against for search, with no constraint that a tag must be in it.
  That is the shape `DECISIONS.md` already implies when it says the retired
  suggestion rows *"seed the initial tag list"*.

**Deciding that needs the tag store to exist**, which is blocked on
report-and-takedown (`nouns.md` § Tag, `[member-content-takedown]`). Recorded
here so the list is not lost; the schema question stays open.
