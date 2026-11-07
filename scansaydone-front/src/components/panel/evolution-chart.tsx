/**
 * B3 — "Últimos 30 días": SVG inline line chart.
 * Coral stroke (único coral de la pantalla), dashed mean line at 16,2.
 * SR-only table with 30 rows for screen readers.
 */
import { dailySeries, totalReviews } from "@/components/panel/panel-data";

const VB_W = 1000;
const VB_H = 260;
const PAD_L = 44;
const PAD_R = 44; // D3: reserve 44px right for mean label
const PAD_T = 14;
const PAD_B = 32;
const CHART_W = VB_W - PAD_L - PAD_R;
const CHART_H = VB_H - PAD_T - PAD_B;
const Y_MAX = 30;
const X_STEPS = [1, 8, 15, 22, 30];
const Y_STEPS = [0, 10, 20, 30];
const MEAN_DAILY = totalReviews / 30; // 16.2

function xForDay(day: number): number {
  return PAD_L + ((day - 1) / 29) * CHART_W;
}

function yForValue(v: number): number {
  return PAD_T + CHART_H - (v / Y_MAX) * CHART_H;
}

const linePath = dailySeries
  .map((d, i) => {
    const x = xForDay(d.day);
    const y = yForValue(d.reviews);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  })
  .join(" ");

const meanY = yForValue(MEAN_DAILY);

export function EvolutionChart() {
  return (
    <section aria-labelledby="b3-title" className="mt-6 lg:mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="b3-title"
          className="font-ui text-[16px] font-semibold text-text-primary lg:text-[18px]"
        >
          Últimos 30 días
        </h2>

        {/* Date filters (disabled) */}
        <div className="flex items-center gap-1" role="group" aria-label="Filtros de fecha">
          <DateFilter label="7 días" />
          <DateFilter label="30 días" active />
          <DateFilter label="90 días" />
        </div>
      </div>

      <p className="mt-1 font-ui text-[13px] text-text-secondary">
        El rango no se puede cambiar en el panel de ejemplo: los datos están fijos en 30 días.
      </p>

      {/* Chart */}
      <figure className="mt-4">
        <div className="h-[180px] xs:h-[180px] md:h-[220px] lg:h-[260px]">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            role="img"
            aria-labelledby="b3-svg-title"
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <title id="b3-svg-title">
              Reseñas por día durante 30 días: entre 9 y 27 al día, en promedio 16,2 diarias; los viernes y sábados son los días más altos.
            </title>

            {/* Grid */}
            {Y_STEPS.map((v) => (
              <line
                key={v}
                x1={PAD_L}
                y1={yForValue(v)}
                x2={VB_W - PAD_R}
                y2={yForValue(v)}
                stroke="currentColor"
                strokeWidth="1"
                className="text-border-subtle"
              />
            ))}

            {/* Y axis labels */}
            {Y_STEPS.map((v) => (
              <text
                key={`yl-${v}`}
                x={PAD_L - 6}
                y={yForValue(v)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="12"
                fontFamily="var(--font-montserrat), system-ui, sans-serif"
                className="fill-text-secondary"
              >
                {v}
              </text>
            ))}

            {/* X axis labels */}
            {X_STEPS.map((day) => (
              <text
                key={`xl-${day}`}
                x={xForDay(day)}
                y={VB_H - 6}
                textAnchor="middle"
                fontSize="12"
                fontFamily="var(--font-montserrat), system-ui, sans-serif"
                className="fill-text-secondary"
              >
                {day}
              </text>
            ))}

            {/* Mean dashed line at 16,2 */}
            <line
              x1={PAD_L}
              y1={meanY}
              x2={VB_W - PAD_R}
              y2={meanY}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 3"
              className="text-text-secondary"
            />
            {/* D3: label in right margin, hidden at mobile (shown below SVG) */}
            <text
              x={xForDay(30) + 4}
              y={meanY}
              textAnchor="start"
              dominantBaseline="middle"
              fontSize="12"
              fontFamily="var(--font-montserrat), system-ui, sans-serif"
              className="hidden fill-text-secondary md:inline"
            >
              16,2
            </text>

            {/* Line (coral — único coral de la pantalla) */}
            <path
              d={linePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="text-interactive-primary"
            />

            {/* Points */}
            {dailySeries.map((d) => (
              <circle
                key={d.day}
                cx={xForDay(d.day)}
                cy={yForValue(d.reviews)}
                r="3"
                className="fill-text-primary lg:r-[3]"
              />
            ))}
          </svg>
        </div>

        {/* D3: mobile alternative for mean label (hidden at md+) */}
        <p className="mt-1 font-ui text-[13px] text-text-secondary md:hidden">
          Media diaria: 16,2 reseñas.
        </p>

        {/* SR-only table */}
        <div className="sr-only">
          <table>
            <caption>Reseñas diarias durante 30 días, panel de ejemplo</caption>
            <thead>
              <tr>
                <th scope="col">Día</th>
                <th scope="col">Reseñas</th>
                <th scope="col">Puntos</th>
                <th scope="col">Media</th>
              </tr>
            </thead>
            <tbody>
              {dailySeries.map((d) => (
                <tr key={d.day}>
                  <td>{d.day}</td>
                  <td>{d.reviews}</td>
                  <td>{d.points}</td>
                  <td>{d.mean.toFixed(1).replace(".", ",")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>
    </section>
  );
}

/* ── Date filter button (disabled) ──────────────────────────────────────── */

function DateFilter({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      aria-disabled="true"
      className={`cursor-not-allowed rounded-[4px] border px-2.5 py-1 font-ui text-[13px] font-medium focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary ${
        active
          ? "border-border-mid bg-surface-elevated text-text-primary"
          : "border-border-subtle text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}
