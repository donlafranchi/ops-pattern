---
id: F092
title: Narrowing happens in a modal that writes what it did
status: approved
date: 2026-09-19
depends: [F091]
approved: 2026-09-19 — Don ruled filtering lives in a modal that writes its selection into the search box as text, Gmail-style.
---
## Story

Rae wants coffee this weekend. She taps the filter control beside the search box; a panel comes up over the results. She picks *this weekend* and *coffee* and taps apply. The panel closes and the search box now reads what she chose, in words. The results narrow to match. Next time she skips the panel and types it herself, because she has seen what it looks like.

## Acceptance

1. No filtering control sits beside the results. The only thing on the results surface is the control that opens the panel.
2. Applying dismisses the panel and writes the selection into the search box as text a person can read and retype.
3. The results match the text in the box, whether that text was written by the panel or typed by hand.
4. Every string the panel can write is understood by the reader of that box.
5. Text that is not understood opens the panel. It does not error, and does not empty the results without saying so.
6. Clearing the box clears the narrowing.

## Why

**This threads design-language principle 10 rather than amending it** *(Don, 2026-09-19)*. That principle already says filtering controls live in *a filter surface*, not on the results surface — a modal is the shape it names. Criterion 1 is what keeps it honest: `ActiveFilterChips` and `KindFilterPills` ship on Explore today and are exactly the chip and pill rows the principle removed. They go with the rewrite; surviving beside the panel would make the panel a dodge.

**Criterion 4 is the whole risk, and it is also what makes this affordable.** The panel defines the grammar, so the parser's required input is the set of strings the panel emits, plus graceful failure. It does not have to understand prose. **A panel that writes a string its own reader cannot parse is worse than no panel** — the product would contradict itself in public.

**Criterion 2's stated purpose is teaching** — Don: the box demonstrates the syntax by writing it, and typing it directly is the same path once someone has seen it. That is why the text has to be readable words rather than an opaque encoding.

**Criterion 5 replaces Issue #57's "unparseable input falls back to chips."** Chips are the thing principle 10 removed.

## Not this

Natural-language understanding. Saved searches. A second entry point to the panel. Narrowing that survives a link without being in the text — the text is the state.
