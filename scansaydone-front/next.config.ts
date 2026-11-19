import type { NextConfig } from "next";

/**
 * Proxy de la API SOLO en desarrollo.
 *
 * En `next dev` no existe el rewrite de Vercel: `/api/*` y `/health` los
 * serviría Next con 404. Este `rewrites()` los deriva al backend local.
 *
 * - Se activa únicamente con `NODE_ENV=development`; en producción la clave
 *   no existe y el enrutado sigue en manos de `vercel.json`.
 * - `API_PROXY_TARGET` es una URL de un servicio propio (no un secreto);
 *   por defecto apunta al backend local en el 8000.
 * - Cámbialo y reinicia `next dev` para que el nuevo destino surta efecto.
 */
const apiProxyTarget = process.env.API_PROXY_TARGET ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    agentUpgrade: "security",
  },
  // En producción (Vercel Services + rewrites) el endpoint `/_next/image`
  // devuelve 404, mientras que los archivos de `/img` se sirven bien de
  // forma directa: desactivamos el optimizador para que `next/image` emita
  // `<img src="/img/...">` sin pasar por `/_next/image`.
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  ...(process.env.NODE_ENV === "development"
    ? {
        async rewrites() {
          return [
            {
              source: "/api/:path*",
              destination: `${apiProxyTarget}/api/:path*`,
            },
            {
              source: "/health",
              destination: `${apiProxyTarget}/health`,
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
