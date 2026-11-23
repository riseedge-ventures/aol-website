import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const OFFICE_CONSULTATION_AMOUNT_CENTS = 30_000;
export const PAYMENT_EVENT_FORM_NAME = "aol-payment-events";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store, max-age=0",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
};

export function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export function cleanText(value, maxLength = 160) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function validEmail(value) {
  const email = cleanText(value, 254).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

export function secureEqual(left, right) {
  const a = Buffer.from(String(left ?? ""));
  const b = Buffer.from(String(right ?? ""));
  if (a.length !== b.length || a.length === 0) return false;
  return timingSafeEqual(a, b);
}

export function verifyLegacyWebhookSignature(rawBody, signature, secret) {
  if (!secret || !signature) return false;
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  return secureEqual(expected, signature);
}

export function verifyWebhookSignature(rawBody, signature, secret, nowSeconds = Math.floor(Date.now() / 1_000)) {
  if (!secret || !signature) return false;

  const fields = String(signature).split(",");
  const timestamp = Number(fields.find((field) => field.startsWith("t="))?.slice(2));
  const signatures = fields
    .filter((field) => field.startsWith("v1="))
    .map((field) => field.slice(3).split(":", 2)[1])
    .filter(Boolean);

  if (!Number.isSafeInteger(timestamp) || Math.abs(nowSeconds - timestamp) > 300 || signatures.length === 0) return false;
  const expected = createHmac("sha512", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  return signatures.some((candidate) => secureEqual(expected, candidate));
}

export function paymentReference(prefix) {
  return `${prefix}-${Date.now()}-${randomUUID().replaceAll("-", "").slice(0, 12)}`;
}

export function siteOrigin(request) {
  const configured = process.env.URL || process.env.DEPLOY_PRIME_URL;
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      // Fall back to the request origin below.
    }
  }
  return new URL(request.url).origin;
}

export function requestOriginAllowed(request) {
  const supplied = request.headers.get("origin");
  if (!supplied) return true;
  try {
    return new URL(supplied).origin === new URL(request.url).origin || new URL(supplied).origin === siteOrigin(request);
  } catch {
    return false;
  }
}

export async function paystack(path, options = {}) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("PAYSTACK_NOT_CONFIGURED");
  const response = await fetch(`https://api.paystack.co${path}`, {
    ...options,
    headers: {
      authorization: `Bearer ${secret}`,
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.status) {
    const error = new Error("PAYSTACK_REQUEST_FAILED");
    error.httpStatus = response.status;
    error.publicMessage = cleanText(payload?.message, 180);
    throw error;
  }
  return payload.data;
}

export function nextFirstOfMonthIso(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-ZA", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "numeric",
  }).formatToParts(now);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  return `${nextYear}-${String(nextMonth).padStart(2, "0")}-01T00:05:00+02:00`;
}

export async function recordPaymentEvent(request, event) {
  const origin = siteOrigin(request);
  const body = new URLSearchParams({
    "form-name": PAYMENT_EVENT_FORM_NAME,
    event: cleanText(event.event, 80),
    reference: cleanText(event.reference, 120),
    purpose: cleanText(event.purpose, 80),
    amount: String(Number.isFinite(event.amount) ? event.amount : ""),
    currency: cleanText(event.currency, 8),
    customer_email: validEmail(event.customerEmail),
    status: cleanText(event.status, 80),
    subscription_code: cleanText(event.subscriptionCode, 120),
    received_at: new Date().toISOString(),
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2_000);
  try {
    await fetch(`${origin}/`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: controller.signal,
    });
  } catch {
    // Paystack remains the transaction system of record if event mirroring is unavailable.
  } finally {
    clearTimeout(timer);
  }
}

