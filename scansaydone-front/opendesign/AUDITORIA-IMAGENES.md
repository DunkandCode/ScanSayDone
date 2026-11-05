# AUDITORIA-IMAGENES — mockups + planos SVG · Scan-Say-Done

> 2026-10-27 · designer-alibaba · auditado: **9** PNG en `mockups/` (el brief decía 8: existe un 9.º, `09-panel-overview.png`, auditado también) + 9 SVG en `wireframes/`.
> Criterio: `DESIGN-CONTRACT.md` §1–§6 · `UX-LANDING.md` · `referencias/ANALISIS-REFERENCIAS.md` · decisiones UX cerradas (3 preguntas 1–5 con etiqueta verbal, sin estrellas ni emoji; 4 métricas máx.; n<20 absolutos; cero jerga).
> Limites: un PNG generado por IA no es medible (proporciones inventadas — GRID-SPEC §5); el audit mide contenido, tokens visibles y reglas, no píxeles.

## Mockups (9)

| Imagen | Estado | Que la desalinea | Accion concreta |
|---|---|---|---|
| `01-hero-desktop.png` | REGENERAR | marca "EncuestaQR" (no existe); estrellas en el movil; claim "10.000 empresas" y "20 s" inventados; pregunta estilo NPS ("que tan probable es que nos recomiendes") = jerga prohibida; chips Si/No ≠ escala 1–5; texto blanco sobre coral (3.01 ✗); hero crema, la spec pide banda ciruela | regenerar con prompt: brand "SCAN-SAY-DONE", banda ciruela, cara+numero 1–5, cifras "—"; si la marca vuelve mal escrita, componer el lockup real encima |
| `02-landing-full.png` | REGENERAR | pseudo-texto ilegible en todo el scroll; precios "$8/$29" inventados; "78 NPS Score" (jerga prohibida); estrellas; 2 caras de personas en el panel; hero crema ≠ ciruela; mostaza como borde de 8 tarjetas (>5%) | no re-generar el scroll entero: la lamina de secciones ya vive en `UX-LANDING §2` y los planos 01–08; descartar |
| `03-panel-desktop.png` | CORREGIR | estructura = shell objetivo (sidebar ciruela, 4 metricas, barras coral, lista, alerta con causa+accion ✓); fallan: estrella en KPI y en cada fila; "CALIFICACION MEDIA 4.7 / 91% / 2.4h" = medias y % inventados; badges contradictorios Positivo+Negativo en la misma fila; texto coral sobre blanco (3.01 ✗); "Dashboard · Version 2.4" inventada; decoracion de esquinas (puntos, diagonales) | regenerar conservando la composicion: caras+numero en lugar de estrellas, un solo badge por fila, numeros absolutos "n", quitar decoracion y version; base del `d01` |
| `04-survey-mobile.png` | CORREGIR | caras de linea SVG ✓, etiqueta verbal ✓, fondo blanco ✓, ciruela-sobre-coral ✓, 0/500 ✓; faltan los numeros 1–5 bajo cada cara (defecto 5 del registro); "Como" sin tilde | re-usar tal cual para iluminar la escala; los numeros 1–5 se especifican en el producto, no en el PNG |
| `05-canales-desktop.png` | CORREGIR | 4 tarjetas ✓ (R1: el plano dibuja 4); iconos de linea ✓, cero personas ✓; 4.ª tarjeta inventada ("Tienda en linea / Web" no esta en el plan: QR, Instagram, WhatsApp, TikTok LIVE); H2 en Montserrat (manda Bebas); chips QR/Chat/Live/Web en mostaza = canal inventado | regenerar con los 4 canales reales del plan; el layout 2×2 / fila de 4 se queda |
| `06-precios-desktop.png` | CORREGIR | placeholders de precio "—" ✓ (sin cifras); jerarquia del plan central ✓; "Comenzar ahora" y "Profesional" en blanco sobre coral (3.01 ✗ — manda ciruela 5.08); features fuera de MVP (sentimientos, API, SLA); lienzo gris #E5E5E5 fuera de paleta | re-usar para jerarquia de tarjetas; texto del plan central a ciruela sobre coral; lista de features → copia real pendiente de `BUILD-ORDER` |
| `07-encuesta-flujo.png` | REGENERAR | paso 2 = chips multi-opcion: contradice la decision cerrada (3 preguntas 1–5); seleccion "5 Excelente" en blanco sobre coral (3.01 ✗) | regenerar el paso 2 como pregunta 1–5 con cara+numero; progreso de 3 puntos ✓ se conserva |
| `08-panel-mobile.png` | REGENERAR | dominio equivocado: "Pedidos / Ingresos $12.840 / Proveedores" — no es satisfaccion; cifras inventadas; objetos decorativos (cuaderno, planta); boton blanco sobre coral | re-utilizar solo el patron de pila 1-col + barra inferior como referencia; contenido → `d04` |
| `09-panel-overview.png` | REGENERAR | compose = rail derecho util; pero pseudo-texto total, marca "Duskiness" inventada, foto de persona en el avatar (cero personas), "Feedback" en jerga, boton blanco sobre coral | descartar el PNG; lo que aporta (4 KPI + grafico + rail alerta/lista) ya queda normativo en `d01` |

## Planos SVG (9) — tokens y geometria medidos (grep hex + bytes, no a ojo)

| Plano | Estado | Hallazgo | Accion |
|---|---|---|---|
| `00-grid-system.svg` | CORREGIR | banda `#FAFAF7` fuera de paleta; demas hex = marca exacta; aritmetica contenedores ✓ | cambiar banda a blanco o declarar el wash `#F7F6F7` del panel como token |
| `01-hero.svg` | ALINEADA | cotas 655/461/1140 cuadran (7x73+6x24=655 ✓); tipografia solo `sans-serif`/`monospace` | — |
| `02-como-funciona.svg` | ALINEADA | 3x364+2x24=1140 ✓ | — |
| `03-canales.svg` | ALINEADA | 4 tarjetas 4x267+3x24=1140 ✓; el choque 3-vs-4 es documental (R1), no del plano | cerrar R1 en UX-LANDING |
| `04-panel-preview.svg` | CORREGIR | area de grafico `#FBF6F1` fuera de paleta | sustituir por blanco de tarjeta (el panel real va en `d01–d04`) |
| `05-precios.svg` | CORREGIR | **U+2605 (estrella) en el badge "RECOMENDADO"** (linea 48) — contra la regla cero estrellas y riesgo de render emoji | quitar el glifo: badge = check SVG + "RECOMENDADO" |
| `06-faq-cta.svg` | ALINEADA | `#B23A2A` usado = token `--link` ✓; cotas 550/386 lg ✓ | — |
| `07-footer.svg` | ALINEADA | banda crema `#FFF8F2` = DESIGN-CONTRACT §4 (realineado); H-1 resuelto 27-oct (acta §4), el plano hace bien su trabajo | — |
| `08-aplicaciones.svg` | ALINEADA | 3x364+2x24=1140 ✓; marcos 4/3 364x273 ✓ | — |

## Reglas de regeneracion (toda imagen nueva)

1. Marca solo "SCAN-SAY-DONE" / bajada "ESCANEA. OPINA. LISTO."; si el modelo la escribe mal 2 veces, componer el lockup real encima del PNG.
2. Cero estrellas; cero emoji. Escala = cara de linea + numero 1–5 + etiqueta verbal.
3. Cero claims/cifras inventadas: precios "—", metricas "n", nada de "10.000 empresas" ni versiones ("2.4").
4. Cero personas (incluidos avatos-foto); producto y UI solos.
5. Paleta exacta: `#FF5F44` `#2E1E3F` `#FFF8F2` `#F4B63B` (wash panel `#F7F6F7`); texto sobre coral = ciruela, nunca blanco (3.01 ✗); coral jamas como texto sobre claro.
6. Cero jerga en UI visible: prohibido NPS/CSAT/score/KPI/feedback; una sola etiqueta de estado por opinion.
7. Cero decoracion: sin puntos, diagonales, cuadernos ni plantas de escena.

## Que sirve tal cual y para que

- **Layout/densidad**: `03` (shell desktop: sidebar+topbar+4 KPI+grafico+lista+alerta) y `09` (rail derecha alerta+sobre-opiniones, solo estructura) → insumo visual de `d01–d03` (ya dibujado con sus medidas).
- **Jerarquia de la encuesta**: `04` — la unica imagen del set que cumple las reglas UX (caras linea + etiqueta + blanco + coral-ciruela); falta el 1–5 numerico, que ya esta en spec.
- **Ritmo de banda y tarjetas**: `05` (canales, con los 4 canales correctos) y `06` (precios con placeholder honesto) → referencia de espaciado para maquetar.
- Los PNG **nunca** valen como fuente de copy, cifras ni medidas (GRID-SPEC §5).

## Veredicto global

- Mockups: **0 ALINEADAS · 4 CORREGIR (03, 04, 05, 06) · 5 REGENERAR (01, 02, 07, 08, 09)**. Utilizable hoy como referencia de layout/densidad/jerarquia: ~44 % del set (03, 04, 05, 06); el resto, descartado o reduible a un patron de pila.
- Planos SVG: **6 ALINEADAS · 3 CORREGIR (hex sueltos 00/04 y la estrella de 05) · 0 REGENERAR**. Los 3 fixes son ediciones de una linea; geometria y tokens verificada entera.
- La familia del panel pasa de mockups a planos normativos: `d01–d04` (esta sesion) sustituyen a `03/08/09` como fuente de medidas.
