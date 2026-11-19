# Diseño: Backend de registro de respuestas (Issues #12 y #13)

> **Fecha:** 05-11-2026 · **Autor:** Juan Pablo Ahumada (`@JuampaCL`) con Claude Code
> **Rama:** `dev/JuampaCL` (todo el trabajo va en esta rama, sin ramas por feature)
> **Estado:** borrador para aprobación

## 1. Intención

Hoy la encuesta de ScanSayDone no guarda nada: el prototipo del frontend mantiene las respuestas en memoria. El Sprint 3 busca *"conectar la encuesta móvil con la base de datos Supabase/PostgreSQL y validar el cálculo de métricas NPS/CSAT"*.

Este trabajo entrega la mitad del backend:

- **#12:** las tablas del modelo de datos del equipo en Supabase.
- **#13:** el endpoint `POST /api/v1/respuestas`, que recibe las 5 preguntas, las valida con Pydantic y guarda la respuesta junto con las variables derivadas. Es la base que Nicolás (#14) necesita para conectar el formulario.

Los cálculos se hacen en Python, porque el área de datos ya tiene su lógica escrita en Python (`docs/datos/scripts_analitica/pipeline_nlp_y_metricas.py`). Por eso el backend sigue en FastAPI.

## 2. Fuentes de verdad

| Tema | Documento |
|---|---|
| Modelo de datos | `docs/datos/modelo_relacional/esquema_modelo_datos_erd.docx` (`fact_encuestas`, `dim_empresas`, `dim_rubros`) |
| Preguntas por rubro | `docs/datos/metodologia/cuestionarios_nps_por_rubro.docx` y la hoja «Preguntas por rubro» de `docs/datos/datasets/simulacion_80_encuestas.xlsx` |
| Reglas derivadas y NLP | `docs/datos/scripts_analitica/pipeline_nlp_y_metricas.py` |
| Alcance y reparto del sprint | `docs/sprints/pauta_sprint_3.md` |

Si este documento contradice el ERD en algo no marcado como «decisión», manda el ERD.

## 3. Objetivos

1. Crear en Supabase (PostgreSQL) las tablas `dim_rubros`, `dim_empresas` y `fact_encuestas` mediante migraciones versionadas, con los 4 rubros precargados.
2. Exponer `POST /api/v1/respuestas`, que valida el payload, calcula las variables derivadas y guarda la fila.
3. Exponer `GET /api/v1/empresas/{empresa_id}/encuesta`, que devuelve el negocio y los textos de las 5 preguntas de su rubro, para que el frontend no tenga que escribirlos a mano.
4. Mantener los endpoints actuales (`/`, `/health`, `/api/v1/qr/generate`, `/api/v1/nps/calculate`) con el mismo comportamiento.
5. Agregar pruebas automáticas con `pytest` y ejecutarlas en el CI.
6. Desplegar el backend en el **mismo proyecto de Vercel que el front** (`scansaydone`), usando **Vercel Services**: `/api/...` va a FastAPI y el resto a Next.js, con una sola URL.

## 4. Fuera de alcance (tienen dueño o sprint propio)

| Tema | Dónde va |
|---|---|
| Rate limiting y sanitización de P5 contra XSS/inyección | #15 (Daniel) |
| Carga de las 80 encuestas simuladas y validación de fórmulas | #16 (Bernarda) |
| Cambios en `scansaydone-front` | #14 (Nicolás) y equipo de front |
| Endpoints de métricas del dashboard y Supabase Auth | Sprint 4 (ver §11) |
| Alertas por correo | Sprint 4 o posterior |
| QR por mesa | No previsto: un comercio, un QR |

## 5. Anti-objetivos (sería un fracaso aunque funcione)

- Que el CI falle porque `import main` intenta conectarse a la base de datos o exige `DATABASE_URL`.
- Que alguien pueda leer o escribir las tablas usando la API pública de Supabase (la clave `anon` está expuesta en el frontend).
- Que una clave o el `.env` llegue al repositorio.
- Que se rompan los endpoints existentes o cambien sus contratos.
- Que el cambio a Services deje caído el front en producción (`scansaydone.vercel.app`).
- Que el bloque horario o la fecha queden en UTC: una encuesta respondida a las 09:00 en Chile debe quedar como «Mañana».
- Que el backend clasifique comentarios distinto del pipeline del área de datos.

## 6. Restricciones

- **Stack:** FastAPI + Pydantic 2 en `scansaydone-back/` y PostgreSQL en Supabase.
- **Despliegue:** Vercel (funciones serverless) en un solo proyecto con Services. Hay que conectarse a Supabase a través del pooler y no se puede depender de estado en memoria entre peticiones.
- **Front:** el contenido de `scansaydone-front/` no se modifica en este trabajo; es del equipo de front.
- **CI** (`.github/workflows/ci.yml`): los pasos `python -m py_compile main.py` y `python -c "import main"` se mantienen sin cambios y deben seguir pasando sin variables de entorno.
- **Versiones de Python:** el CI usa 3.11 y el equipo trabaja localmente con versiones más nuevas. El código debe funcionar desde 3.10.
- **Dependencias livianas:** sin pandas ni numpy en el backend desplegado, para no acercarse al límite de tamaño de las funciones de Vercel.
- **Idioma:** comentarios, documentación y commits en español.

## 7. Modelo de datos (Issue #12)

Las tablas siguen el ERD. Los tipos concretos y las restricciones `CHECK` son decisiones mías para que la base rechace datos imposibles.

### `dim_rubros`
| Columna | Tipo | Notas |
|---|---|---|
| `rubro_id` | `SMALLINT` PK | IDs fijos según el ERD: 1 Minimarket, 2 Cafetería, 3 Peluquería, 4 Online |
| `nombre` | `VARCHAR(80)` UNIQUE NOT NULL | Nombres completos como en el dataset (ej. «Minimarket / almacén de barrio») |
| `p3_label` | `VARCHAR(80)` NOT NULL | Ej. «Surtido y disponibilidad» |
| `p4_label` | `VARCHAR(80)` NOT NULL | Ej. «Calidad de la atención» |
| `p3_pregunta` | `TEXT` NOT NULL | **Decisión:** columna añadida al ERD; texto oficial del cuestionario |
| `p4_pregunta` | `TEXT` NOT NULL | **Decisión:** añadida |
| `p5_pregunta` | `TEXT` NOT NULL | **Decisión:** añadida (P5 cambia según el rubro) |

Datos precargados en la migración (etiquetas de `METADATA_RUBROS` en el pipeline; textos de la hoja «Preguntas por rubro»):

| id | nombre | p3_label | p4_label |
|---|---|---|---|
| 1 | Minimarket / almacén de barrio | Surtido y disponibilidad | Calidad de la atención |
| 2 | Cafetería / restaurante | Calidad del producto | Tiempo de servicio |
| 3 | Peluquería / centro de estética | Calidad técnica del servicio | Comunicación y personalización |
| 4 | Emprendimiento de venta online | Calidad y expectativa del producto | Cumplimiento logístico |

La sección 4 del ERD usa otras etiquetas («Sabor y calidad», «Resultado final», etc.). Se usan las de la tabla `dim_rubros` del ERD, que coinciden con el pipeline y el dataset.

### `dim_empresas`
| Columna | Tipo | Notas |
|---|---|---|
| `empresa_id` | `INTEGER` PK autoincremental | |
| `nombre_negocio` | `VARCHAR(120)` NOT NULL | |
| `rubro_id` | `SMALLINT` FK → `dim_rubros` NOT NULL | |

En el Sprint 4 se agregará `owner_user_id` (UUID de Supabase Auth). No va en esta migración.

### `fact_encuestas`
| Columna | Tipo | Origen |
|---|---|---|
| `encuesta_id` | `INTEGER` PK autoincremental | |
| `empresa_id` | `INTEGER` FK → `dim_empresas` NOT NULL, con índice | Payload |
| `fecha` | `DATE` NOT NULL | Servidor, hora de Chile |
| `hora` | `TIME` NOT NULL | Servidor, hora de Chile |
| `creado_en` | `TIMESTAMPTZ` NOT NULL default `now()` | **Decisión:** añadida para tener el instante exacto en UTC |
| `p1_nps` | `SMALLINT` NOT NULL `CHECK 0..10` | Payload |
| `p2_csat` | `SMALLINT` NOT NULL `CHECK 1..5` | Payload |
| `p3_atributo` | `SMALLINT` NOT NULL `CHECK 1..5` | Payload |
| `p4_atributo` | `SMALLINT` NOT NULL `CHECK 1..5` | Payload |
| `p5_comentario` | `VARCHAR(300)` NULL | Payload |
| `categoria_nps` | `VARCHAR(10)` NOT NULL `CHECK IN ('Promotor','Pasivo','Detractor')` | Calculada |
| `alerta` | `VARCHAR(6)` NOT NULL default `''` `CHECK IN ('ALERTA','')` | Calculada |
| `tipo_comentario` | `VARCHAR(20)` NOT NULL `CHECK IN ('Felicitación','Reclamo','Sugerencia / mixto','Sin comentario')` | NLP |
| `anio` | `SMALLINT` NOT NULL | Temporal |
| `mes_nombre` | `VARCHAR(10)` NOT NULL | Temporal |
| `semana_anio` | `SMALLINT` NOT NULL `CHECK 1..53` | Temporal |
| `dia_semana` | `VARCHAR(9)` NOT NULL | Temporal |
| `bloque_horario` | `VARCHAR(6)` NOT NULL `CHECK IN ('Mañana','Tarde','Noche')` | Temporal |

**Decisión sobre la alerta:** se guarda como `'ALERTA'` o `''`, tal como dice el ERD, para que coincida con el pipeline y el Streamlit del área de datos. El Excel usa celdas vacías: quien cargue el dataset (#16) debe convertirlas a `''`.

**Decisión sobre la semana:** el rango es 1..53 porque la semana ISO puede llegar a 53. El ERD dice 1-52.

### Seguridad de las tablas
- Se activa **RLS** en las tres tablas, sin políticas. Así los roles `anon` y `authenticated` de la API pública de Supabase no pueden leer ni escribir.
- El backend se conecta con el usuario de base de datos dueño de las tablas, que no queda sujeto a RLS.
- **Decidido por el usuario (05-11-2026):** solo el backend escribe en la base de datos, y todos los cálculos se hacen en Python en el backend. El frontend (#14) debe enviar las respuestas con `POST /api/v1/respuestas`; no puede escribir directamente en Supabase. La pauta dejaba abiertas ambas opciones, y esta decisión las cierra.

### Migraciones
- Se usa **Alembic** con migraciones en `scansaydone-back/alembic/`.
- La primera migración crea las tres tablas, activa RLS y carga `dim_rubros`.
- Se ejecutan manualmente desde una máquina local (`alembic upgrade head`) contra Supabase; no corren en el CI ni en Vercel.

### Datos de demostración
- `scansaydone-back/scripts/seed_demo.py` crea los 4 negocios simulados del dataset si no existen, buscándolos por nombre:
  - Minimarket Don Lucho
  - Café Rincón Andino
  - Peluquería Estilo Sur
  - Cosmos Accesorios (Instagram)
- Así hay `empresa_id` reales para probar el endpoint y para que Bernarda cargue las 80 encuestas (#16) usando esos mismos IDs.
- Es un script aparte, no parte de la migración, porque son datos de prueba.

## 8. API (Issue #13)

### `POST /api/v1/respuestas`
Público, sin login: es el envío del cliente final.

**Payload** (los campos extra se rechazan; solo se aceptan enteros JSON, no textos como `"9"` ni booleanos):
```json
{
  "empresa_id": 2,
  "p1_nps": 9,
  "p2_csat": 5,
  "p3_atributo": 4,
  "p4_atributo": 4,
  "p5_comentario": "Los mejores sándwiches de la zona."
}
```

| Campo | Regla |
|---|---|
| `empresa_id` | Entero ≥ 1 |
| `p1_nps` | Entero 0..10 |
| `p2_csat`, `p3_atributo`, `p4_atributo` | Entero 1..5 |
| `p5_comentario` | Opcional. Se le quitan los espacios de los extremos; si queda vacío se guarda `NULL`. Máximo 300 caracteres después de recortar. |

**Respuestas:**
- `201 Created` → `{"encuesta_id": 81}`. A propósito no se devuelven la categoría, la alerta ni la clasificación: el cliente final no las necesita.
- `404` → `{"detail": "Empresa no encontrada."}` si `empresa_id` no existe.
- `422` → error de validación estándar de FastAPI.
- `503` → `{"detail": "Servicio no disponible, intenta nuevamente."}` si la base de datos no responde. No se exponen detalles internos.

**Proceso al guardar:**
1. Validar el payload con Pydantic.
2. Obtener la hora actual en `America/Santiago` y derivar `fecha`, `hora` y las variables temporales.
3. Calcular las variables derivadas con las reglas de §9.
4. Insertar la fila. Si la empresa no existe, responder 404.

### `GET /api/v1/empresas/{empresa_id}/encuesta`
Público: lo usa la página `/encuesta/[id]` del frontend.

`200`:
```json
{
  "empresa_id": 2,
  "nombre_negocio": "Café Rincón Andino",
  "rubro": "Cafetería / restaurante",
  "preguntas": {
    "p1": {"texto": "¿Qué tan probable es que recomiendes el negocio a un amigo o familiar?", "escala": [0, 10]},
    "p2": {"texto": "En general, ¿qué tan satisfecho/a quedaste?", "escala": [1, 5]},
    "p3": {"texto": "¿Cómo calificas el sabor y la calidad de lo que consumiste?", "etiqueta": "Calidad del producto", "escala": [1, 5]},
    "p4": {"texto": "¿Qué tan conforme quedaste con el tiempo que tardó en llegar tu pedido?", "etiqueta": "Tiempo de servicio", "escala": [1, 5]},
    "p5": {"texto": "¿Qué podríamos hacer para que tu próxima visita sea mejor?", "max_caracteres": 300}
  }
}
```
- Los textos de P1 y P2 son comunes a todos los rubros y viven en el código. Se toman de la hoja «Preguntas por rubro» sin el sufijo de escala.
- P3, P4 y P5 vienen de `dim_rubros`.
- `404` si la empresa no existe.

### Endpoints existentes
Se mantienen con el mismo contrato. La lógica de `/api/v1/nps/calculate` se mueve a un módulo reutilizable; el endpoint sigue respondiendo exactamente lo mismo.

### CORS
- En producción el front y la API comparten dominio, así que CORS no interviene. Sí hace falta en desarrollo local: el front corre en `localhost:3000` y FastAPI en `localhost:8000`.
- **Decisión:** reemplazar `allow_origins=["*"]` por la lista de la variable `ALLOWED_ORIGINS`, separada por comas.
- Si la variable no existe, se usan por defecto `http://localhost:3000` y `https://scansaydone.vercel.app`.
- Las URLs de vista previa de Vercel del front se habilitan con la variable opcional `ALLOWED_ORIGIN_REGEX`, que se pasa a `allow_origin_regex`. Si no existe, no se aplica ningún patrón. Así no hay que adivinar el nombre del equipo de Vercel en el código.
- Con `"*"` y `allow_credentials=True`, los navegadores rechazan las peticiones con credenciales, que el dashboard necesitará en el Sprint 4.

## 9. Reglas de cálculo

Todas son funciones puras de Python, sin pandas, ubicadas en un módulo propio y probadas de forma aislada.

| Variable | Regla | Origen |
|---|---|---|
| `categoria_nps` | P1 ≥ 9 → Promotor; 7–8 → Pasivo; ≤ 6 → Detractor | ERD / pipeline |
| `alerta` | `'ALERTA'` si P1 ≤ 6 **o** P2 ≤ 2; si no, `''` | ERD / pipeline / cuestionarios |
| `tipo_comentario` | Copia fiel de `clasificar_comentario_nlp` del pipeline: mismas palabras clave, mismo orden de prioridad (Reclamo → Sugerencia → Felicitación → por defecto «Sugerencia / mixto») y búsqueda por subcadena en minúsculas. Vacío o `NULL` → «Sin comentario». | Pipeline |
| `anio` | Año de la fecha local | ERD |
| `mes_nombre` | Mes en español con mayúscula inicial («Noviembre»). **Decisión:** el pipeline usa `strftime('%B')`, que lo genera en inglés; el ERD pide español. | ERD |
| `semana_anio` | Semana ISO (`isocalendar().week`) | Pipeline |
| `dia_semana` | Día en español con tilde («Miércoles», «Sábado») | Pipeline |
| `bloque_horario` | 06:00–11:59 Mañana; 12:00–19:59 Tarde; resto Noche | ERD / pipeline |

- **Zona horaria (decisión):** `America/Santiago` mediante `zoneinfo`. Se agrega `tzdata` a las dependencias para que funcione en Windows y en cualquier runtime.
- **NLP:** el clasificador queda copiado desde el pipeline. Un comentario en ambos archivos debe indicar que cualquier cambio en las palabras clave se haga en los dos.

## 10. Estructura e implementación

Estructura sugerida; quien construya puede ajustar los nombres internos:

```text
scansaydone-back/
├── main.py                 # Crea `app`, CORS, incluye routers. Debe importar sin BD.
├── scansaydone/            # Paquete de la aplicación (no usar `api/`: Vercel trata esa carpeta de forma especial)
│   ├── config.py           # Lee variables de entorno (carga .env local si existe)
│   ├── db.py               # Engine y sesión, creados de forma diferida en el primer uso
│   ├── models.py           # Modelos SQLAlchemy de las 3 tablas
│   ├── schemas.py          # Modelos Pydantic de entrada/salida
│   ├── reglas.py           # Categoría, alerta, variables temporales
│   ├── nlp.py              # Clasificador de comentarios
│   ├── metricas.py         # Cálculo de NPS existente
│   └── routers/            # respuestas, empresas, general/qr/analytics
├── alembic/ + alembic.ini
├── scripts/seed_demo.py
├── tests/
├── requirements.txt        # Producción
├── requirements-dev.txt    # -r requirements.txt + pytest, httpx, alembic
└── .env.example            # POSTGRES_URL=, POSTGRES_URL_NON_POOLING=, ALLOWED_ORIGINS=, ALLOWED_ORIGIN_REGEX=
```

**Dependencias nuevas de producción:**
- `sqlalchemy>=2`
- `psycopg[binary]>=3`
- `python-dotenv`
- `tzdata`

`alembic` solo hace falta en local, así que va en `requirements-dev.txt`.

**Conexión (Supabase creado desde el Marketplace de Vercel):**
- Al conectar la base de datos al proyecto, la integración crea sus propias variables de entorno. Se esperan `POSTGRES_URL` (pooler, para la app) y `POSTGRES_URL_NON_POOLING` (para migraciones). Los nombres exactos se verifican en el panel una vez creada; no se inventan nombres propios.
- La app usa `POSTGRES_URL`. Si existe `DATABASE_URL`, tiene prioridad, como salida de emergencia.
- Alembic usa `POSTGRES_URL_NON_POOLING`, o `POSTGRES_URL` si la primera no existe.
- Si la URL de la app pasa por el *transaction pooler* (puerto 6543), con psycopg 3 hay que desactivar las sentencias preparadas (`prepare_threshold=None`). En serverless se usa `NullPool`.
- La URL de la base de datos solo se exige cuando un endpoint la necesita, nunca al importar.
- `config.py` acepta la URL tal como la entrega la integración (`postgres://` o `postgresql://`) y la normaliza a `postgresql+psycopg://`.
- Elimina los parámetros que libpq no reconoce y conserva `sslmode`. Las URLs de la integración pueden traer parámetros propios, como `supa=...`, que psycopg rechaza.
- **Seguridad:** `vercel env pull` y el panel de Vercel entregan las variables como `.env.local`. Hoy `scansaydone-back/.gitignore` solo ignora `.env`, y el job de seguridad del CI solo busca `*.env`. Por eso se agrega `.env*` (excepto `.env.example`) al `.gitignore` del backend.

**Pruebas (`pytest`):**
- Unitarias de `reglas.py` y `nlp.py`: bordes de cada regla (P1 = 6, 7, 8 y 9; P2 = 2 y 3; 05:59, 06:00, 11:59, 12:00, 19:59 y 20:00) y comentarios de ejemplo del dataset.
- Endpoints con `TestClient` sobre SQLite en memoria (sobrescribiendo la dependencia de sesión): 201 y fila guardada con sus derivadas; 404 por empresa inexistente; 422 por P1 = 11, P2 = 0, texto en lugar de entero, comentario de 301 caracteres y campo extra; GET de encuesta con 200 y 404.
- Regresión de `/api/v1/nps/calculate` y `/health`.
- Lo específico de PostgreSQL (RLS, pooler) se verifica manualmente contra Supabase y se deja anotado en el PR.

**CI:**
- Se instala `requirements-dev.txt`.
- Se agrega `scansaydone-back/requirements-dev.txt` a `cache-dependency-path`.
- Se agrega un paso `pytest` después de los existentes, que no cambian.

**Despliegue en Vercel (opción B, decidida por el usuario el 06-11-2026): un solo proyecto con Services**
- Se agrega un `vercel.json` en la **raíz del repositorio**, con dos servicios:
  - `frontend`, con `root` en `scansaydone-front/`.
  - `backend`, con `root` en `scansaydone-back/` y `entrypoint` `main:app`.
- Reglas de `rewrites`, en este orden:
  1. `/api/(.*)` → backend.
  2. `/health`, `/docs` y `/openapi.json` → backend.
  3. `/(.*)` → frontend.
- En el proyecto `scansaydone`, el *Root Directory* pasa de `scansaydone-front` a la raíz del repositorio, y el *Framework Preset*, a *Services*. Esto cambia el despliegue del front en producción: **se coordina con el equipo de front antes de hacerlo**.
- `scansaydone-front/vercel.json` no se toca en este trabajo. Si en la vista previa resulta incompatible con Services, se acuerda con el equipo de front cómo fusionarlo.
- **Verificaciones pendientes:** la documentación de Vercel no confirmó si Services está disponible en el plan Hobby, ni si la ruta completa `/api/v1/...` llega intacta a FastAPI. Ambas cosas se comprueban en un **despliegue de vista previa** desde `dev/JuampaCL` antes de tocar producción. Si Services no está disponible en Hobby, se vuelve a la opción A (segundo proyecto con *Root Directory* `scansaydone-back`), sin cambiar el código.
- Las variables de base de datos las crea la integración de Supabase en el proyecto `scansaydone`. `ALLOWED_ORIGINS` solo hace falta si se quiere cambiar el valor por defecto.
- **Decisión:** la región de las funciones se fija en São Paulo (`gru1`), la misma de Supabase (`sa-east-1`). La documentación confirma que Hobby permite elegir una región. Sin esto, Vercel usa por defecto EE. UU., y cada consulta a la base de datos cruzaría el continente.
- Publicar en producción requiere confirmación del usuario.
- Después se verifica de punta a punta en la vista previa y luego en producción: `GET /health`, `GET /api/v1/empresas/{id}/encuesta`, un `POST` real cuya fila se compruebe en Supabase, y que la página principal del front siga cargando.

**Documentación a actualizar:**
- `scansaydone-back/README.md`: endpoints, variables de entorno, migraciones y despliegue.
- `docs/roles/02_backend.md`: tabla de endpoints y despliegue en Vercel.

Las menciones a Render en otros documentos se listan en el PR para que el PM decida.

**Git:**
- Commits en `dev/JuampaCL`, solo cuando el usuario lo pida.
- El PR hacia `main` incluye `Closes #12` y `Closes #13`.

## 11. Nota para el Sprint 4 (no se implementa ahora)

- El dueño inicia sesión con **Supabase Auth** (correo y contraseña); la pantalla de login es del equipo de front.
- FastAPI validará el JWT de Supabase en los endpoints del dashboard.
- `dim_empresas.owner_user_id` vinculará cada negocio con su dueño.
- Los endpoints de métricas reutilizarán `metricas.py` y las reglas de §9, incluido CSAT, promedio y Top Box de P3/P4.

## 12. Riesgos conocidos

| Riesgo | Mitigación |
|---|---|
| `empresa_id` es incremental: alguien podría enviar respuestas a cualquier negocio | Lo cubre el rate limiting de #15. Un identificador público no adivinable queda como mejora futura. |
| El clasificador NLP busca subcadenas: «claro» marca como reclamo «quedó claro todo» | Se copia tal cual para no divergir; mejorarlo es tarea del área de datos. |
| Supabase gratis pausa el proyecto tras días sin uso | Revisar antes de cada demo. |
| Plan Hobby de Vercel: solo uso no comercial | Aceptable para el proyecto académico; revisar si el piloto pasa a uso comercial. |
| Copia duplicada del clasificador | Comentario cruzado en ambos archivos. |
| Con un solo proyecto, las variables `POSTGRES_*` también quedan disponibles para el código de servidor de Next.js; no llegan al navegador | Acuerdo con el equipo de front: Next.js no usa `POSTGRES_*` y escribe solo a través de la API |
| Cambiar el proyecto de producción a Services podría dejar caído el front | Probar primero en vista previa, coordinar con el equipo de front y tener lista la vuelta atrás (restaurar el *Root Directory* `scansaydone-front`) |

## 13. Prerrequisitos del usuario

- **Supabase:** aún no existe al 06-11-2026. **Decidido por el usuario:** se crea desde el Marketplace de Vercel (pestaña *Storage* del proyecto `scansaydone` → *Supabase*), en la región São Paulo, y se conecta a ese proyecto.
- **Coordinación con el equipo de front:** aviso de las variables `POSTGRES_*` y acuerdo de la fecha para cambiar el proyecto a Services.
- **`.env` local:** `scansaydone-back/.env` con las líneas `POSTGRES_URL` y `POSTGRES_URL_NON_POOLING` copiadas del panel de Vercel, sin compartirlas en el chat.
