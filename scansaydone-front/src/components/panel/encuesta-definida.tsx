"use client";

/**
 * "Encuesta definida para este negocio": bloque compacto de solo lectura
 * con los textos y escalas que devuelve `obtenerEncuestaEmpresa`.
 *
 * - Consulta por cada cambio de `empresaId` (abort al desmontar/cambiar).
 * - Las escalas se expanden a fichas: [0,10] → 11 fichas (0..10) y
 *   [1,5] → 5 fichas (1..5), en grilla de 6 columnas (11 → filas 6+5),
 *   cada ficha de 44 px de alto (≥44 px también a 375 px de ancho).
 * - Si la consulta falla, muestra "No se pudo consultar el servicio." y
 *   NO bloquea la sección de resultados (son componentes hermanos).
 */
import { useEffect, useState } from "react";
import {
  obtenerEncuestaEmpresa,
  type EncuestaEmpresa,
} from "@/lib/api/encuesta";

type DatoDefinicion =
  | { tipo: "ok"; encuesta: EncuestaEmpresa }
  | { tipo: "no-encontrada" }
  | { tipo: "fallo" };

export function EncuestaDefinida({ empresaId }: { empresaId: number | null }) {
  // Resultado por id: la carga se deriva comparando el id guardado con el
  // actual (sin setState síncrono en el efecto).
  const [resultado, setResultado] = useState<{
    id: number;
    dato: DatoDefinicion;
  } | null>(null);

  useEffect(() => {
    if (empresaId === null) return;
    const controller = new AbortController();
    obtenerEncuestaEmpresa(empresaId, controller.signal).then((res) => {
      // Consulta abortada (cambio de id o desmonte): el estado lo escribe
      // la consulta vigente, no esta.
      if (controller.signal.aborted) return;
      if (res.estado === "ok") {
        setResultado({ id: empresaId, dato: { tipo: "ok", encuesta: res.encuesta } });
      } else if (res.estado === "no-encontrada") {
        setResultado({ id: empresaId, dato: { tipo: "no-encontrada" } });
      } else {
        setResultado({ id: empresaId, dato: { tipo: "fallo" } });
      }
    });
    return () => controller.abort();
  }, [empresaId]);

  if (empresaId === null) return null;

  // Vigente: si el guardado es de otro id (o aún no hay), la consulta del
  // id actual sigue en curso.
  const vigente =
    resultado !== null && resultado.id === empresaId ? resultado.dato : null;

  return (
    <section aria-labelledby="encuesta-title" className="mt-6 lg:mt-8">
      <h2
        id="encuesta-title"
        className="flex items-center gap-[10px] font-ui text-[16px] font-bold text-text-primary xs:text-[16px] lg:text-[18px]"
      >
        <span
          aria-hidden="true"
          className="inline-block shrink-0 rounded-[1px]"
          style={{ width: 3, height: 16, background: "#8A6F55" }}
        />
        Encuesta definida para este negocio
      </h2>

      <div
        className="mt-4 rounded-[8px] border p-4 xs:p-5"
        style={{ background: "#FFFFFF", borderColor: "#D9C0A0" }}
      >
        {vigente === null && (
          <p role="status" className="font-ui text-[14px] text-text-secondary">
            Consultando la encuesta del servicio…
          </p>
        )}

        {vigente?.tipo === "no-encontrada" && (
          <p className="font-ui text-[14px] text-text-secondary">
            Este negocio todavía no tiene encuesta.
          </p>
        )}

        {vigente?.tipo === "fallo" && (
          <p role="status" className="font-ui text-[14px] text-text-secondary">
            No se pudo consultar el servicio.
          </p>
        )}

        {vigente?.tipo === "ok" && <Definicion encuesta={vigente.encuesta} />}
      </div>
    </section>
  );
}

/* ── Definición p1–p5 ─────────────────────────────────────────────────────── */

function Definicion({ encuesta }: { encuesta: EncuestaEmpresa }) {
  const { p1, p2, p3, p4, p5 } = encuesta.preguntas;
  return (
    <dl className="flex flex-col gap-4">
      <PreguntaEscala numero={1} texto={p1.texto} escala={p1.escala} />
      <PreguntaEscala numero={2} texto={p2.texto} escala={p2.escala} />
      <PreguntaEtiquetada
        numero={3}
        texto={p3.texto}
        etiqueta={p3.etiqueta}
        escala={p3.escala}
      />
      <PreguntaEtiquetada
        numero={4}
        texto={p4.texto}
        etiqueta={p4.etiqueta}
        escala={p4.escala}
      />
      {/* p5 no tiene escala: se representa el campo de respuesta como un
          recuadro decorativo de solo lectura (vista de definición, no un
          formulario). El dato accesible queda en el par dt/dd. */}
      <div className="pb-1">
        <dt className="font-ui text-[13px] font-semibold text-text-secondary">
          Pregunta 5 · Respuesta abierta
        </dt>
        <dd className="mt-1 font-ui text-[14px] text-text-primary">
          {p5.texto}
        </dd>
        <div
          aria-hidden="true"
          className="mt-2 min-h-[72px] rounded-[4px] border p-3 font-ui text-[14px] text-text-secondary"
          style={{ background: "#FFFFFF", borderColor: "#D9C0A0" }}
        >
          El cliente escribe su respuesta (máximo {p5.max_caracteres}{" "}
          caracteres)
        </div>
      </div>
    </dl>
  );
}

function PreguntaEscala({
  numero,
  texto,
  escala,
}: {
  numero: number;
  texto: string;
  escala: readonly [number, number];
}) {
  return (
    <div>
      <dt className="font-ui text-[13px] font-semibold text-text-secondary">
        Pregunta {numero}
      </dt>
      <dd className="mt-1 font-ui text-[14px] text-text-primary">{texto}</dd>
      <ChipsEscala escala={escala} />
    </div>
  );
}

function PreguntaEtiquetada({
  numero,
  texto,
  etiqueta,
  escala,
}: {
  numero: number;
  texto: string;
  etiqueta: string;
  escala: readonly [number, number];
}) {
  return (
    <div>
      <dt className="font-ui text-[13px] font-semibold text-text-secondary">
        Pregunta {numero} · {etiqueta}
      </dt>
      <dd className="mt-1 font-ui text-[14px] text-text-primary">{texto}</dd>
      <ChipsEscala escala={escala} />
    </div>
  );
}

/* ── Fichas de escala (grilla de 6, fichas de 44 px) ──────────────────────── */

function ChipsEscala({ escala }: { escala: readonly [number, number] }) {
  const [min, max] = escala;
  const largo = Math.trunc(max) - Math.trunc(min) + 1;
  // Escalas fuera de rango razonable no se expanden (defensivo).
  if (!(largo >= 1 && largo <= 12)) return null;
  const valores = Array.from({ length: largo }, (_, i) => Math.trunc(min) + i);
  return (
    <ul
      className="mt-2 grid grid-cols-6 gap-1"
      aria-label={`Escala de la ${min} a la ${max}`}
    >
      {valores.map((v) => (
        <li
          key={v}
          className="flex h-[44px] items-center justify-center rounded-[4px] border font-ui text-[14px] font-semibold tabular-nums text-text-primary"
          style={{ background: "#FFFFFF", borderColor: "#D9C0A0" }}
        >
          {v}
        </li>
      ))}
    </ul>
  );
}
