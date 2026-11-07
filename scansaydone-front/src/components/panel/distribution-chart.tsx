/**
 * B4 — "Notas, de la 0 a la 10": SVG bar chart.
 * 11 bars (0-10), tonal fill by range (0-6, 7-8, 9-10).
 * Desktop: vertical bars; mobile: horizontal bars.
 * SR-only table with all 11 values.
 * §13 row 7: no track rect, bar width 60, 3 grid lines #D9C0A0,
 * baseline y=0 solid #8A6F55, tones by range, value 12 support tabular-nums,
 * nota label 12 support, legend 11 with 8px color squares.
 * DEFECTO 2 fix: removed full-height track rects; bars drawn as value-only columns.
 * White opaque card behind chart for consistent surface.
 */
import { distribution, maxCount } from "@/components/panel/panel-data";

const VB_W = 1000;
const VB_H = 340;
const PAD_L = 44;
const PAD_R = 12;
const PAD_T = 20;
const PAD_B = 36;
const CHART_W = VB_W - PAD_L - PAD_R;
const CHART_H = VB_H - PAD_T - PAD_B;
const BAR_W = 60;
const COL_W = CHART_W / 11;
const GRID_VALUES = [50, 100, 150];

/** §13 row 7: tonal bars by range */
function barFill(nota: number): string {
  if (nota <= 6) return "#8A6F55";
  if (nota <= 8) return "color-mix(in srgb, #1A181B 20%, #8A6F55)";
  return "color-mix(in srgb, #1A181B 40%, #8A6F55)";
}

function yForValue(v: number): number {
  return PAD_T + CHART_H - (v / maxCount) * CHART_H;
}

function barLeft(i: number): number {
  return PAD_L + i * COL_W + (COL_W - BAR_W) / 2;
}

function barCenterX(i: number): number {
  return PAD_L + i * COL_W + COL_W / 2;
}

export function DistributionChart() {
  return (
    <section aria-labelledby="b4-title" className="mt-6 lg:mt-0 lg:pt-8 lg:flex lg:flex-col">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        {/* §13 row 5: section title with filete */}
        <h2
          id="b4-title"
          className="flex items-center gap-[10px] font-ui text-[16px] font-bold text-text-primary xs:text-[16px] lg:text-[18px]"
        >
          <span
            aria-hidden="true"
            className="inline-block shrink-0 rounded-[1px]"
            style={{
              width: 3,
              height: 16,
              background: "#8A6F55",
            }}
          />
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

      {/* Desktop: vertical bars (SVG) — white opaque card */}
      <div
        className="mt-4 hidden overflow-hidden rounded-[8px] border p-4 xs:p-5 md:flex md:flex-col"
        style={{ background: "#FFFFFF", borderColor: "#D9C0A0" }}
      >
        <figure className="flex flex-col">
          <div>
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              role="img"
              aria-labelledby="b4-svg-title"
              className="w-full"
            >
              <title id="b4-svg-title">
                Notas de la 0 a la 10: mayoría alta — 150 reseñas con nota 10, 127 con 9 y 100 con 8; solo 16 reseñas entre 0 y 5.
              </title>

              {/* Grid horizontal — 3 lines #D9C0A0 */}
              {GRID_VALUES.map((v) => (
                <line
                  key={`grid-${v}`}
                  x1={PAD_L}
                  y1={yForValue(v)}
                  x2={VB_W - PAD_R}
                  y2={yForValue(v)}
                  stroke="#D9C0A0"
                  strokeWidth="1"
                />
              ))}

              {/* Baseline y=0 — solid #8A6F55 */}
              <line
                x1={PAD_L}
                y1={PAD_T + CHART_H}
                x2={VB_W - PAD_R}
                y2={PAD_T + CHART_H}
                stroke="#8A6F55"
                strokeWidth="1"
              />

              {/* Bars — value-only columns, no track */}
              {distribution.map((d, i) => {
                const x = barLeft(i);
                const cx = barCenterX(i);
                const barH = (d.count / maxCount) * CHART_H;
                const y = PAD_T + CHART_H - barH;

                return (
                  <g key={d.nota}>
                    {/* Bar — §13: tonal by range */}
                    <rect
                      x={x}
                      y={y}
                      width={BAR_W}
                      height={barH}
                      rx="2"
                      fill={barFill(d.nota)}
                    />
                    {/* Value label — 12 support, tabular-nums */}
                    <text
                      x={cx}
                      y={y - 6}
                      textAnchor="middle"
                      fontSize="12"
                      fontFamily="var(--font-montserrat), system-ui, sans-serif"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                      className="fill-text-secondary"
                    >
                      {d.count}
                    </text>
                    {/* Nota label — 12 support */}
                    <text
                      x={cx}
                      y={VB_H - 10}
                      textAnchor="middle"
                      fontSize="12"
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

          {/* Legend — §13 row 7: 11 with color squares */}
          <div className="mt-2 flex items-center gap-4 font-ui text-[11px] text-text-secondary">
            <span className="flex items-center gap-1">
              <span
                aria-hidden="true"
                className="inline-block rounded-[1px]"
                style={{ width: 8, height: 8, background: "#8A6F55" }}
              />
              0-6
            </span>
            <span className="flex items-center gap-1">
              <span
                aria-hidden="true"
                className="inline-block rounded-[1px]"
                style={{ width: 8, height: 8, background: "color-mix(in srgb, #1A181B 20%, #8A6F55)" }}
              />
              7-8
            </span>
            <span className="flex items-center gap-1">
              <span
                aria-hidden="true"
                className="inline-block rounded-[1px]"
                style={{ width: 8, height: 8, background: "color-mix(in srgb, #1A181B 40%, #8A6F55)" }}
              />
              9-10
            </span>
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
      </div>

      {/* Mobile: horizontal bars — white opaque card */}
      <div
        className="mt-4 overflow-hidden rounded-[8px] border p-4 xs:p-5 md:hidden"
        style={{ background: "#FFFFFF", borderColor: "#D9C0A0" }}
      >
        <figure>
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
                      className="h-[22px] rounded-[2px]"
                      style={{ width: `${pct}%`, background: barFill(d.nota) }}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="w-10 text-right font-ui text-[12px] tabular-nums text-text-secondary">
                    {d.count}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Legend mobile — §13 row 7 */}
          <div className="mt-3 flex items-center gap-4 font-ui text-[11px] text-text-secondary">
            <span className="flex items-center gap-1">
              <span
                aria-hidden="true"
                className="inline-block rounded-[1px]"
                style={{ width: 8, height: 8, background: "#8A6F55" }}
              />
              0-6
            </span>
            <span className="flex items-center gap-1">
              <span
                aria-hidden="true"
                className="inline-block rounded-[1px]"
                style={{ width: 8, height: 8, background: "color-mix(in srgb, #1A181B 20%, #8A6F55)" }}
              />
              7-8
            </span>
            <span className="flex items-center gap-1">
              <span
                aria-hidden="true"
                className="inline-block rounded-[1px]"
                style={{ width: 8, height: 8, background: "color-mix(in srgb, #1A181B 40%, #8A6F55)" }}
              />
              9-10
            </span>
          </div>

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
      </div>
    </section>
  );
}
