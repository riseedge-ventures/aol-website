import { OFFICE_CONSULTATION_AMOUNT_CENTS, cleanText, json, paystack } from "./_shared/paystack.mjs";

const handler = async (request) => {
  if (request.method !== "GET") return json(405, { ok: false, message: "Method not allowed." });
  const reference = cleanText(new URL(request.url).searchParams.get("reference"), 120);
  if (!/^[A-Za-z0-9._=-]{6,120}$/.test(reference)) {
    return json(400, { ok: false, verified: false, message: "A valid payment reference is required." });
  }

  try {
    const data = await paystack(`/transaction/verify/${encodeURIComponent(reference)}`, { method: "GET" });
    const metadata = data.metadata && typeof data.metadata === "object" ? data.metadata : {};
    const purpose = cleanText(metadata.purpose, 80);
    const successful = data.status === "success";
    const correctCurrency = data.currency === "ZAR";
    const correctAmount = purpose === "office_consultation"
      ? data.amount === OFFICE_CONSULTATION_AMOUNT_CENTS
      : Number.isInteger(data.amount) && data.amount >= 100;
    const verified = successful && correctCurrency && correctAmount;

    return json(verified ? 200 : 409, {
      ok: verified,
      verified,
      status: cleanText(data.status, 40),
      purpose,
      reference: cleanText(data.reference, 120),
      amount: data.amount,
      currency: cleanText(data.currency, 8),
      paidAt: cleanText(data.paid_at, 60),
      message: verified ? "Payment verified." : "Payment has not been verified.",
    });
  } catch (error) {
    const unavailable = error instanceof Error && error.message === "PAYSTACK_NOT_CONFIGURED";
    return json(unavailable ? 503 : 502, {
      ok: false,
      verified: false,
      message: unavailable ? "Payment verification is not configured yet." : "Payment verification is temporarily unavailable.",
    });
  }
};

export default handler;

