import { words } from "@/content/approved";
import { Reveal } from "../interactive/Reveal";
import { Icon, type IconName } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";

const TRUST_POINTS: Array<[IconName, string, string]> = [
  ["users", words(5, 6), words(5, 8)],
  ["cloud", words(5, 12), words(5, 14)],
  ["target", words(5, 19), words(5, 21)],
  ["award", words(5, 26), words(5, 28)],
];

export function WhyTrust() {
  return (
    <section id="why-trust" className="section section--white hairline-top" aria-labelledby="trust-heading">
      <div className="container">
        <Reveal className="section__head section__head--center">
          <SectionHeading
            id="trust-heading"
            align="center"
            eyebrow={words(5, 0)}
            title={words(5, 1)}
            lead={words(5, 2)}
          />
        </Reveal>
        <div className="trust-grid">
          {TRUST_POINTS.map(([icon, title, desc], i) => (
            <Reveal key={title} delay={String(i + 1)} className="trust-item">
              <span className="trust-item__ic" aria-hidden="true">
                <Icon name={icon} size={22} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>


      </div>
    </section>
  );
}
