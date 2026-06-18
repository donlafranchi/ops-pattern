---
id: what-landing-page
purpose: First-visit surface — sign up, log in, browse as guest.
layer: what
status: active
---

# Capability: Landing Page

**Description:** First-time visitors land on a branded page that introduces Movers, Makers & Shakers and offers sign-up, log-in, or guest-browse paths.

**Primitive:** Member (auth surface)
**Tier:** T1
**Bundle:** b1
**Loops served:** 3 (Land here)

## User story

As a first-time visitor, I want to understand what Movers, Makers & Shakers is and choose how to engage — sign up, log in, or browse anonymously — so I can start discovering what's happening in my locality.

## Scope

- Full-screen landing surface (mobile-first per [`../ui/design-language.md`](../ui/design-language.md) bottom-anchored pattern).
- App name + one-line value proposition: *"What's happening near you, declared by the people doing it."*
- **Sign Up** primary CTA (bottom-anchored).
- **Log In** secondary CTA.
- **Browse as Guest** tertiary option — anonymous Members get access to public Items, Locations, and the locality-aware Explore surface (per the anonymous Loop 3 path in [`member-journey.md`](../needs/member-journey.md)).
- After auth: redirect to Home (the locality feed per [`../ui/community-platform.md`](../ui/community-platform.md)). First-run users get the geolocate-then-city-pick locality prompt before Home renders.
- Already-authenticated Members skip the landing surface and go straight to Home.

## Anonymous browsing

Anonymous Loop 3 traffic is supported at b1: a guest can browse public Items, Locations, and the locality-aware Explore catalog without an account. They cannot follow, RSVP, post, or message; those actions trigger the sign-up flow with the in-progress intent preserved across auth (per [`../systems/member.md`](../systems/member.md) anonymous-to-Member bridge).

## Out of scope (deferred)

- Onboarding tutorial / feature tour (T2).
- Social login (Google, Apple — T2).
- Marketing-content scroll-down with screenshots / testimonials (T2).
- Locality-specific landing variants ("Sacramento" vs "Davis" personalization — T3).

## Related capabilities

- [Home — Locality Feed](../ui/community-platform.md) — destination on Home after auth.
- [Member Profile](member-profile.md) — Members' own pages, populated post-sign-up.

## Changelog

**2026-05-11** — Rewrote on Member primitive. Replaced "discovering independent businesses" with "what's happening near you, declared by the people doing it." Replaced "map view" redirect with locality feed redirect. Added anonymous Loop 3 path. Updated value proposition to align with primitives + people-first commitments.
