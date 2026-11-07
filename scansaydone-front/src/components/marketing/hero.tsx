import { SurveyCard } from "@/components/marketing/survey-card";

export function Hero() {
  return (
    <section
      className="relative isolate flex items-center overflow-hidden bg-background-page py-16 lg:min-h-marketing-hero lg:py-20"
      aria-labelledby="hero-title"
    >
      {/* Escena de fondo completa — H1 conserva prioridad visual y de carga. */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
        <div className="marketing-hero-scene absolute inset-0 overflow-hidden">
          <picture className="absolute inset-0 block">
            <source
              media="(min-width: 992px)"
              srcSet="/img/fondos/hero-escena.webp"
              type="image/webp"
            />
            <img
              alt=""
              aria-hidden="true"
              loading="lazy"
              fetchPriority="low"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </picture>
        </div>
        <div className="absolute bottom-4 right-4 z-10 max-w-sm rounded border border-border-mid bg-surface-elevated px-3 py-2">
          <p className="font-ui text-xs text-text-secondary">
            La imagen de fondo es una ilustración generada. No muestra un local real.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-mkt-xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between">
          <div className="w-full max-w-xl rounded-2xl bg-background-page px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <p className="mb-4 font-ui text-xs font-semibold uppercase tracking-widest text-text-secondary sm:mb-6 sm:text-sm">
              ENCUESTAS DE SATISFACCIÓN PARA RESTAURANTES Y COMERCIOS
            </p>

            <h1
              id="hero-title"
              className="font-display text-marketing-hero tracking-marketing-hero text-text-primary"
            >
              <span className="block">Lo que tus</span>
              <span className="block">clientes piensan,</span>
              <span className="mt-2 block w-fit max-w-full whitespace-normal lg:whitespace-nowrap bg-surface-dark px-1.5 py-1.5 text-on-dark">
                antes de que se vayan
              </span>
            </h1>

            <p className="mt-6 max-w-md font-ui text-base text-text-secondary sm:text-lg">
              Un código en la mesa. Una respuesta breve. Un panel con lo que
              necesitas saber.
            </p>

            <div className="mt-8">
              <a
                href="#encuesta-demo"
                className="marketing-hero-cta inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-text-primary bg-surface-dark px-6 py-3 font-ui font-semibold text-on-dark motion-safe:transition-colors motion-safe:duration-150 hover:bg-text-secondary active:bg-surface-dark"
              >
                Ver una encuesta de ejemplo
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                  focusable="false"
                  data-decorativo="icon-flecha"
                >
                  <path d="M3 8 H12" />
                  <path d="M8.5 4.5 L12 8 L8.5 11.5" />
                </svg>
              </a>
            </div>
          </div>

          <div className="mt-2 w-full max-w-sm self-start">
            <SurveyCard />
          </div>
        </div>
      </div>
    </section>
  );
}
