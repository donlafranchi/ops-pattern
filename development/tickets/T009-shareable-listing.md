# T009: Shareable Listing Page with OG Metadata

**Scenario:** planning/scenarios/F004-shareable-listing.md
**Status:** Open

## Acceptance Criteria

- [ ] `/business/{slug}` route serves a full detail page for any business
- [ ] Page is server-rendered (SSR via Next.js App Router) — no client-side loading spinner for content
- [ ] Page displays: business name, address, category, ownership tier badge, owner story, support count, map preview showing pin location
- [ ] OpenGraph metadata rendered in HTML head: `og:title` (business name), `og:description` (ownership tier + category + city), `og:image` (generic branded image with ownership tier color), `og:url` (canonical listing URL)
- [ ] Business with no story: OG description falls back to ownership + category + city
- [ ] Slug collision handled: slugs are unique (append numeric suffix at registration)
- [ ] Social media crawlers receive full HTML without JavaScript execution
- [ ] Share button on detail card copies `/business/{slug}` URL to clipboard
- [ ] Confirmation toast appears after copying
- [ ] Tests passing
- [ ] BUILD-LOG.md updated

## Notes

Create:
- `src/app/business/[slug]/page.tsx` — SSR detail page using `generateMetadata()` for OG tags
- `src/components/MapPreview.tsx` — small static map showing the business pin (use Mapbox Static Images API or a small interactive map)
- `src/components/Toast.tsx` — simple toast notification component

Use Next.js `generateMetadata()` in the page component to set OG tags dynamically from the business data fetched server-side.

OG image: for MVP, use a generic branded image. Can use Mapbox Static Images API to generate a map thumbnail with a colored pin, or a simple colored card with the business name and tier. Keep it simple — a static fallback image with tier color is fine for b1.

The detail page reuses `BusinessDetailCard` from T007 but in a full-page layout rather than a slide-up card.

Clipboard API: `navigator.clipboard.writeText(url)`. Fall back to `document.execCommand('copy')` for older browsers.

## Completion

Date:
Commit:
