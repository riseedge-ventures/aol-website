import { AnchorFocus } from "@/components/interactive/AnchorFocus";
import { ConsultationModal } from "@/components/interactive/ConsultationModal";
import { Header } from "@/components/interactive/Header";
import { MobileActionBar } from "@/components/interactive/MobileActionBar";
import { NetlifyFormsDetector } from "@/components/interactive/NetlifyFormsDetector";
import { REVEAL_SCRIPT, RevealRuntime } from "@/components/interactive/RevealRuntime";
import { About } from "@/components/sections/About";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Industries } from "@/components/sections/Industries";
import { Insights } from "@/components/sections/Insights";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { WhyTrust } from "@/components/sections/WhyTrust";
import { words } from "@/content/approved";
import { canonicalUrl } from "@/lib/seo";
import type { Metadata } from "next";

const TITLE = words(0, 0);
const DESCRIPTION = words(0, 2);

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl("/") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: canonicalUrl("/"),
  },
};

export default function Home() {
  return (
    <div className="site site--with-mab">
      <Header />
      <main id="main">
        <Hero />
        <About />
        <WhyChoose />
        <Services />
        <Industries />
        <WhyTrust />
        <Pricing />
        <Process />
        <Testimonials />
        <Insights />
        <CTA />
      </main>
      <Footer />
      <MobileActionBar />
      <NetlifyFormsDetector />
      <ConsultationModal />
      <AnchorFocus />
      <RevealRuntime />
      <script dangerouslySetInnerHTML={{ __html: REVEAL_SCRIPT }} />
    </div>
  );
}
