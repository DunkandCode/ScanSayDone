# Mockups — registro y QA

Generados con `wan-image` (MCP) el 2026-10-27. **Uso previsto: referencia visual y estructural, NO contenido final.**
Ninguna imagen es implementable tal cual: todas contienen texto generado por IA que se desvia de la marca y de las reglas UX.

## Registro

| # | Archivo | Modelo / tamano | Peso | Que muestra |
|---|---|---|---|---|
| 1 | `01-hero-desktop.png` | qwen-image-3.0-pro · 1536x864 | 871 KB | Hero del sitio de marketing: titular "ESCANEA. OPINA. LISTO.", CTA coral con texto ciruela, tarjeta QR, badge mostaza "20 s", movil con encuesta |
| 2 | `02-landing-full.png` | wan2.7-image-pro · 1024x1536 | 1.6 MB | Pagina completa: hero, franja de confianza, "como funciona" (3 pasos), canales (4 tarjetas), captura del panel, precios (3 planes), FAQ, footer ciruela |
| 3 | `03-panel-desktop.png` | wan2.7-image-pro · 1536x864 | 1.6 MB | Panel del dueno: sidebar ciruela, 4 KPI, barras semanales coral, lista de opiniones, alerta urgente con borde mostaza y accion |
| 4 | `04-survey-mobile.png` | qwen-image-3.0-pro · 864x1536 | 739 KB | Encuesta movil: pregunta, escala de 5 caras con etiqueta verbal, comentario opcional 0/500, progreso, boton "Enviar opinion", bajada de marca |
| 5 | `05-canales-desktop.png` | qwen-image-3.0-pro · 1536x864 | 744 KB | Seccion de canales: 4 tarjetas (mostrador con QR, Instagram/WhatsApp, LIVE) sin precios ni cifras |
| 6 | `06-precios-desktop.png` | wan2.7-image-pro · 1536x864 | 1.4 MB | 3 planes con el central destacado en coral + badge mostaza "RECOMENDADO"; precio como placeholder, sin cifras inventadas |
| 7 | `07-encuesta-flujo.png` | qwen-image-3.0-pro · 1536x864 | 608 KB | Flujo de 3 pantallas: escala 1-5 con etiqueta verbal, chips de aspecto, comentario + boton y mensaje de gracias |
| 8 | `08-panel-mobile.png` | wan2.7-image-pro · 864x1536 | 1.5 MB | Panel en movil: 4 KPI apilados, 1 grafico, 1 alerta urgente con accion, barra de navegacion inferior |

## QA visual (veredicto por imagen)

| # | Estructura | Paleta | Texto | Veredicto |
|---|---|---|---|---|
| 1 | **Correcta**: hero a 2 columnas, CTA unico destacado, QR + movil | **Correcta**: crema, ciruela, coral, mostaza en proporcion | Marca mal escrita (**"EncuetaQR"**), y aparecen 2 defectos de contenido: **estrellas** de satisfaccion y claim falso "mas de 10.000 empresas" | **Aprobada como referencia de layout**; contenido debe reescribirse |

## Defectos a corregir si se regeneran

1. **Nombre de marca**: las 3 imagenes con marca la escriben mal o inventan otra. Requiere volver a generar con el nombre fijado y, si sigue fallando, componer el lockup encima de la imagen en lugar de pedirlo al modelo.
2. **Estrellas de satisfaccion** (imagenes 1 y 3): prohibidas por el contrato (§5). La escala es 1-5 con etiqueta verbal o caras + numero.
3. **Claims y precios inventados** (imagen 2: "$8/$29"; imagen 1: "10.000 empresas"): sustituir por placeholders vacios o datos reales del piloto.
4. **Badges contradictorios** (imagen 3: Positivo + Negativo en la misma tarjeta): definir una sola etiqueta de estado por opinion.
5. **Caras sin numero** (imagen 4): añadir el 1-5 numerico bajo cada cara.

**Limite de generacion**: `wan-image` permite 4 imagenes por tarea; este lote consumio las 4. La regeneracion con los fixes anteriores es una tarea nueva.

## Como usarlas

- Sirven para **validar jerarquia, densidad y ritmo** antes de escribir SCSS, y para mostrar al equipo/operador la direccion visual.
- **No** sirven como fuente de copy, de precios ni de datos.
- Los planos normativos son `../UX-LANDING.md` (grid, layout, tipografia, color por seccion) y `../wireframes/INDEX.md`; estas imagenes son ilustracion de esa especificacion.

## Veredictos 5-8 (revision ampliada con vision)

| # | Veredicto |
|---|---|
| 5 | **Referencia con defectos**: inventa un canal 'Tienda en linea / Web' que no esta en el plan (QR, Instagram, WhatsApp, TikTok LIVE) |
| 6 | **Referencia con defectos**: las features listadas ('analisis de sentimientos', 'API completa', 'SLA') estan **fuera del MVP** |
| 7 | **Referencia con defectos**: el paso 2 muestra chips multi-opcion; la decision es 3 preguntas 1-5 |
| 8 | **Referencia con defectos**: muestra KPIs de logistica ('Pedidos', 'Proveedores', importes) en vez de satisfaccion y opiniones |


## Registro 9-12 — dashboard (2026-10-27)

| # | Archivo | Modelo / tamano | Peso | Que muestra | Veredicto |
|---|---|---|---|---|---|
| 9 | `09-panel-overview.png` | wan2.7-image-pro · 1536x864 | 1.4 MB | Sidebar ciruela, 4 KPI, barras semanales coral, lista con badge numerico 3/4, alerta con borde mostaza y boton | **Regenerar**: estructura correcta, pero **todo el texto es ilegible** (marca, labels, comentarios) |
| 10 | `10-panel-opiniones.png` | wan2.7-image-pro · 1536x864 | 1.4 MB | Vista de opiniones con chips de filtro y filas con badge 1-5 | **Regenerar** por texto; usar como referencia de densidad de fila |
| 11 | `11-panel-alertas.png` | wan2.7-image-pro · 1536x864 | 1.5 MB | Cola de alertas + detalle con causa y accion unica | **Regenerar** por texto; la estructura (cola + detalle) si se adopta |
| 12 | `12-panel-empty.png` | qwen-image-3.0-pro · 1536x864 | 659 KB | Estado vacio de primer uso: ilustracion QR, "Abrir mi QR", 3 pasos | **La mejor del lote de panel**: texto casi legible (2 erratas), estructura fiel al contrato |

**Nota:** el mockup 9 confirma el patron del lote: los modelos generativos **no producen texto fiable**. Las imagenes sirven para layout y densidad; **las medidas estan en los planos SVG** (`../wireframes/d01..d04`) y el texto definitivo sale del copy del producto, no de la imagen.
