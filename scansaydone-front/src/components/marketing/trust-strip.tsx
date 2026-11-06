/**
 * Banda 2 — Trust Strip
 *
 * Franja de confianza entre Hero y Cómo Funciona.
 * 3 claims sin h2, sin enlaces, sin botones.
 * Fondo: surface-elevated con bordes border-mid.
 *
 * Corrección 2026-11-06 (C-84 / §10): el claim 3 importa la literal canónica
 * desde src/lib/copy-landing.ts (un único punto de verdad).
 */

import { QR_CLAIM_TITLE, QR_CLAIM_BODY } from "../../lib/copy-landing";

const CLAIMS = [
  {
    title: "SIN INSTALAR NADA",
    body: "El cliente contesta en el navegador de su teléfono. No hay app.",
    iconId: "icon-sin-app",
  },
  {
    title: "SIN CUENTA PARA TUS CLIENTES",
    body: "Nada de registros ni correos para responder.",
    iconId: "icon-sin-cuenta",
  },
  {
    title: QR_CLAIM_TITLE,
    body: QR_CLAIM_BODY,
    iconId: "icon-sin-reimpresion",
  },
] as const;

export function TrustStrip() {
  return (
    <section
      className="w-full border-y border-border-mid px-4 py-15"
      style={{
        backgroundImage:
          "linear-gradient(180deg, color-mix(in srgb, var(--color-background-page) 75%, var(--color-surface-elevated)) 0%, var(--color-surface-elevated) 100%)",
      }}
    >
      <div className="relative mx-auto grid w-full max-w-mkt-xl grid-cols-1 gap-4 min-[544px]:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] md:gap-6">
        {CLAIMS.map((claim) => (
          <div key={claim.title} className="flex flex-col">
            {claim.iconId === "icon-sin-app" && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-8 shrink-0 text-text-primary"
                aria-hidden="true"
                focusable="false"
                data-decorativo="icon-sin-app"
              >
                {/* Teléfono vertical */}
                <rect x="6" y="3" width="12" height="18" rx="1.5" />
                <line x1="10" y1="18" x2="14" y2="18" />
                {/* Línea diagonal (no instalar) */}
                <line x1="4" y1="20" x2="20" y2="4" />
              </svg>
            )}
            {claim.iconId === "icon-sin-cuenta" && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-8 shrink-0 text-text-primary"
                aria-hidden="true"
                focusable="false"
                data-decorativo="icon-sin-cuenta"
              >
                {/* Tarjeta/carné rectangular */}
                <rect x="3" y="6" width="18" height="12" rx="1.5" />
                <circle cx="8" cy="12" r="1.5" />
                <line x1="12" y1="10" x2="17" y2="10" />
                <line x1="12" y1="14" x2="17" y2="14" />
                {/* Línea diagonal (no registrarse) */}
                <line x1="3" y1="21" x2="21" y2="3" />
              </svg>
            )}
            {claim.iconId === "icon-sin-reimpresion" && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-8 shrink-0 text-text-primary"
                aria-hidden="true"
                focusable="false"
                data-decorativo="icon-sin-reimpresion"
              >
                {/* Hoja de papel */}
                <rect x="5" y="4" width="14" height="16" rx="1" />
                <line x1="8" y1="9" x2="16" y2="9" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="12" y2="17" />
                {/* Flecha de retorno (se reutiliza) */}
                <path d="M18 8 Q20 8 20 11 L20 14" />
                <path d="M18 13 L20 15 L22 13" />
              </svg>
            )}
            <p className="mt-3 font-ui text-[20px] font-semibold uppercase text-text-primary">
              {claim.title}
            </p>
            <p className="mt-2 font-ui text-[14px] leading-[1.45] text-text-secondary">
              {claim.body}
            </p>
          </div>
        ))}

        {/* Filetes verticales entre columnas (C-86, §10.3): solo desktop (md+) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 hidden w-px bg-border-mid md:block"
          style={{ left: "calc((100% - 48px) / 3 + 12px)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 hidden w-px bg-border-mid md:block"
          style={{ left: "calc(2 * ((100% - 48px) / 3) + 36px)" }}
        />
      </div>
    </section>
  );
}
