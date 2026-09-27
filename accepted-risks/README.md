<!-- Not an index. One file per ruled finding; nothing here lists the others. -->

# accepted-risks/

One JSON file per finding ruled acceptable. Read by scripts, not by people — the ruling itself is a dated line in `../DECISIONS.md`, and that is what settles a question. See `../process/PIPELINE.md` § Accepted risk.

**Two kinds of entry, told apart by `lint`.** Supabase advisor findings carry the advisor's own lint name and are diffed by `scripts/advisor-diff.sh`. **Project risks carry `"lint": "project_accepted_risk"`** — things deliberately deferred that have no advisor to raise them. The register was built for the first kind; the second is the same shape because the problem is identical, and the `source` field already anticipated it.

**A project risk carries one extra field, `cost_if_forgotten`.** Plain words, no jargon: what actually goes wrong for a person if nobody looks again. It exists because these are the entries most easily forgotten — somebody already decided they were fine.

**`revisit_if` must be checkable.** Not "before launch". A named event ("the first report of illegal content reaches the review queue"), or a date, or both. `review_by` is the date a human argues it again.

**Where they surface:** `scripts/risks-due.sh` prints anything overdue or due within 21 days and is **silent when nothing is** — a list that prints daily is a list nobody reads. `scripts/view.sh` renders every project risk into the generated `README.md`, which is how Don reads them on a phone without a checkout.

**Filename is the identity.** `<cache_key>.json` when the advisor has given one; otherwise `<lint>__<object>.json`, sanitised to `[a-z0-9_]`. Either way it is derived from the finding, so two agents ruling the same finding write the same filename and collide in git — which is the argument you want to have, out loud, instead of two rulings landing side by side.

One file per finding is also why dozens of agents can work here at once: nobody appends to a shared list.

**Fields:** `cache_key`, `lint`, `object`, `severity`, `source`, `decision` (the `DECISIONS.md` date), `evidence`, `why`, `revisit_if`, `review_by`, `owner`.

**`owner` and `review_by` are enforced, not advisory.** `owner` is who must argue it again — `don`, `cowork` or `code`. **`scripts/lint.sh` fails the day `review_by` passes**: an accepted risk nobody revisits is the same failure as an inert guard. Argue it again (a new `DECISIONS.md` line and a new date) or delete the entry. A `cache_key_pending` note means the key is still null — fill it verbatim from the first export that reports it and rename the file to match. Never derive a key from the naming pattern: one that looks right but never matches stops suppressing silently, which is worse than null.
