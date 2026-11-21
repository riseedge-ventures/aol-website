import { BRAND } from "@/config/site";
import { blocks, words } from "@/content/approved";
import { BookButton } from "../interactive/BookButton";
import { HeroVideo } from "../interactive/HeroVideo";
import { Reveal } from "../interactive/Reveal";
import { Button } from "../ui/Button";
import { ApprovedCopy } from "./ApprovedCopy";

export function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-heading">
      <div className="container hero__grid">
        <Reveal className="hero__intro" immediate>
          <p className="hero__brand">{BRAND.name}</p>
          <h1 id="hero-heading" className="hero__title">
            {words(0, 0)}
          </h1>
          <p className="hero__tagline">{words(0, 1)}</p>
        </Reveal>

        <Reveal className="hero__visual" delay="1" immediate>
          <div className="hero__frame">
            <HeroVideo />
            <span className="hero__ring" aria-hidden="true"></span>
          </div>
        </Reveal>

        <Reveal className="hero__body" delay="2">
          <div className="hero__leads"><ApprovedCopy content={blocks(0).slice(2, 4)} /></div>
          <div className="hero__cta">
            <Button size="lg" variant="outline" href="#services">
              Explore Our Services
            </Button>
            <BookButton size="lg" iconRight="arrow-right">
              Book a Free Online Consultation
            </BookButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
