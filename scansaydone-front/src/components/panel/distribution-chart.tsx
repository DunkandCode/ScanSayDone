/**
 * B4 — "Notas, de la 0 a la 10": SVG bar chart.
 * 11 bars (0-10), fill border-mid. Desktop: vertical; mobile: horizontal.
 * SR-only table with all 11 values.
 */
import { distribution, maxCount } from "@/components/panel/panel-data";

const VB_W = 1000;
const VB_H = 240;
const PAD_L = 44;
const PAD_R = 12;
const PAD_T = 20;
const PAD_B = 36;
const CHART_W = VB_W - PAD_L - PAD_R;
const CHART_H = VB_H - PAD_T - PAD_B;
const BAR_GAP = 12;
const BAR_W = (CHART_W - BAR_GAP * 10) / 11;

export function DistributionChart() {
  return (
    <section aria-labelledby="b4-title" className="mt-6 lg:mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="b4-title"
          className="font-ui text-[16px] font-semibold text-text-primary lg:text-[18px]"
        >
          Notas, de la 0 a la 10
        </h2>

        {/* Export button (disabled) */}
        <button
          type="button"
          aria-disabled="true"
          title="Exportar no está disponible en el panel de ejemplo."
          className="cursor-not-allowed rounded-[4px] border border-border-subtle px-3 py-1 font-ui text-[13px] font-medium text-text-secondary focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
        >
          Exportar CSV
        </button>
      </div>

      {/* Desktop: vertical bars (SVG) */}
      <figure className="mt-4 hidden md:block">
        <div className="h-[200px] lg:h-[240px]">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            role="img"
            aria-labelledby="b4-svg-title"
            className="h-full w-full"
          >
            <title id="b4-svg-title">
              Notas de la 0 a la 10: mayoría alta — 150 reseñas con nota 10, 127 con 9 y 100 con 8; solo 16 reseñas entre 0 y 5.
            </title>

            {/* Bars */}
            {distribution.map((d, i) => {
              const x = PAD_L + i * (BAR_W + BAR_GAP);
              const barH = (d.count / maxCount) * CHART_H;
              const y = PAD_T + CHART_H - barH;

              return (
                <g key={d.nota}>
                  <rect
                    x={x}
                    y={y}
                    width={BAR_W}
                    height={barH}
                    rx="2"
                    className="fill-border-mid"
                  />
                  {/* Value label */}
                  <text
                    x={x + BAR_W / 2}
                    y={y - 6}
                    textAnchor="middle"
                    fontSize="12"
                    fontFamily="var(--font-montserrat), system-ui, sans-serif"
                    className="fill-text-primary"
                  >
                    {d.count}
                  </text>
                  {/* Nota label */}
                  <text
                    x={x + BAR_W / 2}
                    y={VB_H - 10}
                    textAnchor="middle"
                    fontSize="13"
                    fontFamily="var(--font-montserrat), system-ui, sans-serif"
                    className="fill-text-secondary"
                  >
                    {d.nota}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* SR-only table */}
        <div className="sr-only">
          <table>
            <caption>Distribución de notas de 0 a 10, panel de ejemplo</caption>
            <thead>
              <tr>
                <th scope="col">Nota</th>
                <th scope="col">Reseñas</th>
              </tr>
            </thead>
            <tbody>
              {distribution.map((d) => (
                <tr key={d.nota}>
                  <td>{d.nota}</td>
                  <td>{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>

      {/* Mobile: horizontal bars (divs) */}
      <figure className="mt-4 md:hidden">
        <ul className="space-y-2">
          {distribution.map((d) => {
            const pct = (d.count / maxCount) * 100;
            return (
              <li key={d.nota} className="flex items-center gap-3">
                <span className="w-6 text-right font-ui text-[13px] tabular-nums text-text-secondary">
                  {d.nota}
                </span>
                <div className="flex-1">
                  <div
                    className="h-[20px] rounded-[2px] bg-border-mid"
                    style={{ width: `${pct}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span className="w-10 text-right font-ui text-[13px] tabular-nums text-text-primary">
                  {d.count}
                </span>
              </li>
            );
          })}
        </ul>

        {/* SR-only table (same data) */}
        <div className="sr-only">
          <table>
            <caption>Distribución de notas de 0 a 10, panel de ejemplo</caption>
            <thead>
              <tr>
                <th scope="col">Nota</th>
                <th scope="col">Reseñas</th>
              </tr>
            </thead>
            <tbody>
              {distribution.map((d) => (
                <tr key={d.nota}>
                  <td>{d.nota}</td>
                  <td>{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>
    </section>
  );
}
