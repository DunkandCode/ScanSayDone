/**
 * Banda 9 — CTA Final
 *
 * Cierre del landing después de FAQ, antes del pie.
 * Fondo oscuro (surface-dark), único CTA coral del cierre.
 */

import Link from "next/link";

export function CtaFinal() {
  return (
    <section
      id="cta-final"
      tabIndex={-1}
      className="w-full bg-surface-dark px-4 py-15 scroll-mt-[92px] focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary md:py-25"
    >
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
              Escríbenos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
