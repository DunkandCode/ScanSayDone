This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Servidores dev/prueba y puertos

| Comando | Qué hace | Puerto |
|---|---|---|
| `npm run dev` | Servidor manual de desarrollo (tu terminal) | `localhost:3000` |
| `npm run servers:list` | **Solo lectura**: lista procesos/servidores de este proyecto, puertos, PIDs, URLs, filas TCP sin State (ocupación viva) y colgados sin listener | — |
| `npm run servers:stop` | Detiene **solo** árboles verificados de este proyecto (pide confirmación por árbol; admite `-WhatIf` —que **siempre prevalece sobre `-Yes`**— y `-Confirm:$false`). Exit `1` si queda algún verificado vivo | — |
| `dev-saydone.bat` (doble clic) | Menú/verbos que envuelven lo anterior: `start [puerto]`, `list`, `stop`, `stop-whatif`, `test`. `start` comprueba el puerto antes de arrancar y, si está ocupado, muestra el dueño exacto y **se niega a arrancar** (Next nunca deriva a 3001+ oculto); el puerto se valida inyección-segura y `stop` **no reenvía argumentos** (simulación → verbo `stop-whatif`) | `3000` por defecto |
| `npm run test:a11y` | `next build` + **un único** servidor de producción gestionado por Playwright + tests a11y; al terminar Playwright lo apaga | `127.0.0.1:3120` fijo |

Los tests a11y usan SIEMPRE `http://127.0.0.1:3120` (desktop y móvil comparten ese `baseURL`; ya no existe `A11Y_BASE_URL`). Si el 3120 está ocupado, `npm run test:a11y` falla al arrancar en vez de probar contra otro servidor: ejecuta `npm run servers:list` para ver quién lo usa y `npm run servers:stop` si es de este proyecto.

Detalle completo (seguridad, diagnóstico, diferencias dev vs Playwright): [`../docs/operaciones/DEV-SERVERS-2026-11-07.md`](../docs/operaciones/DEV-SERVERS-2026-11-07.md).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
