# PLAN SCAN-SAY-DONE v2 — decisiones cerradas, correcciones y orden de trabajo

> Fecha: 27-oct-2026 · Cierre: 18-nov-2026 · Estado: **solo documentacion, nada ejecutado**.
> v2 incorpora la revision independiente (`reviewer-alibaba`, 20 hallazgos, veredicto COHERENTE CON FIXES) y la alineacion de `docs/ARQUITECTURA-SCAN-SAY-DONE.md` + `opendesign/*`.
> Respaldo versionado: commit `075f2fb` + tag `docs-baseline-2026-10-27`.

## 1. Decisiones cerradas

| # | Decision | Por que | Validado por |
|---|---|---|---|
| D1 | **Sin TypeScript** en el frontend existente | migrar 1.952 lineas JSX (+482 de JS) sin tests en 3 semanas no se paga | research + Go frontend |
| D2 | **Dashboard con el MISMO Bootstrap + Sass** del landing. Nada de Tailwind/shadcn | coste medido de migrar: 1.952 JSX + 3.299 SCSS (que ya incluye `_menu.scss` 972) + 193 `!important` | research + Go frontend |
| D3 | **Bootstrap compilado desde `bootstrap/scss` con `$theme-colors`** (no el CSS precompilado) | el tema nace en la fuente: se va el azul `#0d6efd` y los componentes Bootstrap heredan coral/ciruela. **Ojo:** compilar NO elimina los 193 `!important` — esos viven en los partials del template, no en Bootstrap | designer (contrato §2) |
| D4 | **Route groups `(marketing)` + `(panel)` + `(public)`, cada uno con su hoja**. Se mueven las **9 rutas** de marketing (8 `page.jsx` + `page.js` raiz); las URLs **no cambian** | en App Router el layout raiz **suma** CSS: sin grupos, panel y encuesta cargan las 3.299 lineas del landing. La encuesta se abre en un movil en 20-30 s: no puede esperar eso | revision independiente (hallazgo 1) + arquitectura §1 |
| D5 | **Iconografia unificada en `react-icons`**, fuera `@mdi/font` (**≈741 KB**: 338 KB CSS + 403 KB woff2 — dato del paquete, no medido en este repo) | 11 glifos MDI reales para 7.447 empaquetados. Deuda declarada: 2 `content:` en `_components.scss:366` y `:480` | research (probe de glifos) |
| D6 | **Backend: Next + Supabase**, sin Python. C (hibrido) descartado para el MVP. A (FastAPI) solo como fallback con criterio falsable | RLS es frontera declarativa y testeable por SQL; un middleware propio sin tests es un bug esperando | research + Go backend |
| D7 | **Coral canonico `#FF5F44`** (el del PNG medido) — **adoptado salvo veto antes del 29-oct** | no existe vector para re-exportar a `#FF6B5B` | designer (contrato §1) |
| D8 | **Librerias**: Recharts 3.10.1 · RHF 7.91.0 (+Zod solo server) · qrcode.react 4.2.0 · sonner 2.0.8 · `Intl` nativo | version/peer React 19/licencia/peso verificados uno por uno | research (context7 + registry + bundlephobia) |
| D9 | **Escala 1-5 con etiqueta verbal en los 5 puntos. Sin NPS** | NPS exige 0-10; convertir 5 estrellas a NPS es invalido | research UX + plan §6 |
| D10 | **Auth = magic link** (passwordless), un solo metodo | el dueno de un almacen no administra contraseñas | arquitectura §2 (alineado) |
| D11 | **URL publica con codigo corto de 8-10 chars (`nanoid`)**; el UUID queda como id interno inmutable | un UUID en la URL sube la version del QR y agranda el modulo impreso: el insumo mas caro del proyecto | revision independiente (hallazgo 12) + designer |

## 2. Correcciones aplicadas (y por que)

| # | Se creia | Realidad verificada | Correccion |
|---|---|---|---|
| C1 | Rate limit en **Map en memoria** | en Vercel cada request puede caer en otra instancia: no limita nada | tabla `rate_bucket(survey_id, minute_bucket, count)` con upsert atomico, **10 req/min por survey**, sin guardar IP |
| C2 | Idempotencia por UUID del cliente | protege reintentos de red, **no** spam (UUID nuevo = respuesta nueva) | redactado con esa precision + honeypot y Turnstile opcional como anti-abuso |
| C3 | "Landing en raiz, sin mover rutas" | el layout raiz importa `style.scss` global → el aislamiento era **imposible** | se crean los route groups y se mueven las 9 rutas (URLs intactas) |
| C4 | `GRANT INSERT ON response TO anon` a secas | el anonimo podia insertar `survey_id`/`channel_code` arbitrarios | **`anon` no inserta nada**: la escritura publica pasa solo por `/api/responses` con `service_role`; la integridad (canal del mismo negocio, rango 1-5, largo del comentario) se valida en el handler y se refuerza con FK compuesta/trigger en la base |
| C5 | Lectura de la encuesta "con anon key y RLS" | `/e/[code]` necesita leer survey+preguntas por codigo publico y la tabla no lo permitia | lectura via `service_role` en Server Component |
| C6 | "2.132 lineas JSX" | conteo real: **1.952 JSX** (+482 JS); `_menu.scss` 972 ya esta dentro de las 3.299 | numeros corregidos (los `!important` reales son **193**, no 192) |
| C7 | "10 rutas" | son **9** (8 `page.jsx` + `page.js`), y los slugs son `/pricing` y `/contactus` | corregido en plan y arquitectura |

## 3. Arquitectura en una vista

```
Local ──QR impreso──> /e/<codigo-corto>        (grupo (public), hoja minima propia)
                            │ POST
                            v
                    /api/responses              (Route Handler: valida, rate_bucket, idempotencia)
                            │ service_role
                            v
   Dueno ──magic link──> /panel/*  ──handler + ownership──>  Supabase (Postgres + Auth + Storage)
                            │                                   (RLS como segunda barrera)
                            │
                    cron externo / Edge  ──>  Resend  (correo de alerta)
```

Reglas duras: **dominio propio** (`scan.<dominio>/e/<code>`, nunca dominio del proveedor) · **`qr_code` inmutable** que no se recicla · **plan Pro antes de imprimir** (el free tier pausa a los 7 dias y mataria los QR pegados) · la tabla de respuestas **no guarda IP ni user-agent**.

## 4. Librerias (verificadas: version, licencia, peer, peso)

| Necesidad | Elegida | Version | Peso | Nota |
|---|---|---|---|---|
| Graficos del panel | Recharts | 3.10.1 (MIT) | 146 KB gzip | peer React 19; code-split solo en `/panel` |
| Formularios | React Hook Form | 7.91.0 (MIT) | 16 KB gzip | JS puro OK; Zod (86 KB) **solo** en login/alta, nunca en la encuesta |
| QR | qrcode.react | 4.2.0 (ISC) | 6 KB gzip | `level="M"`, `QRCodeSVG` para imprimir |
| Toasts | sonner | 2.0.8 (MIT) | 9 KB gzip | tematizar por **variables CSS**, no `!important` global |
| Fechas es-CL | `Intl` nativo | — | 0 KB | date-fns y dayjs **no tienen locale es-CL** |
| Iconos | react-icons | 5.5.0 (ya instalado) | ~0 en cliente | reemplaza 11 glifos MDI; 3 glifos cambian de forma (comillas, check-bold, bullet) |
| UI kit | Bootstrap 5.3.x | 5.3.7 (ya instalado) | — | sin kit extra: 4 vistas de panel no lo justifican |

## 5. Que se reutiliza del landing en el panel

| Elemento | Uso | Regla |
|---|---|---|
| Tokens (`_variables.scss` → `_tokens.scss`) + `$theme-colors` | color de marca en todo | una sola fuente; **cero hex fuera del token file** |
| `.card`, `.btn`, `.badge`, `.table`, `.alert`, `.form-control` | toda la UI del panel | primitivas Bootstrap; sin kit de terceros |
| `@each` de `.btn-*`/`.bg-*`/`.text-*` | se hereda | no duplicar ni crear utilitarios nuevos con `!important` |
| Navbar y footer del landing | **no** se usan en panel | el panel tiene shell propio (sidebar ciruela + topbar) en `_panel.scss` |
| Bebas Neue | **solo** display/marketing | prohibida en datos, tablas y numeros (condensada, solo mayusculas) |
| Secciones de marketing (`services-one`, `pricing`, `team`…) | **no** | el panel no reusa secciones, solo tokens y primitivas |

## 6. Gates de aceptacion UX

**Encuesta** (`/e/<code>`): 3 preguntas, 1 por pantalla · escala 1-5 con **etiqueta verbal en los 5 puntos** · sin estrellas ni emoji · cero campos personales · targets **≥44x44 px** (sin excepcion) · texto ≥16 px · 4 estados (default/sending/success/error con reintento y respuesta conservada) · zoom permitido · `inputmode` correcto · gracias ≤2 lineas sin promo · sin confirmshaming.

**Panel**: **4 KPI maximo** visibles sin scroll en 375x667 · absolutos mientras n<20 · aviso "aun son pocos clientes (3)" si n<10 · **una sola alerta urgente** con causa + accion que abre las respuestas crudas · **cero jerga** (CSAT/NPS/score/KPI prohibidos en UI) · estado vacio con accion ("Abrir mi QR") · ningun estado solo por color · rango por defecto 7 dias · "actualizado hace X" + skeleton.

**Piloto (observar, no preguntar)**: QR→primer tap >10 s falla · taps hasta enviar >3 falla · mis-taps · titubeo en texto libre · pregunta al personal (enunciado ambiguo) · panel: >10 s para señalar "¿contentos?" = jerarquia rota. Salida: ≥80% exito sin ayuda.

## 7. Assets (plan)

Faltan: horizontal claro, monocromo, **SVG**, OG 1200x630, `icon.png` 512, `apple-icon` 180, `favicon.ico` 32/16 (hoy es el del template). Antes de derivar nada: **versionar los PNG fuente** (`logoScanCoral.png` 2172x724, `faviconScan.png` 1254x1254) en `assets/brand/src/`. Si no aparece el vector: re-export desde el AI/FIG del disenador o vectorizacion manual del isotipo (≈3-4 h + 1-2 h wordmark).
QR impreso: ECC **M**, quiet zone ≥4 modulos, contraste ≥40%, **prohibido** logo dentro/degradado/inversion, version ≤3 con codigo corto (≥18 mm impresos), probar en 3 dispositivos antes del lote.

## 8. Fases (27-oct → 18-nov)

| Bloque | Entregable verificable | Gate | Recorte |
|---|---|---|---|
| **Fase 0** 27-30 oct | Tokens + Bootstrap compilado por Sass + retheme teal→coral/ciruela + tipografias por `next/font` + `react-icons` (fuera `@mdi/font`, reescritos los 2 `content:`) + logo navbar 108x36 | `grep 0e6e5c` = 0 · `grep "mdi-"` = 0 · build verde · WCAG AA en 9 rutas | migrar iconos sin el panel; dejar `_mdi` hasta el final del bloque |
| **S1** 31-oct → 5-nov | Esquema + RLS + magic link · owner crea encuesta · QR PNG · `/e/<code>` responde · `/api/responses` idempotente · **prueba de 1 dia (multi-tenant, canal cruzado, concurrencia, URL medida)** | smoke 1-6 + 11-13 de arquitectura §9 | solo PNG (sin SVG); **la validacion de longitud se mantiene** |
| **S2** 6-11 nov | Panel: 4 KPI + opiniones con filtro + estado vacio + 4 estados | n<10 muestra aviso, sin % | sin filtro de canal, sin tiempo mediano |
| **S3** 12-17 nov | Alerta urgente con accion · correo Resend · ajustes | smoke 7-10 y 14 · alerta llega por correo | cron como script externo |
| **18 nov** | Deploy prod + dominio propio + backup + 3 QR en negocios | QR solo se imprimen con prod estable | rollback a dominio temporal |

## 9. Riesgo principal (no tecnico)

**El QR impreso es un contrato irreversible**: sin rollback para un adhesivo en una vitrina. De ahi plan Pro antes de imprimir, dominio propio, `qr_code` inmutable y monitor de "QR sin respuestas en 7 dias".

Segundo: **un dashboard que miente es peor que uno caido** → C1/C2/C4 existen para que el numero que ve el dueno sea real.

## 10. Decisiones abiertas (con fecha o default)

| # | Tema | Default adoptado | Veto hasta |
|---|---|---|---|
| 1 | Coral canonico | `#FF5F44` | **29-oct** |
| 2 | Escala de la encuesta | 1-5 con etiquetas verbales (sin NPS) | 30-oct |
| 3 | Auth | magic link | 30-oct |
| 4 | Plan Supabase Pro US$25/mes | **si, obligatorio antes de imprimir** | 5-nov |
| 5 | Dominio | placeholder `scan.<dominio>`; se cierra antes de S3 | 11-nov |
| 6 | SVG del logo | si no aparece vector: vectorizar (≤6 h) | 3-nov |
| 7 | **El landing pasa a ser el sitio de Scan-Say-Done** (hoy dice "Agencia" y vende desarrollo web) | **DECIDIDO SI (27-oct)**. El copy de las 9 rutas se reescribe para el producto | cerrada |

## 11. Revisiones independientes de esta documentacion

| Revisor | Alcance | Resultado |
|---|---|---|
| `reviewer-alibaba` | coherencia entre los 4 docs + codigo real | 20 hallazgos, 5 criticos, **COHERENTE CON FIXES**; verifico 3.299 lineas Sass, 972 de `_menu.scss` y todos los ratios de contraste (reproducidos) |
| `senior-auditor` (gpt-6-sol) | anti-fraude documental: ¿los numeros y fuentes son reales? | **CONFIABLE CON RESERVAS**. Reprodujo 1.952 lineas JSX, 482 JS, 3.299 SCSS, 972 de `_menu.scss`, 193 `!important`, 9 rutas, 11 glifos y todos los ratios WCAG. Detecto 5 defectos (abajo) |
| `backend-advanced-5.2` (gpt-6-sol, autorizado) | validacion de arquitectura, RLS, idempotencia y seguridad | **APROBADO CON CAMBIOS** (6 bloqueantes) → corregidos en **arquitectura v3/v3.1**: DDL con FK compuestas, SQL de revocacion valido, codigos inmutables por grant de columna, contrato por endpoint con IDs derivados, bucket atomico condicionado, idempotencia sin endpoint de estado, pruebas movidas a S1 |

## 11b. Correcciones aceptadas de la auditoria senior

| # | Defecto detectado | Correccion aplicada |
|---|---|---|
| 1 | El presupuesto del QR omitia `https://` y `/e/` | Recalculado: URL real 36-38 bytes con host tipico → **V3-M**; peor caso 48 bytes → **V4-M**, y con ECC H sube a V5-H/V6-H → tamano minimo **≥23-25 mm**, no 18 mm. Gate: medir la URL final antes de imprimir |
| 2 | Cronologia PLAN vs ARQUITECTURA desalineada | Fechas unicas: Fase 0 27-30 oct · S1 31-oct→5-nov · S2 6-11 nov · S3 12-17 nov · entrega 18 nov (aplicado en ambos docs) |
| 3 | `@mdi/font`: 732 KB en el plan vs 741 KB en la bitacora | Unificado a **≈741 KB** (338 CSS + 403 woff2), etiquetado como dato del paquete |
| 4 | Frontera de seguridad ambigua: `service_role` vs `anon INSERT` | Cerrada: **`anon` no inserta nada**; la escritura publica pasa solo por `/api/responses` con `service_role`, y la validacion (FK, canal perteneciente a la encuesta, rango 1-5, largo del comentario) + rate bucket viven en el handler. SQL de RLS completo, sin `true` sueltos |
| 5 | La bitacora `ANALISIS-LANDING.md` seguia dando recomendaciones ya superadas | Marcada como documento historico, con puntero al plan vigente |

## 12. Lo que NO se hizo

Cero codigo, cero instalaciones, cero assets copiados, cero compromisos con proveedores. Solo 5 documentos: este plan, `docs/ARQUITECTURA-SCAN-SAY-DONE.md`, `opendesign/DESIGN-CONTRACT.md`, `opendesign/ASSET-PIPELINE.md`, `docs/ANALISIS-LANDING.md`.

## 13. Claims que son estimacion (no dato medido)

Pesos gzip de librerias y de Zod (fuente: bundlephobia, no re-verificado en este repo) · tamaño de `@mdi/font` y los 7.447 glifos (dato del paquete) · duracion de la encuesta 20-30 s y umbral del piloto ≥80% (supuestos de diseño) · pesos objetivo de SVG/PNG y "~30x" · legibilidad del QR a 18-25 mm y regla distancia/10 · latencia p95 <500 ms, "4 h + 2 h" de la prueba de 1 dia y "restaurar <1 h" · todos los plazos por bloque. Lo medido de verdad es: lineas de codigo y Sass, `!important`, rutas, glifos usados, y los ratios de contraste hex.
