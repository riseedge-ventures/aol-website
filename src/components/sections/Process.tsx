import { words } from "@/content/approved";
import { Reveal } from "../interactive/Reveal";
import type { IconName } from "../ui/Icon";
import { ProcessStep } from "../ui/ProcessStep";
import { SectionHeading } from "../ui/SectionHeading";

const STEPS: Array<[number, IconName, string, string]> = [
  [1, "messages-square", words(30, 7), words(30, 9)],
  [2, "settings", words(30, 12), words(30, 14)],
  [3, "trending-up", words(30, 17), words(30, 19)],
];

export function Process() {
  return (
    <section id="process" className="section section--white" aria-labelledby="process-heading">
      <div className="container">
        <Reveal className="section__head section__head--center">
          <SectionHeading
            id="process-heading"
            align="center"
            eyebrow={words(30, 0)}
            title={words(30, 1)}
          />
        </Reveal>
        <ol className="process__grid" aria-label="Our process">
          {STEPS.map(([step, icon, title, desc], i) => (
            <li key={step}>
              <Reveal delay={String(i + 1)}>
                <ProcessStep
                  step={step}
                  icon={icon}
                  title={title}
                  description={desc}
                  connector={false}
                  layout="row"
                />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
