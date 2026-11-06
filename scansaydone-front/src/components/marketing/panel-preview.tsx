/**
 * L3 — Landing band 6: "Qué ve el dueño" (panel preview).
 *
 * Content: demo panel with example data (reopens C-19 per operator signature 2026-11-06).
 * Dataset: 486 responses, mean 8.5 exact, distribution 0–10.
 * No network calls, no hex literals, no shadows, no gradients, no coral in panel.
 * All colors resolve to @theme tokens defined in globals.css.
 */

/* ── Dataset ──────────────────────────────────────────────────────────────────
 * Distribución de notas 0–10 en 486 respuestas simuladas.
 * Origen: conteos ficticios autoconsistentes — Σn=486, Σ(n·nota)=4131, media=8,5 exacta.
 * No proviene de ningún negocio real. Ver figcaption de declaración.
 */
const demoData = [
  { nota: 0, count: 1 },
  { nota: 1, count: 1 },
  { nota: 2, count: 2 },
  { nota: 3, count: 2 },
  { nota: 4, count: 4 },
  { nota: 5, count: 6 },
  { nota: 6, count: 20 },
  { nota: 7, count: 73 },
  { nota: 8, count: 100 },
  { nota: 9, count: 127 },
  { nota: 10, count: 150 },
] as const;

const totalResponses = demoData.reduce((sum, d) => sum + d.count, 0); // 486
const weightedSum = demoData.reduce((sum, d) => sum + d.nota * d.count, 0); // 4131
const mean = weightedSum / totalResponses; // 8.5
const highResponses = demoData
  .filter((d) => d.nota >= 8)
  .reduce((sum, d) => sum + d.count, 0); // 377
const maxCount = 150; // escala máxima para barras

/** 30 puntos de evolución diaria, valores entre 7,4 y 9,2. */
const lineData = [
  7.8, 8.1, 7.9, 8.3, 8.0, 7.4, 8.2, 8.5, 8.7, 8.4, 8.9, 8.6, 8.8, 9.0, 8.7,
  9.1, 8.8, 9.2, 8.9, 9.0, 8.6, 8.8, 9.1, 8.7, 9.0, 8.9, 9.2, 9.1, 9.0, 8.5,
] as const;

/* ── SVG constants ──────────────────────────────────────────────────────────── */
const LINE_W = 872;
const LINE_H = 160;

const linePath = lineData
  .map((v, i) => {
    const x = (i / (lineData.length - 1)) * LINE_W;
    const y = LINE_H - (v / 10) * LINE_H;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  })
  .join(" ");

const BAR_VIEW_W = 872;
const BAR_VIEW_H = 130;
const BAR_MAX_H = 100;
const BAR_STEP = BAR_VIEW_W / demoData.length;
const BAR_RECT_W = 52;

const barRects = demoData.map((d, i) => {
  const x = i * BAR_STEP + (BAR_STEP - BAR_RECT_W) / 2;
  const height = (d.count / maxCount) * BAR_MAX_H;
  const y = BAR_MAX_H - height;
  return {
    x,
    y,
    width: BAR_RECT_W,
    height,
    nota: d.nota,
    labelX: x + BAR_RECT_W / 2,
  };
});

export function PanelPreview() {
  const meanFormatted = mean.toFixed(1).replace(".", ","); // "8,5"

  return (
    <section
      id="panel"
      tabIndex={-1}
      aria-labelledby="l3-title"
      className="w-full bg-background-page px-4 py-15 md:py-25 scroll-mt-[92px] focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
    >
      <div className="mx-auto w-full max-w-mkt-sm md:max-w-mkt-md lg:max-w-mkt-lg xl:max-w-mkt-xl 2xl:max-w-mkt-2xl">
        {/* Eyebrow */}
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

        {/* Marco con contenido de ejemplo */}
        <div className="mt-12 grid grid-cols-12 gap-6">
          <figure className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3 relative m-0 flex aspect-auto flex-col overflow-hidden rounded-[8px] border border-solid border-border-mid bg-surface-default md:aspect-[16/10]">
            {/* Badge DEMO */}
            <span className="absolute left-4 top-4 z-10 rounded-[4px] border border-border-mid bg-surface-elevated px-2 py-0.5 font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-text-primary">
              DEMO
            </span>

            {/* Contenido interno */}
            <div className="flex min-h-0 flex-1 flex-col gap-3 p-4 pt-10 md:gap-4 md:p-6 md:pt-12">
              {/* Fila de título */}
              <div className="flex items-center justify-between">
                <p className="font-ui text-[15px] font-semibold text-text-primary md:text-[17px]">
                  Resumen de satisfacción
                </p>
                <span
                  aria-disabled="true"
                  className="rounded-[4px] border border-border-mid px-2 py-0.5 font-ui text-[12px] text-text-secondary"
                >
                  Últimos 30 días
                </span>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div>
                  <span className="font-display text-[28px] font-bold leading-none text-text-primary md:text-[36px]">
                    {meanFormatted}
                  </span>
                  <p className="mt-1 font-ui text-[11px] leading-tight text-text-secondary md:text-[12px]">
                    de {totalResponses} respuestas · últimos 30 días
                  </p>
                </div>
                <div>
                  <span className="font-display text-[28px] font-bold leading-none text-text-primary md:text-[36px]">
                    {totalResponses}
                  </span>
                  <p className="mt-1 font-ui text-[11px] leading-tight text-text-secondary md:text-[12px]">
                    respuestas
                  </p>
                </div>
                <div>
                  <span className="font-display text-[28px] font-bold leading-none text-text-primary md:text-[36px]">
                    {highResponses}
                  </span>
                  <p className="mt-1 font-ui text-[11px] leading-tight text-text-secondary md:text-[12px]">
                    respuestas de 8 a 10
                  </p>
                </div>
              </div>

              {/* Línea de evolución */}
              <div className="flex-1 min-h-0">
                <svg
                  viewBox={`0 0 ${LINE_W} ${LINE_H}`}
                  aria-hidden="true"
                  focusable="false"
                  data-decorativo="panel-linea"
                  className="h-full w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d={linePath}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-text-primary"
                  />
                </svg>
              </div>

              {/* Barras de distribución — solo escritorio */}
              <div className="hidden md:block">
                <svg
                  viewBox={`0 0 ${BAR_VIEW_W} ${BAR_VIEW_H}`}
                  aria-hidden="true"
                  focusable="false"
                  data-decorativo="panel-barras"
                  className="w-full"
                >
                  {barRects.map((bar) => (
                    <g key={bar.nota}>
                      <rect
                        x={bar.x}
                        y={bar.y}
                        width={bar.width}
                        height={bar.height}
                        rx={2}
                        className="fill-surface-dark"
                      />
                      <text
                        x={bar.labelX}
                        y={BAR_MAX_H + 16}
                        textAnchor="middle"
                        className="fill-text-secondary"
                        fontSize="14"
                        fontFamily="system-ui, sans-serif"
                      >
                        {bar.nota}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Declaración */}
            <figcaption className="shrink-0 px-4 pb-3 font-ui text-[12px] text-text-secondary md:px-6 md:pb-4 md:text-[13px]">
              Panel de ejemplo con datos inventados. No pertenece a ningún negocio real.
            </figcaption>
          </figure>
        </div>

        {/* Bullets */}
        <ul
          role="list"
          className="mt-6 space-y-2 list-disc pl-5 font-ui text-[16px] text-text-primary marker:text-text-secondary"
        >
          <li>Cada opinión llega con su fecha y su canal.</li>
          <li>Todo junto, sin repartirlo en planillas.</li>
          <li>Se leen las respuestas, no un número suelto.</li>
        </ul>
      </div>
    </section>
  );
}
