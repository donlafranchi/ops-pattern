# T011: Report a Concern

**Scenario:** planning/scenarios/F005-report-concern.md
**Status:** Open

## Acceptance Criteria

- [ ] Authenticated user sees "Report a concern" button on business detail card
- [ ] Tapping opens a report form (modal or slide-up panel)
- [ ] Form fields: pillar selector (required) with four options and one-line descriptions, description field (required, "What happened?", max 500 chars with counter), source link (optional, URL), "I witnessed this personally" checkbox (optional)
- [ ] Pillar options: Customers, Employees, Community, Planet — each with icon and description
- [ ] Empty description prevents submission with validation error
- [ ] On submit: report saved to `reports` table with business_id, user_id, pillar, description, source_url, personal_witness, timestamp
- [ ] User sees confirmation: "Thank you. Your report has been submitted."
- [ ] Report is NOT visible to other users or on the listing
- [ ] Unauthenticated user: prompted to sign in
- [ ] Tests passing
- [ ] BUILD-LOG.md updated

## Notes

Create:
- `src/components/ReportForm.tsx` — the report form component (modal)
- `src/components/PillarSelector.tsx` — four-option selector with icons and descriptions

Pillar options with descriptions:
- Customers: "How they treat the people they serve"
- Employees: "How they treat the people who work there"
- Community: "How they impact the local community"
- Planet: "How they impact the environment"

The form should feel serious but not hostile. Language is neutral — "Report a concern" not "Report this business."

Reports are collected only in b1. No automated standing changes. No public display. Admin review queue is a basic Supabase dashboard query for now — no custom admin UI in b1.

Character counter: show remaining characters (e.g., "247 / 500") and change color when near limit.

## Completion

Date:
Commit:
