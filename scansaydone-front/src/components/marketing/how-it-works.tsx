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
              className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-[8px] border-2 border-text-primary px-6 font-ui text-[16px] font-semibold text-text-primary motion-safe:transition-colors motion-safe:duration-150 hover:bg-surface-elevated active:bg-surface-dark active:text-on-dark focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
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
                // Scroll-driven reveal (PASE-VISUAL-2 §2.5)
                "reveal",
                index > 0 ? `reveal-${index + 1}` : "",
                // Warm card surface with a quiet filete against the white section.
                "relative col-span-12 rounded-[8px] border border-border-subtle bg-background-page p-5 md:col-span-4 md:p-6",
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full font-display text-[32px] leading-[0.9] text-text-primary md:text-[40px] ${index === 0 ? "bg-interactive-primary" : "border border-border-mid bg-surface-elevated"}`}
                  >
                    {index + 1}
                  </span>
                  <h3 className="font-ui text-[18px] leading-[1.3] font-semibold text-text-primary md:text-[20px]">
                    {step.title}
                  </h3>
                </div>
                {index === 0 && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 shrink-0 text-text-primary"
                    aria-hidden="true"
                    focusable="false"
                    data-decorativo="icon-escanea"
                  >
                    <rect x="8" y="3" width="8" height="14" rx="1.5" />
                    <line x1="8" y1="5.5" x2="16" y2="5.5" />
                    <line x1="8" y1="14" x2="16" y2="14" />
                    <rect x="9.5" y="7" width="2" height="2" rx="0.3" />
                    <rect x="12.5" y="7" width="2" height="2" rx="0.3" />
                    <rect x="9.5" y="10" width="2" height="2" rx="0.3" />
                    <rect x="12.5" y="10" width="2" height="2" rx="0.3" />
                    <line x1="12" y1="17" x2="12" y2="20" />
                    <line x1="9" y1="20" x2="15" y2="20" />
                  </svg>
                )}
                {index === 1 && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 shrink-0 text-text-primary"
                    aria-hidden="true"
                    focusable="false"
                    data-decorativo="icon-responde"
                  >
                    <rect x="7" y="3" width="10" height="16" rx="1.5" />
                    <line x1="7" y1="6" x2="17" y2="6" />
                    <line x1="7" y1="14" x2="17" y2="14" />
                    <path d="M9 10 h1.5 M11 10 h1.5 M13 10 h1.5 M15 10 h1.5 M16 10 h1" />
                    <path d="M12.5 7 l1 2 h-2 Z" />
                  </svg>
                )}
                {index === 2 && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 shrink-0 text-text-primary"
                    aria-hidden="true"
                    focusable="false"
                    data-decorativo="icon-lees"
                  >
                    <rect x="3" y="4" width="18" height="12" rx="1.5" />
                    <path d="M12 16 v3 M8 19 h8" />
                    <path d="M6 13 V7 M6 13 H18" />
                    <path d="M7 12 L10 10 L13 11 L16 7" />
                  </svg>
                )}
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
