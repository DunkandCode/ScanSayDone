export function LoginVisual() {
  return (
    <figure className="hidden w-full max-w-[432px] lg:block">
      {/* Decorative cards container */}
      <div className="relative w-[400px] pt-14" aria-hidden="true">
        {/* Deck (back card) */}
        <div className="absolute right-0 top-0 w-[328px] rounded-[16px] border border-border-mid bg-surface-elevated p-6">
          <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-text-secondary">
            VISTA DEL PANEL
          </span>
          <div className="mt-4 space-y-3">
            <div className="h-3 rounded-[4px] border border-border-subtle bg-surface-elevated" style={{ width: "240px" }} />
            <div className="h-3 rounded-[4px] border border-border-subtle bg-surface-elevated" style={{ width: "208px" }} />
            <div className="h-3 rounded-[4px] border border-border-subtle bg-surface-elevated" style={{ width: "272px" }} />
          </div>
        </div>

        {/* Mock (front card) */}
        <div className="relative z-0 w-[360px] rounded-[16px] border-2 border-border-mid bg-surface-default p-8">
          {/* DEMO badge */}
          <div className="mb-4">
            <span className="rounded-[4px] border border-border-mid bg-surface-elevated px-2 py-0.5 font-ui text-[12px] font-semibold uppercase tracking-[0.1em] text-text-primary">
              DEMO
            </span>
          </div>

          {/* Question */}
          <p className="font-ui text-[16px] font-semibold text-text-primary">
            ¿Cómo fue tu atención?
          </p>

          {/* Five boxes */}
          <div className="mt-4 grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`flex h-12 w-12 items-center justify-center rounded-[6px] border-2 ${
                  n === 5
                    ? "border-border-mid bg-surface-elevated"
                    : "border-border-mid bg-surface-default"
                }`}
              >
                {n === 5 && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 10L8 14L16 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-text-primary"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* Submit button (decorative, not coral) */}
          <div className="mt-6">
            <span className="inline-block rounded-[8px] border border-border-mid bg-surface-elevated px-6 py-2 font-ui text-[14px] font-medium text-text-primary">
              Enviar
            </span>
          </div>
        </div>
      </div>

      {/* Caption (not aria-hidden) */}
      <figcaption className="mt-6 space-y-2 text-center">
        <p className="font-ui text-[13px] font-semibold uppercase tracking-[0.14em] text-text-primary">
          EL CLIENTE ESCANEA · CONTESTA · TÚ LO LEES
        </p>
        <p className="font-ui text-[12px] text-text-secondary">
          ejemplo de referencia · sin funciones
        </p>
        <p className="font-ui text-[14px] font-medium text-text-primary">
          Todavía no hay panel que mostrar.
        </p>
      </figcaption>
    </figure>
  );
}
