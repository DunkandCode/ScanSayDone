"use client";

/**
 * /panel — Pestañas con los módulos vivos del panel, dependientes de la
 * sesión iniciada en /entrar.
 *
 * - Al montar se lee la sesión (`ssd.sesion`): sin sesión se redirige a
 *   /entrar y se muestra solo un esqueleto, sin cifras.
 * - Todos los módulos usan el `empresa_id` de la sesión: ya no hay
 *   selector de negocio en el panel.
 * - Resumen (por defecto), Resultados, Encuesta y Reseñas son pestañas de
 *   una sola página (`role="tablist"` / `role="tab"` / `role="tabpanel"`,
 *   flechas del teclado, foco visible). No hay rutas nuevas: la URL solo
 *   usa hash.
 * - La barra lateral enlaza con `#resumen` / `#resultados` / `#encuesta` /
 *   `#resenas`; esta página escucha `hashchange` para sincronizar la
 *   pestaña activa.
 * - Cabecera con el nombre del negocio de la sesión y el botón
 *   «Cerrar sesión» (borra `ssd.sesion` y vuelve a /entrar).
 */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ResultadosNegocio } from "@/components/panel/resultados-negocio";
import { EncuestaDefinida } from "@/components/panel/encuesta-definida";
import { ResumenEmpresa } from "@/components/panel/resumen-global";
import { ResenasNegocio } from "@/components/panel/resenas-negocio";
import { cerrarSesion, leerSesion, CLAVE_SESION } from "@/lib/auth/sesion";
import type { SesionUsuario } from "@/lib/api/auth";
import { PANEL_TABS, tabDesdeHash, type PanelTabKey } from "@/lib/panel/tabs";

/** Esqueleto sin cifras mientras se verifica la sesión. */
function EsqueletoPanel() {
  return (
    <div role="status" aria-label="Verificando la sesión" className="contents">
      <div className="h-[44px] w-[420px] max-w-full rounded-[6px] border border-border-subtle bg-surface-elevated/60" />
      <div className="mt-6 h-[40px] w-[220px] rounded-[6px] bg-surface-elevated/60" />
      <div className="mt-4 grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[112px] rounded-[8px] border border-border-subtle bg-surface-elevated/60"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Snapshot de la sesión para useSyncExternalStore. JSON.parse devuelve un
 * objeto nuevo en cada llamada y React exige que getSnapshot devuelva la
 * misma referencia mientras el valor no cambie: se cachea por raw de
 * localStorage y solo se re-parsea si el raw cambió.
 */
let cacheSesion: { raw: string | null; valor: SesionUsuario | null } | null =
  null;

function snapshotSesion(): SesionUsuario | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CLAVE_SESION);
  if (cacheSesion === null || cacheSesion.raw !== raw) {
    cacheSesion = { raw, valor: leerSesion() };
  }
  return cacheSesion.valor;
}

/** La sesión solo puede cambiar desde otra pestaña (evento storage). */
function suscribirSesion(notificar: () => void) {
  window.addEventListener("storage", notificar);
  return () => window.removeEventListener("storage", notificar);
}

export default function PanelPage() {
  const router = useRouter();
  // Ref al router para que el efecto de sesión no dependa de la
  // identidad de useRouter (un mock que devuelva un literal nuevo la
  // cambia en cada render). Se sincroniza en un efecto: asignar refs
  // durante el render lo prohíbe react-hooks/refs.
  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  }, [router]);
  const [tab, setTab] = useState<PanelTabKey>("resumen");
  // null = sin sesión (esqueleto sin cifras + redirección a /entrar);
  // en el servidor siempre es null: nunca se pintan cifras en SSR.
  const sesion = useSyncExternalStore(
    suscribirSesion,
    snapshotSesion,
    () => null,
  );
  const botones = useRef<Record<string, HTMLButtonElement | null>>({});

  // Sesión al montar (exactamente una vez): sin sesión se vuelve a
  // /entrar (el esqueleto sigue montado hasta que la navegación despida
  // la página; nunca se pintan cifras de negocio en este estado).
  useEffect(() => {
    if (snapshotSesion() === null) {
      routerRef.current.replace("/entrar");
    }
  }, []);

  // Sincronía con el hash: carga inicial + clics en la navegación lateral.
  useEffect(() => {
    const aplicar = () => setTab(tabDesdeHash(window.location.hash));
    aplicar();
    window.addEventListener("hashchange", aplicar);
    return () => window.removeEventListener("hashchange", aplicar);
  }, []);

  function activar(key: PanelTabKey) {
    setTab(key);
    // Solo hash (no se inventan rutas). replaceState no agrega historial
    // ni dispara scroll.
    window.history.replaceState(null, "", `#${key}`);
  }

  function alCerrarSesion() {
    cerrarSesion();
    // replace: «atrás» no debe devolver a un panel sin sesión.
    router.replace("/entrar");
  }

  // Navegación por teclado del patrón de pestañas: flechas + Home/End,
  // activación automática al mover el foco.
  function alNavegarTeclado(evento: React.KeyboardEvent) {
    const indice = PANEL_TABS.findIndex((t) => t.key === tab);
    let siguiente = -1;
    if (evento.key === "ArrowRight") {
      siguiente = (indice + 1) % PANEL_TABS.length;
    } else if (evento.key === "ArrowLeft") {
      siguiente = (indice - 1 + PANEL_TABS.length) % PANEL_TABS.length;
    } else if (evento.key === "Home") {
      siguiente = 0;
    } else if (evento.key === "End") {
      siguiente = PANEL_TABS.length - 1;
    }
    if (siguiente < 0) return;
    evento.preventDefault();
    const clave = PANEL_TABS[siguiente].key;
    activar(clave);
    botones.current[clave]?.focus();
  }

  if (sesion === null) {
    return <EsqueletoPanel />;
  }

  return (
    <>
      {/* Cabecera de la sesión: negocio de la sesión + cerrar sesión. */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="min-w-0 truncate font-ui text-[15px] font-semibold text-text-primary">
          {sesion.nombre_negocio}
        </p>
        <button
          type="button"
          onClick={alCerrarSesion}
          className="flex h-[44px] items-center rounded-[6px] border border-border-mid bg-surface-default px-4 font-ui text-[14px] font-medium text-text-secondary hover:border-text-primary hover:text-text-primary focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
        >
          Cerrar sesión
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Secciones del panel"
        onKeyDown={alNavegarTeclado}
        className="flex flex-wrap gap-2"
      >
        {PANEL_TABS.map(({ key, label }) => {
          const activo = key === tab;
          return (
            <button
              key={key}
              ref={(el) => {
                botones.current[key] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${key}`}
              aria-selected={activo}
              aria-controls={`panel-${key}`}
              tabIndex={activo ? 0 : -1}
              onClick={() => activar(key)}
              className={`flex h-[44px] items-center rounded-[6px] border px-4 font-ui text-[14px] focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary ${
                activo
                  ? "border-border-mid bg-surface-elevated font-semibold text-text-primary"
                  : "border-border-subtle bg-surface-default text-text-secondary hover:border-border-mid hover:text-text-primary"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        tabIndex={-1}
        className="mt-6 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
      >
        {tab === "resumen" && <ResumenEmpresa empresaId={sesion.empresa_id} />}

        {tab === "resultados" && (
          <>
            <h1 className="font-display text-[32px] uppercase leading-none text-text-primary lg:text-[40px]">
              Resultados
            </h1>
            <ResultadosNegocio empresaId={sesion.empresa_id} />
          </>
        )}

        {tab === "encuesta" && (
          <>
            <h1 className="font-display text-[32px] uppercase leading-none text-text-primary lg:text-[40px]">
              Encuesta
            </h1>
            <EncuestaDefinida empresaId={sesion.empresa_id} />
          </>
        )}

        {tab === "resenas" && (
          <>
            <h1 className="font-display text-[32px] uppercase leading-none text-text-primary lg:text-[40px]">
              Reseñas
            </h1>
            <ResenasNegocio empresaId={sesion.empresa_id} />
          </>
        )}
      </div>
    </>
  );
}
