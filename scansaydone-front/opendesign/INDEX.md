# INDEX — orden documental de diseño · Scan-Say-Done

> 2026-10-27 · sincronizado 2026-10-29 con el estado real de `opendesign/`. Toda decisión de diseño se busca en el documento que manda en su tema; ningún archivo nuevo re-inventa tokens ni layouts sin registrarse aquí.

## Quién manda en cada tema

| tema | documento | alcance |
|---|---|---|
| Tokens, color, tipografía, superficies por zona, estados de componente, prohibiciones | `DESIGN-CONTRACT.md` | fuente única de hex/tokens y de los 6 estados |
| Grid y layout del **sitio de marketing** | `UX-LANDING.md` | especificación de la landing (no del producto); no re-definitione ningún hex |
| Grid y layout del **panel** | `DASHBOARD-UX.md` | shell (sidebar 264 · C 1128 · col 72 · móvil 358/15.17), vistas, responsive, estados |
| Lo **aún no decidido** del panel (respuestas crudas, cuarta vista, gates) | `DASHBOARD-DECISIONES.md` | **manda la decisión sobre la spec cuando choquen**; lo cerrado migra a DASHBOARD-UX |
| Estado de cada imagen (mockups + planos) | `AUDITORIA-IMAGENES.md` | veredicto por archivo: ALINEADA / CORREGIR / REGENERAR + acción concreta |
| Planos métricos (fuente de verdad de medidas) | `wireframes/*.svg` + `wireframes/INDEX.md` | landing: `GRID-SPEC.md`; panel: `DASHBOARD-UX.md` §1. Los ASCII de UX-LANDING §3 son el plan conceptual; el SVG manda en números |
| Mockups de alta fidelidad | `mockups/` + `mockups/INDEX.md` | **referencia visual únicamente: nunca fuente de medidas ni de copy** |
| Assets de marca: variantes de logo, SVG, favicons, OG, QR impreso | `ASSET-PIPELINE.md` | matriz de variantes, tamaños, checklist a11y de assets |
| Lámina de identidad | `brand-src/referencias.png` → lectura en `referencias/ANALISIS-REFERENCIAS.md` | activo derivado de presentación: confirma variantes y reglas, **no re-linea tokens** |
| Reutilización panel↔landing y gates UX (encuesta/panel/piloto) | `docs/PLAN-SCAN-SAY-DONE.md` §5–§6 | no se duplica aquí |
| Route groups y hojas de estilo por zona | `docs/ARQUITECTURA-SCAN-SAY-DONE.md` §1 | `(marketing)` / `(panel)` / `(public)` |
| Orden de construcción del frontend | `BUILD-ORDER.md` | secuencia de fases y bloqueos |
| Gradientes, efectos, sombras, movimiento, presupuesto de rendimiento y `prefers-reduced-motion` del landing | `EFECTOS-Y-MOTION.md` | manda sobre la política de efectos; sus tokens nuevos (`--grad-*`, `--shadow-card*`, `--dur-*`) son **enmienda propuesta al contrato** — aterrizan en `_tokens.scss` en F0 y hasta entonces ningún otro documento fija gradientes sueltos (regla 1) |
| Precondiciones y gates de arranque de la construcción (F0–F8) | `PLAN-EJECUCION-LANDING.md` | operacionaliza `BUILD-ORDER.md` con la numeración del operador; no redefine cotas (mandan los SVG) ni criterios de estados (manda el contrato §5) |
| **Copy publicable de la landing** (cadenas, reglas de promesa, lista §13 de aprobación) | `COPY-LANDING.md` | toda cadena visible nace aquí (no en el código ni en una lámina); §12 fija lo que NO se dice; gates D/F de `RIESGOS-USUARIO.md` |
| **Copy de las 8 rutas internas** + cadenas canónicas compartidas con la home | `COPY-INTERNAS.md` | §1 tabla de coherencia manda sobre la duplicación de cadenas; §2 lista los `[confirmar]` que bloquean publicación |
| Evaluación de marketing de lo construido (F0–F8) y mejoras de mayor impacto | `ANALISIS-MARKETING.md` | diagnóstico con criterio #/arreglo concreto; §3 es P0 intocable (cero prueba social inventada, cero promesa sin respaldo); no fija tokens |
| Dirección visual F8.5: qué se adoptó/rechazó de `featuresMD/redesign.png` | `UPGRADE-VISUAL-F8.5.md` | veredicto por elemento y plan B1–B5; es documento de **época**: lo ejecutado y lo luego revertido (solape B4, `32b4a86`) está mejor descrito en el contrato §2 y en `REVISION-UX.md` §6 |
| **Lectura única del sistema + correcciones priorizadas** (bienvenida del responsable de UX) | `REVISION-UX.md` | onboarding y deuda viva (§6 P0/P1/P2); no manda sobre los documentos fuente — sus medidas están fechadas 2026-10-29 |
| **Registro visual del sitio** (capturas) | `capturas/<fecha>/` + `capturas/2026-10-29/README.md` | evidencia para regresión y revisión UX; **no es fuente de medidas** (mandan los planos SVG); cada set vive atado a su build |

> **Las actas `VERIFICACION-F*.md` (F0-F1…F9) y `DECISIONES-2026-10-27.md` son registro histórico, no norma:** documentan qué se verificó, qué defecto apareció y qué desvío se aceptó en cada fase. Cuando una decisión posterior cambió lo actado (ej.: el solape del hero F8.5, revertido en `32b4a86`), gana la norma vigente (`DESIGN-CONTRACT.md` / `UX-LANDING.md`) y el acta queda como evidencia de la evolución. Se citan, no se obedecen.

## Regla de precedencia cuando dos documentos chocan

1. **Tokens / color / tipografía / estados** → gana `DESIGN-CONTRACT.md` sobre cualquier otro `opendesign/*` o código.
2. **Layout del landing** → gana `UX-LANDING.md`, citando tokens del contrato; un valor que el contrato no tiene se propone como enmienda, no se fija en su propio texto.
3. **Layout del panel** → gana `DASHBOARD-UX.md`; **si lo que toca ya está en `DASHBOARD-DECISIONES.md` (decisión abierta o propuesta), manda la decisión sobre la spec** hasta que el operador la cierre y migre la regla a DASHBOARD-UX.
4. **Medidas** → ganan los planos SVG (`wireframes/*`): `GRID-SPEC.md` para el landing, `DASHBOARD-UX.md` §1 para el panel. **Los mockups nunca son fuente de medidas ni de copy** (GRID-SPEC §5).
5. **Assets** → gana `ASSET-PIPELINE.md`; si un layout pide un asset inexistente (ej. logo claro), es bloqueante del asset, no excusa para deformar otro. La lámina `referencias.png` documenta, no fija tokens.
6. **Estado de una imagen** → gana `AUDITORIA-IMAGENES.md` sobre el registro de `mockups/INDEX.md` si difieren (la auditoría es el pase más reciente).
7. **Choque entre dos documentos vigentes** (caso vivo: `DASHBOARD-DECISIONES.md` vs `DASHBOARD-UX.md` en el layout del panel → manda la decisión, regla 3) → provisionalmente gana el documento con mandato sobre ese tema (reglas 1–6); lo cierra el operador por escrito y el documento perdedor se corrige en la misma sesión. (H-1, el choque del footer, quedó resuelto por el operador el 27-oct — acta `DECISIONES-2026-10-27.md` §4.)
8. **Código vs documento** → gana el documento; el frontend no "arregla" el spec escribiendo otro valor. La desviación se registra como deuda con nombre y fecha.
9. Contrastes: solo valen cifras calculadas con la fórmula WCAG (las del contrato/UX-LANDING/DASHBOARD-UX están recalculadas); se prohíbe "se ve bien".

## Cómo se agrega un documento nuevo

Fila en la tabla de arriba (tema + qué define) + regla de precedencia aplicable + sin copiar tokens. Si nadie manda en ese tema todavía, se declara aquí antes de crear el archivo.

---

## Mapa físico: dónde está cada cosa (29-oct-2026, `796c10f`)

**Código** — `E:\Trabajos\scan\src\app\`

| Qué | Dónde |
|---|---|
| Landing completa (8 bandas + footer) | `page.js` |
| Configuración única del sitio (flags, planes, contacto, features) | `data/site.js` |
| Preguntas del FAQ (fuente única de `/` y `/faqs`) | `data/faq-product.js` |
| Helper de contacto (`mailto` si hay correo; si no, aviso honesto) | `lib/contact.js` |
| Cabecera de las 8 rutas internas | `components/page-hero/page-hero.jsx` |
| Navbar / footer | `components/navbar/navlight.jsx` · `components/footer.jsx` |
| Tokens (color, espaciado, bandas, glow, reduced-motion) | `assets/scss/_tokens.scss` |
| Marcas crudas (hex, sin uso directo en componentes) | `assets/scss/_brand-vars.scss` |
| Estilos del landing | `assets/scss/_home.scss` |
| Estilos de la cabecera interna | `assets/scss/_page-hero.scss` |
| Bootstrap recompilado desde Sass | `assets/scss/bootstrap.scss` + `_bootstrap-custom.scss` |
| Rutas internas | `aboutus/`, `services/`, `service-detail/`, `contactus/`, `terms/`, `privacy/`, `faqs/`, `pricing/` |

**Documentación de diseño** — `E:\Trabajos\scan\opendesign\`

| Qué necesitas | Documento |
|---|---|
| Entender el diseño de una sola lectura | **`REVISION-UX.md`** (empieza aquí si eres el responsable de UX) |
| Saber qué documento manda en cada tema | `INDEX.md` (este archivo) |
| Color, tipografía, estados, prohibiciones | `DESIGN-CONTRACT.md` |
| Retícula y recorrido del landing | `UX-LANDING.md` |
| Gradientes, sombras, movimiento, `prefers-reduced-motion` | `EFECTOS-Y-MOTION.md` |
| Medidas canónicas (planos) | `wireframes/GRID-SPEC.md` + `wireframes/*.svg` + `wireframes/INDEX.md` |
| Copy aprobado de la landing | `COPY-LANDING.md` |
| Copy de las 8 rutas internas + datos bloqueantes | `COPY-INTERNAS.md` |
| Diagnóstico de marketing y prioridades | `ANALISIS-MARKETING.md` |
| Qué se adoptó y qué se rechazó del rediseño propuesto | `UPGRADE-VISUAL-F8.5.md` |
| Panel del producto (spec de lo que aún no existe) | `DASHBOARD-UX.md` + `DASHBOARD-DECISIONES.md` |
| Historial de verificación por fase | `VERIFICACION-F0-F1.md` … `VERIFICACION-F9.md` |

**Evidencia visual** — `E:\Trabajos\scan\opendesign\capturas\2026-10-29\`

19 capturas PNG (1,7 MB) atadas al build `796c10f`, con su índice y el comando para regenerarlas en `README.md` de esa carpeta. Regla: **una captura vieja no sirve si el build cambió** — se regenera, no se reutiliza.

**Cómo se valida el sitio** (los cuatro comandos que importan):

```
npm run build                     # debe salir exit 0
node scripts/check-tokens.mjs     # "OK: tokens emitidos correctamente"
node scripts/check-placeholders.mjs  # "OK: 0 placeholders"
npx next start -p <puerto>        # una sola instancia: no mezclar con npm run dev
```

> No ejecutar `npm run dev` y `npm run build` a la vez: comparten `.next` y tumban el servidor (pasó en esta sesión con `routesManifest.dataRoutes is not iterable`). Si un servidor queda sirviendo un build viejo, **reiniciarlo** — un `next start` ya arrancado no recoge el build nuevo.
