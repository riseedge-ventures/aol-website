import { BookButton } from "@/components/interactive/BookButton";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ApprovedCopy } from "@/components/sections/ApprovedCopy";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { blocks, words } from "@/content/approved";
import { canonicalUrl } from "@/lib/seo";
import type { Metadata } from "next";

const TITLE = words(26, 0);
const DESCRIPTION = words(26, 2);

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl("/contact/") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: canonicalUrl("/contact/") },
};

export default function ContactPage() {
  return (
    <SiteChrome>
      <article className="section section--white page-hero">
        <div className="container page-content">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact/" }]} />
          {[26, 27, 28].map((section, i) => <section key={section} style={{ marginTop: "2rem" }}><ApprovedCopy content={blocks(section)} firstHeading={i === 0 ? "h1" : "h2"} /></section>)}
          <section id="enquiry" style={{ marginTop: "2rem" }}>
            <ApprovedCopy content={blocks(29).slice(0, 6)} />
            <div className="page-cta-row"><BookButton size="lg">Submit Enquiry</BookButton></div>
            <ApprovedCopy content={blocks(29).slice(18)} />
          </section>
          <section style={{ marginTop: "2rem" }}><ApprovedCopy content={blocks(30)} /></section>
        </div>
      </article>
    </SiteChrome>
  );
}
