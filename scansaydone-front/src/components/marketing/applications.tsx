/**
 * L5 — Landing band 5: "Para quién" (Aplicaciones).
 * Plan: L5-APLICACIONES-2026-11-06.md (PROPOSED).
 * Closes C-32 (crema→blanco→crema alternation restored).
 * Empty state declared: dashed frame + DEMO badge + "Todavía no hay foto que mostrar."
 * No network, no hex, no shadows, no gradients, no CTA, no <img>.
 * All colors resolve to @theme tokens defined in globals.css.
 */

const DECLARACION = "Todavía no hay foto que mostrar.";

const PLATES: { name: string; use: string }[] = [
  { name: "Restaurante", use: "Quien paga la cuenta, puede opinar al salir." },
  { name: "Café", use: "En la barra, la pregunta queda a la vista." },
  { name: "Comercio pequeño", use: "Da voz al cliente que calla en el trato." },
];

function MarcaDeHueco() {
  return (
    <svg
      viewBox="0 0 44 44"
      className="h-11 w-11"
      aria-hidden="true"
      focusable="false"
      data-decorativo="marca-de-hueco"
    >
      <g fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5">
        <rect x="6" y="10" width="32" height="24" rx="3" />
        <circle cx="16" cy="19" r="3.5" />
        <path d="M9 31 L18 23 L24 28 L30 22 L35 27" />
      </g>
    </svg>
  );
}

export function Applications() {
  return (
    <section
      id="aplicaciones"
      aria-labelledby="l5-title"
      className="w-full bg-surface-default px-4 py-15 md:py-25 scroll-mt-[92px]"
    >
      <div className="mx-auto w-full max-w-mkt-sm md:max-w-mkt-md lg:max-w-mkt-lg xl:max-w-mkt-xl">
        {/* eyebrow — 12 px hasta 991, 13 px desde 992 */}
        <p className="font-ui text-[12px] font-semibold uppercase tracking-[0.14em] text-text-secondary lg:text-[13px]">
          PARA QUIÉN ES
        </p>

        {/* H2 */}
        <h2
          id="l5-title"
          className="mt-3 font-display uppercase text-[44px] leading-[0.95] tracking-[0.01em] text-text-primary md:text-[64px]"
        >
          NEGOCIOS QUE ATIENDEN EN PERSONA
        </h2>

        {/* Lead */}
        <p className="mt-4 max-w-[70ch] font-ui text-[17px] leading-[1.55] text-text-secondary md:text-[18px]">
          Un restaurante, un café, un comercio. La opinión llega igual.
        </p>

        {/* 3 placas: 12 col (<lg) → 4 col (lg+). gap-6 = 24 exacto */}
        <ul role="list" className="mt-12 grid grid-cols-12 gap-6 list-none">
          {PLATES.map((plate) => (
            <li
              key={plate.name}
              className="col-span-12 lg:col-span-4"
            >
              <figure className="m-0 mx-auto w-full max-w-[364px] lg:max-w-none">
                {/* marco 4/3 — borde discontinuo = señal de falta (precedente C-30 / panel-preview) */}
                <div className="relative flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-border-mid bg-surface-default p-4">
                  <span className="absolute left-4 top-4 rounded-[4px] border border-border-mid bg-surface-elevated px-2 py-0.5 font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-text-primary">
                    DEMO
                  </span>
                  <MarcaDeHueco />
                  <p className="max-w-[28ch] text-center font-ui text-[14px] font-medium leading-[1.5] text-text-secondary">
                    {DECLARACION}
                  </p>
                </div>
                <figcaption className="mt-4">
                  <h3 className="font-ui text-[18px] font-semibold leading-[1.3] text-text-primary md:text-[20px]">
                    {plate.name}
                  </h3>
                  <p className="mt-2 font-ui text-[14px] leading-[1.45] text-text-secondary">
                    {plate.use}
                  </p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
