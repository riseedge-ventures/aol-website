import type { Metadata } from "next";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SubscriptionSetup } from "@/components/interactive/SubscriptionSetup";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Private client billing",
  description: "Private monthly payment setup for an AOL Accountants client.",
  robots: { index: false, follow: false },
  alternates: { canonical: canonicalUrl("/client-billing/") },
};

export default function ClientBillingPage() {
  return (
    <SiteChrome>
      <section className="section section--white billing-page">
        <div className="container billing-page__inner">
          <SubscriptionSetup />
        </div>
      </section>
    </SiteChrome>
  );
}

