<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Anchor — Frontend ScanSayDone

> Leer completo al iniciar cualquier sesión en esta carpeta.
> Norma externa obligatoria: `docs/standards/MANUAL-HERRAMIENTAS-AGENTES.md` y
> `docs/standards/PROJECT-DOCTRINE-10-MANDAMIENTOS.md` del ecosistema OpenCode.
> Plan vigente: `docs/planning/PLAN-FRONTEND-2026-11-05.md`.

---

## 1. Qué es esta carpeta

Aplicación web del producto ScanSayDone: plataforma de encuestas de satisfacción por QR para
MiPymes, principalmente restaurantes, cafés y comercios pequeños.

Esta carpeta es **solo frontend**. El backend es FastAPI y lo mantiene otro equipo.

## 2. Stack permitido

| Elemento | Versión / valor |
|---|---|
| Framework | Next.js 16.4.3 (App Router) |
| React | 19.3.0 |
| Lenguaje | TypeScript 5, `strict` |
| Estilos | Tailwind CSS 4, configuración CSS-first con `@theme` |
| Fuentes | `next/font` con las tipografías de marca |

**Prohibido**: Bootstrap, Sass/SCSS, JavaScript sin tipos, librerías de gráficos, `alert()` para
comunicar estado, y cualquier dependencia que duplique lo que ya hace el framework.

## 3. Fuentes de verdad

| Dato | Fuente |
|---|---|
| Stack y versiones | `package.json`, `tsconfig.json`, `next.config.ts` |
| Producto y sprints | `../docs/sprints/`, `../docs/roles/`, `../docs/implementaciones/` |
| Diseño | `../docs/ux/` y el snapshot `ENTREGA-UX-2026-10-30/` (referencia histórica) |
| Marca | Logos reales aprobados; los mockups de IA no son asset ni copy |
| Copy | Solo textos aprobados. Sin cifras, precios, testimonios ni logos de clientes inventados |
| API | Contrato único definido por backend |

Si dos fuentes contradicen, se detiene la implementación y se resuelve por escrito. No se elige la
que convenga en el momento.

## 4. Orden de trabajo

```
F0 Base → L Landing → A Login → P Panel → I Internas → E Encuesta
```

Cada etapa se aprueba antes de la siguiente. La encuesta está bloqueada hasta que el equipo defina
el cuestionario y el contrato de envío.

## 5. Reglas de rama y sincronización

- Trabajo en `dev/nicolaslopezv`. `main` solo por Pull Request.
- Sincronizar con `git fetch origin` + `git merge origin/main`. Nunca al revés.
- Sin `rebase` sobre rama publicada. Sin `--force`. Sin `reset --hard`. Sin `clean`.
- Commits por path explícito, convencionales.
- Al cerrar un lote: push a la rama personal.

## 6. Reglas de contenido

- Español de Chile, tuteo, sin jerga técnica en la interfaz.
- Nada de datos inventados: cifras, precios, testimonios, logos, direcciones, correos.
- Ningún estado de éxito sin acción real. Si el envío no existe, se dice antes de los campos.
- Todo dato de demostración lleva banda `DEMO` visible.
- QR decorativo siempre declarado como ilustración; nunca simular que escanea.
- Sin fotos de personas que no hayan sido entregadas y autorizadas.

## 7. Gates obligatorios por lote

```
npm run build
npm run lint
npx tsc --noEmit
npm test
axe / Playwright en la vista tocada
captura de viewport
```

Un PASS sin salida de comandos no cuenta. Un lote sin evidencia no está terminado.

## 8. Trampas conocidas

| Trampa | Efecto | Regla |
|---|---|---|
| `#6366f1`, índigo o degradado púrpura | Aspecto genérico de plantilla | Prohibido por contrato de diseño |
| Colores o tamaños sueltos | Deriva visual | Todo valor sale de tokens |
| Animación sobre el pliegue | CLS y LCP degradados | Sin animación en hero |
| Imagen del hero con `lazy` | Retrasa el LCP | Carga prioritaria y dimensiones explícitas |
| `"use client"` en la página completa | Pierde render en servidor | Cliente solo en islas interactivas |
| `process.env` disperso | Fuga de configuración | Todo por `src/lib/config` |
| Estado de éxito simulado | Engaño al usuario | Prohibido; banda DEMO y mensaje honesto |
| `alert()` | Patrón no accesible | Mensajes en la interfaz |

## 9. Decisiones pendientes

| # | Decisión | Responsable |
|---|---|---|
| 1 | Dirección de color definitiva | Operador |
| 2 | Tres o cinco preguntas de la encuesta | PM / equipo |
| 3 | Contrato del endpoint de respuestas | Backend |
| 4 | Correo de contacto, razón social, RUT, jurisdicción, retención | Operador |
| 5 | Precios y planes | PM |

## 10. Deuda declarada

- Snapshot UX del 30 escrito para un stack anterior; requiere traducción a Tailwind.
- Snapshot incompleto respecto de su propio manifiesto; faltan originales de marca que viven en el
  bundle local.
- Sin tests en el repositorio al inicio del proyecto.
- CI sin lint ni typecheck al inicio del proyecto.
- Encuesta sin especificación aprobada.
