<!-- Not an index. One file per ruled finding; nothing here lists the others. -->

# accepted-risks/

One JSON file per lint finding ruled acceptable. Read by `scripts/advisor-diff.sh`, not by people — the ruling itself is a dated line in `../DECISIONS.md`, and that is what settles a question. See `../PIPELINE.md` § Accepted risk.

**Filename is the identity.** `<cache_key>.json` when the advisor has given one; otherwise `<lint>__<object>.json`, sanitised to `[a-z0-9_]`. Either way it is derived from the finding, so two agents ruling the same finding write the same filename and collide in git — which is the argument you want to have, out loud, instead of two rulings landing side by side.

One file per finding is also why dozens of agents can work here at once: nobody appends to a shared list.

**Fields:** `cache_key`, `lint`, `object`, `severity`, `source`, `decision` (the `DECISIONS.md` date), `evidence`, `why`, `revisit_if`, `review_by`. A `cache_key_pending` note means the key is still null — fill it verbatim from the first export that reports it and rename the file to match. Never derive a key from the naming pattern: one that looks right but never matches stops suppressing silently, which is worse than null.
