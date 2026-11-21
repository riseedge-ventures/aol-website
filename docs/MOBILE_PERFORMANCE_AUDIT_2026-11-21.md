# AOL website mobile and performance audit

Audit date: 21 November 2026

## Scope

- Phone widths: 320, 360, 390 and 430 CSS pixels
- Public routes: Home, About, Services, all ten service detail pages, Industries, Pricing, Insights, Contact, Privacy Notice, Cookie Policy, Terms of Use and Thank You
- Interactive route: enquiry drawer including the Online and Office consultation choices
- Content rule: owner-approved wording is locked and must pass `scripts/verify-approved-copy.py`

## Corrections

- The About photograph uses a purpose-built 2:1 top-aligned mobile presentation below 900 pixels, preventing the desktop 5:6 card from being imposed on phones and excluding the partial face at the source photograph's lower edge.
- The existing 5:6 sticky image presentation remains unchanged from 900 pixels upward.
- Long inner-page headings are capped at 32 pixels at widths of 360 pixels and below.
- Long links and email addresses may wrap instead of forcing horizontal overflow.
- The current mobile header, visible AOL logo, Book control, menu, bottom contact bar and stacked consultation choices are preserved.
- The supplied logo is served as a 112,614-byte high-quality WebP instead of the 746,262-byte PNG, an 84.9% reduction.
- The approved office photograph is served as a 134,032-byte 1600-pixel WebP instead of the 611,481-byte JPEG, a 78.1% reduction.
- Original owner/source assets remain in the repository for provenance; the uncropped photograph is internal and is not copied into the public build.

## Acceptance checks

- No page-wide horizontal overflow at 320, 360, 390 or 430 pixels.
- Mobile controls remain at least 44 pixels where interaction is required.
- Online and Office consultation cards remain independently selectable and stack vertically on phones.
- The production build, TypeScript check and exact-copy verifier pass before deployment.
- The public AOL production website remains unchanged; corrections are released only to the owner-private preview.
