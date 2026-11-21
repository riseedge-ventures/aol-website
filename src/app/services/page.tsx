import { BookButton } from "@/components/interactive/BookButton";
import { Reveal } from "@/components/interactive/Reveal";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ApprovedCopy } from "@/components/sections/ApprovedCopy";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { blocks, words } from "@/content/approved";
import { SERVICES, servicePath } from "@/content/services";
import { canonicalUrl } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

const TITLE = words(7, 0);
const DESCRIPTION = words(7, 2);

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl("/services/") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: canonicalUrl("/services/") },
};

export default function ServicesPage() {
  return (
    <SiteChrome>
      <section className="section section--white page-hero" aria-labelledby="services-page-heading">
        <div className="container">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services/" },
            ]}
          />
          <Reveal immediate>
            <SectionHeading
              as="h1"
              id="services-page-heading"
              eyebrow="OUR SERVICES"
              title={blocks(7)[1].text}
              lead={blocks(7)[2].text}
            />
          </Reveal>
          <ApprovedCopy content={blocks(7).slice(3, 5)} />
        </div>
      </section>

      <section className="section section--paper2">
        <div className="container">
          <div className="grid grid--services grid--services-detail">
            {SERVICES.map((service) => (
              <div key={service.slug} id={service.slug}>
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={<><strong>{service.tagline}</strong><br />{service.description}</>}
                  href={servicePath(service.slug)}
                  linkLabel="Learn More"
                />
              </div>
            ))}
          </div>
          <div className="services__more">
            <Link className="text-link" href="/services/">View All Services</Link>
            <BookButton size="lg" iconRight="arrow-right">
              Book a Free Online Consultation
            </BookButton>
            <Link className="text-link" href="/contact/" style={{ marginLeft: "1rem" }}>
              Submit an Enquiry
            </Link>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
