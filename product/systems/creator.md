---
id: what-creator
purpose: How a Member takes on selling, hosting, or organizing — derived from Group membership and Item state, not a stored role or a business entity.
layer: what
status: active
---

# Creator

Selling, hosting, and organizing are things a Member does, not things a Member *is*. *(2026-09-14: **creator** is now the sanctioned word for someone who does them, and **patron** for the other side — but the naming changes nothing below. There is still no creator record and no stored role; the word describes a state the platform computes, not a column it writes.)* There is no creator record, no business entity, and no stored role anywhere in this pattern — every surface below is computed from Group memberships and Items, both of which are dated, declared, and auditable.

## Selling tools have no toggle

There's no "maker mode." Selling surfaces (composers, dashboard, agent-assistance affordances) are present exactly when a Member holds an active `kind='business'` Group membership or has posted a product/service Item — not behind a Member-level flag. A Member without one sees the universal composer, and tapping Sell for the first time is what triggers the business-Group walkthrough — that walkthrough is the entry path, not a mode switch. To stop selling, end the owner membership; there's no separate off switch. The signal is declared, dated, and ungameable because it lives in the Group event log, not a boolean anyone could silently toggle.

## Standing presence is a data state, not a mode

A Member has "standing presence" — the gate for fuller agent-assistance surfaces — when they hold an active business-Group membership of any role, or a steward role in any non-business Group. It's computed from membership rows, not stored as a flag, and a Member without either is still fully functional: they can browse, RSVP, follow, save, and post ideas. Joining or founding a Group is what shifts them into the tier, and it happens because they took the deliberate "Sell" action, not by accident.

## No promote-to-recurring flow

A one-off act does not auto-upgrade into a persistent presence. A garage sale, a single class, one gathering — these stay Items with a date, filed where they were filed. The platform does not detect a second occurrence and offer to turn it into a Page or a Group, and does not create one on someone's behalf. A Member who wants a long-lived presence creates it themselves, deliberately, the same way anyone else does.

## Archive is a flag, not a lifecycle

"Archive" is a single flag on a Page, surfaced as one button. It removes the Page from map findability — that is the whole of what it does. It does not delete data, does not change ownership, and has no separate reactivate flow: the same button toggles it back. There is no draft/active/paused/archived state machine, no transition rules, and no state a Page can get stuck in.

## What this rules out

A stored role or account-type column of any kind — a `role` enum or an "is this a business" boolean on the Member row collapses the primitive back into a directory-of-types. A Business entity anywhere in the ownership chain — a Member who runs a business is captured entirely by their Group memberships and their Items, not by a shell that owns things. A promotion path that turns a one-off act into a persistent Page or Group. A lifecycle state machine behind archive, or any second control that has to be kept in sync with the archive flag.
