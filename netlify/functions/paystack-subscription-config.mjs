import { cleanText, json, nextFirstOfMonthIso, requestOriginAllowed, secureEqual, validEmail } from "./_shared/paystack.mjs";

const handler = async (request) => {
  if (request.method !== "POST") return json(405, { ok: false, message: "Method not allowed." });
  if (!requestOriginAllowed(request)) return json(403, { ok: false, message: "Request origin is not allowed." });

  let input;
  try {
    input = await request.json();
  } catch {
    return json(400, { ok: false, message: "Invalid subscription request." });
  }

  const invite = cleanText(input?.invite, 180);
  const email = validEmail(input?.email);
  const expectedInvite = process.env.AOL_SUBSCRIPTION_INVITE_CODE || "";
  const expectedEmail = validEmail(process.env.AOL_EXISTING_CLIENT_EMAIL || "");
  const publicKey = cleanText(process.env.PAYSTACK_PUBLIC_KEY, 180);
  const amount = Number(process.env.AOL_EXISTING_CLIENT_MONTHLY_AMOUNT_CENTS);

  if (!secureEqual(invite, expectedInvite) || !email || (expectedEmail && email !== expectedEmail)) {
    return json(403, { ok: false, message: "This billing invitation is invalid or has expired." });
  }

  if (!publicKey.startsWith("pk_") || !Number.isInteger(amount) || amount < 100) {
    return json(503, { ok: false, message: "The customised monthly subscription is not configured yet." });
  }

  return json(200, {
    ok: true,
    publicKey,
    amount,
    currency: "ZAR",
    interval: "monthly",
    subscriptionStartDate: nextFirstOfMonthIso(),
  });
};

export default handler;

