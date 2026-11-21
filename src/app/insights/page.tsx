import { SiteChrome } from "@/components/layout/SiteChrome";
import { ApprovedCopy } from "@/components/sections/ApprovedCopy";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { blocks, words } from "@/content/approved";
import { INSIGHT_TOPICS } from "@/content/insights";
import { canonicalUrl } from "@/lib/seo";
import type { Metadata } from "next";

const TITLE = words(25, 0);
const DESCRIPTION = words(25, 2);

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl("/insights/") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: canonicalUrl("/insights/") },
};

export default function InsightsPage() {
  return (
    <SiteChrome>
      <article className="section section--white page-hero">
        <div className="container page-content">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Insights", path: "/insights/" }]} />
          <ApprovedCopy content={blocks(25).slice(0, 47)} firstHeading="h1" />
          <ul className="insights-preview" style={{ marginTop: "2rem" }}>
            {INSIGHT_TOPICS.map((topic, i) => <li key={topic.title} className="insights-preview__item">
              <div className="insights-preview__row"><span className="insights-preview__mark" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div><p>{blocks(25)[47 + i * 3].text}</p><h3 className="insights-preview__title">{topic.title}</h3><p className="insights-preview__blurb">{topic.blurb}</p></div>
              </div>
            </li>)}
          </ul>
          <ApprovedCopy content={blocks(25).slice(65)} />
        </div>
      </article>
    </SiteChrome>
  );
}
