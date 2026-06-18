---
id: explore-apple-platform-integration
purpose: Exploration doc mapping Apple's WWDC 2025–2026 platform strategy to our community/local-commerce platform. Checklist of what to do now (web MVP) vs. what requires native iOS work.
layer: what
status: exploration
---

# Apple Platform Integration Strategy

**Research compiled June 2026 from 60+ sources including Apple developer documentation, tech press, creator analysis, and developer blogs.**

## The Big Picture: What Apple Wants From Apps

Across WWDC 2025 and 2026, Apple's message to developers converges on a single thesis: **your app should be an intelligent, context-aware participant in the user's life — not just something they open and close.**

Three shifts define Apple's current era:

1. **AI as the interface layer.** Siri AI (rebuilt on a ~1.2T-parameter Google Gemini model at WWDC 2026) can now search across a user's personal data, chain multi-step actions, and take actions inside third-party apps. Apps that don't expose their functionality through App Intents are invisible to this system.

2. **On-device first, cloud second.** Apple's Foundation Models framework gives developers a free ~3B-parameter on-device LLM — no API key, no token cost, no network required. Heavier tasks route to Private Cloud Compute. The privacy-first positioning is the architectural default.

3. **One design language everywhere.** Liquid Glass — a translucent, light-bending material system — shipped at WWDC 2025 and becomes mandatory.

## What Matters Most for Our Platform

### Critical — Direct Impact on Discovery and Engagement

**App Intents + Entity Schemas** — The single most impactful integration. Defining entity schemas for our core objects (events, businesses, listings, user profiles) makes content discoverable through Spotlight system-wide and actionable through Siri. A user could say "Show me craft markets this weekend" and Siri surfaces our listings. Without App Intents, our app is invisible to Siri AI on billions of devices.

**Push Notifications** — Critical for community engagement. Native push is the most reliable path. Web Push works on iOS 16.4+ but only from Home Screen PWAs, and does not work in the EU due to DMA restrictions.

**Widgets (Home Screen, Lock Screen, StandBy)** — Surface upcoming events, new listings, or community activity outside the app. Lock Screen widgets keep content visible without opening the app.

### High Value — Differentiation Opportunities

**Foundation Models (On-Device AI)** — Free on-device LLM for smart search, content summarization, recommendation explanations, or natural-language filtering. Zero API cost. Example: "Find me family-friendly events near downtown this Saturday" processed entirely on-device.

**Live Activities** — Real-time event countdowns, auction timers, or order status on the Lock Screen and Dynamic Island. Strong fit for time-sensitive community and commerce interactions.

**MapKit / GeoToolbox** — New geocoding APIs, cycling directions, and `PlaceDescriptor` for rich place data. Highly relevant for local commerce with business locations, event venues, and proximity-based discovery. MapKit JS is available for web.

### Medium Value — Worth Planning For

**View Annotations API** — Map SwiftUI views to App Intents entities so users can point at something on screen and ask Siri about it.

**MCP Server Integration** — Hosting an MCP server for our API would let Siri AI and other Apple Intelligence features query our data directly. Forward-looking but architecturally significant.

### Lower Priority

**visionOS** — Vision Pro's installed base is small and enterprise-focused. Not a near-term priority.

**Image Playground API** — Novel for user-generated content but not core.

## How Our Architecture Maps to App Intents

Our action-handler pattern maps almost directly to App Intents entity schemas:

| Our Action Handler | App Intent Entity/Action |
|---|---|
| `member.saved_search.create` | "Follow this venue" Siri action |
| `item.search` (future) | "Find events near me" Siri query |
| `member.place_interest.add` | "Set my home to Sacramento" Siri action |
| `group.create` | "Start a group" Siri action |
| `item.create` (kind='gathering') | "Host an event at Drake's" Siri action |

Our primitives (Person, Item, Location, Group) are clean entity schemas. Each maps to an App Intents `AppEntity` with typed properties.

## Web vs. Native Capability Comparison

### What Works From a PWA (No Native Code)

| Capability | Status on iOS |
|---|---|
| Web Push Notifications | iOS 16.4+, Home Screen PWAs only, not in EU |
| Home Screen installation | Improved in iOS 26 — standalone web app mode |
| Service Workers / Offline | Supported, aggressive 7-day eviction |
| Geolocation | Supported |
| Camera / Microphone | Supported (basic) |
| Web Share API | Supported |
| Passkeys / WebAuthn | Supported |
| MapKit JS | Supported |

### What Requires Native (or Hybrid Bridge)

| Capability | Path |
|---|---|
| App Intents / Siri AI integration | Native Swift only |
| Foundation Models (on-device AI) | Native Swift, or React Native via `@react-native-ai/apple` |
| Widgets / Live Activities | Native WidgetKit + SwiftUI only |
| Background processing | Native BGTaskScheduler only |
| In-App Purchases (StoreKit) | Native only |
| App Store presence | Requires native shell (Capacitor, React Native, or Swift) |

### PWA Limitations

- No Background Sync
- iOS aggressively evicts IndexedDB/cache after ~7 days of inactivity
- 50MB cache limit per PWA
- EU: Apple removed standalone PWA support under DMA; PWAs open in Safari tabs

## What to Do Now (While Building the Web MVP)

1. **Structured data on every public page.** schema.org JSON-LD for Events, Venues, Businesses, Products. Feeds Spotlight web indexing today; maps to App Intents entity schemas later.

2. **Keep the action-handler contract strict.** Every write goes through a named handler with typed input → typed output → event. This is the exact shape App Intents needs.

3. **Clean place-scoped URLs.** Already done — `/p/[…place]/l/[slug]` is clean for both web and native deep linking.

4. **Consider MapKit JS.** Free geocoding, Look Around, cycling directions that transfer 1:1 to native MapKit.

## Priority Checklist (Post-b1)

### Months 1–3 After Web MVP

- [ ] Wrap with Capacitor for App Store presence + native push
- [ ] Define App Intents entity schemas for Events, Businesses, Listings (2-3 basic intents)
- [ ] Home Screen / Lock Screen widgets (upcoming events, trending listings)
- [ ] Liquid Glass compliance on custom UI

### Months 3–6

- [ ] Foundation Models integration (smart search, NL filtering)
- [ ] Live Activities (event countdowns, order tracking)
- [ ] Spotlight entity indexing via App Intents
- [ ] MapKit GeoToolbox for location features

### 6–12 Months

- [ ] View Annotations API
- [ ] MCP server for our API
- [ ] Evaluate SwiftUI-first rebuild if Apple integration becomes competitive moat

## Key Deadlines

| Date | Requirement |
|---|---|
| April 2026 | All App Store submissions must use Xcode 26 / iOS 26 SDK |
| September 2026 | Full Liquid Glass design system compliance |
| Fall 2026 (iOS 27) | SiriKit apps no longer surface in Siri AI |
| ~Fall 2028 | Estimated SiriKit hard removal |

## Essential WWDC Sessions

1. [Get to Know App Intents (WWDC25)](https://developer.apple.com/videos/play/wwdc2025/244/)
2. [Explore New Advances in App Intents (WWDC25)](https://developer.apple.com/videos/play/wwdc2025/275/)
3. [Meet the Foundation Models Framework (WWDC25)](https://developer.apple.com/videos/play/wwdc2025/286/)
4. [Build Intelligent Siri Experiences with App Schemas (WWDC26)](https://developer.apple.com/videos/play/wwdc2026/240/)
5. [What's New in Widgets (WWDC25)](https://developer.apple.com/videos/play/wwdc2025/278/)
6. [Go Further with MapKit (WWDC25)](https://developer.apple.com/videos/play/wwdc2025/204/)
7. [Meet Liquid Glass (WWDC25)](https://developer.apple.com/videos/play/wwdc2025/219/)
