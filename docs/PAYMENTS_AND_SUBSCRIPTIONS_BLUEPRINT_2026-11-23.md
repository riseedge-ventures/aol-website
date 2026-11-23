# AOL payments and subscriptions blueprint

Date: 23 November 2026  
Status: Approved for implementation by the owner

## Objective

Add secure Paystack payment handling to the existing AOL Accountants website without changing the owner-approved website wording, layout structure, public company facts or existing free-online-consultation flow.

## Locked business decisions

1. A free online consultation remains free.
2. An office consultation costs R300 and must be paid before the appointment is confirmed.
3. The R300 office-consultation fee is non-refundable.
4. An office consultation may be rescheduled once when at least 24 hours' notice is provided.
5. The existing monthly client receives a customised monthly subscription using the client's current agreed fee.
6. Automatic monthly collection occurs on the first day of each month.
7. If a monthly payment fails, AOL continues essential compliance work only until payment is received.
8. While an account is unpaid, non-essential services do not continue.

## Functional requirements

### Office consultation

1. Preserve the existing enquiry form and exact approved field labels.
2. Preserve Netlify Forms submission and the `aol-website-enquiries` identity.
3. When `Office Consultation` is selected, create a server-side Paystack transaction for exactly ZAR 300.00.
4. Never accept an amount supplied by the browser.
5. Record the enquiry before redirecting to Paystack checkout.
6. Confirm payment only through server-side Paystack verification and a signed webhook.
7. Display a clear paid, pending, failed or unavailable state after checkout.
8. Do not confirm an office consultation merely because the customer returned to the website.

### Monthly subscription

1. Provide a private, unlisted client billing page.
2. Require a revocable invitation code before returning subscription configuration.
3. Read the existing client's email and agreed monthly amount from Netlify environment variables; do not commit them.
4. Charge the first agreed monthly fee when the client accepts the subscription.
5. Schedule subsequent monthly charges for the first day of the following month.
6. Use Paystack-hosted card collection; AOL must never collect or store card numbers.
7. Record subscription creation, successful charges, failed invoices and cancellation events.
8. Failed subscription payments are not treated as successful and must be visible to AOL operations.

## Security and privacy constraints

1. `PAYSTACK_SECRET_KEY`, the client email and the invitation code are server-only environment variables.
2. The Paystack public key and the approved monthly amount may be returned only after invitation validation.
3. Webhook signatures are verified with HMAC-SHA512 before any event is processed.
4. Payment event records exclude card numbers, authorisation codes, identity numbers and banking credentials.
5. API responses use `Cache-Control: no-store` and restrictive security headers.
6. The payment status page and client billing page are excluded from search indexing and the sitemap.
7. No live transaction is attempted during development or QA.

## Runtime configuration

- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_PUBLIC_KEY`
- `AOL_EXISTING_CLIENT_EMAIL`
- `AOL_EXISTING_CLIENT_MONTHLY_AMOUNT_CENTS`
- `AOL_SUBSCRIPTION_INVITE_CODE`
- `URL` (provided by Netlify in production)

## Payment event states

- Office: `payment_pending`, `paid`, `payment_failed`.
- Subscription: `active`, `attention`, `non-renewing`, `disabled`.
- `invoice.payment_failed` places the client into `attention`; AOL continues only essential compliance work.
- A later successful charge returns the account to `active`.

## Validation and acceptance

1. TypeScript check passes.
2. Static production build passes.
3. All Netlify function modules pass syntax checks.
4. The approved-copy verifier continues to pass all 2,303 passages and form mappings.
5. The online consultation submits without opening payment.
6. The office consultation requests a fixed R300 server transaction.
7. Missing keys or configuration fail closed with a helpful message.
8. Tampered amounts, invalid invitation codes and invalid webhook signatures are rejected.
9. Mobile widths have no horizontal overflow.
10. No production deployment proceeds while the Netlify account is restricted or live Paystack activation is incomplete.

## Release and rollback

- Release only after test-mode payment, webhook and subscription-cycle checks pass.
- Preserve the pre-payment production commit as the rollback point.
- Rollback is a single Git revert of the payment implementation commit.
- Phone, email and WhatsApp remain the operational fallback if Paystack is unavailable.

