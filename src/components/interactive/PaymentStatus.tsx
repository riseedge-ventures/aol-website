"use client";

import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_URL } from "@/config/site";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

type Status = "checking" | "paid" | "pending" | "error";

export function PaymentStatus() {
  const [status, setStatus] = useState<Status>("checking");
  const [purpose, setPurpose] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const ref = query.get("reference") || query.get("trxref") || "";
    setReference(ref);
    if (!ref) {
      setStatus("error");
      return;
    }

    const controller = new AbortController();
    fetch(`/.netlify/functions/paystack-verify?reference=${encodeURIComponent(ref)}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then(async (response) => ({ response, body: await response.json().catch(() => null) }))
      .then(({ response, body }) => {
        setPurpose(String(body?.purpose || ""));
        if (response.ok && body?.verified) setStatus("paid");
        else if (body?.status === "pending" || body?.status === "ongoing") setStatus("pending");
        else setStatus("error");
      })
      .catch((error) => {
        if (error?.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, []);

  const isSubscription = purpose === "monthly_subscription";

  return (
    <div className={`payment-result payment-result--${status}`} aria-live="polite">
      <span className="payment-result__icon" aria-hidden="true">
        <Icon name={status === "paid" ? "check" : status === "checking" ? "loader-circle" : "shield-alert"} size={30} />
      </span>
      {status === "checking" ? (
        <>
          <h1>Confirming your payment</h1>
          <p>Please wait while we securely verify the payment with Paystack.</p>
        </>
      ) : status === "paid" ? (
        <>
          <h1>Payment received</h1>
          <p>
            {isSubscription
              ? "Your initial monthly payment has been verified. AOL Accountants will confirm that your customised subscription is active."
              : "Your R300 office-consultation payment has been verified. AOL Accountants will contact you to confirm the consultation arrangements."}
          </p>
          <p><strong>Payment reference:</strong> {reference}</p>
        </>
      ) : status === "pending" ? (
        <>
          <h1>Payment is still processing</h1>
          <p>Your appointment is not confirmed yet. AOL Accountants will confirm it after Paystack reports a successful payment.</p>
        </>
      ) : (
        <>
          <h1>Payment not confirmed</h1>
          <p>No office appointment or monthly subscription has been confirmed. Please contact AOL Accountants before trying again.</p>
          {reference ? <p><strong>Reference:</strong> {reference}</p> : null}
        </>
      )}
      <div className="payment-result__actions">
        <Button href="/">Back to home</Button>
        <Button href={WHATSAPP_URL} variant="outline">WhatsApp</Button>
        <a className="text-link" href={PHONE_HREF}>Call {PHONE_DISPLAY}</a>
      </div>
    </div>
  );
}

