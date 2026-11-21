import { INSIGHT_TOPICS } from "@/content/insights";
import { Reveal } from "../interactive/Reveal";
import { Button } from "../ui/Button";
import { SectionHeading } from "../ui/SectionHeading";

export function Insights() {
  return (
    <section id="insights" className="section section--paper2" aria-labelledby="insights-heading" tabIndex={-1}>
      <div className="container">
        <Reveal className="section__head section__head--center">
          <SectionHeading
            id="insights-heading"
            align="center"
            eyebrow="AOL INSIGHTS"
            title="The Numbers Behind Every Business Decision."
          />
        </Reveal>
        <ul className="insights-preview">
          {INSIGHT_TOPICS.map((topic, i) => (
            <li key={topic.title} className="insights-preview__item">
              <Reveal delay={String(i + 1)}>
                <div className="insights-preview__row">
                  <span className="insights-preview__mark" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="insights-preview__title">{topic.title}</span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <Reveal className="services__more">
          <Button href="/insights/" size="lg" variant="outline" iconRight="arrow-right">
            AOL INSIGHTS
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
