# Cómo debe el backend entender el frontend del panel

> **Estado: BORRADOR 2026-11-12.** Requisitos escritos desde el frontend. No es un contrato
> aprobado ni una propuesta de implementación: sirve para que backend y datos sepan qué
> necesita la pantalla antes de definir endpoints.
> Rama de trabajo: `dev/nicolaslopezv-front` (`ce7c594`).

## 1. Qué pantalla existe hoy

`/panel` es un dashboard **demo** con datos inventados y rotulados
(`scansaydone-front/src/app/(panel)/panel/page.tsx:55-145`). No hace ninguna llamada de red.
El dataset vive en `scansaydone-front/src/components/panel/panel-data.ts` y es el contrato
visual que el backend debe poder alimentar.

## 2. Bloques de la pantalla y qué dato exige cada uno

| Bloque UI | Qué muestra hoy | Dato que necesita | ¿Existe en la BD? |
|---|---|---|---|
| KPI «Satisfacción» | media 8,5 | media de P1 (0–10) del periodo | **Sí**: `fact_encuestas.p1_nps` (`models.py:57`) |
| KPI «Respuestas» | 486 | conteo de filas del periodo | **Sí**: `fact_encuestas` |
| KPI «Promotores» | 377, rotulado «Notas 8–10» | conteo de P1 ≥ 8 **o** ≥ 9 según se defina | **Sí el dato**, pero la etiqueta es ambigua (ver §4) |
| Distribución por nota | 11 barras 0–10 | `nota`, `count` por cada valor 0–10 | **Sí**: agrupar `p1_nps` |
| Canales | 5 orígenes con conteo y puntos | canal/origen de cada respuesta | **No**: no hay columna de canal en `fact_encuestas` (`models.py:54-99`) |
| Serie diaria | 30 días: reseñas, puntos, media | fecha + conteo + suma + media por día | **Sí**: `fecha` (`models.py:80`) |
| Últimas respuestas | 5 filas: nota, cita, canal, antigüedad | P1, P5, canal, fecha | **Parcial**: falta canal |
| Filtro 7 / 30 / 90 días | selector | rango de fechas como parámetro | **Sí**, si el endpoint lo recibe |

## 3. Forma de datos que el frontend espera

Hoy el frontend trabaja con estas estructuras (`panel-data.ts:9-111`):

```ts
distribution: { nota: 0..10, count: number }[]        // 11 filas
channels:     { name: string, count: number, points: number }[]
dailySeries:  { day: 1..30, reviews: number, points: number, mean: number }[]
lastResponses:{ rating: number, quote: string | null, channel: string, daysAgo: number }[]
```

Para la versión real la forma puede cambiar, pero debe cubrir **los mismos cinco bloques**
sin que el frontend calcule agregados ni invente etiquetas.

## 4. Decisiones que el backend debe tomar (y hoy no están tomadas)

| # | Decisión | Por qué importa | Estado |
|---|---|---|---|
| D1 | ¿«Promotores» es P1 ≥ 9 (NPS) o P1 ≥ 8 (como el demo)? | El demo rotula 377 como «Notas 8–10», pero NPS define promotor 9–10. Dos números distintos con la misma etiqueta | **Conflicto visible**: `panel-data.ts:120-122` vs `reglas.py:31-37` |
| D2 | ¿Existe canal/origen? ¿Se agrega columna, tabla o se elimina el bloque? | Sin canal, el bloque «Canales» y el campo `channel` de últimas respuestas no se pueden construir | `sin_evidencia`: no existe en `models.py` |
| D3 | ¿La media del panel es sobre P1 (0–10) o sobre P2 (1–5)? | El demo mezcla: media 8,5 con distribución 0–10, pero P2 es 1–5 | A definir |
| D4 | ¿Qué significa «puntos» en canales y serie? | El demo usa `points` como suma de notas; hay que confirmarlo | A definir |
| D5 | ¿Zona horaria de los cortes diarios? | El backend ya usa hora Chile (`reglas.py:54-69`); el panel debe cortar el día igual | Propuesto: `America/Santiago` |
| D6 | ¿Alcance por negocio y autenticación? | El panel es por empresa (tenant); sin auth no hay forma segura de saber qué negocio consulta | Abierto (`pauta:143-144`) |

## 5. Contrato que el frontend necesita (propuesta, no firmada)

Un `GET` de resumen por empresa y periodo, con respuesta numérica y fechas ISO. Nada de
texto formateado ni jerga: el frontend formatea.

```jsonc
{
  "empresa_id": 2,
  "periodo": { "desde": "2026-10-13", "hasta": "2026-11-11", "dias": 30 },
  "totales": { "respuestas": 486, "suma_p1": 4131, "media_p1": 8.5,
               "promotores": 277, "altas_8_10": 377 },
  "distribucion": [ { "nota": 0, "count": 1 } ],
  "canales": [ { "canal": "qr_mesa", "count": 210 } ],
  "serie_diaria": [ { "fecha": "2026-10-13", "respuestas": 11, "suma_p1": 92 } ],
  "ultimas": [ { "encuesta_id": 1, "p1": 10, "p5": "texto o null",
                 "canal": "qr_mesa", "creado_en": "2026-11-02T18:04:00-03:00" } ]
}
```

Reglas que el frontend asume:

1. Números crudos y fechas ISO 8601; el formato (`8,5`, `hace 2 días`) es del cliente.
2. `null` explícito cuando no hay dato; nunca `0` para «sin datos».
3. `404` empresa inexistente con el mismo cuerpo que ya usa la API.
4. `503` servicio no disponible con el cuerpo existente (`main.py:43-46`).
5. Ausencia de respuestas en el periodo → listas vacías y totales en `0`, para que la UI
   muestre «—» y no gráficos con ceros.
6. Sin datos personales: nada de nombres, mesas, correos ni teléfonos. El demo ya lo
   prohíbe (`panel-data.ts:67`).

## 6. Lo que el backend no debe mandar

- Textos ya formateados (`"8,5"`, `"hace 2 días"`), porque rompen el formato local.
- Categorías visibles tipo NPS/CSAT en la respuesta: la interfaz tiene prohibido mostrar
  esa jerga (`CANON.md:79-80`).
- Cifras «de ejemplo» mezcladas con reales: el frontend distingue **DEMO** de real y no
  puede recibir ambas en el mismo campo.
- Agregados sin periodo explícito: el selector 7/30/90 debe reflejarse en la respuesta.

## 7. Bloqueos conocidos, en orden

1. **Sin endpoint de métricas** por empresa; el dashboard real es tarea futura
   (`docs/roles/02_backend.md:74`).
2. **Sin autenticación ni alcance por negocio** (`pauta:143-144`).
3. **Sin canal/origen** en el modelo (D2).
4. **Datos demo incompletos**: 4 negocios cargados, las 80 respuestas no
   (`pauta:115-119`). Sin historial no se pueden probar estados con datos.
5. **Rate limit** pendiente en el POST de respuestas (`pauta:75,160-172`), no en el resumen.

## 8. Qué se pide en concreto

1. Responder D1–D6 (§4).
2. Confirmar o corregir la forma de §5.
3. Decir si el canal entra al modelo o se elimina del panel.
4. Publicar el contrato firmado antes de que el frontend escriba el `fetch`.
