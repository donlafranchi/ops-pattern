---
purpose: b2 build work — implement Impact Transparency feature in web/
layer: planning
status: draft
created: 2026-06-21
---

# Initiative: Impact Transparency — b2 Build Work

The actual feature build. Replaces the old ownership-tier code with the Impact Transparency system: data pipeline, scoring engine, member intelligence surfaces, entity profiles, alternatives UI, badge rendering, and discovery ranking integration. All work in `web/`.

**Working frame:** 1 = "Benefits the few" → 5 = "Benefits the many." Final label naming pending PM decision.

---

## Scope

**In:** All code work to ship Impact Transparency as a live feature. Schema migration from `ownership_tier` to impact score. New components, new data pipeline, new scoring engine, discovery integration. Replaces the 10 load-bearing code files identified in the audit.

**Out:** Doc/spec work (covered by `now` and `next` initiatives). Final label naming (PM decision, not a build task).

---

## Feature areas

These are high-level build areas — individual tickets come from the `ticket` skill after scenarios are scoped and approved.

### 1. Schema & data migration

- [ ] Design and migrate from `ownership_tier` text column to impact scoring tables. New tables: `entity_impact_scores`, `impact_attestations`, `impact_data_sources`.
- [ ] Migrate existing `member_business_jurisdictions` data as one input dimension.
- [ ] Backfill existing entities with initial scores from available signals.

### 2. Scoring engine

- [ ] Build the scoring pipeline: ingest input dimensions (locality verification, ownership structure, labor practices, community engagement, wealth circulation), weight them, output a 1–5 score.
- [ ] Define scoring rules as configuration (not hardcoded) so the model can evolve.
- [ ] Handle score recalculation triggers (new attestation, verification tier change, data source update).

### 3. Data pipeline ingestion

- [ ] Build ingestion for structured data sources (public records, business registrations).
- [ ] Build the member attestation pipeline (tips, confirmations, flags).
- [ ] Define the trust model for community-contributed data (attestation quorum, decay, dispute resolution).

### 4. Badge component & visual treatment

- [ ] Replace `OwnershipBadge.tsx` with new `ImpactBadge.tsx` component: 1–5 scale rendering, color ramp from DLS, accessible contrast.
- [ ] Replace `OwnershipSelector.tsx` with new impact-aware onboarding flow (if self-attestation is part of the model).
- [ ] Replace `--color-ownership-*` CSS custom properties in `globals.css` with new `--color-impact-*` tokens.
- [ ] Replace `[data-extractive="true"]` CSS rule with new `[data-impact-score]` treatment.
- [ ] Update `BusinessDetailCard.tsx` and `BusinessListingPage.tsx` to use new score attribute.
- [ ] Update `LocallyOwnedClaim.tsx` to reflect new badge model (locality verification becomes one input, not the whole badge).

### 5. Entity profile — impact section

- [ ] Build the impact section on entity profiles: score display, input dimension breakdown (what contributed to this score), "how to improve" guidance.
- [ ] Build the transparency view: show the data sources and attestations that informed the score.
- [ ] Build the dispute/correction flow: entity owner can flag incorrect data or request review.

### 6. Alternatives UI

- [ ] Build the "see local alternatives" section on entity profiles: when viewing a low-scoring entity, surface higher-scoring alternatives in the same category and place.
- [ ] Build the alternatives query: category match, place proximity, score threshold, result ranking.
- [ ] Define the UX: placement on page, number of alternatives shown, link-through behavior.

### 7. Member intelligence surfaces

- [ ] Build the member tips/attestation UI: how members contribute impact data (confirm ownership, flag concerns, attest to practices).
- [ ] Build the attestation history view: what a member has attested and the status of each.
- [ ] Integrate attestations with the scoring pipeline (trigger recalculation).

### 8. Discovery & ranking integration

- [ ] Integrate impact scores into Explore feed ranking algorithm.
- [ ] Build impact-score filter in search/explore UI.
- [ ] Update map pin colors in `map-config.ts` to use new impact color ramp (replacing `PIN_COLORS` ownership-tier record).
- [ ] Define the ranking rules: impact score as one signal among relevance, proximity, freshness.

### 9. Producer tools integration

- [ ] Add impact score visibility to the Growth dashboard.
- [ ] Build the "improve your score" guidance surface: actionable steps the producer can take.
- [ ] Replace the Tier 0/1/2 verification nudge with impact-score-aware nudging.

### 10. Cleanup & migration

- [ ] Remove all `OwnershipTier` type references from `types.ts`.
- [ ] Remove `OWNERSHIP_TIERS` const.
- [ ] Clean up any remaining `ownership_tier` references in components, server actions, and resolvers.
- [ ] Update `web/CLAUDE.md` and `skills/test/workflow.md` for new attribute names.
- [ ] Update evals: `F037-maya-claims-locally-owned.spec.ts` and related Playwright specs.

### Verification

- [ ] Zero references to `OwnershipTier`, `ownership_tier`, `--color-ownership-*`, `data-extractive` in `web/src/`.
- [ ] All existing evals pass (updated for new model).
- [ ] New evals cover: score calculation, badge rendering, alternatives display, attestation flow.
- [ ] Accessibility review on new badge component and alternatives UI.

---

## Done criteria

Impact Transparency feature is live in production. Old ownership-tier code fully removed. New scoring engine running. Badges render the 1–5 scale. Alternatives surface on low-scoring entity profiles. Member attestation pipeline active. All evals pass.

## Depends on

- `initiative-impact-transparency-now` completed (foundation docs and DLS updated).
- `initiative-impact-transparency-next` completed (system specs define the scoring model, badge treatment, and alternatives pattern that code implements).
- PM decision on final 1–5 scale labels.
- Scenarios scoped and approved via `scope` skill (this initiative lists feature areas, not tickets).

## Retires when

Feature shipped, evals green, old code removed, file moves to `planning/done/`.
