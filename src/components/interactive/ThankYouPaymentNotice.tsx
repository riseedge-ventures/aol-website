"use client";

import { useSyncExternalStore } from "react";

function subscribeToLocationChange(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function paymentIsPending() {
  return new URLSearchParams(window.location.search).get("payment") === "pending";
}

export function ThankYouPaymentNotice() {
  const pending = useSyncExternalStore(subscribeToLocationChange, paymentIsPending, () => false);
  if (!pending) return null;
  return (
    <div className="payment-fallback-notice" role="status">
      <strong>Your enquiry has been received, but online payment was not opened.</strong>
      <span>Your office consultation is not confirmed. AOL Accountants will provide secure payment arrangements directly.</span>
    </div>
  );
}

