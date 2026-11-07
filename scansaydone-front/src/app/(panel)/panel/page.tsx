"use client";

"use client";

/**
 * /panel — Dashboard de ejemplo con datos inventados.
 * Cumple PANEL-2026-11-06.md: B1-B7, dataset canónico, cero sombras,
 * único coral en B3, chip DEMO + línea + pie de declaración.
 * D5: toggle switch para estado vacío.
 */
import { useState } from "react";
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

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex h-[44px] items-center gap-2 rounded-[4px] px-2 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
    >
      <span className="font-ui text-[14px] text-text-primary">
        Ver con datos de ejemplo
      </span>
      <span
        className={`relative inline-flex h-[24px] w-[44px] shrink-0 items-center rounded-full border border-border-mid transition-colors ${
          checked ? "bg-surface-elevated" : "bg-background-page"
        }`}
      >
        <span
          className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-[23px]" : "translate-x-[2px]"
          }`}
        />
      </span>
    </button>
  );
}

export default function PanelPage() {
  const [showExample, setShowExample] = useState(true);
  const meanFormatted = meanRating.toFixed(1).replace(".", ","); // "8,5"
  const highFormatted = `${highRatings} (${highPercentage.toFixed(1).replace(".", ",")} %)`;

  return (
    <>
      {/* ── B1: Cabecera ──────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-[32px] uppercase leading-none text-text-primary lg:text-[40px]">
            Panel de ejemplo
          </h1>
          <span className="rounded-[4px] border border-border-mid bg-surface-elevated px-2 py-0.5 font-ui text-[12px] font-semibold uppercase tracking-[0.1em] text-text-primary">
            DEMO
          </span>
        </div>
        <ToggleSwitch checked={showExample} onChange={setShowExample} />
      </header>

      <p className="mt-2 font-ui text-[15px] text-text-secondary">
        {showExample
          ? "Ves un panel de ejemplo con datos inventados. No pertenece a ningún negocio real."
          : "Ves el panel de ejemplo vacío. No hay datos reales en ninguna cuenta."}
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
          {showExample ? (
            <>
              <KpiCard label="Media" value={meanFormatted} detail="de 0 a 10" />
              <KpiCard label="Reseñas" value={String(totalReviews)} detail="últimos 30 días" />
              <KpiCard
                label="Notas 8-10"
                value={highFormatted}
                detail="satisfacción alta"
              />
            </>
          ) : (
            <>
              <KpiCard label="Media" value="—" detail="de 0 a 10" />
              <KpiCard label="Reseñas" value="—" detail="últimos 30 días" />
              <KpiCard label="Notas 8-10" value="—" detail="satisfacción alta" />
            </>
          )}
        </div>

        {!showExample && (
          <p className="mt-3 font-ui text-[14px] text-text-secondary">
            Así verías el panel antes de la primera reseña.
          </p>
        )}
      </section>

      {/* ── B3, B4, B5: solo en estado ejemplo ────────────────────────── */}
      {showExample && (
        <>
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
        </>
      )}

      {/* ── B6: Últimas respuestas ────────────────────────────────────── */}
      <ResponseList empty={!showExample} />

      {/* ── B7: Pie (nunca cambia) ────────────────────────────────────── */}
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
