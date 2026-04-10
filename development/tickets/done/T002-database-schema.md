# T002: Database Schema and Supabase Setup

**Scenario:** N/A (infrastructure, supports F001-F005)
**Status:** Complete

## Acceptance Criteria

- [ ] `businesses` table created with columns: `id` (uuid, PK), `user_id` (uuid, FK to auth.users), `name` (text, not null), `slug` (text, unique, not null), `street_address` (text, not null), `city` (text, not null), `state` (text, not null), `zip` (text, not null), `latitude` (numeric), `longitude` (numeric), `category` (text, not null), `ownership_tier` (text, not null), `story` (text, nullable), `parent_company` (text, nullable), `location_count` (integer, nullable), `certification_type` (text, nullable), `metadata` (jsonb, default '{}'), `created_at` (timestamptz), `updated_at` (timestamptz)
- [ ] `supports` table created: `id` (uuid, PK), `user_id` (uuid, FK), `business_id` (uuid, FK), `created_at` (timestamptz), unique constraint on (user_id, business_id)
- [ ] `reports` table created: `id` (uuid, PK), `user_id` (uuid, FK), `business_id` (uuid, FK), `pillar` (text, not null), `description` (text, not null), `source_url` (text, nullable), `personal_witness` (boolean, default false), `created_at` (timestamptz)
- [ ] Row Level Security enabled on all tables
- [ ] RLS policies: businesses readable by all, writable by owner; supports readable by all, writable by authenticated user (own rows); reports writable by authenticated user, readable only by service role
- [ ] TypeScript types generated or manually defined in `src/lib/types.ts`
- [ ] Migration SQL file stored in `supabase/migrations/`
- [ ] `ownership_tier` uses text (not enum) — valid values enforced at app level: independent, coop, local-franchise, challenger, mission-driven, pe-corporate
- [ ] `category` is open text (not enum) per ADR-2
- [ ] `metadata` jsonb field exists for future extensibility per ADR-2
- [ ] Tests passing
- [ ] BUILD-LOG.md updated

## Notes

Use Supabase CLI for migrations if available, otherwise store raw SQL in `supabase/migrations/001_initial_schema.sql`.

Slug generation: lowercase, hyphenated, from business name. Handle collisions by appending `-2`, `-3`, etc.

The `metadata` jsonb column is the extensibility hook from ADR-2 — future business types (farms, etc.) can store type-specific fields here without schema changes.

`ownership_tier` is text not enum so new tiers can be added without migration. Validation happens in the registration form.

Index `businesses` on `(latitude, longitude)` for spatial queries and on `category` for search filtering. Index `supports` on `business_id` for count aggregation.

## Completion

Date: 2026-04-09
Commit: 8efd0a3
