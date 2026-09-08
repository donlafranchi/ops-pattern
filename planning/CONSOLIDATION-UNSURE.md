---
purpose: The judgment calls from the 2026-09-07 doc consolidation — files that met the archive test on one reading and failed it on another. Nothing here has been moved.
layer: how
status: active
---

# Consolidation — the unsure list

**Nothing on this list has been touched.** Same rule as the morning's cleanup: **a longer list is cheaper than a wrong archive.**

Seventeen files were archived. These are the ones that stopped me.

---

## 1. Docs that describe live code — the rule's hardest cases

**The rule says a doc describing how the system works goes, because the code answers it. These describe systems that are live and shipped**, and are cited by scenarios or tickets currently in flight. **Archiving them mid-build is the one thing the timebox said not to do.**

| File | Why it stayed | The case against it |
|---|---|---|
| `product/systems/groups.md` | **8 ticket citations, 5 scenario citations.** Three spec sections written into it today, all cited by live tickets. | Two-thirds of it describes schema the code holds better. **The decision content is worth lifting; the description isn't.** |
| `product/systems/member.md` | Cited by two tickets. The largest spec at 718 lines. | Almost entirely schema description. **Strongest archive candidate once nothing in flight cites it.** |
| `product/systems/item.md`, `action-layer.md`, `location.md`, `places.md`, `discovery.md` | All cited by live work. `places.md` has 30 references across the repo. | Same shape. The action-layer contract may be the one genuinely worth keeping — it states an invariant the code enforces but doesn't explain. |
| `product/systems/business-jurisdiction.md` | 18 references. | **The badge it exists to serve was removed today.** Probably archivable now; it needed a closer read than the timebox allowed. |

**Recommendation:** revisit when F061 closes. **Not before** — a spec cited by a ticket being built is not a stale doc, it's a working document.

## 2. The playbooks — skill-operational, not descriptive

`playbooks/PLATFORM-PATTERNS.md`, `DEVELOPMENT-PATTERNS.md`, `DECISION-PATTERNS.md`, `writing-docs.md`, `repo-tidying.md`, `process-checklists.md`, `deployment-pipeline.md`

**These are read by the skills at runtime.** Archiving them breaks the pipeline rather than tidying it.

**But `PLATFORM-PATTERNS.md` and `DECISION-PATTERNS.md` are decision records** — the same job as `decisions.md`, in a different format, with the routing rule for which one gets a new entry living in `CLAUDE.md`. **That is a genuine duplication and it is exactly the kind that goes stale in one place and not the other.**

**Recommendation:** fold the platform-decision entries up into `decisions.md`, and let the playbooks keep only the how-we-build process content the skills actually execute. **Half a day, and it needs care** — a skill reading a section that moved fails silently.

## 3. Values and research material — not description, so the rule doesn't reach it

| File | Note |
|---|---|
| `product/foundation/community-health-rubric.md` (507 lines) | A measuring stick, not a description. Barely referenced. **Is it used, or is it aspiration?** Only Don knows. |
| `product/foundation/metrics.md`, `impact-diagnostic.md`, `people-first.md` | Overlap with `principles.md` and `decisions.md` to varying degrees. `people-first.md` in particular looks folded-in already. |
| `product/ui/design-research-thesis.md` (427 lines) | Cited by a live scenario and by the top-search contradiction. **Load-bearing for an open argument** — archiving it would remove one side of a dispute that isn't settled. |
| `product/exploration/` (23 files) | Raw ideas. **Not reference and not description** — the rule doesn't cover them. They may just need a note saying they're not to be cited. |

## 4. The two dated logs

`planning/DECISIONS.md` (the launch-tier dated log) and `planning/archive/JOURNAL.md`.

**Kept deliberately.** The dated log is where new rulings land before they are distilled into `decisions.md` — that is a lifecycle, not a duplication. **But it will drift into being a second decisions doc if nobody distils it.** Worth a standing habit rather than a rule.

---

## What I lifted before archiving — so the reasoning wasn't lost

Two decisions existed **only** in files that were archived. Both are now numbered entries in `decisions.md`:

- **The platform is the technology layer, never the bank** *(from the payments spec)* — a chartered partner holds money on members' behalf; the platform holds none for itself; card numbers are never stored here.
- **What an assistant knows belongs to the member, and it never holds the keys** *(from the agent-assistance spec)* — member context is exportable, deletable, never trained on; the credential is minted per turn at the network edge and never enters the agent's context.

**Everything else archived was description, catalogue, or superseded** — the architecture map, the lineage table, the doc registry, seven capability files, three design-inspiration files, and two specs for systems that do not exist yet and are not in the launch.
