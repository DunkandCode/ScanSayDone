"use client";

/**
 * /panel — Pestañas con los módulos vivos del panel.
 *
 * - Resumen (por defecto), Resultados, Encuesta y Reseñas son pestañas de
 *   una sola página (`role="tablist"` / `role="tab"` / `role="tabpanel"`,
 *   flechas del teclado, foco visible). No hay rutas nuevas: la URL solo
 *   usa hash.
 * - La barra lateral enlaza con `#resumen` / `#resultados` / `#encuesta` /
 *   `#resenas`; esta página escucha `hashchange` para sincronizar la
 *   pestaña activa.
 * - Todos los números visibles salen de la instantánea local
 *   (`src/data/local-snapshot.json`) o de la API de encuestas. Nada del
 *   dataset anterior se importa aquí.
 */
import { useEffect, useRef, useState } from "react";
import { NegocioSelector } from "@/components/panel/negocio-selector";
import { ResultadosNegocio } from "@/components/panel/resultados-negocio";
import { EncuestaDefinida } from "@/components/panel/encuesta-definida";
import { ResumenLocal } from "@/components/panel/resumen-local";
import { ResenasNegocio } from "@/components/panel/resenas-negocio";
import { PANEL_TABS, tabDesdeHash, type PanelTabKey } from "@/lib/panel/tabs";

export default function PanelPage() {
  const [tab, setTab] = useState<PanelTabKey>("resumen");
  // Id del negocio elegido en el selector de cada pestaña (null hasta que
  // el selector resuelve su primer valor).
  const [negocioResultados, setNegocioResultados] = useState<number | null>(null);
  const [negocioEncuesta, setNegocioEncuesta] = useState<number | null>(null);
  const [negocioResenas, setNegocioResenas] = useState<number | null>(null);
  const botones = useRef<Record<string, HTMLButtonElement | null>>({});

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

  return (
    <>
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
        {tab === "resumen" && <ResumenLocal />}

        {tab === "resultados" && (
          <>
            <h1 className="font-display text-[32px] uppercase leading-none text-text-primary lg:text-[40px]">
              Resultados
            </h1>
            <NegocioSelector onSeleccion={setNegocioResultados} />
            <ResultadosNegocio empresaId={negocioResultados} />
          </>
        )}

        {tab === "encuesta" && (
          <>
            <h1 className="font-display text-[32px] uppercase leading-none text-text-primary lg:text-[40px]">
              Encuesta
            </h1>
            <NegocioSelector onSeleccion={setNegocioEncuesta} />
            <EncuestaDefinida empresaId={negocioEncuesta} />
          </>
        )}

        {tab === "resenas" && (
          <>
            <h1 className="font-display text-[32px] uppercase leading-none text-text-primary lg:text-[40px]">
              Reseñas
            </h1>
            <NegocioSelector onSeleccion={setNegocioResenas} />
            <ResenasNegocio empresaId={negocioResenas} />
          </>
        )}
      </div>
    </>
  );
}
