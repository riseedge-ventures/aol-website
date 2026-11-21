import { Reveal } from "../interactive/Reveal";
import { Button } from "../ui/Button";
import { ApprovedPricingCards, ApprovedPricingIntro } from "./ApprovedPricing";
export function Pricing() {
  return <section id="pricing" className="section section--paper2"><div className="container">
    <Reveal className="section__head section__head--center"><ApprovedPricingIntro /></Reveal>
    <ApprovedPricingCards />
    <Reveal className="services__more"><Button href="/pricing/" size="lg" variant="outline">IMPORTANT PRICING INFORMATION</Button></Reveal>
  </div></section>;
}
