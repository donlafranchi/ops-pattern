# T001: Project Initialization

**Scenario:** N/A (infrastructure)
**Status:** Complete
**Completed:** 2026-04-09T16:09:22-07:00

## Acceptance Criteria

- [ ] Next.js app created with App Router, TypeScript, Tailwind CSS
- [ ] Supabase client library installed and configured (`src/lib/supabase.ts`)
- [ ] Mapbox GL JS installed with types
- [ ] Environment variables defined in `.env.local.example`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_MAPBOX_TOKEN`
- [ ] Directory structure matches `web/CLAUDE.md` spec: `src/app/`, `src/components/`, `src/lib/`, `src/hooks/`, `src/styles/`, `tests/`, `evals/features/`, `evals/results/`
- [ ] Tailwind configured with project color tokens for ownership tiers: gold (independent), deep-green (co-op), amber (local-franchise), bright-blue (challenger), warm-purple (mission-driven), flat-grey (pe-corporate)
- [ ] Vitest configured for unit tests (`npm run test`)
- [ ] Playwright configured for evals (`npm run eval`)
- [ ] `npm run dev`, `npm run build`, `npm run test`, `npm run eval` all succeed
- [ ] BUILD-LOG.md created with initial entry
- [ ] Tests passing

## Notes

Use `create-next-app` with App Router and TypeScript. Install:
- `@supabase/supabase-js`
- `mapbox-gl` + `@types/mapbox-gl`
- `vitest` + `@testing-library/react`
- `playwright` (dev dependency)

Tailwind color tokens (add to `tailwind.config.ts` under `extend.colors`):
```
ownership: {
  independent: '#D4A017',
  coop: '#1B7A3D',
  'local-franchise': '#E8A317',
  challenger: '#2196F3',
  'mission-driven': '#9C27B0',
  'pe-corporate': '#9E9E9E',
}
```

Supabase client: create `src/lib/supabase.ts` using `createBrowserClient` from `@supabase/ssr` for App Router compatibility. Also create `src/lib/supabase-server.ts` for server components.

## Completion

Date: 2026-04-09
Commit: a09a53b
