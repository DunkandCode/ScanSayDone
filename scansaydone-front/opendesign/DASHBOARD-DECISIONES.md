# Dashboard — decisiones abiertas y riesgo de "respuestas crudas"

Estado: **aprobado e integrado en `DASHBOARD-UX.md`** (27-oct); este documento queda como registro de la decision y su razonamiento.

> Fuente: segunda opinion Go (`second-opinion --area frontend`, gpt-6-luna, 2026-10-27) + revision del plan de 4 vistas.
> Complementa `DASHBOARD-UX.md` (spec) con lo que **falta decidir** antes de construir.

## 1. Hallazgos de la segunda opinion Go

| # | Hallazgo del modelo | Severidad | Como se resuelve |
|---|---|---|---|
| 1 | No se especifican estados de carga, error y exito por vista | media | anadir a `DASHBOARD-UX.md`: 4 estados obligatorios por vista (loading/error/empty/success), con skeleton para el grafico y KPI |
| 2 | Contraste y a11y declarados pero sin requisitos verificables (teclado, foco, semantica) | media | gate por vista: recorrido completo con teclado, `:focus-visible` visible, un `<h1>` por vista, landmarks, `aria-live` en envios |
| 3 | No se fija que **todos** los colores y medidas vengan de tokens | media | regla: cero hex y cero px magicos fuera de `_tokens.scss`; grep de control en el gate |
| 4 | Responsive definido solo para movil (drawer) | media | definir 1440 / 1024 / 768 / 375 y que se colapsa en cada uno |
| 5 | Sin presupuesto de rendimiento | media | presupuesto: LCP < 2.5 s y CLS < 0.1 en el panel; grafico cargado solo en su vista |
| 6 | No se puede juzgar si 4 vistas cubren el MVP | baja | ver §2: la cuarta vista cambia |

## 2. El riesgo que el modelo no vio: las respuestas crudas

El plan dice que la alerta abre **"las respuestas crudas"**. Eso no es un detalle de UX: es un problema de datos y de responsabilidad.

| Riesgo | Consecuencia concreta | Regla propuesta |
|---|---|---|
| **Datos personales en pantalla** | el cliente escribe su nombre o telefono en el comentario y el dueno lo ve en un celular que puede estar en el mostrador | **regla final (aprobada 27-oct, acta §7): sin mascara automatica en el MVP.** Las heuristicas de PII fallan en espanol (apellidos compuestos, telefonos locales) y producen texto mutilado; con el literal completo a un clic, la mascara es teatro. Lista = extracto **≤90 caracteres**, sin enmascarar; detalle = literal completo. Proteccion real: la encuesta no pide datos personales + aviso "no escribas datos personales" bajo el campo + politica de retencion. Prohibido inventar un `mask()` inline sin tests |
| **Contenido hostil** | insultos o sarcasmo sin contexto: el dueno se desconecta del producto | el texto se muestra **citado** como "esto dijo tu cliente", nunca como conclusion; accion unica "Responder" que abre borrador |
| **No hay vista para eso** | la alerta promete abrir algo que no existe en las 4 vistas planificadas | la vista de respuestas es **la cuarta**: `opiniones` y `respuestas` se separan (filtros por un lado, texto literal por otro) |
| **Incentivo perverso** | si responder rapido "sube" el estado de la alerta, se premia cerrar sin resolver | el estado de la alerta solo cambia con una accion registrada, no con abrirla |

## 3. Decision: **APROBADA (27-oct)**

**3 destinos de primer nivel**: `overview`, `opiniones`, `respuestas`. `respuestas` **reemplaza a `alertas`** como destino; las alertas quedan como **tarjeta resumen** en el overview (contador + enlace directo `respuestas?filtro=sin-responder`) y como **filtro dentro de la lista de `respuestas`**, con el detalle al seleccionar fila. **Condicion que sostiene la fusion:** la alerta se deriva de una respuesta (puntuacion ≤ 2), `alert.response_id NOT NULL` — no existen alertas huerfanas; si se agregara una alerta manual (sin respuesta), esta fusion se revisa (acta §1). Cambiar esto despues del piloto cuesta mucho mas que decidirlo ahora, porque toca navegacion, permisos y el modelo de datos de la respuesta.

3 destinos de primer nivel + `ajustes` (configuracion). El estado vacio **no es una vista**: es un estado de cada vista.

| Vista | Contenido | Estado vacio |
|---|---|---|
| `overview` | 4 KPI + grafico + 3 opiniones + tarjeta resumen de alertas | "Todavia nadie respondio" + "Abrir mi QR" |
| `opiniones` | lista con filtros por canal (5 chips exactos) y puntuacion | "Sin opiniones en este filtro" + limpiar filtro |
| `respuestas` | **lista canonica del texto literal** (extracto ≤90 car., sin mascara) + cola de alertas como filtro (`Todas · Sin responder · En revision · Resueltas`) + detalle con literal completo + accion "Responder" | "No hay alertas abiertas. Bien."; filtro `Sin responder` con 0 = estado verde |
| `ajustes` | negocio, canales habilitados, QR | — |

## 4. Pendiente del operador

- ~~Aprobar o vetar el cambio de la cuarta vista (§3)~~ — **APROBADO 27-oct** (3 destinos, acta §1).
- ~~Rotulos definitivos de las 4 metricas (prohibido que una se llame "tendencia")~~ — **APROBADOS 27-oct**, fijados en `DASHBOARD-UX.md` §2.1 (limite 19 caracteres por rotulo).
- **Queda pendiente:** politica de retencion del comentario libre (hoy: 500 caracteres, sin datos personales por diseño, pero el usuario puede escribirlos; a definir antes del piloto — acta §7).
