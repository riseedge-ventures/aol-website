import { BRAND } from "@/config/site";
import { blocks, words } from "@/content/approved";
import { Reveal } from "../interactive/Reveal";
import { Button } from "../ui/Button";
import { SectionHeading } from "../ui/SectionHeading";
import { ApprovedCopy } from "./ApprovedCopy";

export function About() {
  return (
    <section id="about" className="section section--white" aria-labelledby="about-heading">
      <div className="container about__grid">
        <Reveal>
          <div className="about__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BRAND.officeImage}
              alt="Professional accounting workspace supporting AOL Accountants advisory work"
              width={1600}
              height={1067}
              loading="lazy"
              decoding="async"
            />
          </div>
        </Reveal>

        <Reveal delay="1">
          <SectionHeading
            id="about-heading"
            eyebrow={words(1, 0)}
            title={words(1, 1)}
          />
          <ApprovedCopy content={blocks(1).slice(2, 5)} />
          <div style={{ marginTop: "1.25rem" }}>
            <Button href="/about/" variant="outline" iconRight="arrow-right">
              ABOUT US
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
