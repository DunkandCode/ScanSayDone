/**
 * Resumen del panel: solo datos reales de la instantánea local
 * (`src/data/local-snapshot.json`, 4 negocios y 60 respuestas).
 *
 * - Cuatro cifras generales + distribución 0–10 + comparación entre
 *   negocios + tabla por negocio, todo calculado con `resumenEmpresa`
 *   (sin duplicar cálculos).
 * - Etiqueta obligatoria siempre visible mientras haya datos: origen de
 *   prueba local, fecha de la instantánea y advertencia de que no son
 *   clientes reales.
 * - Instantánea inválida: se muestra "No hay datos locales disponibles."
 *   y no se fabrica ningún número.
 */
import { formatear1, resumenEmpresa } from "@/lib/panel/calculos";
import {
  empresasDeInstantanea,
  fechaInstantanea,
  instantanea,
  respuestasDeEmpresa,
} from "@/lib/panel/instantanea";

export function ResumenLocal() {
  const fecha = fechaInstantanea();
  const hayDatos = instantanea.valida && fecha !== null;

  if (!hayDatos) {
    return (
      <>
        <h1 className="font-display text-[32px] uppercase leading-none text-text-primary lg:text-[40px]">
          Resumen
        </h1>
        <p className="mt-4 font-ui text-[14px] text-text-secondary">
          No hay datos locales disponibles.
        </p>
      </>
    );
  }

  const general = resumenEmpresa(instantanea.respuestas);
  const filas = empresasDeInstantanea().map((empresa) => ({
    empresa,
    resumen: resumenEmpresa(respuestasDeEmpresa(empresa.empresa_id)),
  }));

  return (
    <>
      <h1 className="font-display text-[32px] uppercase leading-none text-text-primary lg:text-[40px]">
        Resumen
      </h1>

      {/* Etiqueta obligatoria: origen de los datos, siempre visible. */}
      <p className="mt-2 font-ui text-[13px] text-text-secondary">
        Datos de prueba locales · instantánea del {fecha} · no son clientes
        reales
      </p>

      {/* Cuatro cifras generales */}
      <div className="mt-4 grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
        <Cifra
          label="Respuestas"
          value={String(general.total)}
          detail="en la instantánea local"
        />
        <Cifra
          label="Media general"
          value={general.mediaP1 === null ? "—" : formatear1(general.mediaP1)}
          detail="nota 1, de la 0 a la 10"
        />
        <Cifra
          label="Empresas"
          value={String(filas.length)}
          detail="en la instantánea local"
        />
        <Cifra
          label="Recomendación neta general"
          value={general.nps === null ? "—" : formatear1(general.nps)}
          detail="va de -100 a 100"
        />
      </div>

      {/* Gráficos: distribución + comparación entre negocios */}
      <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 lg:flex-[2]">
          <TituloSeccion id="resumen-distribucion">
            Distribución de las notas
          </TituloSeccion>
          <DistribucionNotas distribucion={general.distribucion} />
        </div>
        <div className="min-w-0 flex-1 lg:flex-[1]">
          <TituloSeccion id="resumen-comparacion">
            Comparación entre negocios
          </TituloSeccion>
          <ComparacionNegocios filas={filas} />
        </div>
      </div>

      {/* Tabla por negocio (orden fijo por id, sin ordenamiento) */}
      <section aria-labelledby="resumen-tabla" className="mt-6 lg:mt-8">
        <TituloSeccion id="resumen-tabla">Resumen por negocio</TituloSeccion>
        <TablaNegocios filas={filas} />
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

/* ── Gráfico A: distribución 0–10 con conteos reales ──────────────────────── */

/** Mismos tonos por rango que el resto del panel: 0-6 / 7-8 / 9-10. */
function tonoNota(nota: number): string {
  if (nota <= 6) return "#8A6F55";
  if (nota <= 8) return "color-mix(in srgb, #1A181B 20%, #8A6F55)";
  return "color-mix(in srgb, #1A181B 40%, #8A6F55)";
}

function DistribucionNotas({ distribucion }: { distribucion: readonly number[] }) {
  const max = Math.max(...distribucion, 1);
  return (
    <div className="mt-3 rounded-[8px] border border-border-subtle bg-surface-default p-4 xs:p-5">
      <ul
        className="flex flex-col gap-1.5"
        aria-label="Cantidad de respuestas por nota, de la 0 a la 10"
      >
        {distribucion.map((count, nota) => (
          <li key={nota} className="flex items-center gap-3">
            <span className="w-6 shrink-0 text-right font-ui text-[13px] tabular-nums text-text-secondary">
              {nota}
            </span>
            <div className="h-[18px] min-w-0 flex-1" aria-hidden="true">
              <div
                className="h-full rounded-[2px]"
                style={{
                  width: `${(count / max) * 100}%`,
                  background: tonoNota(nota),
                }}
              />
            </div>
            <span className="w-10 shrink-0 text-right font-ui text-[12px] tabular-nums text-text-secondary">
              {count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Gráfico B: recomendación neta por negocio (barras horizontales) ──────── */

interface FilaNegocio {
  empresa: {
    empresa_id: number;
    nombre_negocio: string;
    rubro: string;
  };
  resumen: ReturnType<typeof resumenEmpresa>;
}

function ComparacionNegocios({ filas }: { filas: readonly FilaNegocio[] }) {
  // Escala común: el mayor valor absoluto ocupa la mitad completa de su
  // lado. Sin datos no hay barra (0 disfrazado nunca).
  const maxAbs = Math.max(
    ...filas.map((f) => (f.resumen.nps === null ? 0 : Math.abs(f.resumen.nps))),
    1,
  );

  return (
    <div className="mt-3 rounded-[8px] border border-border-subtle bg-surface-default p-4 xs:p-5">
      <ul
        className="flex flex-col gap-4"
        aria-label="Recomendación neta de cada negocio"
      >
        {filas.map(({ empresa, resumen }) => {
          const nps = resumen.nps;
          const ancho = nps === null ? 0 : (Math.abs(nps) / maxAbs) * 50;
          return (
            <li key={empresa.empresa_id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate font-ui text-[13px] font-semibold text-text-primary">
                  {empresa.nombre_negocio}
                </span>
                <span className="shrink-0 font-ui text-[13px] tabular-nums text-text-secondary">
                  {nps === null ? "—" : formatear1(nps)}
                </span>
              </div>
              <div
                className="relative mt-1.5 h-[12px]"
                aria-hidden="true"
              >
                {/* Eje central: promotores % − detractores % = 0 */}
                <span className="absolute inset-y-0 left-1/2 w-px bg-border-subtle" />
                {nps !== null && nps !== 0 && (
                  <span
                    className="absolute inset-y-0 rounded-[2px] bg-border-mid"
                    style={
                      nps > 0
                        ? { left: "50%", width: `${ancho}%` }
                        : { right: "50%", width: `${ancho}%` }
                    }
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 font-ui text-[12px] text-text-secondary">
        Barra hacia la derecha: recomendación neta positiva. Hacia la
        izquierda: negativa.
      </p>
    </div>
  );
}

/* ── Tabla por negocio: apilada en móvil (375), tabla real desde md ───────── */

function TablaNegocios({ filas }: { filas: readonly FilaNegocio[] }) {
  return (
    <div className="mt-3 rounded-[8px] border border-border-subtle bg-surface-default p-2 md:p-4">
      <table className="w-full border-collapse font-ui text-[14px] text-text-primary">
        <caption className="sr-only">
          Resumen por negocio: respuestas, media, promotores, detractores y
          recomendación neta
        </caption>
        <thead className="hidden md:table-header-group">
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
          {filas.map(({ empresa, resumen }) => (
            <tr
              key={empresa.empresa_id}
              className="block border-b border-border-subtle last:border-b-0 md:table-row md:border-b"
            >
              <th
                scope="row"
                className="block px-3 pb-1 pt-3 text-left font-semibold text-text-primary md:table-cell md:px-3 md:py-2 md:font-medium"
              >
                {empresa.nombre_negocio}
              </th>
              <Celda etiqueta="Rubro">{empresa.rubro}</Celda>
              <Celda etiqueta="Respuestas" numerica>
                {String(resumen.total)}
              </Celda>
              <Celda etiqueta="Media" numerica>
                {resumen.mediaP1 === null ? "—" : formatear1(resumen.mediaP1)}
              </Celda>
              <Celda etiqueta="Promotores" numerica>
                {String(resumen.promotores)}
              </Celda>
              <Celda etiqueta="Detractores" numerica>
                {String(resumen.detractores)}
              </Celda>
              <Celda etiqueta="Recomendación neta" numerica>
                {resumen.nps === null ? "—" : formatear1(resumen.nps)}
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
      className={`block px-3 pb-1 pt-0.5 text-text-primary md:table-cell md:px-3 md:py-2 ${
        numerica ? "tabular-nums md:text-right" : ""
      }`}
    >
      {/* En móvil cada celda se apila con su etiqueta visible. */}
      <span className="mr-2 text-text-secondary md:hidden">{etiqueta}:</span>
      {children}
    </td>
  );
}
