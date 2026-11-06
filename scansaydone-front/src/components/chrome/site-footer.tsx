import Link from "next/link";

// Año fijado en el build para sitios estáticos; en servidores dinámicos se evalúa al cargar el módulo.
const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer
      className="w-full border-t border-border-mid px-4 pb-10 pt-15 md:pb-12 md:pt-25"
      style={{
        backgroundImage:
          "linear-gradient(180deg, var(--color-surface-elevated) 0%, var(--color-background-page) 45%)",
      }}
    >
      <div className="mx-auto w-full max-w-mkt-sm md:max-w-mkt-md lg:max-w-mkt-lg xl:max-w-mkt-xl">
        <div className="relative">
          {/* Filetes verticales entre columnas (solo xl) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 hidden w-px bg-border-mid xl:block"
            style={{ left: "calc(25% - 6px)" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 hidden w-px bg-border-mid xl:block"
            style={{ left: "50%" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 hidden w-px bg-border-mid xl:block"
            style={{ left: "calc(75% + 6px)" }}
          />

          <div className="grid grid-cols-12 gap-6">
          {/* Celda 1 — Marca */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-3">
            <div className="flex h-9 items-center font-ui text-[16px] font-semibold uppercase leading-none tracking-[0.12em] text-text-primary">
              ScanSayDone
            </div>
            <p className="mt-4 font-display uppercase text-[32px] leading-[0.95] text-text-primary">
              ESCANEA. OPINA. LISTO.
            </p>
            <p className="mt-3 font-ui text-[14px] leading-[1.5] text-text-secondary">
              Encuestas de satisfacción por QR para restaurantes y comercios.
            </p>
          </div>

          {/* Celda 2 — Producto */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-3">
            <h2 className="font-ui text-[13px] font-semibold uppercase tracking-[0.14em] text-text-primary">
              Producto
            </h2>
            <ul className="mt-3 list-none space-y-2">
              <li>
                <Link
                  href="/#como-funciona"
                  className="inline-flex min-h-11 items-center font-ui text-[15px] text-text-primary underline decoration-border-mid underline-offset-4 hover:decoration-2 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
                >
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link
                  href="/#canales"
                  className="inline-flex min-h-11 items-center font-ui text-[15px] text-text-primary underline decoration-border-mid underline-offset-4 hover:decoration-2 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
                >
                  Canales
                </Link>
              </li>
              <li>
                <Link
                  href="/#aplicaciones"
                  className="inline-flex min-h-11 items-center font-ui text-[15px] text-text-primary underline decoration-border-mid underline-offset-4 hover:decoration-2 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
                >
                  Aplicaciones
                </Link>
              </li>
              <li>
                <Link
                  href="/#panel"
                  className="inline-flex min-h-11 items-center font-ui text-[15px] text-text-primary underline decoration-border-mid underline-offset-4 hover:decoration-2 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
                >
                  Panel
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="inline-flex min-h-11 items-center font-ui text-[15px] text-text-primary underline decoration-border-mid underline-offset-4 hover:decoration-2 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
                >
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Celda 3 — Contacto */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-3">
            <h2 className="font-ui text-[13px] font-semibold uppercase tracking-[0.14em] text-text-primary">
              Contacto
            </h2>
            <ul className="mt-3 list-none">
              <li>
                <Link
                  href="/contactus"
                  className="inline-flex min-h-11 items-center font-ui text-[15px] text-text-primary underline decoration-border-mid underline-offset-4 hover:decoration-2 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
                >
                  Contáctanos
                </Link>
              </li>
            </ul>
          </div>

          {/* Celda 4 — Legal */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-3">
            <h2 className="font-ui text-[13px] font-semibold uppercase tracking-[0.14em] text-text-primary">
              Legal
            </h2>
            <p className="mt-3 font-ui text-[14px] leading-[1.5] text-text-secondary">
              Las reglas de uso y la política de privacidad se publicarán una vez completada la revisión legal.
            </p>
          </div>
        </div>
        </div>

        {/* Barra legal */}
        <div className="mt-12 flex justify-between border-t border-border-mid pt-6 font-ui text-[14px] text-text-primary">
          <span>© {year} ScanSayDone</span>
          <Link
            href="/#contenido"
            className="inline-flex min-h-11 items-center gap-1 text-text-primary hover:underline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
          >
            Volver arriba
            <svg
              viewBox="0 0 16 16"
              className="size-4 rotate-180"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M3.5 6 L8 10.5 L12.5 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
