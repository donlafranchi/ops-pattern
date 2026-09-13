---
id: F075
title: An occurrence is cancelled
status: draft
date: 2026-09-13
depends: [F074]
---
## Story

The run club is not meeting this Thursday — the Sloppy Moose is closed. Sam opens that Thursday and cancels it. That week shows as cancelled rather than vanishing, so the regulars who turn up anyway know why, and next Thursday is untouched. The following morning the nightly job runs and does not quietly put it back.

## Acceptance

1. Cancelling an occurrence sets a state on it. **The row is never deleted.**
2. A cancelled occurrence survives the next run of the top-up job — it is not recreated, and not resurrected as uncancelled.
3. A cancelled occurrence is visibly cancelled wherever it appears, rather than absent.
4. Cancelling one occurrence changes no other occurrence in the series.
5. Cancelling is reversible: the same control restores the occurrence, with no confirmation dialog either way.
6. A cancelled occurrence does not appear in a date search or on the map.
7. Only the series' managing role can cancel an occurrence.

## Not this

Cancelling a whole series. A reason or message attached to the cancellation. Notifying anyone who responded — that needs a channel that does not exist.

**Why state and not deletion, in the scenario because it is the whole point:** a deleted occurrence comes back on the next nightly run. The top-up job cannot tell a row someone deleted from one that was never created, so deletion is not a cancellation — it is a cancellation that undoes itself overnight.
