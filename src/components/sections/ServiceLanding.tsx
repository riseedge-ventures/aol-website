import { SiteChrome } from "@/components/layout/SiteChrome";
import { ApprovedCopy } from "@/components/sections/ApprovedCopy";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TRADING_NAME } from "@/config/site";
import { blocks } from "@/content/approved";
import { type ServiceItem, servicePath } from "@/content/services";
import { canonicalUrl } from "@/lib/seo";

export function ServiceLanding({ service }: { service: ServiceItem }) {
  const pageUrl = canonicalUrl(servicePath(service.slug));

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: pageUrl,
    provider: {
      "@type": "AccountingService",
      "@id": `${canonicalUrl("/")}#business`,
      name: TRADING_NAME,
    },
    areaServed: [
      { "@type": "City", name: "Durban" },
      { "@type": "Country", name: "South Africa" },
    ],
  };

  return (
    <SiteChrome>
      <JsonLd data={serviceLd} />
      <article className="section section--white page-hero">
        <div className="container legal__inner page-content">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services/" },
              { name: service.title, path: servicePath(service.slug) },
            ]}
          />
          <ApprovedCopy content={blocks(service.approvedSection)} firstHeading="h1" />
        </div>
      </article>
    </SiteChrome>
  );
}
