import { Hero } from "@/components/marketing/hero";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Channels } from "@/components/marketing/channels";
import { Applications } from "@/components/marketing/applications";
import { PanelPreview } from "@/components/marketing/panel-preview";
import { Faqs } from "@/components/marketing/faqs";
import { CtaFinal } from "@/components/marketing/cta-final";

export default function MarketingLanding() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <Channels />
      <Applications />
      {/* Banda 6: panel de ejemplo con datos inventados, declarado con badge y pie. C-19 quedó reabierta y firmada el 2026-11-06. */}
      <PanelPreview />
      <Faqs />
      <CtaFinal />
    </>
  );
}
