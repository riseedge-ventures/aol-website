"use client";

import { useEffect, useState } from "react";

export function ThankYouPaymentNotice() {
  const [pending, setPending] = useState(false);
  useEffect(() => {
    setPending(new URLSearchParams(window.location.search).get("payment") === "pending");
  }, []);
  if (!pending) return null;
  return (
    <div className="payment-fallback-notice" role="status">
      <strong>Your enquiry has been received, but online payment was not opened.</strong>
      <span>Your office consultation is not confirmed. AOL Accountants will provide secure payment arrangements directly.</span>
    </div>
  );
}

