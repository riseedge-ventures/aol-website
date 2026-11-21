import { SiteChrome } from "@/components/layout/SiteChrome";
import { ApprovedCopy } from "@/components/sections/ApprovedCopy";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { IndustryTag } from "@/components/ui/IndustryTag";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { blocks, words } from "@/content/approved";
import { INDUSTRIES } from "@/content/industries";
import { canonicalUrl } from "@/lib/seo";
import type { Metadata } from "next";

const TITLE = words(18, 0);
const DESCRIPTION = words(18, 2);

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl("/industries/") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: canonicalUrl("/industries/") },
};

export default function IndustriesPage() {
  return (
    <SiteChrome>
      <article className="section section--white page-hero">
        <div className="container page-content">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Industries", path: "/industries/" }]} />
          <SectionHeading as="h1" title="INDUSTRIES WE SERVE" />
          <ul className="grid grid--industries" style={{ marginTop: "2rem" }}>
            {INDUSTRIES.map((item, i) => <li key={item.label} className="industry-item"><a href={`#industry-${i}`}><IndustryTag icon={item.icon}>{item.label}</IndustryTag></a></li>)}
          </ul>
          {[18, 19, 20, 21, 22, 23].map((section, i) => <section id={`industry-${i}`} key={section} style={{ marginTop: "2rem" }}><ApprovedCopy content={blocks(section)} /></section>)}
        </div>
      </article>
    </SiteChrome>
  );
}
