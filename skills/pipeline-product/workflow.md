# pipeline-product — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `product/foundation/*` (loops, primitives, people-first, canonical-examples), `product/exploration/`, `product/specs/`, root `CLAUDE.md` |
| **Writes** | `product/capabilities/`, `product/systems/`, `product/surfaces/`, `product/exploration/`, `product/templates/`, extends `product/needs/use-cases.md` |
| **Templates** | `templates/system.md`, `templates/capability.md`, `templates/product.md` |
| **Does NOT read** | `planning/`, `development/`, `web/` |
| **Hands to** | `pipeline-plan` (for system → scenarios) |

## Directory map

| Directory | Purpose |
|---|---|
| `product/foundation/` | Fixed principles: mission, ethics, north stars. Changes rarely. |
| `product/exploration/` | Raw ideas, narrative scenarios, freeform incubation. |
| `product/capabilities/` | Atomic user-facing capabilities. One per file. |
| `product/systems/` | Tiered technical system specs (T1/T2/T3). |
| `product/surfaces/` | Consumer-facing surface descriptions. One per major surface (e.g., `community-platform.md` covers Home / Explore / You). Renamed from `product/products/` on 2026-05-11. |
| `product/templates/` | Workflow/intake templates (e.g., `idea-intake.md`) used by upstream chats. |
| `product/specs/` | Full platform specs (vision, not MVP-bound). |
| `product/ui/` | UI inventory, design language, visual patterns. |

## Workflow

1. Raw ideas → `product/exploration/` as freeform writing.
2. Mature ideas become **capabilities** (user-facing) or **systems** (technical).
3. When a surface is added or its role changes, update the relevant `product/surfaces/{slug}.md` so the architecture index stays current.

## Required: Data model implications

Every system doc MUST include a "Data model implications" section listing tables/columns/event-sourcing patterns to introduce at MVP — even for features that ship later. Cheap at MVP, impossible to backfill.

## Templates

Use the templates in `templates/`. Stub copy into the right project directory and fill in.

## Hand off

**You produced:** a system, capability, product file, or exploration note.

**Next skill:** `pipeline-plan`. Plan converts systems/capabilities into user-story scenarios.

**Plan will refuse your system if:**
- It has no "Data model implications" section.
- It doesn't anchor to at least one canonical example in `product/needs/use-cases.md`.
- It tries to ship across all tiers at once instead of being tiered T1/T2/T3.

Add the canonical anchor before handing off — plan does not invent personas.
