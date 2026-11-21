# AOL owner blueprint implementation audit — 21 November 2026

## Audit standard

The 107-page owner PDF is the only copy authority. The audit compares all 31 approved sections independently with the PDF, then checks the built site for exact wording, emphasis data, page mapping, sequence, placement, form fields/options, CTA priority and behaviour, service destinations, internal links, fragment targets, page titles and public brand references.

## Omissions and mismatches corrected

1. Added the exact visible consultation fees to the enquiry form: `Consultation Fee: Free` and `Consultation Fee: R300`.
2. Made the header's `Book a Free Online Consultation` action open the form with Online selected.
3. Replaced the old public-facing name in the About image alternative text, hero-video accessibility label and WhatsApp greeting. The registered legal entity name remains in legal policies and structured data where it is legally appropriate.
4. Restored the owner-supplied home hero order: `Explore Our Services` first, then `Book a Free Online Consultation`.
5. Moved the hero controls after the approved introductory paragraphs, matching the source sequence.
6. Restored the closing CTA order and priority: `Submit an Enquiry` first, then `Book a Free Online Consultation`.
7. Made `Submit an Enquiry` open the enquiry form directly instead of only navigating to the Contact page.
8. Made all three package enquiry actions open the enquiry form directly.
9. Moved the form action before the exact required-fields note and `BEFORE YOU SUBMIT` notices, matching the source.
10. Removed invented dropdown prompts/options and used the exact approved labels and guidance sentence.
11. Set each detailed service page's browser title to its exact owner-approved detailed-page heading.
12. Replaced the passive consultation-type dropdown and display cards with two accessible, full-card radio choices. The selected choice is visibly highlighted, keyboard-operable and submitted with the enquiry; online and office CTAs preselect their matching option. The field remains optional exactly as specified by the absence of an asterisk in the owner document.
13. Replaced the visible full-logo asset with the owner-supplied 1312 × 1199 PNG and increased its header, drawer and footer presentation sizes. Removed AOL's registration number from public pages and structured data, replacing the footer disclosure with `All documents, including the company registration, are available upon request.` Company-registration service copy remains intact.
14. Replaced the AI-generated About image with the owner-approved real Unsplash photograph by Microsoft 365. The 2400 × 1600 source is served locally and responsively cropped to show the accounting workspace without a visible face.

## Verified result

- 31 of 31 approved sections independently match the PDF.
- 2,303 of 2,303 approved passages/action/field labels appear on the correct built routes.
- Approved blocks follow the intended main-content or form sequence.
- All ten service destinations work and retain their complete detailed content.
- All internal links and fragment targets resolve across all 17 public content routes.
- Required form fields, consultation choices and fee disclosures are present.
- Online/office and package CTA behaviour is mapped correctly.
- TypeScript, production build, exact-copy verification and whitespace checks pass.

## Deliberately preserved source wording

The pricing page says `In-Person Consultation — R300 per hour`; the Contact page says `Consultation Fee: R300` and `The consultation fee is R300.` The supplied required-field note is `Fields marked with an asterisk () are required.*`. The Healthcare section retains its supplied `01` numbering. These differences are in the owner source and were not silently rewritten.

## Release decision

The audited build is suitable for owner review on the private preview. Production remains a no-go until the owner approves the preview and a live Netlify enquiry is submitted and confirmed received under the release-safety checks.
