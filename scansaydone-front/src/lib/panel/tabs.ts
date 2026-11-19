/**
 * Módulos vivos del panel como pestañas de una sola página.
 *
 * La navegación lateral no inventa rutas: usa únicamente el hash de la
 * URL (`#resumen`, `#resultados`, `#encuesta`, `#resenas`). Este módulo
 * concentra la clave de cada pestaña y la lectura del hash para que la
 * página (con su `tablist`) y los enlaces de la barra lateral compartan
 * la misma fuente.
 */

export type PanelTabKey = "resumen" | "resultados" | "encuesta" | "resenas";

export interface PanelTab {
  key: PanelTabKey;
  label: string;
}

/** Pestañas vivas, en el orden de la navegación lateral. */
export const PANEL_TABS: readonly PanelTab[] = [
  { key: "resumen", label: "Resumen" },
  { key: "resultados", label: "Resultados" },
  { key: "encuesta", label: "Encuesta" },
  { key: "resenas", label: "Reseñas" },
];

const CLAVES = new Set<string>(PANEL_TABS.map((t) => t.key));

/**
 * Traduce el hash de la URL a una pestaña válida.
 * Cualquier hash desconocido (o vacío) cae a "resumen", la pestaña
 * por defecto.
 */
export function tabDesdeHash(hash: string): PanelTabKey {
  const limpia = hash.replace(/^#/, "").trim().toLowerCase();
  return CLAVES.has(limpia) ? (limpia as PanelTabKey) : "resumen";
}
