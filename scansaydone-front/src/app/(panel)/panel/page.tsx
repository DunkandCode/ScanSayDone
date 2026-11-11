"use client";

/**
 * /panel — Dashboard de ejemplo con datos inventados.
 * Cumple PANEL-2026-11-06.md: B1-B7, dataset canónico, cero sombras,
 * único coral en B3, chip DEMO + línea + pie de declaración.
 * D5: toggle switch para estado vacío.
 * §13: salto visual (gradientes, filetes, Bebas, medallones).
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
        <SectionTitle id="b2-title">Resumen</SectionTitle>

        <div className="mt-4 grid grid-cols-1 gap-4 xs:grid-cols-3">
          {showExample ? (
            <>
              <KpiCard label="Media" value={meanFormatted} detail="de 0 a 10" glyph="media" />
              <KpiCard label="Reseñas" value={String(totalReviews)} detail="últimos 30 días" glyph="reviews" />
              <KpiCard
                label="Notas 8-10"
                value={highFormatted}
                detail="satisfacción alta"
                glyph="high"
              />
            </>
          ) : (
            <>
              <KpiCard label="Media" value="—" detail="de 0 a 10" glyph="media" />
              <KpiCard label="Reseñas" value="—" detail="últimos 30 días" glyph="reviews" />
              <KpiCard label="Notas 8-10" value="—" detail="satisfacción alta" glyph="high" />
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
          <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:items-start">
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

/* ── Section title with vertical filete (§13 row 5) ────────────────────── */

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
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
      {children}
    </h2>
  );
}

/* ── KPI medallón glyphs (F-O7: 3 geometrías, ≤9 trazos) ─────────────────── */

function GlyphMedia() {
  // 2 bars + tick
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="6" y1="18" x2="6" y2="13" />
      <line x1="10" y1="18" x2="10" y2="10" />
      <polyline points="14,15 16.5,12 19,8" />
    </svg>
  );
}

function GlyphReviews() {
  // bocadillo con cola
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 5h16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-8l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function GlyphHigh() {
  // 3 barras ascendentes
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="6" y1="18" x2="6" y2="14" />
      <line x1="12" y1="18" x2="12" y2="10" />
      <line x1="18" y1="18" x2="18" y2="6" />
    </svg>
  );
}

/* ── KPI Card (§13 row 4) ────────────────────────────────────────────────── */

function KpiCard({
  label,
  value,
  detail,
  glyph,
}: {
  label: string;
  value: string;
  detail: string;
  glyph: "media" | "reviews" | "high";
}) {
  const Glyph = glyph === "media" ? GlyphMedia : glyph === "reviews" ? GlyphReviews : GlyphHigh;
  return (
    <div
      className="relative overflow-hidden rounded-[8px] border p-4"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, color-mix(in srgb, #F0D8BD 24%, #FFFFFF) 100%)",
        borderTop: "3px solid #8A6F55",
        borderColor: "#D9C0A0",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-ui text-[13px] font-semibold text-text-secondary">
            {label}
          </p>
          <p
            className="mt-1 font-display text-[32px] leading-none tabular-nums text-text-primary xs:text-[32px] lg:text-[36px]"
            style={{ textTransform: "uppercase" }}
          >
            {value}
          </p>
          <p className="mt-2 font-ui text-[12px] text-text-secondary">{detail}</p>
        </div>
        {/* Medallón 28px (§13 row 4) */}
        <span
          className="flex shrink-0 items-center justify-center rounded-full text-border-mid"
          style={{
            width: 28,
            height: 28,
            background: "color-mix(in srgb, #F0D8BD 60%, #FFFFFF)",
            border: "1px solid #D9C0A0",
          }}
        >
          <Glyph />
        </span>
      </div>
    </div>
  );
}
