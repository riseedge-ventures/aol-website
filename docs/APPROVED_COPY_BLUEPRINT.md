# AOL owner-approved wording replacement — 20 November 2026

Source of truth: `AOL_Accountants_Approved_Website_Content_Master_FINAL_LAYOUT.pdf` supplied by the owner (107 pages). This instruction supersedes earlier copy registers.

## Objective and constraints
Replace marketing wording with the exact supplied words. Preserve existing routes, page structure, component classes, grids, images, colours, typography, navigation and functioning enquiry delivery. No paraphrases, invented claims, summaries, new services or package assumptions. PDF provenance, repeating folios and developer instructions are not public copy. Brackets around CTA instructions become functioning controls with the exact enclosed label.

## Requirements and mapping
1. Home hero: page 2. Existing remaining home sections draw verbatim copy from their corresponding approved page; full copy lives on the corresponding dedicated route.
2. About: pages 3–15, all six approved sections in order; retain the existing office image and introductory grid.
3. Services overview: pages 16–17, ten exact cards and descriptions. Page 18 specifies each Learn More destination; preserve existing ten service URLs.
4. Service detail: pages 19–74; map all ten complete approved detail sections to their matching existing service URLs.
5. Industries: pages 75–92; all six approved industries and complete sections in document order.
6. Pricing: pages 93–97; exact three cards, package scope, transaction definitions, exclusions and consultation terms. No unsupported Most Popular badge or invented transaction limits.
7. Insights: pages 98–101; approved topics, featured perspectives and supporting copy. Do not invent full articles or dead article links.
8. Contact: pages 102–107; all five sections, contact channels, consultation prices, required form labels and preferred consultation field. Use final approved address `27 Bram Fischer Road, North Beach, Durban, 4001`.
9. Shared marketing CTAs and brand wording use the approved public name AOL Accountants; preserve registered legal entity and legal policies which are not replaced by this document.
10. Keep paragraph text and punctuation verbatim, normalising only PDF line/page wrapping. Retain document headings, bullets and emphasis.

## Milestones and acceptance
- [x] Identify original repository and read source PDF.
- [x] Extract paragraph-level copy with page provenance and map to components.
- [x] Apply all replacements without CSS, asset or route changes.
- [x] Verify each source paragraph against the built matching page, all ten Learn More links, typecheck and build.
- [x] Audit approved block order and placement, CTA priority, form options, consultation/package intent, internal links and public-name attributes.
- [x] Review mobile and desktop across all 17 public routes; see verification report.
- [x] Publish the audited build to the persistent owner-only preview.
- [ ] Obtain owner approval and complete live Netlify form-delivery/release-safety checks before any production release.

## Dependencies, risks and release
Long approved text necessarily increases page/card heights; retain natural responsive flow, never shorten text to fit. Existing Netlify form delivery must remain intact and may only be proven end-to-end on that host. Production release requires existing security/regression evidence, monitoring and incident ownership, data protection, recovery and operational fallback, and customer communication evidence. Prepare a reviewable branch and PR; do not silently deploy or merge without verified release evidence. Rollback: revert the wording commit; forms, assets and deployment configuration remain preserved.
