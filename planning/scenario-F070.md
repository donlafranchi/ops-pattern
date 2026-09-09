---
id: F070
title: Every Page has a face, even without a photo
status: building
date: 2026-09-10
depends: [F061]
---
## Story

Don adds a photo of the counter to his new Page; it's downscaled, re-encoded, and stripped of GPS metadata before it ever leaves his phone. The seeded Pages with no photo don't look broken — each shows its own quiet gradient-and-letter art, the same art every time, so nothing looks unstable or borrowed from a stock library.

## Acceptance

1. A photo step is optional; the composer completes without one.
2. An uploaded photo's stored bytes carry no metadata block (GPS included) — verified against the file, not the code's intent.
3. A raw upload bypassing the client (wrong format, oversized, wrong path) is rejected by the storage API itself.
4. A Page with no photo shows generated art derived from its own id — identical on every load, to every viewer.
5. The operator can remove a Page's photo in one action; the object is deleted and an event recorded.

## Not this

Cropping UI beyond a fixed centre-crop. Multiple images per Page. Anything sourced from a stock library.
