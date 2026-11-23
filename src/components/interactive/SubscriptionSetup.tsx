"use client";

import Script from "next/script";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

type Config = {
  publicKey: string;
  amount: number;
  currency: "ZAR";
  interval: "monthly";
  subscriptionStartDate: string;
};

type PaystackTransaction = { reference?: string; trxref?: string };
type PaystackOptions = {
  key: string;
  email: string;
  amount: number;
  currency: string;
  planInterval: string;
  subscriptionStartDate: string;
  metadata: Record<string, unknown>;
  onSuccess: (transaction: PaystackTransaction) => void;
  onCancel: () => void;
  onError: (error: { message?: string }) => void;
};

declare global {
  interface Window {
    Paystack?: new () => { newTransaction: (options: PaystackOptions) => void };
  }
}

function money(cents: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);
}

export function SubscriptionSetup() {
  const [invite, setInvite] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setInvite(new URLSearchParams(window.location.search).get("invite") || "");
  }, []);

  const prepare = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/.netlify/functions/paystack-subscription-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite, email }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) throw new Error(body?.message || "The subscription could not be prepared.");
      setConfig(body as Config);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The subscription could not be prepared.");
    } finally {
      setLoading(false);
    }
  };

  const startPayment = () => {
    if (!config || !scriptReady || !window.Paystack) {
      setError("Secure checkout is still loading. Please wait a moment and try again.");
      return;
    }
    setError("");
    const popup = new window.Paystack();
    popup.newTransaction({
      key: config.publicKey,
      email,
      amount: config.amount,
      currency: config.currency,
      planInterval: config.interval,
      subscriptionStartDate: config.subscriptionStartDate,
      metadata: {
        purpose: "monthly_subscription",
        client_name: name.trim(),
        billing_day: 1,
        failed_payment_service_level: "essential_compliance_only",
      },
      onSuccess: (transaction) => {
        const reference = transaction.reference || transaction.trxref || "";
        window.location.assign(`/payment/?reference=${encodeURIComponent(reference)}&kind=subscription`);
      },
      onCancel: () => setError("Checkout was cancelled. No subscription has been created."),
      onError: (reason) => setError(reason?.message || "Secure checkout could not be opened."),
    });
  };

  return (
    <div className="billing-card">
      <Script src="https://js.paystack.co/v2/inline.js" strategy="afterInteractive" onLoad={() => setScriptReady(true)} />
      <div className="billing-card__heading">
        <span className="billing-card__icon" aria-hidden="true"><Icon name="credit-card" size={24} /></span>
        <div>
          <p className="billing-card__eyebrow">PRIVATE CLIENT BILLING</p>
          <h1>Set Up Your Monthly Payment</h1>
        </div>
      </div>

      {!config ? (
        <form className="billing-form" onSubmit={prepare} noValidate>
          <label htmlFor="billing-name">Full Name</label>
          <input id="billing-name" value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" />
          <label htmlFor="billing-email">Email Address</label>
          <input id="billing-email" value={email} onChange={(event) => setEmail(event.target.value)} required type="email" autoComplete="email" />
          <label htmlFor="billing-invite">Private Invitation Code</label>
          <input id="billing-invite" value={invite} onChange={(event) => setInvite(event.target.value)} required autoComplete="off" />
          <Button type="submit" block size="lg" disabled={loading}>{loading ? "Checking…" : "Continue Securely"}</Button>
        </form>
      ) : (
        <div className="billing-summary">
          <div><span>Monthly amount</span><strong>{money(config.amount)}</strong></div>
          <div><span>First payment</span><strong>Today</strong></div>
          <div><span>Future payments</span><strong>First day of every month</strong></div>
          <p>By continuing, you authorise Paystack to collect the agreed monthly fee automatically. If a payment fails, AOL Accountants will continue essential compliance work only until the account is paid.</p>
          <Button type="button" block size="lg" disabled={!scriptReady} onClick={startPayment}>
            {scriptReady ? `Pay ${money(config.amount)} & Activate` : "Loading Secure Checkout…"}
          </Button>
          <button type="button" className="text-link billing-summary__back" onClick={() => setConfig(null)}>Change details</button>
        </div>
      )}
      {error ? <p className="modal__form-error" role="alert">{error}</p> : null}
      <p className="billing-card__security"><Icon name="shield-check" size={17} /> Card details are entered securely on Paystack and are never stored by AOL Accountants.</p>
    </div>
  );
}

