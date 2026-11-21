import { SiteChrome } from "@/components/layout/SiteChrome";
import { ApprovedPricingCards, ApprovedPricingIntro, ApprovedPricingTerms } from "@/components/sections/ApprovedPricing";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { words } from "@/content/approved";
import { canonicalUrl } from "@/lib/seo";
import type { Metadata } from "next";

const TITLE = words(24, 0);
const DESCRIPTION = words(24, 2);

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl("/pricing/") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: canonicalUrl("/pricing/") },
};

export default function PricingPage() {
  return (
    <SiteChrome>
      <article className="section section--white page-hero">
        <div className="container page-content">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Pricing", path: "/pricing/" },
            ]}
          />
          <ApprovedPricingIntro page />
          <ApprovedPricingCards />
          <ApprovedPricingTerms />
        </div>
      </article>
    </SiteChrome>
  );
}
