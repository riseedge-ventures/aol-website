import { BRAND } from "@/config/site";
import { words } from "@/content/approved";
import { BookButton } from "../interactive/BookButton";
import { Reveal } from "../interactive/Reveal";

export function CTA() {
  return (
    <section className="section section--white" aria-labelledby="cta-heading">
      <div className="container">
        <Reveal className="ctaband">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ctaband__mark" src={BRAND.logoMark} alt="" aria-hidden="true" loading="lazy" width={260} height={260} />
          <div className="ctaband__inner">
            <h2 id="cta-heading" className="ctaband__title">
              {words(30, 24)}
            </h2>
            <p className="ctaband__lead">
              {words(30, 25)}
            </p>
            <div className="ctaband__cta">
              <BookButton size="lg" iconRight="arrow-right">
                Submit an Enquiry
              </BookButton>
              <BookButton size="lg" variant="outline" onDark>
                Book a Free Online Consultation
              </BookButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
