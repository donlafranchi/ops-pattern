---
id: how-spec-patches
purpose: Queue of product/ spec patches flagged by the build agent. Closes the Build → Product return path.
layer: how
status: active
---

# SPEC-PATCHES — open queue

When `build` writes a DEVIATIONS entry with `Disposition: flag-for-spec-revision`, it appends a one-line entry here. `explore` drains the queue as a gate before each bundle phase opens. Empty is the desired state at phase boundaries.

**Entry format.**

```
- [ ] {YYYY-MM-DD} · {spec path} § {section} — {one-line what's wrong}. Caught by T###. DEVIATIONS: {ticket-or-date pointer}.
```

Check the box and append `· landed YYYY-MM-DD ({commit hash})` when product patches; move to the sprint archive on next sprint close.

---

## Open

- [ ] 2026-06-01 · `development/tickets/T073-*.md` § Acceptance line 36 (Locality step writes `member_business_jurisdictions` row) — contradicts `review-F036.md` § cross-system consistency ("F036 does NOT need that substrate"). Two sources of truth diverged; pick one. Implementation chose UI-only at b1 (substrate ships with F037). Caught by T073. DEVIATIONS: 2026-06-01 — T073.
- [ ] 2026-06-01 · `product/systems/action-layer.md` § handler catalog — `location.create` handler is referenced by T073 acceptance but not in the registry. Add to the catalog with input/output shape, or remove the reference from the spec. Caught by T073. DEVIATIONS: 2026-06-01 — T073.
- [ ] 2026-06-01 · `supabase/migrations/017_places.sql` — `places.geography` polygons are not seeded; only name + parent hierarchy land. `public.place_for_coords()` returns zero rows for every coordinate as a result, blocking any surface that resolves a place from a Location (T073's `sellActivateAction` URL builder; future surfaces in F035 + the producer feed). Add polygon stamping to the T058 seed OR a follow-up seed migration. Caught by T073b. DEVIATIONS: 2026-06-01 — T073b.
- [ ] 2026-06-02 · `planning/now/scenario-F035-rosa-finds-mayas-shop.md` § Data Captured (follow) + `product/systems/member.md` § Follows substrate — scenario describes a `member_follows` row with `target_kind='group'` / `target_id=$group_id`, but the shipped `member_follows` (T048, `010_member_interests_follows.sql`) is member→member only (composite PK `(follower_member_id, followed_member_id)`, no polymorphic target). Group-follow has no substrate. Decide the shape — a dedicated `group_follows` table OR a polymorphic reshape of `member_follows` — and assign it to F042 (the follow-CTA scenario) so the F035 Follow CTA can persist. Caught by T074. DEVIATIONS: 2026-06-02 — T074.
- [ ] 2026-06-02 · `planning/now/scenario-F038-producer-lists-product.md` § Data Captured (Pickup point row) — specifies `item_locations.schedule_kind='permanent'`, but the shipped `item_locations.schedule_kind` CHECK (T056, `015_items.sql`) permits only `one_time | recurring | ongoing | by_appointment`. `'permanent'` conflates Location *kind* with the Item↔Location *schedule* enum. Patch the scenario row to `schedule_kind='ongoing'`. Caught by T077. DEVIATIONS: 2026-06-02 — T077.
- [ ] 2026-06-02 · `planning/now/scenario-F040-producer-lists-service.md` § Data Captured (Pricing model row) + § Edge Cases (Free service) — lists `rate_model` enum as `flat / hourly / per-session / free`, but the shipped `item_services.rate_model` CHECK (T056, `015_items.sql`) is `hourly / flat / quote / membership`. Reconcile: `per-session` has no schema slot (maps to `flat`); `free` is not a `rate_model` value — model it as `rate_cents = NULL` (as the build does). Patch the scenario to the shipped enum + null-rate free, or migrate the enum. Caught by T081. DEVIATIONS: 2026-06-02 — T081.

---

**Historical Landed + Rescinded** — `planning/done/b1.x-spec-drain-sprint/spec-patches-landed.md`.
