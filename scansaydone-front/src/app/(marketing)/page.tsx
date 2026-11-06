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
      {/* C-19: banda 6 en estado vacio (sin captura del panel). RETIRAR este bloque del DOM publico
          si se despliega antes de la etapa P; el marco vacio no se publica (L3-PANEL §1.2, criterio 1).
          Al llegar la captura real: se repone con el ghost "Ver mi panel (demo)". */}
      <PanelPreview />
      <Faqs />
      <CtaFinal />
    </>
  );
}
