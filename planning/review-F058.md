---
purpose: Review — F058, the report path and operator photo takedown. Split from the combined F055–F058 review. Verdict PROCEED; now a precondition of F061 rather than F055.
layer: how
status: approved
---

# Review — F058: a member reports an image, and the operator can take it down

**Scenario:** [`scenario-F058-a-member-reports-an-image-and-the-operator-takes-it-down.md`](scenario-F058-a-member-reports-an-image-and-the-operator-takes-it-down.md)
**Ticket:** `development/tickets/T123-general-report-path.md`
**Reviewer:** `review` (2026-09-04) · **split to its own lane 2026-09-07**
**Verdict:** **PROCEED.**

> **Why this file exists.** The original review covered F055–F058 in one document. Its three scenarios now sit in different lanes, and a review travels with its scenario. **The parent stays authoritative for F056 and for the shared reasoning:** [`review-F055-F058-self-serve-producer.md`](review-F055-F058-self-serve-producer.md).

## What changed on 2026-09-07 — the dependency moved, and got sooner

**This scenario was a hard precondition of Item photos. It is now a hard precondition of Page photos**, which ship first.

The commitment is unchanged: *the platform never serves an image it cannot take down, and a takedown path exists before the first upload is accepted* ([`policy.md`](../product/foundation/policy.md) § Uploaded images, ratified 2026-09-07).

**So this scenario got more urgent, not less.** The first upload the platform accepts is now a Page photograph, and it arrives in the same stretch as [F061](scenario-F061-someone-creates-a-page-worth-showing-people.md).

## The split of responsibility for removal

| | Owns |
|---|---|
| **F058** (this) | The **report path** — the control, the sheet, the table, the operator's route to it. And photo removal on **Items**. |
| **F061** | Photo removal on **Pages** — the column, the object delete, the event. |

**The report path is not duplicated.** F061 adds no reporting surface of its own; a report about a Page photograph travels the path this scenario builds. **The reason removal is split at all is that the two live on different tables with different event logs** — one handler cannot serve both without collapsing that separation.

## Binding notes carried to build

1. **New lineage, same name.** The `reports` table is not the pre-rebuild vendor-era table. Same name, new shape, new lineage — do not revive the old one or its columns.
2. **Nothing about a report is visible to anyone but the operator.** No counter, no flag, no state on the reported thing, and the reported party is not told. Reporting the same thing twice changes nothing in the interface.
3. **The bucket is `media`, not `item-media`** (F061 review, binding note 1). The delete path names the same bucket every other caller uses.

## Sequencing

**Ship the report path and Item removal in this scenario; F061 adds the Page-side removal in its own migration.** Neither blocks the other's start, but **no photograph — of any kind — is accepted in production until the report path is live.**
