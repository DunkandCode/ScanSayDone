/**
 * /panel — Dashboard de ejemplo con datos inventados.
 * Cumple PANEL-2026-11-06.md: B1-B7, dataset canónico, cero sombras,
 * único coral en B3, chip DEMO + línea + pie de declaración.
 */
import { EvolutionChart } from "@/components/panel/evolution-chart";
import { DistributionChart } from "@/components/panel/distribution-chart";
import { ChannelTable } from "@/components/panel/channel-table";
import { ResponseList } from "@/components/panel/response-list";
import {
  totalReviews,
  meanRating,
  highRatings,
  highPercentage,
} from "@/components/panel/panel-data";

export default function PanelPage() {
  const meanFormatted = meanRating.toFixed(1).replace(".", ","); // "8,5"
  const highFormatted = `${highRatings} (${highPercentage.toFixed(1).replace(".", ",")} %)`;

  return (
    <>
      {/* ── B1: Cabecera ──────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-[32px] uppercase leading-none text-text-primary lg:text-[40px]">
          Panel de ejemplo
        </h1>
        <span className="rounded-[4px] border border-border-mid bg-surface-elevated px-2 py-0.5 font-ui text-[12px] font-semibold uppercase tracking-[0.1em] text-text-primary">
          DEMO
        </span>
      </header>

      <p className="mt-2 font-ui text-[15px] text-text-secondary">
        Ves un panel de ejemplo con datos inventados. No pertenece a ningún negocio real.
      </p>

      {/* ── B2: Resumen (3 KPIs) ──────────────────────────────────────── */}
      <section aria-labelledby="b2-title" className="mt-6 lg:mt-8">
        <h2
          id="b2-title"
          className="font-ui text-[16px] font-semibold text-text-primary lg:text-[18px]"
        >
          Resumen
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 xs:grid-cols-3">
          <KpiCard label="Media" value={meanFormatted} detail="de 0 a 10" />
          <KpiCard label="Reseñas" value={String(totalReviews)} detail="últimos 30 días" />
          <KpiCard
            label="Notas 8-10"
            value={highFormatted}
            detail="satisfacción alta"
          />
        </div>
      </section>

      {/* ── B3: Evolución (línea 30 días) ─────────────────────────────── */}
      <EvolutionChart />

      {/* ── B4 + B5: Distribución + Canales (paralelo ≥993) ───────────── */}
      <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row">
        {/* B4: ~640 (2/3) */}
        <div className="min-w-0 flex-1 lg:flex-[2]">
          <DistributionChart />
        </div>

        {/* B5: ~390 (1/3) */}
        <div className="min-w-0 flex-1 lg:flex-[1]">
          <ChannelTable />
        </div>
      </div>

      {/* ── B6: Últimas respuestas ────────────────────────────────────── */}
      <ResponseList />

      {/* ── B7: Pie ───────────────────────────────────────────────────── */}
      <footer className="mt-8 border-t border-border-subtle pt-4 lg:mt-10">
        <p className="font-ui text-[14px] text-text-secondary">
          Panel de ejemplo con datos inventados. No pertenece a ningún negocio real.
        </p>
      </footer>
    </>
  );
}

/* ── KPI Card ────────────────────────────────────────────────────────────── */

function KpiCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[8px] border border-border-subtle bg-surface-default p-4">
      <p className="font-ui text-[13px] font-medium text-text-secondary">
        {label}
      </p>
      <p className="mt-1 font-ui text-[28px] font-semibold leading-none tabular-nums text-text-primary lg:text-[32px]">
        {value}
      </p>
      <p className="mt-2 font-ui text-[13px] text-text-secondary">{detail}</p>
    </div>
  );
}
