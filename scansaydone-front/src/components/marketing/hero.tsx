import { SurveyCard } from "@/components/marketing/survey-card";

export function Hero() {
  return (
    <section className="py-16 lg:py-24" aria-labelledby="hero-title">
      <div className="max-w-mkt-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left column — 7/12 */}
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <p className="font-ui text-xs sm:text-sm font-semibold tracking-widest uppercase text-text-secondary mb-4 sm:mb-6">
              ENCUESTAS DE SATISFACCIÓN PARA RESTAURANTES Y COMERCIOS
            </p>

            {/* H1 */}
            <h1 id="hero-title" className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-text-primary">
              Lo que tus clientes piensan,
              <span className="block bg-surface-dark text-on-dark px-2 mt-2 w-fit">
                antes de que se vayan
              </span>
            </h1>

            {/* Subhead */}
            <p className="font-ui text-base sm:text-lg text-text-secondary mt-6 max-w-md">
              Un código en la mesa. Una respuesta breve. Un panel con lo que
              necesitas saber.
            </p>

            {/* CTA — in-page anchor to the demo survey card below */}
            <div className="mt-8">
              <a
                href="#encuesta-demo"
                className="inline-flex items-center justify-center px-6 py-3 bg-interactive-primary text-text-primary font-ui font-semibold rounded-lg hover:bg-interactive-hover active:bg-interactive-pressed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
              >
                Ver una encuesta de ejemplo
              </a>
            </div>
          </div>

          {/* Right column — 5/12, survey card */}
          <div className="lg:col-span-5 flex items-center">
            <SurveyCard />
          </div>
        </div>
      </div>
    </section>
  );
}
