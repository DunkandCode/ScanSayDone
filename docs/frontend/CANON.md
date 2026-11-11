# CANON — Proyecto frontend ScanSayDone

> Documento canónico. Si algo contradice este archivo, manda este archivo hasta que se escriba
> una decisión nueva con fecha.
> Última actualización: 2026-11-05.

---

## 1. Qué es

Frontend de ScanSayDone: plataforma de encuestas de satisfacción por QR para MiPymes,
principalmente restaurantes, cafés y comercios pequeños.

Monorepo del equipo:
- `scansaydone-front/` — esta aplicación.
- `scansaydone-back/` — FastAPI, otro equipo. **No se toca.**
- `docs/` — documentación del equipo.

## 2. Stack, cerrado

Next.js 16.4.3 · React 19.3 · TypeScript 5 · Tailwind CSS 4 (CSS-first `@theme`).
Prohibido: Bootstrap, Sass, JavaScript sin tipos, librerías de gráficos, jQuery.

## 3. Orden de construcción

```
F0 Base → Landing → Login → Panel → Internas → Encuesta → Integración backend
```

- **Solo frontend.** Sin llamadas a API hasta la última etapa. Datos de demostración aislados.
- Landing primero, sección por sección, con gate en cada una.

## 4. Paleta, aprobada

| Rol | HEX | Uso |
|---|---|---|
| `interactive-primary` | `#FC5A41` | Acción principal y estado activo |
| `surface-default` | `#FFFFFF` | Tarjeta principal |
| `surface-elevated` | `#F0D8BD` | Tarjeta secundaria y etiqueta DEMO |
| `background-page` | `#F7E5C8` | Fondo general |
| `text-primary` | `#1A181B` | Texto, títulos y bordes |
| `text-secondary` | `#5A5555` | Texto secundario |

Reglas medidas:
- Etiqueta del botón siempre `#1A181B`. Nunca blanca: blanco sobre coral mide 3.14.
- Coral nunca como texto sobre superficie clara: 2.55 sobre crema.
- Las tarjetas se separan con borde, no con sombra difusa.
- Elevación por color y borde, no por sombra.
- Estados nunca solo por color: van con texto o icono.

Roles derivados pendientes de firma en `decisiones/DECISIONES-2026-11-05.md`.

## 5. Tipografía

Bebas Neue para títulos, Montserrat para interfaz, ambas con `next/font`, subset latino.
Bebas nunca en cuerpo, botones ni tablas.

## 6. Imágenes y assets

Orden de preferencia:

1. **Foto real** del producto o del local, ya existente y autorizada.
2. **Ilustración propia** generada o dibujada, declarada como ilustración.
3. ~~Decoración abstracta generada~~ — **rechazada**: es el patrón genérico que buscamos evitar.

Reglas:
- Prohibido inventar prueba social: testimonios, logos de clientes, cifras, premios.
- Prohibido QR que parezca escaneable si no lo es. Si es decorativo, se declara.
- Prohibido usar fotos de personas no entregadas y autorizadas.
- Toda captura del panel en el sitio público lleva banda `DEMO`.

Estado de las referencias generadas el 2026-11-05:
- `canales` — **aceptada como ilustración**, con dos correcciones: QR declarado decorativo y la
  tablet muestra 1–5, no la escala 0–10.
- `hero` — **rechazada**. Bucles abstractos sobre crema: decoración genérica sin información.

## 7. Reglas de contenido

Español de Chile, tuteo. Sin jerga: nada de KPI, CSAT, NPS, score, dashboard, insights,
"tiempo real", "en construcción", "próximamente" en texto visible.

Ningún estado de éxito sin acción real. Si el envío no existe, se dice antes de los campos.

## 8. Documentación

| Zona | Ruta | Estado |
|---|---|---|
| Canónica | `docs/frontend/` | Vigente, se edita con fecha nueva |
| Planificación | `docs/planning/` | Vigente |
| Snapshot histórico | `scansaydone-front/ENTREGA-UX-2026-10-30/` | Congelado, **nunca se edita** |

Convención: `<AREA>-<AAAA-MM-DD>.md`. Sin `-v2`, `-final`, `-nuevo`.

## 9. Gates

```
npm run build
npm run lint
npx tsc --noEmit
npm test
axe / Playwright en la vista tocada
captura de viewport
```

Sin salida de comandos no hay PASS. Sin captura no hay revisión visual.

## 10. Agentes

| Etapa | Agente |
|---|---|
| Arquitectura y límites | `architect-alibaba` |
| Implementación | `frontend-alibaba` |
| Diseño, assets, contraste | `designer-alibaba` |
| CI y repositorio | `gitops-alibaba` |
| Revisión final | `reviewer-alibaba` |

Todos siguen el manual del ecosistema: un dominio por delegación, rutas de escritura disjuntas,
evidencia en cada entrega.

## 11. Pendientes que bloquean

| # | Pendiente | Owner |
|---|---|---|
| 1 | Doce roles de color derivados | Operador |
| 2 | Tipografías confirmadas | Operador |
| 3 | Cinco preguntas de la encuesta | PM |
| 4 | Panel con barra lateral | Operador |
| 5 | Correo, razón social, RUT, jurisdicción, retención | Operador |
| 6 | Endpoint de respuestas | Backend |
