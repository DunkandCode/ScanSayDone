import { channels } from "@/components/panel/panel-data";

/**
 * L3 — Landing band 6: "Qué ve el dueño" (panel preview).
 *
 * Content: demo panel with example data (reopens C-19 per operator signature 2026-11-06).
 * Dataset: 486 responses, mean 8.5 exact, distribution 0–10.
 * No network calls or invented data. Visual language mirrors the served panel.
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
const LINE_H = 138;

const linePath = lineData
  .map((v, i) => {
    const x = (i / (lineData.length - 1)) * LINE_W;
    const y = LINE_H - (v / 10) * LINE_H;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  })
  .join(" ");

/** Reference lines at values 0, 5, 10 for the y-axis scale. */
const refLines = [
  { value: 10, y: 0 },
  { value: 5, y: LINE_H / 2 },
  { value: 0, y: LINE_H },
] as const;

const BAR_VIEW_W = 872;
const BAR_VIEW_H = 130;
const BAR_MAX_H = 100;
const BAR_STEP = BAR_VIEW_W / demoData.length;
const BAR_RECT_W = 52;

function barFill(nota: number): string {
  if (nota <= 6) return "var(--color-border-mid)";
  if (nota <= 8) {
    return "color-mix(in srgb, var(--color-text-primary) 20%, var(--color-border-mid))";
  }
  return "color-mix(in srgb, var(--color-text-primary) 40%, var(--color-border-mid))";
}

const barRects = demoData.map((d, i) => {
  const x = i * BAR_STEP + (BAR_STEP - BAR_RECT_W) / 2;
  const rawHeight = (d.count / maxCount) * BAR_MAX_H;
  const height = d.count > 0 ? Math.max(2, rawHeight) : 0;
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
      className="relative w-full bg-background-page px-4 py-15 md:py-25 scroll-mt-[92px] focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
    >
      {/* Luz cálida contenida bajo la superficie blanca del preview. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(640px 430px at 58% 46%, color-mix(in srgb, var(--color-surface-elevated) 68%, transparent), transparent)",
        }}
      />
      <div className="relative mx-auto w-full max-w-mkt-sm md:max-w-mkt-md lg:max-w-mkt-lg xl:max-w-mkt-xl">
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
          <figure
            className="reveal elev-float relative m-0 col-span-12 flex min-w-0 flex-col overflow-hidden rounded-[8px] border border-solid border-border-subtle bg-surface-default"
            style={{
              background:
                "linear-gradient(180deg, var(--color-surface-default) 0%, color-mix(in srgb, var(--color-surface-elevated) 18%, var(--color-surface-default)) 100%)",
            }}
          >
            {/* Badge DEMO */}
            <span className="absolute left-4 top-4 z-10 rounded-[4px] border border-border-mid bg-surface-elevated px-2 py-0.5 font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-text-primary">
              DEMO
            </span>

            {/* Contenido interno */}
            <div className="flex min-h-0 flex-1 flex-col gap-5 p-4 pt-12 md:gap-6 md:p-8 md:pt-12">
              {/* Fila de título */}
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
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
                <div className="border-t-2 border-border-mid bg-surface-default px-3 py-3">
                  <p className="font-ui text-[12px] font-semibold uppercase tracking-[0.06em] text-text-secondary">Media</p>
                  <span className="mt-1 block font-display text-[32px] font-bold leading-none tabular-nums text-text-primary md:text-[36px]">
                    {meanFormatted}
                  </span>
                  <p className="mt-1 font-ui text-[12px] leading-tight text-text-secondary">
                    de 0 a 10
                  </p>
                </div>
                <div className="border-t-2 border-border-mid bg-surface-default px-3 py-3">
                  <p className="font-ui text-[12px] font-semibold uppercase tracking-[0.06em] text-text-secondary">Reseñas</p>
                  <span className="mt-1 block font-display text-[32px] font-bold leading-none tabular-nums text-text-primary md:text-[36px]">
                    {totalResponses}
                  </span>
                  <p className="mt-1 font-ui text-[12px] leading-tight text-text-secondary">
                    últimos 30 días
                  </p>
                </div>
                <div className="border-t-2 border-border-mid bg-surface-default px-3 py-3">
                  <p className="font-ui text-[12px] font-semibold uppercase tracking-[0.06em] text-text-secondary">Notas 8–10</p>
                  <span className="mt-1 block font-display text-[32px] font-bold leading-none tabular-nums text-text-primary md:text-[36px]">
                    {highResponses}
                  </span>
                  <p className="mt-1 font-ui text-[12px] leading-tight text-text-secondary">
                    satisfacción alta
                  </p>
                </div>
              </div>

              {/* Línea de evolución */}
              <section aria-labelledby="preview-evolution-title" className="min-w-0">
                <h3 id="preview-evolution-title" className="font-ui text-[14px] font-semibold text-text-primary">Últimos 30 días</h3>
              <div className="mt-2 h-[112px] shrink-0 md:h-[138px]">
                <svg
                  viewBox={`0 0 ${LINE_W} ${LINE_H}`}
                  role="img"
                  aria-label="Evolución de la nota media en 30 días, sobre una escala de 0 a 10"
                  data-decorativo="panel-linea"
                  className="h-full w-full"
                >
                  {refLines.map((ref) => (
                    <g key={ref.value}>
                      <line
                        x1="0"
                        y1={ref.y}
                        x2={LINE_W}
                        y2={ref.y}
                        strokeWidth={ref.value === 0 ? "1.5" : "1"}
                        stroke={
                          ref.value === 0
                            ? "var(--color-border-mid)"
                            : "color-mix(in srgb, var(--color-border-mid) 78%, var(--color-surface-default))"
                        }
                      />
                      <text
                        x="4"
                        y={ref.y}
                        dominantBaseline={
                          ref.value === 10
                            ? "hanging"
                            : ref.value === 0
                              ? "ideographic"
                              : "middle"
                        }
                        fontSize="11"
                        fontFamily="system-ui, sans-serif"
                        fill="currentColor"
                        className="text-text-secondary"
                      >
                        {ref.value}
                      </text>
                    </g>
                  ))}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className="text-text-primary"
                    aria-hidden="true"
                    focusable="false"
                  />
                  <path
                    d={linePath}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className="text-interactive-primary"
                    aria-hidden="true"
                    focusable="false"
                  />
                </svg>
              </div>
              </section>

              {/* Distribución resumida + canales principales. */}
              <div className="grid min-w-0 grid-cols-1 gap-5 border-t border-border-subtle pt-5 md:grid-cols-12 md:gap-6">
                <section aria-labelledby="preview-distribution-title" className="min-w-0 md:col-span-8">
                  <h3 id="preview-distribution-title" className="font-ui text-[14px] font-semibold text-text-primary">Notas, de la 0 a la 10</h3>
                <svg
                  viewBox={`0 0 ${BAR_VIEW_W} ${BAR_VIEW_H}`}
                  role="img"
                  aria-label="Distribución de las 486 respuestas en once notas, de 0 a 10"
                  data-decorativo="panel-barras"
                  className="mt-2 h-[104px] w-full md:h-[130px]"
                >
                  {[50, 100, 150].map((value) => {
                    const y = BAR_MAX_H - (value / maxCount) * BAR_MAX_H;
                    return <line key={value} x1="0" y1={y} x2={BAR_VIEW_W} y2={y} stroke="color-mix(in srgb, var(--color-border-mid) 78%, var(--color-surface-default))" strokeWidth="1" />;
                  })}
                  <line x1="0" y1={BAR_MAX_H} x2={BAR_VIEW_W} y2={BAR_MAX_H} stroke="var(--color-border-mid)" strokeWidth="1.5" />
                  {barRects.map((bar) => (
                    <g key={bar.nota}>
                      <rect
                        x={bar.x}
                        y={bar.y}
                        width={bar.width}
                        height={bar.height}
                        rx={2}
                        fill={barFill(bar.nota)}
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
                  <div className="sr-only">
                    <table>
                      <caption>Respuestas por nota, panel de ejemplo</caption>
                      <thead>
                        <tr>
                          <th scope="col">Nota</th>
                          <th scope="col">Respuestas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {demoData.map((entry) => (
                          <tr key={entry.nota}>
                            <td>{entry.nota}</td>
                            <td>{entry.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-ui text-[11px] text-text-secondary" aria-label="Escala de color de las barras">
                    <span className="inline-flex items-center gap-1"><span aria-hidden="true" className="size-2 rounded-[1px] bg-border-mid" />0–6</span>
                    <span className="inline-flex items-center gap-1"><span aria-hidden="true" className="size-2 rounded-[1px]" style={{ background: "color-mix(in srgb, var(--color-text-primary) 20%, var(--color-border-mid))" }} />7–8</span>
                    <span className="inline-flex items-center gap-1"><span aria-hidden="true" className="size-2 rounded-[1px]" style={{ background: "color-mix(in srgb, var(--color-text-primary) 40%, var(--color-border-mid))" }} />9–10</span>
                  </div>
                </section>

                <section aria-labelledby="preview-channels-title" className="min-w-0 md:col-span-4">
                  <h3 id="preview-channels-title" className="font-ui text-[14px] font-semibold text-text-primary">Canales principales</h3>
                  <ul className="mt-2 space-y-2" role="list">
                    {channels.slice(0, 3).map((channel) => (
                      <li key={channel.name} className="flex items-center gap-2 border-b border-border-subtle py-1.5 font-ui text-[12px] text-text-primary">
                        <span className="min-w-0 flex-1">{channel.name}</span>
                        <span className="font-semibold tabular-nums">{channel.count}</span>
                        <span aria-hidden="true" className="h-2 w-12 shrink-0 rounded-[2px] bg-border-subtle">
                          <span className="block h-full rounded-[2px] bg-border-mid" style={{ width: `${(channel.count / channels[0].count) * 100}%` }} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>

            {/* Declaración */}
            <figcaption className="shrink-0 border-t border-border-subtle px-4 py-3 font-ui text-[12px] text-text-secondary md:px-8 md:py-4 md:text-[13px]">
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
