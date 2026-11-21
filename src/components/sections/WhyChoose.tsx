import { words } from "@/content/approved";
import { Reveal } from "../interactive/Reveal";
import { FeatureCard } from "../ui/FeatureCard";
import type { IconName } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";

const WHY_ITEMS: Array<[IconName, string, string]> = [
  ["award", words(4, 6), words(4, 8)],
  ["cloud", words(4, 12), words(4, 14)],
  ["sliders-horizontal", words(4, 19), words(4, 21)],
  ["heart-handshake", words(4, 26), words(4, 28)],
];

export function WhyChoose() {
  return (
    <section id="why" className="section section--paper2" aria-labelledby="why-heading">
      <div className="container">
        <Reveal className="section__head section__head--center">
          <SectionHeading
            id="why-heading"
            align="center"
            eyebrow={words(4, 0)}
            title={words(4, 1)}
            lead={words(4, 2)}
          />
        </Reveal>
        <div className="grid grid--4">
          {WHY_ITEMS.map(([icon, title, desc], i) => (
            <Reveal key={title} delay={String(i + 1)}>
              <FeatureCard icon={icon} title={title} description={desc} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
