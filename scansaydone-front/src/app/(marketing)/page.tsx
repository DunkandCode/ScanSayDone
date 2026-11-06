import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Channels } from "@/components/marketing/channels";
import { PanelPreview } from "@/components/marketing/panel-preview";

export default function MarketingLanding() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Channels />
      {/* C-19: banda 6 en estado vacio (sin captura del panel). RETIRAR este bloque del DOM publico
          si se despliega antes de la etapa P; el marco vacio no se publica (L3-PANEL §1.2, criterio 1).
          Al llegar la captura real: se repone con el ghost "Ver mi panel (demo)". */}
      <PanelPreview />
    </>
  );
}
