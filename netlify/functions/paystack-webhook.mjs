import {
  OFFICE_CONSULTATION_AMOUNT_CENTS,
  cleanText,
  json,
  recordPaymentEvent,
  verifyWebhookSignature,
} from "./_shared/paystack.mjs";

const TRACKED_EVENTS = new Set([
  "charge.success",
  "invoice.create",
  "invoice.payment_failed",
  "invoice.update",
  "subscription.create",
  "subscription.not_renew",
  "subscription.disable",
  "subscription.expiring_cards",
]);

export default async (request) => {
  if (request.method !== "POST") return json(405, { ok: false });
  const rawBody = await request.text();
  const secret = process.env.PAYSTACK_SECRET_KEY || "";
  const signature = request.headers.get("x-paystack-signature") || "";
  if (!verifyWebhookSignature(rawBody, signature, secret)) return json(401, { ok: false });

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return json(400, { ok: false });
  }

  const eventName = cleanText(payload?.event, 80);
  if (!TRACKED_EVENTS.has(eventName)) return json(200, { ok: true });

  const data = payload?.data || {};
  const metadata = data.metadata && typeof data.metadata === "object" ? data.metadata : {};
  const purpose = cleanText(metadata.purpose, 80) || (eventName.startsWith("subscription") || eventName.startsWith("invoice") ? "monthly_subscription" : "");
  const amount = Number(data.amount ?? data.plan?.amount ?? data.transaction?.amount);
  const currency = cleanText(data.currency ?? data.plan?.currency ?? data.transaction?.currency, 8);
  const reference = cleanText(data.reference ?? data.transaction?.reference, 120);
  const customerEmail = cleanText(data.customer?.email ?? data.email, 254);
  const subscriptionCode = cleanText(data.subscription_code ?? data.subscription?.subscription_code, 120);

  let status = cleanText(data.status, 80) || eventName;
  if (eventName === "invoice.payment_failed") status = "attention";
  if (eventName === "charge.success" && purpose === "office_consultation" && (amount !== OFFICE_CONSULTATION_AMOUNT_CENTS || currency !== "ZAR")) {
    status = "rejected_amount_mismatch";
  }

  await recordPaymentEvent(request, {
    event: eventName,
    reference,
    purpose,
    amount,
    currency,
    customerEmail,
    status,
    subscriptionCode,
  });

  return json(200, { ok: true });
};

