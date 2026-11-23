import test from "node:test";
import assert from "node:assert/strict";
import officePayment from "../netlify/functions/paystack-office-payment.mjs";
import subscriptionConfig from "../netlify/functions/paystack-subscription-config.mjs";
import webhook from "../netlify/functions/paystack-webhook.mjs";
import { createHmac } from "node:crypto";
import { nextFirstOfMonthIso } from "../netlify/functions/_shared/paystack.mjs";

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };

test.afterEach(() => {
  globalThis.fetch = originalFetch;
  process.env = { ...originalEnv };
});

test("office checkout always initializes exactly R300 in ZAR", async () => {
  process.env.URL = "https://aolaccountants.co.za";
  process.env.PAYSTACK_SECRET_KEY = "sk_test_not_a_real_key";
  let sent;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.paystack.co/transaction/initialize");
    sent = JSON.parse(options.body);
    return new Response(JSON.stringify({
      status: true,
      data: { authorization_url: "https://checkout.paystack.com/test-session", reference: sent.reference },
    }), { status: 200, headers: { "content-type": "application/json" } });
  };

  const response = await officePayment(new Request("https://aolaccountants.co.za/.netlify/functions/paystack-office-payment", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://aolaccountants.co.za" },
    body: JSON.stringify({
      name: "Test Client",
      email: "client@example.com",
      phone: "+27 71 000 0000",
      business: "Example Business",
      service: "Accounting & Bookkeeping",
      amount: 1,
    }),
  }));
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(sent.amount, 30_000);
  assert.equal(sent.currency, "ZAR");
  assert.equal(sent.metadata.purpose, "office_consultation");
  assert.equal(sent.callback_url, "https://aolaccountants.co.za/payment/");
});

test("subscription configuration requires the private invitation and approved client email", async () => {
  process.env.AOL_SUBSCRIPTION_INVITE_CODE = "private-invite";
  process.env.AOL_EXISTING_CLIENT_EMAIL = "client@example.com";
  process.env.AOL_EXISTING_CLIENT_MONTHLY_AMOUNT_CENTS = "230000";
  process.env.PAYSTACK_PUBLIC_KEY = "pk_test_not_a_real_key";

  const invalid = await subscriptionConfig(new Request("https://aolaccountants.co.za/.netlify/functions/paystack-subscription-config", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://aolaccountants.co.za" },
    body: JSON.stringify({ invite: "wrong", email: "client@example.com" }),
  }));
  assert.equal(invalid.status, 403);

  const valid = await subscriptionConfig(new Request("https://aolaccountants.co.za/.netlify/functions/paystack-subscription-config", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://aolaccountants.co.za" },
    body: JSON.stringify({ invite: "private-invite", email: "CLIENT@example.com" }),
  }));
  const body = await valid.json();
  assert.equal(valid.status, 200);
  assert.equal(body.amount, 230000);
  assert.equal(body.interval, "monthly");
  assert.match(body.subscriptionStartDate, /^\d{4}-\d{2}-01T00:05:00\+02:00$/);
});

test("next billing date rolls December into January", () => {
  assert.equal(nextFirstOfMonthIso(new Date("2026-12-15T12:00:00Z")), "2027-01-01T00:05:00+02:00");
});

test("webhook rejects an unsigned payload", async () => {
  process.env.PAYSTACK_SECRET_KEY = "sk_test_not_a_real_key";
  const response = await webhook(new Request("https://aolaccountants.co.za/.netlify/functions/paystack-webhook", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ event: "charge.success", data: {} }),
  }));
  assert.equal(response.status, 401);
});

test("webhook accepts Paystack's current timestamped signature", async () => {
  const rawBody = JSON.stringify({ event: "charge.success", data: {} });
  const timestamp = Math.floor(Date.now() / 1_000);
  process.env.PAYSTACK_WEBHOOK_SECRET = "whsec_not_a_real_secret";
  const digest = createHmac("sha512", process.env.PAYSTACK_WEBHOOK_SECRET)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
  globalThis.fetch = async () => new Response("", { status: 200 });

  const response = await webhook(new Request("https://aolaccountants.co.za/.netlify/functions/paystack-webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "paystack-signature": `t=${timestamp},v1=whk_test:${digest}`,
    },
    body: rawBody,
  }));
  assert.equal(response.status, 200);
});

test("webhook rejects a valid signature older than five minutes", async () => {
  const rawBody = JSON.stringify({ event: "charge.success", data: {} });
  const timestamp = Math.floor(Date.now() / 1_000) - 301;
  process.env.PAYSTACK_WEBHOOK_SECRET = "whsec_not_a_real_secret";
  const digest = createHmac("sha512", process.env.PAYSTACK_WEBHOOK_SECRET)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  const response = await webhook(new Request("https://aolaccountants.co.za/.netlify/functions/paystack-webhook", {
    method: "POST",
    headers: { "paystack-signature": `t=${timestamp},v1=whk_test:${digest}` },
    body: rawBody,
  }));
  assert.equal(response.status, 401);
});

