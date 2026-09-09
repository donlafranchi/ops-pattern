---
id: F055
title: A producer puts a photo on what they're selling
status: deferred
date: 2026-09-10
depends: [F061]
---
## Story

Maya bakes sourdough and sells it Sundays. Her own listing shows a grey glyph where a photo should be. She taps the photo field on the product composer; her phone's picker opens, she chooses the loaf, and it appears — resized, cropped, stripped of EXIF — with no file name or percentage ever shown. Her loaf is the only card in the feed with a real picture on it.

## Acceptance

1. Product, service, and gathering composers each carry an optional photo field.
2. A picked photo is resized client-side, re-encoded to WebP, and EXIF-stripped (GPS included) before upload.
3. The storage bucket itself rejects anything that isn't WebP under 5MB, even bypassing the client.
4. A shared item link renders the photo in a link preview (iMessage/WhatsApp/Slack).

## Not this

More than one photo per item. Editing a photo after publish. Server-side re-encoding.

Deferred: Page photos (F061) ship first; this resumes as a composer field once F061's storage substrate exists.
