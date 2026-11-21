import { Reveal } from "@/components/interactive/Reveal";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ApprovedCopy } from "@/components/sections/ApprovedCopy";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { BRAND } from "@/config/site";
import { blocks, words } from "@/content/approved";
import { canonicalUrl } from "@/lib/seo";
import type { Metadata } from "next";

const TITLE = words(1, 0);
const DESCRIPTION = words(1, 2);

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl("/about/") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: canonicalUrl("/about/") },
};

export default function AboutPage() {
  return (
    <SiteChrome>
      <article className="section section--white page-hero">
        <div className="container page-content">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "About", path: "/about/" }]} />
          <div className="about__grid about-page__intro" style={{ marginTop: "1.25rem" }}>
            <Reveal immediate><div className="about__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BRAND.officeImage} alt="AOL Accountants" width={1600} height={1067} loading="eager" decoding="async" />
            </div></Reveal>
            <Reveal immediate delay="1"><ApprovedCopy content={blocks(1)} firstHeading="h1" /></Reveal>
          </div>
          {[2, 3, 4, 5, 6].map(section => <section key={section} style={{ marginTop: "2rem" }}><ApprovedCopy content={blocks(section)} /></section>)}
        </div>
      </article>
    </SiteChrome>
  );
}
