# Contrato de la API del backend (versión JPA, 2026-11-19)

> **Audiencia:** agentes de IA que van a consumir la API (p. ej. para conectar el frontend).
> **Autor:** Juan Pablo Ahumada (`@JuampaCL`) · **Rama:** `dev/JuampaCL` · **Commits:** `df3b0e5`, `4bfe083`
> **Verificado:** 2026-11-19 contra el servidor local conectado a Supabase. Los ejemplos JSON
> son respuestas reales, no inventadas.

## 0. Reglas de lectura para el agente

1. **Precedencia de fuentes** (si dos fuentes discrepan, gana la de número menor):
   1. El código en `scansaydone-back/` y su esquema OpenAPI en `GET /openapi.json`.
   2. Este documento.
   3. `docs/integracion/BACKEND-LOGIN-Y-PANEL-2026-11-18.md` (diseño; §11 lista las diferencias).
   4. Cualquier otro `.md` del repo.
2. **Documentos desactualizados para estos endpoints.** No los uses como contrato:
   - `CLAUDE.md` (raíz), sección «Estado actual»: dice que el backend es solo `main.py`, sin BD ni tests. **Falso** desde el 2026-11-11.
   - `docs/integracion/REQUISITOS-FRONTEND-DASHBOARD-2026-11-12.md` §5: es una **propuesta** (`totales`, `canales`, `ultimas`) que **no se implementó**. La forma real está en §4.4 de este documento.
   - `docs/integracion/PREGUNTAS-BACKEND-2026-11-12.md` Q4 y §4 punto 4: dicen que no hay endpoint de métricas ni login. **Ya existen.**
   - `docs/roles/01_frontend.md:54-56`: menciona Render y `POST /api/v1/encuestas/responder`. **Esa ruta no existe**; la correcta es `POST /api/v1/respuestas`.
3. **No inventes campos, rutas ni parámetros.** Si algo no está aquí ni en `/openapi.json`, no existe.
4. **No hay filtro por fechas, paginación ni token.** Ver §6.

## 1. Dirección base

| Entorno | Base URL | Estado |
|---|---|---|
| Local | `http://localhost:8000` | Verificado. CORS acepta `http://localhost:3000`. |
| Producción | Mismo dominio que el frontend; rutas relativas `/api/v1/...` (Vercel Services) | Previsto, **no verificado**. |

- No hay variable de entorno definida en el frontend para la base URL. Decisión pendiente del frontend.
- Todas las rutas de datos empiezan con `/api/v1/`.
- Esquema exacto (tipos, campos obligatorios, nulos): `GET {base}/openapi.json`. Interfaz manual: `GET {base}/docs`.

Levantar el backend local (desde `scansaydone-back/`, con `.env` configurado):

```powershell
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

## 2. Flujos

**Comerciante (panel):**

```
POST /api/v1/auth/login {usuario, contrasena}
  └─ 200 → {empresa_id, ...}  →  el cliente guarda empresa_id (el backend no entrega token)
        └─ GET /api/v1/empresas/{empresa_id}/panel  →  {empresa, agregado, respuestas[]}
```

**Cliente final (encuesta, sin login):**

```
GET /api/v1/empresas/{empresa_id}/encuesta  →  textos y escalas de P1–P5
  └─ POST /api/v1/respuestas {empresa_id, p1_nps, p2_csat, p3_atributo, p4_atributo, p5_comentario?}
        └─ 201 → {encuesta_id}
```

## 3. Errores (formato común)

| Código | Cuerpo | Cuándo |
|---|---|---|
| 401 | `{"detail": "Usuario o contraseña incorrectos."}` | Solo en el login. Mismo texto si el usuario no existe o la contraseña es incorrecta. |
| 404 | `{"detail": "Empresa no encontrada."}` | `empresa_id` válido pero inexistente. |
| 422 | `{"detail": [ {type, loc, msg, input, ctx?}, ... ]}` | Validación de FastAPI/Pydantic. `loc` indica dónde: `["body", "<campo>"]` o `["path", "empresa_id"]`. `msg` está en inglés salvo las validaciones propias. |
| 503 | `{"detail": "Servicio no disponible, intenta nuevamente."}` | Base de datos caída o sin configuración. |

Ejemplos reales de 422:

```json
{"detail":[{"type":"value_error","loc":["body","contrasena"],"msg":"Value error, La contraseña no puede estar vacía.","input":"   ","ctx":{"error":{}}}]}
```

```json
{"detail":[{"type":"greater_than_equal","loc":["path","empresa_id"],"msg":"Input should be greater than or equal to 1","input":"0","ctx":{"ge":1}}]}
```

## 4. Endpoints

### 4.1 `POST /api/v1/auth/login` (nuevo, 2026-11-18)

Login de demostración. **No abre sesión ni devuelve token.** Se reemplazará por Supabase Auth.

Petición (`Content-Type: application/json`):

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `usuario` | string | sí | 1–40 caracteres tras recortar. Se recortan los espacios de los extremos y se pasa a minúsculas antes de comparar. |
| `contrasena` | string | sí | 1–128 caracteres. Se compara **exacta** (no se recorta). Si está vacía o es solo espacios → 422. |

Campos extra → 422.

Respuesta 200:

| Campo | Tipo | Nulo |
|---|---|---|
| `usuario` | string (normalizado) | no |
| `empresa_id` | integer | no |
| `nombre_negocio` | string | no |

```json
{"usuario":"cafe_rincon_andino","empresa_id":2,"nombre_negocio":"Café Rincón Andino"}
```

Errores: 401, 422, 503. Cada login tarda ~0,3–1 s (cifrado PBKDF2): no lo trates como un timeout.

### 4.2 `GET /api/v1/empresas/{empresa_id}/panel` (nuevo, 2026-11-18)

Datos del panel de una empresa: agregado y detalle de **todas** sus respuestas.

- `empresa_id`: entero entre 1 y 2147483647; fuera de ese rango → 422.
- Sin parámetros de consulta. **No filtra por fechas y no pagina.**
- **Sin autenticación:** cualquier `empresa_id` es consultable (aceptado para la demo).

Respuesta 200: objeto con tres claves, `empresa`, `agregado` y `respuestas`.

**`empresa`**

| Campo | Tipo | Nulo |
|---|---|---|
| `empresa_id` | integer | no |
| `nombre_negocio` | string | no |
| `rubro` | string | no |

**`agregado`**

| Campo | Tipo | Nulo si no hay respuestas | Significado y redondeo |
|---|---|---|---|
| `respuestas` | integer | no (`0`) | Total de encuestas de la empresa. |
| `desde` | string `YYYY-MM-DD` | sí | Fecha (hora de Chile) de la respuesta más antigua. |
| `hasta` | string `YYYY-MM-DD` | sí | Fecha (hora de Chile) de la más reciente. |
| `nps` | number | sí | `%promotores − %detractores`, rango −100 a 100, 1 decimal. |
| `promotores` | integer | no (`0`) | P1 entre 9 y 10. |
| `pasivos` | integer | no (`0`) | P1 entre 7 y 8. |
| `detractores` | integer | no (`0`) | P1 entre 0 y 6. |
| `notas_8_a_10` | integer | no (`0`) | P1 ≥ 8. **No es lo mismo que `promotores`.** |
| `media_p1` | number | sí | Media de P1 (0–10), 2 decimales. |
| `csat` | number | sí | % de P2 en 4 o 5, 0–100, 1 decimal. |
| `media_p2` | number | sí | Media de P2 (1–5), 2 decimales. |
| `p3`, `p4` | object | no | `{etiqueta: string, media: number\|null, top_box: number\|null}`. `etiqueta` depende del rubro; `media` 1–5 con 2 decimales; `top_box` = % de 4 o 5, 1 decimal. |
| `alertas` | integer | no (`0`) | Respuestas con P1 ≤ 6 o P2 ≤ 2. |
| `comentarios` | object | no | `{felicitacion, reclamo, sugerencia, sin_comentario}`, todos enteros. |
| `distribucion_p1` | array | no | **Siempre 11 elementos**, `nota` 0 a 10 en orden: `{nota: integer, cantidad: integer}`. |
| `serie_diaria` | array | no (`[]`) | Solo días con respuestas, orden ascendente: `{fecha: "YYYY-MM-DD", respuestas: integer, suma_p1: integer, media_p1: number (2 dec.)}`. Los días sin datos **no aparecen**; rellénalos tú si el gráfico los necesita. |

**`respuestas[]`**: orden de la más reciente a la más antigua (`creado_en` descendente).

| Campo | Tipo | Nulo | Nota |
|---|---|---|---|
| `encuesta_id` | integer | no | No empieza en 1; no asumas continuidad. |
| `fecha` | string `YYYY-MM-DD` | no | Hora local de Chile (`America/Santiago`). |
| `hora` | string `HH:MM:SS` | no | Hora local de Chile. |
| `creado_en` | string ISO 8601 en UTC (`...Z`) | no | Mismo instante que `fecha` + `hora`. Para «hace N días», usa este campo. |
| `p1_nps` | integer 0–10 | no | |
| `p2_csat` | integer 1–5 | no | |
| `p3_atributo` | integer 1–5 | no | Su etiqueta está en `agregado.p3.etiqueta`. |
| `p4_atributo` | integer 1–5 | no | Su etiqueta está en `agregado.p4.etiqueta`. |
| `p5_comentario` | string ≤ 300 | **sí** | `null` si no hubo comentario. |
| `categoria_nps` | `"Promotor"` \| `"Pasivo"` \| `"Detractor"` | no | |
| `alerta` | boolean | no | |
| `tipo_comentario` | `"Felicitación"` \| `"Reclamo"` \| `"Sugerencia / mixto"` \| `"Sin comentario"` | no | |
| `bloque_horario` | `"Mañana"` \| `"Tarde"` \| `"Noche"` | no | Mañana 06–11, Tarde 12–19, Noche 20–05 (hora de Chile). |

Los nombres de campo (`nps`, `csat`, `categoria_nps`) son datos, **no texto para mostrar**. El
frontend tiene prohibido mostrar esa jerga (`docs/frontend/CANON.md`); elige las palabras visibles.

Ejemplo real (empresa 2; `serie_diaria` y `respuestas` recortados con `"..."`):

```json
{
 "empresa": {"empresa_id": 2, "nombre_negocio": "Café Rincón Andino", "rubro": "Cafetería / restaurante"},
 "agregado": {
  "respuestas": 20, "desde": "2026-10-19", "hasta": "2026-10-31",
  "nps": 25.0, "promotores": 10, "pasivos": 5, "detractores": 5, "notas_8_a_10": 14,
  "media_p1": 8.15, "csat": 70.0, "media_p2": 4.15,
  "p3": {"etiqueta": "Calidad del producto", "media": 3.75, "top_box": 70.0},
  "p4": {"etiqueta": "Tiempo de servicio", "media": 4.1, "top_box": 85.0},
  "alertas": 5,
  "comentarios": {"felicitacion": 9, "reclamo": 3, "sugerencia": 3, "sin_comentario": 5},
  "distribucion_p1": [
   {"nota": 0, "cantidad": 0}, {"nota": 1, "cantidad": 0}, {"nota": 2, "cantidad": 0},
   {"nota": 3, "cantidad": 0}, {"nota": 4, "cantidad": 0}, {"nota": 5, "cantidad": 3},
   {"nota": 6, "cantidad": 2}, {"nota": 7, "cantidad": 1}, {"nota": 8, "cantidad": 4},
   {"nota": 9, "cantidad": 3}, {"nota": 10, "cantidad": 7}
  ],
  "serie_diaria": [
   {"fecha": "2026-10-19", "respuestas": 1, "suma_p1": 9, "media_p1": 9.0},
   {"fecha": "2026-10-20", "respuestas": 2, "suma_p1": 15, "media_p1": 7.5},
   "..."
  ]
 },
 "respuestas": [
  {"encuesta_id": 158, "fecha": "2026-10-31", "hora": "15:20:00", "creado_en": "2026-10-31T18:20:00Z",
   "p1_nps": 10, "p2_csat": 5, "p3_atributo": 4, "p4_atributo": 4, "p5_comentario": null,
   "categoria_nps": "Promotor", "alerta": false, "tipo_comentario": "Sin comentario", "bloque_horario": "Tarde"},
  "..."
 ]
}
```

Empresa sin respuestas → 200 con: `respuestas: 0`; `desde`, `hasta`, `nps`, `media_p1`, `csat`,
`media_p2`, `p3.media`, `p3.top_box`, `p4.media` y `p4.top_box` en `null`; conteos en `0`;
`distribucion_p1` con 11 filas en `0`; `serie_diaria: []`; `respuestas: []`.

Errores: 404, 422, 503.

### 4.3 `GET /api/v1/empresas/{empresa_id}/encuesta` (existente, #13)

Textos y escalas de las 5 preguntas del rubro de la empresa. Errores: 404, 422, 503.

```json
{"empresa_id":2,"nombre_negocio":"Café Rincón Andino","rubro":"Cafetería / restaurante","preguntas":{"p1":{"texto":"¿Qué tan probable es que recomiendes el negocio a un amigo o familiar?","escala":[0,10]},"p2":{"texto":"En general, ¿qué tan satisfecho/a quedaste?","escala":[1,5]},"p3":{"texto":"¿Cómo calificas el sabor y la calidad de lo que consumiste?","escala":[1,5],"etiqueta":"Calidad del producto"},"p4":{"texto":"¿Qué tan conforme quedaste con el tiempo que tardó en llegar tu pedido?","escala":[1,5],"etiqueta":"Tiempo de servicio"},"p5":{"texto":"¿Qué podríamos hacer para que tu próxima visita sea mejor?","max_caracteres":300}}}
```

`escala` es `[mín, máx]`, no la lista de opciones.

### 4.4 `POST /api/v1/respuestas` (existente, #13)

**Efecto real:** cada llamada inserta una fila en Supabase, que aparece en el panel. No la uses
para pruebas sin avisar.

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `empresa_id` | integer | sí | 1–2147483647; debe existir (si no → 404). |
| `p1_nps` | integer | sí | 0–10. |
| `p2_csat`, `p3_atributo`, `p4_atributo` | integer | sí | 1–5. |
| `p5_comentario` | string \| null | no | ≤ 300 caracteres; se recorta; vacío → `null`. |

- Enteros **estrictos**: `"9"`, `9.0` y `true` → 422. Campos extra → 422.
- No hay clave de idempotencia: un doble envío crea dos filas. Deshabilita el botón tras el primer envío.
- 201 → `{"encuesta_id": <integer>}`. El servidor calcula todos los campos derivados.

## 5. Fórmulas del agregado

Mismas fórmulas que `docs/datos/scripts_analitica/pipeline_nlp_y_metricas.py`
(`calcular_metricas_satisfaccion`) y que `docs/datos/metodologia/cuestionarios_nps_por_rubro.docx`.
Implementación: `scansaydone-back/scansaydone/panel.py`.

| Métrica | Fórmula |
|---|---|
| `nps` | `round((promotores − detractores) / n × 100, 1)` |
| `csat` | `round(count(P2 ∈ {4,5}) / n × 100, 1)` |
| `pX.top_box` | `round(count(PX ∈ {4,5}) / n × 100, 1)` |
| `media_*` | `round(suma / n, 2)` |
| `alertas` | `count(P1 ≤ 6 o P2 ≤ 2)` |

Invariantes que un agente puede verificar en cada respuesta 200:

- `promotores + pasivos + detractores == respuestas`
- `sum(distribucion_p1[].cantidad) == respuestas` y `len(distribucion_p1) == 11`
- `sum(serie_diaria[].respuestas) == respuestas == len(respuestas[])`
- `sum(comentarios.*) == respuestas`

La metodología indica que con **menos de 30 respuestas** el NPS es solo referencial. Muestra
siempre `respuestas` junto al NPS.

## 6. Limitaciones conocidas (no las «arregles» desde el cliente sin acordarlo)

| Limitación | Consecuencia para el cliente |
|---|---|
| Sin token ni sesión | El cliente guarda `empresa_id` tras el login y lo pone en la URL. |
| Panel sin autenticación | Cualquier `empresa_id` es legible. Aceptado solo para la demo. |
| Sin filtro de fechas | Un selector 7/30/90 días debe filtrar en el cliente usando `respuestas[].fecha` / `serie_diaria[].fecha`. |
| Sin paginación | `respuestas[]` trae todo el historial de la empresa. |
| Sin canal/origen | No existe en el modelo; un bloque «Canales» no se puede alimentar. |
| Sin rate limit | Pendiente en #15. |
| Datos simulados del 19 al 31 de octubre de 2026 | Un filtro «últimos 7 días» calculado desde hoy devuelve vacío. |

## 7. Datos disponibles hoy en Supabase

| empresa_id | nombre_negocio | rubro | respuestas | nps | csat | alertas | usuario |
|---|---|---|---|---|---|---|---|
| 1 | Minimarket Don Lucho | Minimarket / almacén de barrio | 20 | 25.0 | 70.0 | 5 | `minimarket_don_lucho` |
| 2 | Café Rincón Andino | Cafetería / restaurante | 20 | 25.0 | 70.0 | 5 | `cafe_rincon_andino` |
| 3 | Peluquería Estilo Sur | Peluquería / centro de estética | 20 | 50.0 | 70.0 | 3 | `peluqueria_estilo_sur` |
| 4 | Cosmos Accesorios (Instagram) | Emprendimiento de venta online | 20 | 5.0 | 65.0 | 8 | `cosmos_accesorios` |

- Contraseñas: **no están en el repositorio.** Están en `scansaydone-back/credenciales_demo.csv`
  (ignorado por git, solo en el equipo de JPA). Pídeselas al humano; nunca las escribas en un archivo
  versionado.
- Las 80 respuestas vienen de `docs/datos/datasets/simulacion_80_encuestas.xlsx` (#16).

## 8. Qué se hizo en esta sesión (registro)

| Fecha | Cambio | Dónde |
|---|---|---|
| 2026-11-18 | Carga de las 80 encuestas simuladas en `fact_encuestas`, idempotente, con `--prueba` | `scripts/cargar_simulacion.py`, `scansaydone/simulacion.py` (commit `df3b0e5`) |
| 2026-11-18 | Derivados comunes para la API y la carga | `scansaydone/registro.py` |
| 2026-11-18 | Migración 0002 `dim_usuarios` (RLS activado), aplicada en Supabase | `alembic/versions/0002_usuarios.py` |
| 2026-11-18 | Cifrado PBKDF2-SHA256 y credenciales en dos pasos (`generar` → CSV, `cargar` → BD) | `scansaydone/seguridad.py`, `scripts/usuarios_demo.py` |
| 2026-11-18 | `POST /api/v1/auth/login` y `GET /api/v1/empresas/{empresa_id}/panel` | `routers/auth.py`, `routers/empresas.py`, `panel.py` (commit `4bfe083`) |

Pruebas: `python -m pytest` en `scansaydone-back/` (149 pasan; SQLite en memoria, sin Supabase).
