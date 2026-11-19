"use client";

/**
 * Enlaces de navegación del panel (barra lateral ≥993 px y fila superior
 * ≤992 px).
 *
 * - Los módulos vivos (Resumen, Resultados, Encuesta, Reseñas) son anclas
 *   de hash: la página escucha `hashchange` y cambia de pestaña. No hay
 *   rutas nuevas.
 * - El ítem activo sigue el hash en cliente; en el servidor siempre se
 *   pinta "Resumen" (la pestaña por defecto) y el efecto corrige al montar.
 * - Códigos QR y Ajustes quedan visibles pero deshabilitados
 * (`role="link"`, `aria-disabled`, sin `href`), igual que antes.
 */
import { useEffect, useState } from "react";
import { PANEL_TABS, tabDesdeHash, type PanelTabKey } from "@/lib/panel/tabs";

type Variante = "sidebar" | "topbar";

interface ItemNav {
  key: string;
  label: string;
  vivo: boolean;
}

/** Módulos vivos + módulos deshabilitados, en el orden de la navegación. */
const ITEMS: readonly ItemNav[] = [
  ...PANEL_TABS.map((t) => ({ key: t.key, label: t.label, vivo: true })),
  { key: "qr", label: "Códigos QR", vivo: false },
  { key: "ajustes", label: "Ajustes", vivo: false },
];

export function PanelNavLinks({ variante }: { variante: Variante }) {
  const [tab, setTab] = useState<PanelTabKey>("resumen");

  useEffect(() => {
    const aplicar = () => setTab(tabDesdeHash(window.location.hash));
    aplicar();
    window.addEventListener("hashchange", aplicar);
    return () => window.removeEventListener("hashchange", aplicar);
  }, []);

  const base =
    variante === "sidebar"
      ? "flex h-[44px] items-center rounded-[6px] px-3 font-ui text-[14px] font-medium focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
      : "flex h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-[6px] px-3 font-ui text-[14px] font-medium focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary";

  return (
    <>
      {ITEMS.map((item) => {
        if (!item.vivo) {
          return (
            <span
              key={item.key}
              role="link"
              aria-disabled="true"
              title="Todavía no disponible"
              className={`${base} cursor-not-allowed text-text-secondary`}
            >
              {item.label}
            </span>
          );
        }

        const activo = item.key === tab;
        return (
          <a
            key={item.key}
            href={`#${item.key}`}
            aria-current={activo ? "page" : undefined}
            className={`${base} border-l-[3px] transition-colors ${
              activo
                ? "border-border-mid bg-surface-elevated font-semibold text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {item.label}
          </a>
        );
      })}
    </>
  );
}
