# AOL payment operations runbook

Date: 23 November 2026

## Office consultation

1. Client selects `Office Consultation` in the existing enquiry form.
2. The server creates a fixed ZAR 300.00 Paystack transaction.
3. The enquiry is recorded before the client leaves the AOL website.
4. The client completes payment on Paystack-hosted checkout.
5. AOL treats the consultation as paid only after a valid `charge.success` webhook or server-side transaction verification confirms ZAR 300.00.
6. Payment does not by itself confirm a date and time. AOL communicates the consultation arrangement separately.
7. The fee is non-refundable. One rescheduling request is permitted with at least 24 hours' notice.

If checkout is unavailable, the enquiry remains recorded but no office appointment is confirmed. AOL may send a secure Paystack payment link manually.

## Existing monthly client

1. Confirm the client's current agreed monthly fee and email address.
2. Set the fee in cents in `AOL_EXISTING_CLIENT_MONTHLY_AMOUNT_CENTS`.
3. Set the client's exact email in `AOL_EXISTING_CLIENT_EMAIL`.
4. Create a strong, revocable `AOL_SUBSCRIPTION_INVITE_CODE`.
5. Send the client the private `/client-billing/?invite=...` link only when the next monthly payment is due.
6. The first agreed monthly fee is charged when the client accepts the subscription.
7. Subsequent charges are scheduled for the first day of each month.

## Failed subscription payment

Paystack does not automatically retry a failed subscription charge. On `invoice.payment_failed`:

1. Mark the account `attention` in the operating register.
2. Notify the client and send a Paystack subscription-management link so the card can be updated.
3. Stop advisory work, management reporting, meetings, new assignments and other non-essential services.
4. Continue only essential compliance work already within the signed engagement and necessary to avoid an immediate statutory deadline or penalty.
5. Keep the unpaid amount outstanding until settled.
6. Restore full contracted services only after a later successful charge is verified.

This rule does not authorise work beyond the signed engagement or require AOL to fund disbursements, penalties, third-party costs or new assignments for an unpaid client.

## Netlify configuration

Set these as Netlify environment variables, never in Git or client-side code:

- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_PUBLIC_KEY`
- `AOL_EXISTING_CLIENT_EMAIL`
- `AOL_EXISTING_CLIENT_MONTHLY_AMOUNT_CENTS`
- `AOL_SUBSCRIPTION_INVITE_CODE`

Configure the Paystack webhook URL as:

`https://aolaccountants.co.za/.netlify/functions/paystack-webhook`

Subscribe at minimum to successful charges, subscription lifecycle, invoice creation/update/failure and expiring-card events.

## Go-live gate

1. Netlify overdue balance resolved and production deploys restored.
2. Paystack live mode activated.
3. Live keys stored only in Netlify.
4. Existing client's exact fee and email confirmed.
5. R300 office payment completed in Paystack test mode.
6. Invalid payment, cancelled payment and amount-mismatch tests pass.
7. Test subscription is created and the first-of-month next payment date is confirmed.
8. Signed webhook events appear in Paystack and the `aol-payment-events` Netlify form.
9. `office@aolaccountants.co.za` receives the required operational notifications.
10. Owner gives the final live-transaction approval.

