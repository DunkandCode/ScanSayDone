/**
 * L2 — Landing band 3: "Como funciona".
 *
 * Geometry: plan L2-COMO-FUNCIONA-2026-11-06.md (PROPOSED).
 * No network calls, no hex literals, no shadows, no gradients.
 * All colors resolve to @theme tokens defined in globals.css.
 */

const STEPS = [
  {
    title: "Escanea",
    body: "El QR está en la mesa o en el mostrador. El cliente lo enfoca y la encuesta se abre en el navegador.",
  },
  {
    title: "Responde",
    body: "Responde desde el navegador. No hay que instalar nada ni crear una cuenta.",
  },
  {
    title: "Tú las lees",
    body: "Tú lees las opiniones de tus clientes en tu panel.",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      tabIndex={-1}
      aria-labelledby="l2-title"
      className="w-full bg-surface-default px-4 py-15 md:py-25 scroll-mt-[92px] focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
    >
      <div className="mx-auto w-full max-w-mkt-sm md:max-w-mkt-md lg:max-w-mkt-lg xl:max-w-mkt-xl">
        {/* Eyebrow — 12px mobile, 13px from lg (992). tracking 0.14em. */}
        <p className="font-ui text-[12px] font-semibold uppercase tracking-[0.14em] text-text-secondary lg:text-[13px]">
          DE LA MESA A TUS RESPUESTAS
        </p>

        {/* Header row: H2 (span-8) + ghost (span-4), side-by-side only from xl */}
        <div className="mt-3 grid grid-cols-12 gap-6">
          <h2
            id="l2-title"
            className="col-span-12 xl:col-span-8 font-display uppercase text-[44px] leading-[0.95] tracking-[0.01em] text-text-primary md:text-[64px]"
          >
            ASÍ FUNCIONA
          </h2>
          <div className="col-span-12 xl:col-span-4 flex xl:justify-end">
            <a
              href="#encuesta-demo"
              className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-[8px] border-2 border-text-primary px-6 font-ui text-[16px] font-semibold text-text-primary motion-safe:transition-colors motion-safe:duration-150 hover:bg-surface-elevated active:bg-surface-dark active:text-on-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
            >
              Ver una encuesta de ejemplo
            </a>
          </div>
        </div>

        {/* Lead */}
        <p className="mt-4 max-w-[70ch] font-ui text-[17px] leading-[1.55] text-text-secondary md:text-[18px]">
          El cliente opina desde la mesa. Tú lo lees después.
        </p>

        {/* Steps — ordered list with role="list" for a11y (markers removed) */}
        <ol role="list" className="mt-12 grid grid-cols-12 gap-6 list-none">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className={[
                // Base card: 1px border all sides, same bg as band, 16px padding
                "relative col-span-12 md:col-span-4 rounded-[8px] border border-border-mid p-4 bg-surface-default",
                // Mobile: 2px left border = vertical decorative connector
                "border-l-2 md:border-l",
                // Desktop: horizontal connector pseudo-element (not on last item)
                // Center at 37px from border-box top (matches badge center).
                // Covers exactly the 24px gutter between border-box edges.
                index < STEPS.length - 1
                  ? "md:after:content-[''] md:after:absolute md:after:top-[35px] md:after:-right-[25px] md:after:w-6 md:after:h-0.5 md:after:bg-border-mid"
                  : "",
              ].join(" ")}
            >
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-interactive-primary font-display text-[32px] leading-[0.9] text-text-primary md:text-[40px]"
                >
                  {index + 1}
                </span>
                <h3 className="font-ui text-[18px] leading-[1.3] font-semibold text-text-primary md:text-[20px]">
                  {step.title}
                </h3>
              </div>
              <p className="mt-2 font-ui text-[16px] leading-[1.6] text-text-primary">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
