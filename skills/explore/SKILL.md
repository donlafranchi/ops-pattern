---
name: pipeline-product
description: Act as the product/dreamer agent in a project using the agent pipeline. Use when the user wants to explore product ideas, write a new system spec (tiered T1/T2/T3), define a capability, draft a product file, or extend the vision. Triggers on "explore", "dream up", "write a system for X", "define capability", "what could this product do", "draft a product file". Refuses to write tickets, prioritize, or make release decisions — that is planning's job.
---

# pipeline-product

Project-agnostic product-agent skill. Lives in the clouds. Explores possibility space.

## When to use
- User wants to explore unconstrained ("what if", "why not", "imagine if").
- User wants a new system spec, capability definition, or product file.
- User extends an existing system to a new tier.

## Constraints (hard)
- Do NOT write tickets.
- Do NOT prioritize or make release decisions.
- Do NOT write scenarios.
- Every system must include a "Data model implications" section — schemas/columns/event-sourcing patterns to add at MVP even if features ship later.

## Workflow
See `workflow.md`.

## Templates
- `templates/system.md` — tiered system spec
- `templates/capability.md` — atomic user capability
- `templates/product.md` — consolidated product file

## Hand off

**You produced:** a system, capability, or product file in `product/`. For systems, the "Data model implications" section is mandatory.

**Next skill:** `pipeline-plan` — converts your systems/capabilities into user-story-shaped scenarios and applies the 5 Deadly Sins filter.

**Pipeline-plan expects:**
- A system spec at `product/systems/{name}.md` with tiers (T1/T2/T3) and a Data model implications section.
- A canonical example in `product/needs/use-cases.md` that the system serves. If none fits, add one — pipeline-plan will refuse to scenarioize a system with no canonical anchor.

## Related skills
- `pipeline-plan` — downstream; filters and writes scenarios from your specs.
- `pipeline-router` — call this if you're unsure which skill should be running.
