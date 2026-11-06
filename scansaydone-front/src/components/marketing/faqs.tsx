"use client";
// L6 — Landing band 8: "Preguntas frecuentes" (FAQ accordion).
// Plan: L6-FAQ-2026-11-06.md (PROPOSED). First client component on the landing.
// No network, no hex, no shadows, no gradients, no CTA coral, no <img>.
// All colors resolve to @theme tokens defined in globals.css.
import { useState } from "react";

// [P] canonical literal — UX-SPEC §5.1 rule 9; not varied or rewritten by hand:
const CANONICA_QR = "El mismo QR sirve para siempre: no hay que reimprimirlo.";

// Isolated data (CANON §3 / F0.5). Adding an item requires a signed act (§5.5).
const PREGUNTAS: { q: string; a: string }[] = [
  {
    q: "¿Tengo que instalar algo?",
    a: "No. La encuesta funciona en el navegador, el tuyo y el de tus clientes. No hay que descargar nada.",
  },
  {
    q: "¿Mis clientes tienen que instalar algo o crear una cuenta?",
    a: "Tampoco. Enfocan el teléfono al QR y la encuesta se abre en el navegador.",
  },
  {
    q: "¿Dónde veo lo que responden?",
    a: "En tu panel. Cada opinión entra con su fecha, su canal y lo que contestó.",
  },
  { q: "¿Tengo que reimprimir el QR cada vez?", a: CANONICA_QR },
  {
    q: "¿Lo que se ve en esta página es real?",
    a: "No. Es un ejemplo. Cuando falta un dato o una foto reales, la página lo dice con letras.",
  },
];

function FaqItem({ n, q, a }: { n: number; q: string; a: string }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <li className="min-h-12">
      <h3 className="m-0">
        <button
          type="button"
          id={`l6-q${n}`}
          aria-expanded={abierto}
          aria-controls={`l6-a${n}`}
          onClick={() => setAbierto((v) => !v)}
          className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-left font-ui text-[16px] font-semibold leading-[1.5] text-text-primary focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
        >
          <span>{q}</span>
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
            data-decorativo="chevron-acordeon"
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ease-in-out motion-reduce:transition-none ${abierto ? "rotate-180" : ""}`}
          >
            <path
              d="M3.5 6 L8 10.5 L12.5 6"
              fill="none"
              stroke="var(--color-text-primary)"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </h3>
      <div
        id={`l6-a${n}`}
        role="region"
        aria-labelledby={`l6-q${n}`}
        hidden={!abierto}
        className="px-4 pb-4 font-ui text-[16px] leading-[1.6] text-text-secondary"
      >
        <p className="m-0">{a}</p>
      </div>
    </li>
  );
}

export function Faqs() {
  return (
    <section
      id="faq"
      tabIndex={-1}
      aria-labelledby="l6-title"
      className="w-full bg-surface-default px-4 py-15 md:py-25 scroll-mt-[92px] focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
    >
      <div
        className="mx-auto grid w-full max-w-mkt-sm grid-cols-12 gap-6 md:max-w-mkt-md lg:max-w-mkt-lg"
      >
        <div className="col-span-12 lg:col-span-8 lg:col-start-3">
          <p className="font-ui text-[12px] font-semibold uppercase tracking-[0.14em] text-text-secondary lg:text-[13px]">
            DUDAS
          </p>
          <h2
            id="l6-title"
            className="mt-3 font-display uppercase text-[44px] leading-[0.95] tracking-[0.01em] text-text-primary md:text-[64px]"
          >
            LO QUE PUEDES PREGUNTARTE
          </h2>
          <p className="mt-4 max-w-[70ch] font-ui text-[17px] leading-[1.55] text-text-secondary md:text-[18px]">
            Son las que este producto ya puede responder. Las demás, escríbenos.
          </p>
          <ul
            role="list"
            className="mt-12 list-none divide-y divide-border-mid rounded-[8px] border border-border-mid"
          >
            {PREGUNTAS.map((p, i) => (
              <FaqItem key={i} n={i + 1} q={p.q} a={p.a} />
            ))}
          </ul>
          <p className="mt-12 font-ui text-[16px] leading-[1.5] text-text-secondary">
            ¿Otra duda?{" "}
            <a
              href="/contactus"
              className="inline-flex items-center py-2.5 font-ui text-[16px] font-semibold text-text-primary underline decoration-border-mid underline-offset-4 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
            >
              Escríbenos
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
