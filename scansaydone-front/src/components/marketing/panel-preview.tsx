/**
 * L3 — Landing band 6: "Qué ve el dueño" (panel preview).
 *
 * Geometry: plan L3-PANEL-2026-11-06.md (PROPOSED).
 * Empty state only: badge DEMO + declaration + nothing else in frame.
 * No network calls, no hex literals, no shadows, no gradients.
 * All colors resolve to @theme tokens defined in globals.css.
 */

export function PanelPreview() {
  return (
    <section
      id="panel"
      aria-labelledby="l3-title"
      className="w-full bg-background-page px-4 py-15 md:py-25 scroll-mt-4"
    >
      {/* ÚNICA banda con ensanche xxl: PLANOS §2.6 container-mkt-xxl-only */}
      <div className="mx-auto w-full max-w-mkt-sm md:max-w-mkt-md lg:max-w-mkt-lg xl:max-w-mkt-xl 2xl:max-w-mkt-2xl">
        {/* Eyebrow — 12px mobile, 13px from lg (992). tracking 0.14em. */}
        <p className="font-ui text-[12px] font-semibold uppercase tracking-[0.14em] text-text-secondary lg:text-[13px]">
          TUS OPINIONES, EN UN PANEL
        </p>

        {/* H2 */}
        <h2
          id="l3-title"
          className="mt-3 font-display uppercase text-[44px] leading-[0.95] tracking-[0.01em] text-text-primary md:text-[64px]"
        >
          TODO EN UN MISMO LUGAR
        </h2>

        {/* Lead */}
        <p className="mt-4 max-w-[70ch] font-ui text-[17px] leading-[1.55] text-text-secondary md:text-[18px]">
          Ahí llegan las respuestas que te dejan tus clientes.
        </p>

        {/* Marco 16/10 — estado vacío: sin <img>, sin callouts, sin enlace */}
        <div className="mt-12 grid grid-cols-12 gap-6">
          <figure className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3 relative m-0 flex aspect-[16/10] flex-col items-center justify-center rounded-[8px] border border-dashed border-border-mid bg-surface-default p-4">
            <span className="absolute left-4 top-4 rounded-[4px] border border-border-mid bg-surface-elevated px-2 py-0.5 font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-text-primary">
              DEMO
            </span>
            <figcaption className="max-w-[34ch] text-center font-ui text-[16px] font-medium leading-[1.5] text-text-primary">
              Todavía no hay panel que mostrar.
            </figcaption>
          </figure>
        </div>

        {/* Bullets — 3 items. role="list" por consistencia con patrón de casa (L2);
            list-style NO se remueve aquí (list-disc visible). */}
        <ul
          role="list"
          className="mt-6 space-y-2 list-disc pl-5 font-ui text-[16px] text-text-primary marker:text-text-secondary"
        >
          <li>Cada opinión llega con su fecha y su canal.</li>
          <li>Todo junto, sin repartirlo en planillas.</li>
          <li>Se leen las respuestas, no un número suelto.</li>
        </ul>

        {/* ETAPA P — no va en este lote:
            · el <figcaption> + <span>DEMO</span> se reemplazan por
              <img src=... alt="describe contenido" width=872 height=545
                   className="h-full w-full rounded-[4px] object-cover" loading="lazy" />
              (la banda DEMO sobre la imagen sigue siendo el propio span de §5.3, ahora sobre la img)
            · aparece el ghost, al estilo conservado por L1 D10:
              <a href="/panel" className="inline-flex h-12 items-center whitespace-nowrap rounded-[8px]
                 border-2 border-text-primary px-6 font-ui text-[16px] font-semibold text-text-primary
                 transition-colors duration-150 hover:bg-surface-elevated
                 active:bg-surface-dark active:text-on-dark focus-visible:outline-2
                 focus-visible:outline-offset-2 focus-visible:outline-text-primary">
                Ver mi panel (demo)
              </a>
            · callouts (≥992): contenedor absolute inset-0 grid aria-hidden="true",
              disco size-6 rounded-full bg-surface-dark font-ui text-[11px] text-on-dark,
              ❶→"1" arriba-izq / ❷→"2" abajo-der a 16 px del borde. */}
      </div>
    </section>
  );
}
