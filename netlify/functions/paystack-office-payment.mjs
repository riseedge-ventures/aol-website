import {
  OFFICE_CONSULTATION_AMOUNT_CENTS,
  cleanText,
  json,
  paymentReference,
  paystack,
  requestOriginAllowed,
  siteOrigin,
  validEmail,
} from "./_shared/paystack.mjs";

export default async (request) => {
  if (request.method !== "POST") return json(405, { ok: false, message: "Method not allowed." });
  if (!requestOriginAllowed(request)) return json(403, { ok: false, message: "Request origin is not allowed." });

  let input;
  try {
    input = await request.json();
  } catch {
    return json(400, { ok: false, message: "Invalid payment request." });
  }

  const name = cleanText(input?.name, 100);
  const email = validEmail(input?.email);
  const phone = cleanText(input?.phone, 40);
  const business = cleanText(input?.business, 120);
  const service = cleanText(input?.service, 160);

  if (!name || !email || !phone || !service) {
    return json(400, { ok: false, message: "Complete the required enquiry details before payment." });
  }

  const reference = paymentReference("aol-office");
  const callbackUrl = `${siteOrigin(request)}/payment/`;

  try {
    const data = await paystack("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify({
        email,
        amount: OFFICE_CONSULTATION_AMOUNT_CENTS,
        currency: "ZAR",
        reference,
        callback_url: callbackUrl,
        metadata: {
          purpose: "office_consultation",
          client_name: name,
          phone,
          business,
          service,
          consultation_fee_policy: "non_refundable_reschedule_once_24_hours",
        },
      }),
    });

    const checkout = new URL(data.authorization_url);
    if (checkout.protocol !== "https:" || checkout.hostname !== "checkout.paystack.com") {
      throw new Error("INVALID_CHECKOUT_URL");
    }

    return json(200, { ok: true, authorizationUrl: checkout.toString(), reference });
  } catch (error) {
    const unavailable = error instanceof Error && error.message === "PAYSTACK_NOT_CONFIGURED";
    return json(unavailable ? 503 : 502, {
      ok: false,
      message: unavailable
        ? "Secure online payment is not available yet. AOL Accountants will provide payment arrangements directly."
        : "The secure payment session could not be created. Please try again or contact AOL Accountants.",
    });
  }
};

