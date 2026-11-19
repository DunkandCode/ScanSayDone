"use client";

/**
 * Selector de negocio para el encabezado del panel.
 *
 * - Al montarse sondea la lista de negocios (`listarEmpresas`) y consulta la
 *   encuesta del id seleccionado (por defecto, el primero de la lista; si no
 *   hay lista, el 1).
 * - Muestra el nombre y el rubro REALES que devuelve la API. Si la lista no
 *   se pudo construir (`vacio` o `no-disponible`), el selector cae a los
 *   nombres de respaldo de `empresas-demo.ts` dejando claro su origen:
 *   `vacio` → "Sin negocios" (servicio sano, base vacía),
 *   `no-disponible`/`error` → "Sin conexión" (API no consultable). En
 *   esos estados jamás se muestra un nombre de negocio como si viniera
 *   de la API.
 * - El `<select>` vive siempre montado y habilitado (mismo nodo aunque
 *   lleguen datos): el foco no se pierde cuando termina una consulta. La
 *   carga se comunica con `aria-busy` + atenuación, no deshabilitando.
 * - Los indicadores de conexión usan `role="status"` + `aria-live="polite"`.
 * - Prop opcional `onSeleccion(empresaId)`: avisa cada vez que el id
 *   seleccionado cambia (primer valor y cada cambio del usuario). Sirve
 *   para que la página mantenga secciones que dependen del negocio sin
 *   mover el estado del selector de su hogar actual.
 * - Lenguaje visual de las tarjetas del panel: superficie blanca, borde de
 *   1 px, radio 8, sin sombra; chevron propio en `currentColor`.
 */
import { useEffect, useRef, useState } from "react";
import { EMPRESAS_DEMO } from "@/components/panel/empresas-demo";
import { listarEmpresas, type EmpresaResumen } from "@/lib/api/empresas";
import {
  obtenerEncuestaEmpresa,
  type EncuestaEmpresa,
} from "@/lib/api/encuesta";

// ── Estados ─────────────────────────────────────────────────────────────────

type EstadoLista = "cargando" | "ok" | "fallback";

/**
 * Estado de la conexión con la API, derivado del listado:
 * - `conectado` → la lista real llegó (hay negocios de la API).
 * - `sin-negocios` → el servicio responde pero la base está vacía.
 * - `sin-conexion` → no se pudo consultar la API (caída o ilegible).
 * - `null` → todavía cargando.
 */
type EstadoConexion = "conectado" | "sin-negocios" | "sin-conexion" | null;

/**
 * Resultado de la consulta de encuesta para un id concreto. El estado
 * "cargando" no vive aquí: se deriva en el render comparando el id del
 * detalle guardado con el id seleccionado (sin setState síncrono en el
 * efecto).
 */
type DetalleCargado =
  | { estado: "ok"; encuesta: EncuestaEmpresa }
  | { estado: "no-encontrada" }
  | { estado: "no-disponible" }
  | { estado: "error" };

// ── Componente ──────────────────────────────────────────────────────────────

export function NegocioSelector({
  onSeleccion,
}: {
  /** Opcional: se llama con el id cada vez que cambia la selección. */
  onSeleccion?: (empresaId: number) => void;
} = {}) {
  const [lista, setLista] = useState<{ estado: EstadoLista; empresas: EmpresaResumen[] }>({
    estado: "cargando",
    empresas: [],
  });
  const [mensajeFallback, setMensajeFallback] = useState<string | null>(null);
  const [conexion, setConexion] = useState<EstadoConexion>(null);
  const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);
  const [detalle, setDetalle] = useState<{ id: number; dato: DetalleCargado } | null>(
    null,
  );

  // Callback opcional en ref: estable ante funciones inline del caller y
  // disparado solo por cambios reales del id seleccionado.
  const onSeleccionRef = useRef(onSeleccion);
  useEffect(() => {
    onSeleccionRef.current = onSeleccion;
  }, [onSeleccion]);

  useEffect(() => {
    if (idSeleccionado !== null) {
      onSeleccionRef.current?.(idSeleccionado);
    }
  }, [idSeleccionado]);

  // Sondeo de la lista al montar.
  useEffect(() => {
    let activo = true;
    listarEmpresas().then((resultado) => {
      if (!activo) return;
      if (resultado.estado === "ok") {
        // `ok` siempre trae al menos una empresa (ver empresas.ts).
        setLista({ estado: "ok", empresas: resultado.empresas });
        setMensajeFallback(null);
        setConexion("conectado");
        setIdSeleccionado((previo) => previo ?? resultado.empresas[0].empresaId);
      } else if (resultado.estado === "vacio") {
        // /health responde: el problema son los datos, no la conexión.
        setLista({ estado: "fallback", empresas: [] });
        setMensajeFallback(
          "El servicio responde, pero no hay negocios cargados en la base. Se muestran los nombres guardados en el proyecto.",
        );
        setConexion("sin-negocios");
        setIdSeleccionado((previo) => previo ?? 1);
      } else {
        // no-disponible | error: la API no pudo consultarse. Los nombres
        // del selector son de respaldo, no datos de la API.
        setLista({ estado: "fallback", empresas: [] });
        setMensajeFallback(
          "No se pudo consultar el servicio. Se muestran los nombres guardados en el proyecto.",
        );
        setConexion("sin-conexion");
        setIdSeleccionado((previo) => previo ?? 1);
      }
    });
    return () => {
      activo = false;
    };
  }, []);

  // Encuesta del negocio seleccionado (primera consulta y cada cambio).
  useEffect(() => {
    if (idSeleccionado === null) return;
    let activo = true;
    obtenerEncuestaEmpresa(idSeleccionado).then((resultado) => {
      if (!activo) return;
      if (resultado.estado === "ok") {
        setDetalle({ id: idSeleccionado, dato: { estado: "ok", encuesta: resultado.encuesta } });
      } else {
        // no-encontrada | no-disponible | error
        setDetalle({ id: idSeleccionado, dato: { estado: resultado.estado } });
      }
    });
    return () => {
      activo = false;
    };
  }, [idSeleccionado]);

  // Detalle vigente: si el guardado es de otro id (o aún no hay), la
  // consulta del id actual sigue en curso.
  const detalleVigente =
    detalle !== null && detalle.id === idSeleccionado ? detalle.dato : null;

  const cargando = lista.estado === "cargando";

  // ── Opciones del selector ────────────────────────────────────────────────
  // Durante la consulta no se ofrecen nombres de respaldo: todavía no se
  // sabe si la lista real va a llegar.

  const opciones =
    lista.estado === "ok"
      ? lista.empresas.map((e) => (
          <option key={e.empresaId} value={e.empresaId}>
            {e.nombre}
          </option>
        ))
      : lista.estado === "fallback"
        ? EMPRESAS_DEMO.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))
        : null;

  const etiquetaPlaceholder = cargando
    ? "Consultando los negocios…"
    : "Elige un negocio";

  return (
    <section className="mt-4 rounded-[8px] border border-border-subtle bg-surface-default p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        {/* Control: label caption + select con chevron propio. */}
        <div className="w-full min-w-0 md:w-auto md:max-w-[320px]">
          <label
            htmlFor="negocio-selector"
            className="block font-ui text-[13px] font-semibold text-text-secondary"
          >
            Negocio
          </label>
          <div className="relative mt-1">
            <select
              id="negocio-selector"
              value={idSeleccionado === null ? "" : idSeleccionado}
              onChange={(e) => setIdSeleccionado(Number(e.target.value))}
              aria-busy={cargando}
              data-cargando={cargando ? "true" : undefined}
              className="h-[44px] w-full appearance-none rounded-[6px] border border-border-mid bg-surface-default pl-3 pr-10 font-ui text-[14px] text-text-primary hover:border-text-primary focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary data-[cargando=true]:cursor-progress data-[cargando=true]:opacity-70 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {idSeleccionado === null && (
                <option value="">{etiquetaPlaceholder}</option>
              )}
              {lista.estado !== "cargando" && opciones}
            </select>
            {/* Chevron propio (sin flecha del navegador). */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-primary"
            >
              <polyline points="4,7.5 10,13 16,7.5" />
            </svg>
          </div>
        </div>

        {/* Nombre + rubro reales de la API y estado de la conexión. */}
        <div
          role="status"
          aria-live="polite"
          className="min-w-0 md:text-right"
        >
          <ContenidoDetalle
            conexion={conexion}
            idSeleccionado={idSeleccionado}
            detalle={detalleVigente}
          />
        </div>
      </div>

      {mensajeFallback !== null && (
        <p role="status" className="mt-3 font-ui text-[13px] text-text-secondary">
          {mensajeFallback}
        </p>
      )}
    </section>
  );
}

/* ── Detalle según el resultado de la encuesta ────────────────────────────── */

function ContenidoDetalle({
  conexion,
  idSeleccionado,
  detalle,
}: {
  conexion: EstadoConexion;
  idSeleccionado: number | null;
  detalle: DetalleCargado | null;
}) {
  // Todavía no se sabe nada del listado: reservar el espacio.
  if (conexion === null) {
    return <p className="font-ui text-[14px] text-text-secondary">&nbsp;</p>;
  }

  // Estados sin lista real (`sin-negocios`, `sin-conexion`): no hay datos
  // de la API que mostrar, solo el punto de estado; el mensaje bajo la
  // tarjeta aclara el origen de los nombres del selector.
  // En estos estados jamás se renderiza un nombre de negocio como si
  // viniera de la API.
  if (conexion === "sin-negocios" || conexion === "sin-conexion") {
    return <EstadoConexion estado={conexion} />;
  }

  return (
    <>
      {idSeleccionado !== null && detalle === null && (
        <p className="font-ui text-[14px] text-text-secondary">
          Consultando la encuesta del negocio…
        </p>
      )}

      {detalle !== null && detalle.estado === "ok" && (
        <>
          <p className="truncate font-ui text-[15px] font-semibold text-text-primary">
            {detalle.encuesta.nombre_negocio}
          </p>
          <p className="mt-0.5 truncate font-ui text-[13px] text-text-secondary">
            {detalle.encuesta.rubro}
          </p>
        </>
      )}

      {detalle !== null && detalle.estado === "no-encontrada" && (
        <p className="font-ui text-[14px] text-text-secondary">
          Este negocio todavía no tiene encuesta.
        </p>
      )}

      {detalle !== null && detalle.estado === "no-disponible" && (
        <p className="font-ui text-[14px] text-text-secondary">
          No se pudo conectar con el servicio. Prueba de nuevo en un momento.
        </p>
      )}

      {detalle !== null && detalle.estado === "error" && (
        <p className="font-ui text-[14px] text-text-secondary">
          No se pudo leer la respuesta del servicio.
        </p>
      )}

      <EstadoConexion estado={conexion} />
    </>
  );
}

/* ── Punto de estado de la conexión (neutro, decorativo) ─────────────────── */

function EstadoConexion({ estado }: { estado: Exclude<EstadoConexion, null> }) {
  const texto =
    estado === "conectado"
      ? "Conectado"
      : estado === "sin-conexion"
        ? "Sin conexión"
        : "Sin negocios";
  return (
    <p className="mt-1 flex items-center gap-2 font-ui text-[13px] text-text-secondary md:mt-0.5 md:justify-end">
      <span
        aria-hidden="true"
        className="inline-block h-[8px] w-[8px] shrink-0 rounded-full bg-border-mid"
      />
      {texto}
    </p>
  );
}
