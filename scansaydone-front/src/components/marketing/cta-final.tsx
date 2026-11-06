/**
 * Banda 9 — CTA Final
 *
 * Cierre del landing después de FAQ, antes del pie.
 * Fondo oscuro (surface-dark) con imagen de fondo atenuada, único CTA coral del cierre.
 */

import Image from "next/image";
import Link from "next/link";

export function CtaFinal() {
  return (
    <section
      id="cta-final"
      tabIndex={-1}
      className="relative w-full overflow-hidden bg-surface-dark px-4 py-15 scroll-mt-[92px] focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary md:py-25"
    >
      {/* Capa de imagen de fondo (solo md+) */}
      <Image
        src="/img/fondos/banda-9-escena.png"
        width={1536}
        height={768}
        alt=""
        aria-hidden
        priority={false}
        loading="lazy"
        sizes="100vw"
        className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-center md:block"
      />

      {/* Velo atenuador */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-surface-dark/88"
      />

      {/* Contenido */}
      <div className="relative">
        <div className="mx-auto max-w-mkt-lg">
          <div className="mx-auto max-w-[632px] text-center">
            <p className="font-ui text-[13px] font-semibold uppercase tracking-[0.14em] text-on-dark-secondary">
              COMIENZA HOY
            </p>
            <h2 className="mt-4 font-display text-[44px] leading-[0.95] uppercase text-on-dark md:text-[64px]">
              ¿LISTO PARA EMPEZAR?
            </h2>
            <p className="mt-4 font-ui text-[18px] leading-[1.6] text-on-dark-secondary">
              Encuestas por QR para tu restaurante, café o comercio.
            </p>
            <div className="mt-8">
              <Link
                href="/contactus"
                className="inline-flex h-14 w-full items-center justify-center rounded-[8px] bg-interactive-primary px-6 font-ui text-[16px] font-semibold text-text-primary transition-colors duration-150 hover:bg-interactive-hover active:bg-interactive-pressed focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary sm:w-auto"
              >
                Hablemos
              </Link>
            </div>
            <p className="mt-6 font-ui text-[12px] text-on-dark-secondary">
              La imagen de fondo es una ilustración generada. No muestra un
              local real.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
