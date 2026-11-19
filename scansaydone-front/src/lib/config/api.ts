/**
 * Configuración de la API del producto.
 * Regla de la carpeta: `process.env` solo vive en `src/lib/config`.
 * `baseUrl` vacío = ruta relativa (`/api/v1/...`), que el rewrite de Vercel
 * dirige al backend. Con `NEXT_PUBLIC_API_BASE_URL` se puede apuntar a otro
 * origen durante desarrollo local.
 */
export interface ApiConfig {
  baseUrl: string;
}

export const apiConfig: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
};
