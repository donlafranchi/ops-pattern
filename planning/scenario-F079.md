---
id: F079
title: The review queue handles many reports at once
status: draft
date: 2026-09-14
depends: [F078]
---
## Story

Once there's real report volume, opening one item at a time doesn't scale for one person. Don selects a batch in the mobile queue — everything the agent tagged "spam," say — and dismisses or upholds all of them in one tap.

## Acceptance

1. The review queue supports multi-select.
2. A bulk action (dismiss / uphold) applies to every selected item in one confirmed tap.
3. Each bulked item still writes its own event row — a bulk action is many individual decisions made at once, not one decision applied silently.

## Not this

Building this before there's volume to justify it — deliberately unscheduled; F078 ships without it.
