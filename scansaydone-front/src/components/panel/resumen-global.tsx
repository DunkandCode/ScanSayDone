"use client";

/**
 * Resumen global del panel: 4 consultas al servicio (una por negocio) con
 * `Promise.allSettled`, más los gráficos por día y por momento del día.
 *
 * - La lista de negocios sale de `listarEmpresas()` (sondeo de encuestas,
 *   cacheado 60 s); por cada id se consulta `obtenerPanelEmpresa`.
 * - Los totales se calculan DESDE LAS FILAS (`resumenGlobalDesdePaneles`):
 *   la recomendación neta general nunca es el promedio de las de cada
 *   negocio. La tabla usa los números oficiales de cada `agregado`.
 * - Gráfico por día: fusión de las series de los negocios consultados
 *   (13 días del 19 al 31 de octubre, sin rellenar huecos).
 * - Gráfico por momento: conteo en cliente de `bloque_horario`; los
 *   bloques con menos de 5 respuestas llevan la nota «muestra mínima».
 * - Estados honestos: si el servicio no se puede consultar, se muestra
 *   «No se pudo consultar el servicio.» SIN cifras. Si fallan algunos
 *   negocios (pero no todos), se muestran los que sí llegaron y una nota
 *   con la cantidad que falló.
 */
import { useEffect, useState } from "react";
import { obtenerPanelEmpresa, type PanelEmpresaDatos } from "@/lib/api/panel";
import { listarEmpresas } from "@/lib/api/empresas";
import { formatear1, formatearDiaMes, formatearMedia } from "@/lib/panel/calculos";
import {
  agregarSerieDiaria,
  contarPorBloqueHorario,
  esMuestraMinima,
  resumenGlobalDesdePaneles,
  type ConteoBloques,
  type FilaNegocioGlobal,
  type PuntoDia,
  type ResumenGlobal,
} from "@/lib/panel/global";
import { ETIQUETA_SIMULADOS } from "@/lib/panel/etiqueta";

type EstadoResumen =
  | { fase: "cargando" }
  | { fase: "sin-servicio" }
  | { fase: "sin-negocios" }
  | {
      fase: "ok";
      datos: ResumenGlobal;
      serie: readonly PuntoDia[];
      bloques: ConteoBloques;
      fallidos: number;
    };

export function ResumenGlobal() {
  const [estado, setEstado] = useState<EstadoResumen>({ fase: "cargando" });

  useEffect(() => {
    const controller = new AbortController();
    let activo = true;

    (async () => {
      const lista = await listarEmpresas();
      if (!activo) return;

      if (lista.estado !== "ok") {
        // vacio | no-disponible | error: sin lista no hay qué consultar.
        // La distinción la muestra el selector de las otras pestañas;
        // aquí basta el estado honesto sin cifras.
        setEstado({ fase: lista.estado === "vacio" ? "sin-negocios" : "sin-servicio" });
        return;
      }

      const ids = lista.empresas.map((e) => e.empresaId);
      const resultados = await Promise.allSettled(
        ids.map((id) => obtenerPanelEmpresa(id, controller.signal)),
      );
      if (!activo) return;

      const paneles: PanelEmpresaDatos[] = [];
      let fallidos = 0;
      for (const resultado of resultados) {
        if (resultado.status === "fulfilled" && resultado.value.estado === "ok") {
          paneles.push(resultado.value.panel);
        } else {
          fallidos += 1;
        }
      }

      if (paneles.length === 0) {
        setEstado({ fase: "sin-servicio" });
        return;
      }

      const filas = paneles.flatMap((p) => p.respuestas);
      setEstado({
        fase: "ok",
        datos: resumenGlobalDesdePaneles(paneles),
        serie: agregarSerieDiaria(paneles.map((p) => p.agregado.serie_diaria)),
        bloques: contarPorBloqueHorario(filas),
        fallidos,
      });
    })();

    return () => {
      activo = false;
      controller.abort();
    };
    // Solo al montar: los negocios del servicio no cambian sin recargar.
  }, []);

  return (
    <>
      <h1 className="font-display text-[32px] uppercase leading-none text-text-primary lg:text-[40px]">
        Resumen
      </h1>

      {/* Etiqueta obligatoria: origen de los datos, siempre visible. */}
      <p className="mt-2 font-ui text-[13px] text-text-secondary">{ETIQUETA_SIMULADOS}</p>

      {estado.fase === "cargando" && (
        <p role="status" className="mt-4 font-ui text-[14px] text-text-secondary">
          Consultando el servicio…
        </p>
      )}

      {estado.fase === "sin-servicio" && (
        <p role="status" className="mt-4 font-ui text-[14px] text-text-secondary">
          No se pudo consultar el servicio.
        </p>
      )}

      {estado.fase === "sin-negocios" && (
        <p role="status" className="mt-4 font-ui text-[14px] text-text-secondary">
          El servicio responde, pero no hay negocios cargados.
        </p>
      )}

      {estado.fase === "ok" && (
        <ResumenDatos
          datos={estado.datos}
          serie={estado.serie}
          bloques={estado.bloques}
          fallidos={estado.fallidos}
        />
      )}
    </>
  );
}

// ── Datos del resumen (fase ok) ────────────────────────────────────────────

function ResumenDatos({
  datos,
  serie,
  bloques,
  fallidos,
}: {
  datos: ResumenGlobal;
  serie: readonly PuntoDia[];
  bloques: ConteoBloques;
  fallidos: number;
}) {
  return (
    <>
      {/* Cuatro cifras generales */}
      <div className="mt-4 grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
        <Cifra
          label="Respuestas"
          value={String(datos.totalRespuestas)}
          detail="entre el 19 y el 31 de octubre"
        />
        <Cifra
          label="Media general"
          value={
            datos.mediaGeneral === null ? "—" : formatearMedia(datos.mediaGeneral)
          }
          detail="nota 1, de la 0 a la 10"
        />
        <Cifra
          label="Negocios"
          value={String(datos.filas.length)}
          detail="consultados en el servicio"
        />
        <Cifra
          label="Recomendación neta general"
          value={
            datos.recomendacionNetaGeneral === null
              ? "—"
              : formatear1(datos.recomendacionNetaGeneral)
          }
          detail="va de -100 a 100"
        />
      </div>

      {/* Gráfico por día: conteo diario fusionado */}
      <section aria-labelledby="resumen-dia" className="mt-6 lg:mt-8">
        <TituloSeccion id="resumen-dia">Respuestas por día</TituloSeccion>
        <GraficoPorDia serie={serie} />
      </section>

      {/* Distribución + momento del día */}
      <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 lg:flex-[2]">
          <TituloSeccion id="resumen-distribucion">
            Distribución de las notas
          </TituloSeccion>
          <DistribucionNotas distribucion={datos.distribucion} />
        </div>
        <div className="min-w-0 flex-1 lg:flex-[1]">
          <TituloSeccion id="resumen-momento">Por momento del día</TituloSeccion>
          <GraficoPorMomento bloques={bloques} />
        </div>
      </div>

      {/* Tabla por negocio (orden fijo por id, sin ordenamiento) */}
      <section aria-labelledby="resumen-tabla" className="mt-6 lg:mt-8">
        <TituloSeccion id="resumen-tabla">Resumen por negocio</TituloSeccion>
        <TablaNegocios filas={datos.filas} />
        {fallidos > 0 && (
          <p role="status" className="mt-3 font-ui text-[13px] text-text-secondary">
            No se pudo consultar {fallidos} {fallidos === 1 ? "negocio" : "negocios"}.
          </p>
        )}
      </section>
    </>
  );
}

/* ── Título de sección con filete vertical (lenguaje del panel) ───────────── */

function TituloSeccion({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="flex items-center gap-[10px] font-ui text-[16px] font-bold text-text-primary lg:text-[18px]"
    >
      <span
        aria-hidden="true"
        className="inline-block h-[16px] w-[3px] shrink-0 rounded-[1px] bg-border-mid"
      />
      {children}
    </h2>
  );
}

/* ── Cifra (tarjeta del panel: 1 px de borde, sin sombra) ─────────────────── */

function Cifra({
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
      <p className="font-ui text-[13px] font-semibold text-text-secondary">
        {label}
      </p>
      <p className="mt-1 font-display text-[32px] leading-none tabular-nums text-text-primary">
        {value}
      </p>
      <p className="mt-2 font-ui text-[12px] text-text-secondary">{detail}</p>
    </div>
  );
}

/* ── Barras: tono único del panel (sin resaltar rangos) ──────────────────── */

function tonoBarra(): string {
  return "#8A6F55";
}

/* ── Fila de barra: patrón único para los tres gráficos ─────────────────────
 * [etiqueta fija] [pista flexible] [valor fijo]. La etiqueta nunca se parte
 * (`whitespace-nowrap` + `tabular-nums`); la barra interior mide sobre el
 * máximo del conjunto (si el máximo es 0, todas quedan en 0, sin dividir
 * por cero); el valor comparte tamaño tipográfico con la etiqueta. La fila
 * mide 20 px en los tres gráficos, con bordes izquierdos alineados.
 */

function FilaBarra({
  ariaLabel,
  claseEtiqueta,
  conteo,
  etiqueta,
  max,
  nota,
}: {
  ariaLabel: string;
  /** Ancho y alineación de la etiqueta: `w-14 text-right`, el MISMO valor
   *  en los tres gráficos, para que las barras compartan el mismo origen
   *  izquierdo (la columna de etiqueta es fija; el contenido no la ensancha). */
  claseEtiqueta: string;
  conteo: number;
  etiqueta: string;
  max: number;
  /** Nota opcional DEBAJO de la fila (elemento aparte del conteo). */
  nota?: React.ReactNode;
}) {
  const ancho = max > 0 ? (conteo / max) * 100 : 0;
  return (
    <li aria-label={ariaLabel} className="flex flex-col">
      <div className="flex items-center gap-2">
        <span
          className={`shrink-0 whitespace-nowrap font-ui text-[13px] tabular-nums text-text-secondary ${claseEtiqueta}`}
        >
          {etiqueta}
        </span>
        <div className="h-[20px] min-w-0 flex-1" aria-hidden="true">
          <div
            className="h-full rounded-[2px]"
            style={{ width: `${ancho}%`, background: tonoBarra() }}
          />
        </div>
        <span className="min-w-[28px] shrink-0 text-right font-ui text-[13px] tabular-nums text-text-secondary sm:min-w-[36px]">
          {conteo}
        </span>
      </div>
      {nota}
    </li>
  );
}

/* ── Gráfico por día (filas horizontales, conteo visible) ─────────────────── */

function GraficoPorDia({ serie }: { serie: readonly PuntoDia[] }) {
  if (serie.length === 0) {
    return (
      <p className="mt-3 font-ui text-[14px] text-text-secondary">
        Sin respuestas por día.
      </p>
    );
  }
  const max = Math.max(...serie.map((p) => p.respuestas));
  return (
    <div className="mt-3 rounded-[8px] border border-border-subtle bg-surface-default p-4 xs:p-5">
      <ul
        className="flex flex-col gap-1.5"
        aria-label="Cantidad de respuestas por día, de la más antigua a la más reciente"
      >
        {serie.map((punto) => {
          const dia = formatearDiaMes(punto.fecha);
          return (
            <FilaBarra
              key={punto.fecha}
              ariaLabel={`${dia}: ${punto.respuestas} ${punto.respuestas === 1 ? "respuesta" : "respuestas"}`}
              claseEtiqueta="w-14 text-right"
              conteo={punto.respuestas}
              etiqueta={dia}
              max={max}
            />
          );
        })}
      </ul>
    </div>
  );
}

/* ── Distribución 0–10 (mismas filas; sin resaltar rangos) ────────────────── */

function DistribucionNotas({ distribucion }: { distribucion: readonly number[] }) {
  const max = Math.max(...distribucion);
  return (
    <div className="mt-3 rounded-[8px] border border-border-subtle bg-surface-default p-4 xs:p-5">
      <ul
        className="flex flex-col gap-1.5"
        aria-label="Cantidad de respuestas por nota, de la 0 a la 10"
      >
        {distribucion.map((count, nota) => (
          <FilaBarra
            key={nota}
            ariaLabel={`Nota ${nota}: ${count} ${count === 1 ? "respuesta" : "respuestas"}`}
            claseEtiqueta="w-14 text-right"
            conteo={count}
            etiqueta={String(nota)}
            max={max}
          />
        ))}
      </ul>
    </div>
  );
}

/* ── Gráfico por momento del día (3 barras + muestra mínima) ──────────────── */

function GraficoPorMomento({ bloques }: { bloques: ConteoBloques }) {
  const filas = [
    { etiqueta: "Mañana", rango: "de 6 a 11", conteo: bloques.manana },
    { etiqueta: "Tarde", rango: "de 12 a 19", conteo: bloques.tarde },
    { etiqueta: "Noche", rango: "de 20 a 5", conteo: bloques.noche },
  ];
  const max = Math.max(...filas.map((f) => f.conteo));
  return (
    <div className="mt-3 rounded-[8px] border border-border-subtle bg-surface-default p-4 xs:p-5">
      <ul
        className="flex flex-col gap-2.5"
        aria-label="Cantidad de respuestas por momento del día"
      >
        {filas.map((fila) => (
          <FilaBarra
            key={fila.etiqueta}
            ariaLabel={`${fila.etiqueta} (${fila.rango}): ${fila.conteo} ${fila.conteo === 1 ? "respuesta" : "respuestas"}`}
            claseEtiqueta="w-14 text-right"
            conteo={fila.conteo}
            etiqueta={fila.etiqueta}
            max={max}
            nota={
              esMuestraMinima(fila.conteo) ? (
                /* Nota debajo de la fila, en un elemento aparte del conteo:
                 * nunca se superpone al número. */
                <p className="mt-1 font-ui text-[12px] text-text-secondary">
                  <span className="inline-block rounded-[4px] border border-border-mid px-1.5 py-0.5 text-[11px]">
                    muestra mínima
                  </span>
                </p>
              ) : undefined
            }
          />
        ))}
      </ul>
      <p className="mt-4 font-ui text-[12px] text-text-secondary">
        Mañana de 6 a 11 · Tarde de 12 a 19 · Noche de 20 a 5. Los bloques
        con menos de 5 respuestas se marcan como muestra mínima.
      </p>
    </div>
  );
}

/* ── Tabla por negocio: apilada hasta lg (768 incluido), tabla real desde lg ─
 * A 768 la tabla real (7 columnas) desbordaba el documento
 * (scrollWidth 797 > clientWidth 768); el modo apilado se mantiene
 * hasta 1024 px. */

function TablaNegocios({
  filas,
}: {
  filas: readonly FilaNegocioGlobal[];
}) {
  return (
    <div className="mt-3 rounded-[8px] border border-border-subtle bg-surface-default p-2 lg:p-4">
      <table className="w-full border-collapse font-ui text-[14px] text-text-primary">
        <caption className="sr-only">
          Resumen por negocio: respuestas, media, promotores, detractores y
          recomendación neta
        </caption>
        <thead className="hidden lg:table-header-group">
          <tr className="text-left">
            <th
              scope="col"
              className="border-b border-border-mid px-3 py-2 text-[13px] font-semibold text-text-secondary"
            >
              Empresa
            </th>
            <th
              scope="col"
              className="border-b border-border-mid px-3 py-2 text-[13px] font-semibold text-text-secondary"
            >
              Rubro
            </th>
            <th
              scope="col"
              className="border-b border-border-mid px-3 py-2 text-right text-[13px] font-semibold text-text-secondary"
            >
              Respuestas
            </th>
            <th
              scope="col"
              className="border-b border-border-mid px-3 py-2 text-right text-[13px] font-semibold text-text-secondary"
            >
              Media
            </th>
            <th
              scope="col"
              className="border-b border-border-mid px-3 py-2 text-right text-[13px] font-semibold text-text-secondary"
            >
              Promotores
            </th>
            <th
              scope="col"
              className="border-b border-border-mid px-3 py-2 text-right text-[13px] font-semibold text-text-secondary"
            >
              Detractores
            </th>
            <th
              scope="col"
              className="border-b border-border-mid px-3 py-2 text-right text-[13px] font-semibold text-text-secondary"
            >
              Recomendación neta
            </th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr
              key={fila.empresaId}
              className="block border-b border-border-subtle last:border-b-0 lg:table-row lg:border-b"
            >
              <th
                scope="row"
                className="block px-3 pb-1 pt-3 text-left font-semibold text-text-primary lg:table-cell lg:px-3 lg:py-2 lg:font-medium"
              >
                {fila.nombre}
              </th>
              <Celda etiqueta="Rubro">{fila.rubro}</Celda>
              <Celda etiqueta="Respuestas" numerica>
                {String(fila.respuestas)}
              </Celda>
              <Celda etiqueta="Media" numerica>
                {fila.mediaP1 === null ? "—" : formatearMedia(fila.mediaP1)}
              </Celda>
              <Celda etiqueta="Promotores" numerica>
                {String(fila.promotores)}
              </Celda>
              <Celda etiqueta="Detractores" numerica>
                {String(fila.detractores)}
              </Celda>
              <Celda etiqueta="Recomendación neta" numerica>
                {fila.recomendacionNeta === null
                  ? "—"
                  : formatear1(fila.recomendacionNeta)}
              </Celda>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Celda({
  etiqueta,
  numerica = false,
  children,
}: {
  etiqueta: string;
  numerica?: boolean;
  children: React.ReactNode;
}) {
  return (
    <td
      className={`block px-3 pb-1 pt-0.5 text-text-primary lg:table-cell lg:px-3 lg:py-2 ${
        numerica ? "tabular-nums lg:text-right" : ""
      }`}
    >
      {/* En móvil cada celda se apila con su etiqueta visible. */}
      <span className="mr-2 text-text-secondary lg:hidden">{etiqueta}:</span>
      {children}
    </td>
  );
}
