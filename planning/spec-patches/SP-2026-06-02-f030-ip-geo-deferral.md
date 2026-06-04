---
id: spec-patch-2026-06-02-f030-ip-geo-deferral
purpose: Spec patch — F030 ships launch-locality default instead of IP geolocation.
layer: how
status: open
filed: 2026-06-02
caught_by: T088
deviation_pointer: 2026-06-02 — T088
target_spec: planning/now/scenario-F030-newcomer-signs-up-and-lands-in-feed.md
target_section: § Acceptance (AC1 "IP-geolocated locality") + § Surfaces
---

# Confirm F030 IP geolocation is a b2 refinement + Member-scoped feed URLs at b1

**What's wrong:** scenario-F030 § Acceptance (AC1) specifies an "IP-geolocated locality" + § Surfaces. b1 ships a launch-locality default + scope picker instead of real IP geolocation (no geo provider wired). The scenario's own IP-fail edge case sanctions a picker fallback. Feed cards link via Member-scoped Item URLs (`/m/<handle>/<seg>/<slug>-<id8>`) rather than Group place-path URLs.

**The fix:** Confirm the scenario should mark IP geolocation as a b2 refinement, and that the feed's Member-scoped Item URLs are acceptable at b1.

**Caught by:** T088 during build

**Deviation pointer:** [`development/deviations/T088.md`](../../development/deviations/T088.md) § 2026-06-02 entry
