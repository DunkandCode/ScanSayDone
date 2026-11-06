/**
 * L5 — Landing band 5: "Para quién" (Aplicaciones).
 * Plan: MEJORA-VISUAL-2026-11-06.md §5.
 * Three AI-generated illustrations declared as such (badge ILUSTRACIÓN + declaration line).
 * No network calls at runtime (images served from /public), no hex, no shadows, no gradients, no CTA.
 * All colors resolve to @theme tokens defined in globals.css.
 */

import Image from "next/image";

const PLATES: { name: string; use: string; img: string; alt: string }[] = [
  {
    name: "Restaurante",
    use: "Quien paga la cuenta, puede opinar al salir.",
    img: "/img/ilustraciones/i1.png",
    alt: "Mesa de restaurante con soporte de encuesta (ilustración generada)",
  },
  {
    name: "Café",
    use: "En la barra, la pregunta queda a la vista.",
    img: "/img/ilustraciones/i2.png",
    alt: "Taza de café junto a un soporte ilustrado (imagen generada)",
  },
  {
    name: "Comercio pequeño",
    use: "Da voz al cliente que calla en el trato.",
    img: "/img/ilustraciones/i3.png",
    alt: "Mostrador de comercio con tarjeta de encuesta (imagen generada)",
  },
];

export function Applications() {
  return (
    <section
      id="aplicaciones"
      tabIndex={-1}
      aria-labelledby="l5-title"
      className="w-full bg-surface-default px-4 py-15 md:py-25 scroll-mt-[92px] focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
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
          {PLATES.map((plate, index) => (
            <li
              key={plate.name}
              className={`reveal${index > 0 ? ` reveal-${index + 1}` : ""} col-span-12 lg:col-span-4`}
            >
              <figure className="m-0 mx-auto w-full max-w-[364px] lg:max-w-none">
                {/* marco 4/3 — borde sólido (contenido presente, ya no "falta") */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] border border-border-mid bg-surface-default">
                  <span className="absolute left-4 top-4 rounded-[4px] border border-border-mid bg-surface-elevated px-2 py-0.5 font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-text-primary">
                    ILUSTRACIÓN
                  </span>
                  <Image
                    src={plate.img}
                    width={1024}
                    height={768}
                    alt={plate.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    sizes="(min-width:1200px) 364px, (min-width:992px) 304px, (min-width:768px) 364px, 343px"
                  />
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

        {/* Declaration line — honesty about AI-generated illustrations */}
        <p className="mt-6 max-w-[58ch] font-ui text-[12px] leading-[1.5] text-text-secondary">
          Estas tres imágenes son ilustraciones generadas por IA. No muestran locales reales. El patrón que parece un código es decorativo y no se puede escanear.
        </p>
      </div>
    </section>
  );
}
