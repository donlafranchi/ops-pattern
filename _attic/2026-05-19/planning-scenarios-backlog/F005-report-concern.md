# Scenario: Community Signals — User reports a concern about a business

**Feature:** F005 (product/capabilities/community-signals.md)
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- A business exists on the map
- The user is authenticated

### When
- The user taps "Report a concern" on the business detail card

### Then
- A report form opens with:
  - Pillar selector (required): 🤝 Customers, 👷 Employees, 🏘️ Community, 🌍 Planet — each with a one-line description
  - Description field (required): "What happened?" — brief factual text
  - Source link (optional): URL to news article, video, court record, or social media post
  - "I witnessed this personally" checkbox (optional)
- On submission:
  - Report is saved to the database with: business_id, user_id, pillar, description, source_url, personal_witness flag, timestamp
  - User sees confirmation: "Thank you. Your report has been submitted."
  - Report is NOT visible to other users or on the listing
  - Report appears in the admin report queue

## Edge Cases

- Empty description: form validation prevents submission
- Very long description: character limit (500 chars) with counter
- Duplicate report by same user for same business + pillar: allowed (different incidents are valid)
- Malicious/spam reports: admin queue handles review — no automated action from a single report

## Assumptions

- Reports are never displayed publicly — not individually, not as counts, not as summaries
- Admin view is a basic table of reports sortable by business, pillar, date, volume — not a full moderation tool (that's b2)
- No automated standing changes from reports in b1 — reports are collected only

## Comments

The report form must feel serious but not hostile. The user is flagging a concern, not attacking a business. Language should be neutral: "Report a concern" not "Report this business." The four pillars give structure without requiring the user to write an essay.
