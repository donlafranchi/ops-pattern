# HANDOFF

Approved for build, one line each. Cowork writes this; Code reads it. Scenario files carry the detail — `planning/scenario-F###.md`.

- **F081 — everyone signs up the same way, and the zip suggests the metro.** `status: approved` 2026-09-14, depends on F076 and F077.
- **F082 — anyone publishing something others show up for takes one step first, and nothing is checked.** `status: approved` 2026-09-14, depends on F081.

### Tickets for F081 and F082 — T161–T168, in order

*Schema tickets open with Code's ≤20-line architecture note in the Issue, per `CLAUDE.md`.*

| # | Ticket | What it is | Starts after |
|---|---|---|---|
| 1 | **F081 · T161 · member zip column** | Adds a zip to the member record, owner-only — nothing else in F081 can move until it exists. Schema + RLS. | nothing |
| 2 | **F082 · T165 · creator attestation record** | One row per member holding what they attested and when. **No role column, no account type** — creator status is derived from this row, never stored as a flag. Schema + RLS. | nothing — parallel with T161 |
| 3 | **F081 · T162 · zip to metro shortlist** | Turns a zip into an ordered list of candidate metros. Suggests only; never selects. | T161 |
| 4 | **F082 · T166 · derive creator status** | The read path that answers "is this member a creator" from the attestation row plus what they have authored. | T165 |
| 5 | **F081 · T163 · signup form** | The zip field and the metro picker on the signup screen, with every US metro reachable if the shortlist is wrong (reuses F076's full metro list). Also asserts signup records no make-or-find role. | T162 **and F077's legal-name/display-name fields** |
| 6 | **F081 · T164 · signup copy** | The two published lines: we don't sell your information, and people who interact see each other's real name. **Wording is Don's under [public-is-draft].** | T163 |
| 7 | **F082 · T167 · the attestation step** | The one-time screen before a first Page. No upload, no check, no queue, no badge. | T166 |
| 8 | **F082 · T168 · gate the first Page** | Publishing a first Page — selling or hosting — requires the attestation. | T167 **and F060's create flow** |

**Blocked until something else lands, stated plainly:**

- **T163 cannot start until F077's legal name and display name fields exist.** F081's signup screen collects four things and two of them are F077's. F077 is approved and has no Issue yet — either ticket it first or ship the two together.
- **T168 collides with F060, which is marked `building`.** Both touch the create flow. F060 has no branch and no commit yet, so the collision is still free — land F060's amended criteria 1–2 first, or build the two as one change.
- **T164 needs Don before it merges**, not after. It is published copy.
- **T163, T167 and T168 are all visible changes** — each opens with a preview link and three plain steps, labelled `needs-don`.

- **F077 — people who actually interact are not hidden from each other; everyone else sees a display name.** `status: approved`. **Amended 2026-09-14** — criteria 6–8 added (mutual counterparty disclosure; 12-month per-interaction legibility; interaction as the only path to a name), criterion 3 narrowed to public surfaces.
- **F078 — flagged content hides itself immediately, and the poster is told why.** `status: approved`, depends on F058 and F077.
- **F080 — nobody can post anything about a child without a stronger-verified account.** `status: approved`, depends on F077.
- **F076 — a person outside an open metro joins its waitlist.** `status: approved`.
- **F056 — a producer edits a shop that already exists.** `status: approved`.
- **F057 — someone who isn't selling yet finds the way in.** `status: approved`.
- **F058 — a member reports something, and the operator can take a photo down.** `status: approved`.
- **F059 — a newcomer browses, and finds the neighbourhood.** `status: approved` — **approved 2026-09-14**, ten criteria, Browse settled at `/explore`. Its issues in `socialus-web` (#51–#54) cite it; #75 carries the post-grain half.
- **F060 — someone starts something without opening a shop.** `status: building`.
- **F069 — a non-business Page resolves everywhere, and holding several is ordinary.** `status: building`.
- **F061 — someone creates a Page worth showing people.** `status: building`.
- **F070 — every Page has a face, even without a photo.** `status: building`.
- **F063 — someone says they're coming.** `status: approved`.
- **F064 — someone asks for something that isn't built.** `status: approved`.
- **F065 — someone follows something.** `status: approved`.
- **F066 — a Page owner posts to its followers.** `status: superseded` 2026-09-13 — **do not build.** Replaced by F072–F075 below, all `draft` and awaiting Don.
- **F072 — a Page owner posts.** `status: draft`.
- **F073 — a post with a time is an event.** `status: draft`, depends on F072.
- **F074 — a series repeats.** `status: draft`, depends on F073.
- **F075 — an occurrence is cancelled.** `status: draft`, depends on F074.
- **F079 — the review queue handles many reports at once.** `status: draft` — deferred, depends on F078.
