# SocialUs — Terms & Privacy Starter Kit

> **Reference, 2026-10-01 — research, not legal advice.** Rulings live in `DECISIONS.md` (valid legal process; plain-language drafts, counsel after launch); the plan in F081.

Oct 1, 2026 · @don

## Read this first

This kit says where SocialUs's launch Terms and Privacy Policy can come from, what they must cover and what Don must decide before drafting. It is research, not legal advice: Claude is not a lawyer, and California counsel should review both documents. Live drafts can go up for the 2026-10-30 launch, with counsel's review to follow.

## Template sources

The best free base is GitHub's CC0 policies, with Basecamp (CC BY) and Automattic (CC BY-SA) for structure. Use TermsFeed's one-time premium if you would rather buy than adapt. Cooley GO, Clerky and YC publish no website Terms or privacy templates.

| Source | Licence / reuse | Cost | Fit for SocialUs | Pitfalls |
| --- | --- | --- | --- | --- |
| [GitHub site-policy](https://github.com/github/site-policy) (Terms, Privacy Statement, DMCA policy) | [CC0 1.0](https://github.com/github/site-policy/blob/main/LICENSE.md): no attribution, no share-alike; no trademark rights | Free | High: clean UGC, DMCA and moderation clauses | Written for a developer platform; long; strip GitHub-specific features |
| [Basecamp policies](https://github.com/basecamp/policies) (Terms, Privacy, CA notice at collection, use restrictions) | [CC BY 4.0](https://github.com/basecamp/policies/blob/master/LICENSE.md): reuse with credit and a "modified" note | Free | High for tone: short, plain language | Repo archived Dec 2023; SaaS-for-business framing; no UGC or SMS |
| [Automattic legalmattic](https://github.com/Automattic/legalmattic) (WordPress.com Terms, Privacy, DMCA) | CC BY-SA 4.0: credit plus link back; your version must also be CC BY-SA | Free | Medium-high: covers UGC, US state privacy rights | Share-alike means anyone can reuse your policy; WordPress-specific practices |
| [TermsFeed](https://www.termsfeed.com/pricing/) generator | Free tier needs a credit link; premium removes it; you keep the files (HTML, DOCX, MD) | Free basic; premium one-time, per clause (CCPA clause $82, UGC $24, accounts $24) | Good: you own the output | Free version thin; per-clause upsells; vendor disclaims liability |
| [Termly](https://termly.io/pricing/) generator | Licensed, not owned; tied to paying | $14–$20 per site per month, billed annually | Good: CalOPPA and CCPA built in | Ongoing bill; free tier is 1 policy, no edits |
| [GetTerms](https://getterms.io/pricing) generator | One domain; output "may become invalid" if subscription lapses | $8/mo or $249 lifetime (Business, includes Terms) | OK | "One size fits most"; Western Australia law governs |
| [iubenda](https://www.iubenda.com/en/pricing) generator | Embed only, no copy-paste | Terms start at $24.99/mo | Poor: EU-leaning, locked in | Hosted embed; pageview overage fees |
| [Common Paper](https://commonpaper.com/standards/terms-of-service/) standards | CC BY 4.0 | Free | Poor: B2B SaaS only, by its own description | Not for consumer Terms; no privacy policy |
| [Cooley GO](https://www.cooleygo.com/documents/), [Clerky](https://www.clerky.com/pricing), [YC documents](https://www.ycombinator.com/documents) | n/a | Free / from $427 / free | None: incorporation, hiring, SAFEs only | Not relevant here |
| Government guidance: [CA AG CCPA](https://oag.ca.gov/privacy/ccpa), [CPPA](https://cppa.ca.gov/regulations/), [FTC COPPA](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa), [Copyright Office DMCA](https://www.copyright.gov/dmca-directory/faq.html) | Public guidance, not templates | Free | Checklist for what must be in the text | Tells you what to cover, not how to word it |

## Which laws apply

At launch these apply: CalOPPA, Section 230, the DMCA safe harbour (if you register an agent), TCPA/CTIA for the verification texts, California breach notice and security laws, and the federal law on disclosing user data to government. CCPA/CPRA and COPPA do not apply yet, but the policy should say why. Rows marked (unverified) rest on search snippets, not the primary page.

| Law | Applies at launch? | What the policy must say or do |
| --- | --- | --- |
| [CalOPPA](https://law.justia.com/codes/california/code-bpc/division-8/chapter-22/section-22575/) (Bus. & Prof. Code 22575) | Yes: any commercial site collecting PII from Californians | Conspicuous link; categories collected; categories of third parties; how users review or change data; how changes are announced; effective date; Do Not Track response; whether third parties track across sites |
| [CCPA/CPRA](https://cppa.ca.gov/regulations/cpi_adjustment.html) | No: triggers are $26,625,000 revenue (since 1/1/2025), 100,000+ consumers bought, sold or shared, or 50%+ of revenue from selling data | State "we do not sell or share personal information"; revisit when revenue or scale grows |
| [COPPA](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa) | No, unless the site targets under-13s or learns a user is under 13 | 18+ attestation at signup; "not directed to children"; delete accounts found to be underage. CA minors' laws (AADC, SB 976) are in litigation (unverified) |
| TCPA / [CTIA Messaging Principles](https://api.ctia.org/wp-content/uploads/2023/05/230523-CTIA-Messaging-Principles-and-Best-Practices-FINAL.pdf) | Yes, lightly: one requested code per signup is not marketing | Disclosure at the phone field (code by text, msg and data rates, STOP/HELP); never reuse the number for marketing without written consent. Carrier 10DLC registration likely avoided with Twilio Verify (unverified) |
| [DMCA 512](https://www.copyright.gov/dmca-directory/faq.html) | Yes, to keep safe harbour for user-posted content | Register a designated agent: $6, renew every 3 years; post agent details on site; notice-and-takedown process; repeat-infringer policy |
| [Section 230](https://www.law.cornell.edu/uscode/text/47/230) | Yes | Protects you for third-party content and good-faith removal (your report-and-hide). Doesn't cover IP, federal crime or FOSTA. Terms need one line on parental-control tools (230(d)) |
| [Breach notice](https://law.justia.com/codes/california/code-civ/division-3/part-4/title-1-81/section-1798-82/) (Civ. Code 1798.82) and reasonable security (1798.81.5) | Yes, regardless of size | Notify within 30 days of discovery (SB 446, 2026); AG sample if >500 Californians; reasonable security and vendor contracts (Supabase, Vercel) |
| [Delete Act / data broker](https://cppa.ca.gov/data_brokers/) | No: you have a direct relationship with members | Nothing |
| [Stored Communications Act](https://www.law.cornell.edu/uscode/text/18/2702) and [CalECPA](https://law.justia.com/codes/california/code-pen/part-2/title-12/chapter-3-6/section-1546-1/) | Yes | Disclose to government only under valid legal process, in emergencies involving danger of death or serious injury, or for required child-safety reports |
| Data retention / deletion | No statute forces it at your size | Say how long each data type is kept and how to delete an account; voluntary but expected |

**Flag on Don's principle:** "Disclose only under a court order" is narrower than the law allows. A valid subpoena can compel subscriber info, and emergency and child-exploitation reports are carve-outs. Promising "court order only" could put SocialUs in breach of its own policy. Ask counsel for the wording; the safer draft is "valid legal process".

## How comparable platforms structure theirs

All four use a three-layer setup: Terms, Privacy, and separate Community Guidelines. Most keep separate terms for businesses or organisers. Structure only is summarised here; no text is borrowed.

| Platform | Terms shape | Privacy shape | Worth borrowing |
| --- | --- | --- | --- |
| [Nextdoor](https://help.nextdoor.com/s/article/Member-Agreement-US-2026?language=en_US) (updated July 9, 2026) | 15 sections: services, joining, licences, "being a good neighbor", transactions, disclaimers, arbitration | [9 short Q&A sections](https://help.nextdoor.com/s/article/Privacy-Policy-2026?language=en_US): collected, used, shared, choices, retention, security, children | Question-style headings; separate Community Guidelines that the Terms enforce; separate California notice |
| [Meetup](https://help.meetup.com/hc/en-us/articles/360027447252-Terms-of-Service) (updated Oct 1, 2026) | 11 sections; separate EU/UK version without arbitration | [14 sections](https://help.meetup.com/hc/en-us/articles/360044422391-Privacy-Policy) incl. a "Your Choices" block covering SMS reminders and location | Separate Organizer Terms; SMS choices called out in privacy |
| [Yelp](https://terms.yelp.com/tos/en_us/20260101_en_us/) (effective Jan 1, 2026) | Consumer Terms plus an appended "Additional Terms for Business Accounts" | [16 sections](https://terms.yelp.com/privacy/en_us/20260101_en_us/) incl. account closure and retention, and US state rights | Business terms appended to one document (closest to SocialUs); dated, versioned URLs |
| [Eventbrite](https://www.eventbrite.com/help/en-us/articles/251210/eventbrite-terms-of-service/) (updated Aug 20, 2025) | 25 sections incl. copyright takedown, scraping ban, organizer licences | [19 sections](https://www.eventbrite.com/help/en-us/articles/460838/eventbrite-privacy-policy/) incl. a notice for non-users | A single Legal hub page listing every policy; scraping ban; organizers responsible for their own permits |

All four use US binding arbitration with a class-action waiver. Whether SocialUs should is a question for counsel.

## Privacy Policy sections

GitHub's Privacy Statement (CC0) is the base because it carries no credit or share-alike duties; Basecamp (CC BY 4.0) supplies the plain-language tone, credited in the footer. Automattic (CC BY-SA) is left out so the policy isn't forced open-licence. "Own" means no template fits and the text is written fresh.

| # | Section | What it covers for SocialUs | Source | Licence |
| --- | --- | --- | --- | --- |
| 1 | Who we are and how to reach us | Legal entity, California address, privacy email | Basecamp Privacy | CC BY 4.0 |
| 2 | What we collect | Email, SMS-verified phone, ZIP/metro, private legal name; business entity name, state, type; follows, RSVPs, reports; device and log data | GitHub Privacy Statement | CC0 |
| 3 | Why we collect it | Account security, one-person-one-account, metro matching, platform protection | GitHub Privacy Statement | CC0 |
| 4 | What is public and what is not | Organisation pages public; member identity and legal name never public | Own (Nextdoor structure) | n/a |
| 5 | Text messages | One verification code per signup; no marketing texts; STOP/HELP | Own (CTIA guidance) | n/a |
| 6 | Who we share with | Supabase, Vercel, SMS provider; no sale, no ads | GitHub Privacy Statement | CC0 |
| 7 | Government and legal requests | Valid legal process only; emergencies; notice to member where lawful | GitHub Privacy Statement + counsel wording | CC0 |
| 8 | Reports and moderation data | What a report stores, who sees it, how long | Own | n/a |
| 9 | Retention and deletion | Per-type retention; how to delete an account | Basecamp Privacy | CC BY 4.0 |
| 10 | Security and breach notice | Reasonable security; notice within 30 days | GitHub Privacy Statement | CC0 |
| 11 | Your choices | Edit profile, unfollow, delete account, Do Not Track answer | GitHub Privacy Statement | CC0 |
| 12 | California rights | CalOPPA items; "we do not sell or share"; CCPA not yet triggered | Basecamp CA Notice at Collection | CC BY 4.0 |
| 13 | Children | 18+ only; delete if underage | GitHub Privacy Statement | CC0 |
| 14 | Changes to this policy | How members are told; effective date | GitHub Privacy Statement | CC0 |
| 15 | Credits | Licence credit for Basecamp-derived text | Required by CC BY | n/a |

## Terms of Service sections

GitHub's Terms (CC0) supply the platform-protection clauses: UGC licence, moderation, DMCA, disclaimers, liability cap. Business-page terms are appended to the same document, Yelp-style. Community Guidelines get their own short page, as all four comparables do.

| # | Section | What it covers for SocialUs | Source | Licence |
| --- | --- | --- | --- | --- |
| 1 | Agreement and eligibility | Accepting the Terms; 18+; one account per person | GitHub Terms | CC0 |
| 2 | Your account | Accurate legal name and phone; keep credentials safe; we may suspend | GitHub Terms | CC0 |
| 3 | What SocialUs is (and isn't) | A directory; we don't vet or endorse organisations or events | Own (Eventbrite structure) | n/a |
| 4 | Pages, events and your content | You own it; licence to SocialUs to display it | GitHub Terms | CC0 |
| 5 | Community rules | Link to Community Guidelines; prohibited conduct; no scraping | GitHub Acceptable Use | CC0 |
| 6 | Reports and moderation | We may hide or remove content or accounts at our discretion; no duty to monitor | GitHub Terms | CC0 |
| 7 | Copyright and DMCA | Designated agent; takedown and counter-notice; repeat-infringer termination | GitHub DMCA Takedown Policy | CC0 |
| 8 | RSVPs and events | Organisers run events; SocialUs isn't a party; attend at own risk | Own (Eventbrite structure) | n/a |
| 9 | Text messages | Consent to one verification code; STOP/HELP | Own (CTIA guidance) | n/a |
| 10 | Privacy | Pointer to the Privacy Policy | Basecamp Terms | CC BY 4.0 |
| 11 | Termination | Either side can end it; what survives | GitHub Terms | CC0 |
| 12 | Disclaimers and limitation of liability | As-is service; liability cap | GitHub Terms | CC0 |
| 13 | Indemnity | Users cover claims from their content and conduct | GitHub Terms | CC0 |
| 14 | Disputes and governing law | California law; Sacramento County venue or arbitration (counsel decides) | Own, counsel to draft | n/a |
| 15 | Changes to the Terms | Notice and effective date | GitHub Terms | CC0 |
| 16 | Additional terms for business pages | Authority to represent the entity; accurate registration details; claim and verification | Own (Yelp structure) | n/a |
| 17 | Parental controls notice | One line, per Section 230(d) | Own | n/a |
| 18 | Contact and credits | Legal contact; CC BY credit for Basecamp text | Required by CC BY | n/a |

## Recommended path

**Recommendation: A.** It is free, you own the text, it fits the four weeks left, and counsel reviews a draft rather than a blank page.

| Option | What it is | Cost | Time | Trade-off |
| --- | --- | --- | --- | --- |
| **A. Adapt open templates** | Build from GitHub (CC0) plus Basecamp (CC BY), using the section lists above; Claude drafts in plain language | $0 + $6 DMCA agent | ~1 week to draft | Most tailored; needs Don's facts and a careful counsel pass |
| B. Generator | TermsFeed premium (one-time) or GetTerms lifetime ($249) | ~$150–250 (TermsFeed estimate, not quoted) | 1–2 days | Fastest; generic; weak on SMS, reporting and business pages |
| C. Counsel first | Wait for a lawyer to draft from scratch | Lawyer fees | Unknown; risks 10/30 | Best protection; most likely to miss launch |

The A sequence follows; dates assume Don supplies the facts by 10/8.

1. Don answers the facts list below by 10/8.
2. Claude drafts Privacy, Terms and Community Guidelines by 10/15.
3. Register the DMCA agent and add the phone-field disclosure in the build by 10/22.
4. Publish on 10/30 with an effective date; counsel reviews after launch, and the changes clause covers the update.

## Facts Don must supply

The drafts can't be finished without these; each is one line.

- [ ] Legal entity name, entity type and state of formation (or "sole proprietor" for now)
- [ ] Physical street address for the policies and DMCA agent (a P.O. box needs a Copyright Office waiver)
- [ ] Privacy and legal contact email; DMCA agent name, phone and email
- [ ] Minimum age: confirm 18+, and how signup asks for it (checkbox or date of birth)
- [ ] SMS provider behind Supabase Auth (Twilio Verify, Twilio, MessageBird, other) and its sending number type
- [ ] Analytics, error tracking, cookies or embeds in use (e.g. Vercel Analytics) and whether any track across sites
- [ ] Retention per data type: deleted accounts, hidden content, reports, phone numbers, logs
- [ ] What happens to the legal name: who at SocialUs can see it, and when it is used
- [ ] Who reviews reports, and whether members are told when their content is hidden
- [ ] Business pages: who may claim one, and how registration details are verified
- [ ] Disputes: arbitration with class waiver, or California courts (Sacramento County)
- [ ] Law-enforcement wording: accept "valid legal process" over "court order only"
- [ ] Notifying members of legal requests: yes or no, where lawful
- [ ] Any plans within 12 months for payments, ads or other states (changes the drafts now)

## What counsel should review

Counsel's time goes furthest on the clauses that protect the platform or set legal exposure.

1. Law-enforcement and legal-request clause (SCA, CalECPA, emergency and child-safety carve-outs).
2. Dispute resolution: arbitration and class waiver vs. California courts.
3. Limitation of liability, disclaimers and indemnity, given California's limits on these clauses in consumer contracts.
4. Moderation and report-hiding language, so Section 230 protection holds.
5. DMCA policy and repeat-infringer process.
6. Business-page terms: who may speak for an entity and liability for false claims.
7. Handling and retention of private legal names.
8. SMS consent wording at the phone field.
9. The CCPA trigger plan: when to add full rights and a notice at collection.
10. CC BY credit and the CC0 adaptation, so licence terms are met.

## Sources

All opened 2026-10-01; legal rows marked (unverified) above rest on snippets only.

- [GitHub site-policy licence](https://github.com/github/site-policy/blob/main/LICENSE.md) · [Basecamp licence](https://github.com/basecamp/policies/blob/master/LICENSE.md) · [Automattic legalmattic](https://github.com/Automattic/legalmattic)
- [CPPA threshold adjustment](https://cppa.ca.gov/regulations/cpi_adjustment.html) · [Copyright Office DMCA FAQ](https://www.copyright.gov/dmca-directory/faq.html) · [47 USC 230](https://www.law.cornell.edu/uscode/text/47/230) · [18 USC 2702](https://www.law.cornell.edu/uscode/text/18/2702)
- Generator pricing and comparables: linked in their tables above.
