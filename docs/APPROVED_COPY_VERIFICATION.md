# Approved wording verification — 20 November 2026

## Source and result

Source PDF SHA-256: `b522c12a43c645c61f274587eebbe9352e18cc01ba48ace7a643b23dad2d0e15`.

Owner source: `AOL_Accountants_Approved_Website_Content_Master_FINAL_LAYOUT.pdf`, 107 pages. The 31 approved content sections are transcribed in `src/content/approved-copy.json`; each block retains its source page, words and emphasis runs. PDF provenance, repeating folios and developer routing instructions are excluded from public copy.

All 31 sections match an independent pypdf extraction, including punctuation, with only whitespace/page wrapping normalised. pypdf represents the PDF bullet glyph as DEL; this glyph is normalised to the visible bullet for the independent comparison.

All 2,303 approved passages and action/field labels occur on their matching built pages. They also occur in the intended main-content or form sequence rather than merely somewhere in shared page HTML. All ten Learn More links point to their corresponding complete service detail routes. Source actions become working links/buttons; form-field instructions become labelled fields. The form preserves its Netlify identity and endpoint, with its required fields and preferred consultation type represented in both the interactive form and static detection form. Online and office CTA buttons initialise the appropriate consultation preference. All internal links and fragment targets resolve across the 17 public routes.

The strict follow-up audit corrected ten implementation categories beyond the previously missing visible fee disclosure: header consultation intent, legacy public-name attributes, hero CTA order, hero CTA placement, closing CTA order and priority, closing enquiry destination, package enquiry destinations, form action/note placement, invented dropdown wording, and detailed-service browser titles. These were implementation errors; none of the owner's supplied wording was rewritten to correct them.

The consultation-type control was subsequently strengthened into two full-card radio choices. Selecting either card updates the submitted `consultation_type` value and its visible selected state; consultation-specific CTAs preselect the matching choice. It remains optional because the approved form specification labels it `Preferred Consultation Type` without the required asterisk.

The owner-supplied full-resolution AOL Accountants PNG subsequently replaced the public full-logo asset in the header, mobile drawer, footer and structured data. Its display sizes were increased without recreating or compressing the supplied artwork. The company registration number was removed from public pages and structured data; the footer now states exactly: `All documents, including the company registration, are available upon request.`

The owner-approved real Unsplash photograph by Microsoft 365 replaced the generated About image. The local 2400 × 1600 JPEG is cropped responsively with CSS to preserve the laptop, calculator and financial-document workspace without showing a face. No AOL branding or documentary evidence is fabricated inside the image.

## Verification evidence

- `npm run typecheck`: passed.
- `npm run build`: passed, all 28 generated outputs including all ten service routes.
- `python scripts/verify-approved-copy.py <owner-pdf-path>`: passed (independent source equality, 2,303 built passage/label checks, exact sequence/placement, action intent, all internal links/fragment targets, service titles, required form fields, public-name attributes and obsolete-copy exclusions).
- `git diff --check`: passed.
- Desktop browser QA: passed for the home, About, Services, service detail, Industries, Pricing and Contact layouts.
- Mobile browser QA at a 390px content viewport: passed across all 17 public content routes with no horizontal overflow. Header navigation, fixed contact actions, stacked pricing, About imagery and all ten visible Learn More routes were checked.
- Interactive enquiry modal QA: passed on mobile and desktop. The modal opens from the Book action, remains within the viewport, scrolls internally, displays the approved field labels and visibly discloses the exact supplied consultation fees: `Consultation Fee: Free` and `Consultation Fee: R300`.
- Existing images/video, dependency files, route paths, legal policies and deployment settings: unchanged. Three presentation-only refinements were made: the long About introduction is top-aligned, Learn More labels remain visible without hover, and the Industries page displays its approved heading once instead of twice.
- Live Netlify enquiry receipt: **unverified**. No external enquiry was submitted during this copy update.

## Source discrepancies preserved

- Pricing page: `In-Person Consultation — R300 per hour`.
- Contact page: `Consultation Fee: R300` and `The consultation fee is R300.`
- Required-field note is reproduced exactly, including its supplied punctuation: `Fields marked with an asterisk () are required.*`
- Healthcare section retains its supplied `01 — HEALTHCARE & MEDICAL PRACTICES` numbering although it is the sixth industry in the document.

These are source-owned wording issues, not silently corrected by the implementation.

## Release decision

**NO-GO for production; GO for review branch and pull request.**

| Required category | Evidence / remaining limitation |
| --- | --- |
| Prevention and regression | Typecheck, production build, exact-source verification, built-route checks and desktop/mobile browser QA pass. Live Netlify enquiry receipt remains unverified. |
| Monitoring and alerts | Existing deployment/alert configuration preserved; live monitoring ownership and alert delivery not verified in this task. |
| Data and transaction protection | No database, payment or live customer record changes. Enquiry form identity/POST endpoint preserved; live receipt and host-side data protections not verified. |
| Recovery and operational fallback | All edits isolated to a branch. Reverting the content commit restores prior code; existing phone, email and WhatsApp channels retained. A production recovery exercise has not been performed. |
| Communication and incident ownership | Scope, source discrepancies and verification limitations recorded here and in the PR. Production incident owner and launch communication remain to be confirmed. |

Do not merge/deploy until the remaining release evidence is supplied. Review does not require a production release. Natural text wrapping and card/page heights grow to accommodate the complete approved wording; no copy is shortened to fit.

## Reproduce

The owner PDF is an input supplied separately, not a public repository attachment. Run the extraction with Python/PyMuPDF and verification with Python/pypdf/beautifulsoup4:

```sh
python scripts/extract-approved-copy.py /absolute/path/AOL_Accountants_Approved_Website_Content_Master_FINAL_LAYOUT.pdf
npm ci --no-audit --no-fund
npm run typecheck
npm run build
python scripts/verify-approved-copy.py /absolute/path/AOL_Accountants_Approved_Website_Content_Master_FINAL_LAYOUT.pdf
```

## Publication status

The implementation and visual refinements are committed locally. A persistent owner-only review deployment is available at `https://aol-owner-preview-20261120.philasandentokozo7.chatgpt.site`; its latest private deployment completed successfully on 20 November 2026. This review deployment does not change the live AOL production website.

Automatic approval review rejected pushing the content branch to the public `riseedge-ventures/aol-website` GitHub repository because explicit authorization for public disclosure was not established. No workaround was attempted. A local patch remains available for review; no public pull request or production deployment has been created.
