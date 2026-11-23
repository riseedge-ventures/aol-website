import type { Metadata } from "next";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { PaymentStatus } from "@/components/interactive/PaymentStatus";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Payment status",
  description: "Secure payment confirmation for AOL Accountants.",
  robots: { index: false, follow: false },
  alternates: { canonical: canonicalUrl("/payment/") },
};

export default function PaymentPage() {
  return (
    <SiteChrome>
      <section className="section section--white payment-page">
        <div className="container payment-page__inner">
          <PaymentStatus />
        </div>
      </section>
    </SiteChrome>
  );
}

