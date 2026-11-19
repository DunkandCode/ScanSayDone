# Backend de registro de respuestas — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Objetivo:** guardar en Supabase las encuestas QR de 5 preguntas mediante `POST /api/v1/respuestas`, con todas las variables derivadas calculadas en Python (Issues #12 y #13).

**Arquitectura:**
- El `main.py` actual se separa en un paquete `scansaydone/`: configuración, BD diferida, modelos SQLAlchemy, reglas puras, NLP y routers.
- Alembic crea las tablas del ERD en Supabase.
- Las pruebas usan SQLite en memoria, así que el CI no necesita la base de datos.
- El despliegue usa Vercel Services en el mismo proyecto que el front.

**Tecnologías:** Python ≥ 3.10, FastAPI, Pydantic 2, SQLAlchemy 2, psycopg 3, Alembic, pytest, Vercel Services, Supabase (PostgreSQL).

**Spec:** `docs/superpowers/specs/2026-11-05-backend-respuestas-design.md` (leerlo junto con este plan).

## Restricciones globales

- **Directorio:** todo el código va en `scansaydone-back/`, y todos los comandos se ejecutan desde ahí con el venv activado (`.\venv\Scripts\Activate.ps1`).
- **Rama:** `dev/JuampaCL`. No crear otras ramas.
- **Commits:** en español, con el pie `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Solo si el usuario autorizó commits durante la ejecución.
- **Front:** no modificar nada dentro de `scansaydone-front/`.
- **Importación sin BD:** `import main` debe funcionar sin variables de entorno y sin conectarse a la BD. Los pasos actuales del CI (`py_compile main.py` e `import main`) no se modifican.
- **Dependencias livianas:** sin pandas ni numpy en `requirements.txt`.
- **Sin `pyproject.toml`:** Vercel lo lee para el entrypoint y las dependencias. La configuración de pytest va en `pytest.ini`.
- **Zona horaria:** `America/Santiago`.
- **Textos con tildes exactas:** `Promotor`, `Pasivo`, `Detractor`, `ALERTA`, `Felicitación`, `Reclamo`, `Sugerencia / mixto`, `Sin comentario`, `Mañana`, `Tarde`, `Noche`.
- **Contratos existentes:** se mantienen sin cambios los de `/`, `/health`, `/api/v1/qr/generate` y `/api/v1/nps/calculate`.

## Puntos de revisión

1. **Comentario solo con espacios o saltos de línea:** debe guardarse como `NULL` y clasificarse como «Sin comentario». Lo cubre la prueba de la Task 5.
2. **Comentario de exactamente 300 caracteres con tildes o emoji:** se acepta. Con 301 caracteres útiles se rechaza, y los espacios de los extremos no cuentan. Prueba en la Task 5.
3. **BD caída o variables ausentes en Vercel:** debe responder `503` con un mensaje fijo, nunca un 500 con traceback. Prueba en la Task 5.
4. **Respuesta cerca de medianoche:** a las 23:30 en Chile ya es el día siguiente en UTC, y la fecha guardada debe ser la de Chile. Prueba en la Task 2.
5. **Números enviados como `true`, `"9"` o `9.0`:** el front puede serializarlos mal, y deben dar `422` en vez de guardarse convertidos. Prueba en la Task 5.

---

### Task 1: Esqueleto del paquete, configuración y BD diferida

**Archivos:**
- Crear:
  - `scansaydone/__init__.py` (vacío)
  - `scansaydone/config.py`
  - `scansaydone/db.py`
  - `requirements-dev.txt`
  - `pytest.ini`
  - `.env.example`
  - `tests/__init__.py`
  - `tests/test_config.py`
  - `tests/test_importacion.py`
- Modificar:
  - `requirements.txt`
  - `.gitignore`
  - `../.github/workflows/ci.yml` (solo el job `backend-test`)

**Interfaces:**
- Produce, en `scansaydone.config`:
  - `class ConfiguracionError(RuntimeError)`
  - `normalizar_url_db(url: str) -> str`
  - `obtener_url_db() -> str`
  - `obtener_url_migraciones() -> str`
  - `origenes_permitidos() -> list[str]`
  - `regex_origenes() -> str | None`
- Produce, en `scansaydone.db`:
  - `obtener_engine() -> Engine`, decorado con `functools.lru_cache`.
  - `get_session() -> Iterator[Session]`, la dependencia de FastAPI.

- [ ] **Paso 1: Preparar el entorno.**
  - `requirements.txt` agrega: `sqlalchemy>=2.0`, `psycopg[binary]>=3.2`, `python-dotenv>=1.0`, `tzdata>=2024.1`.
  - `requirements-dev.txt` contiene: `-r requirements.txt`, `pytest>=8`, `httpx>=0.27`, `alembic>=1.13`.
  - `pytest.ini`:
    ```ini
    [pytest]
    testpaths = tests
    pythonpath = .
    ```
  - `.gitignore` agrega `.env*` y `!.env.example`.
  - `.env.example` lista estas variables, todas vacías: `POSTGRES_URL=`, `POSTGRES_URL_NON_POOLING=`, `DATABASE_URL=`, `ALLOWED_ORIGINS=`, `ALLOWED_ORIGIN_REGEX=`.
  - Ejecutar `python -m venv venv; .\venv\Scripts\Activate.ps1; pip install -r requirements-dev.txt`.

  Resultado esperado: la instalación termina sin errores.

- [ ] **Paso 2: Escribir las pruebas que fallan, en `tests/test_config.py`.**

```python
import pytest
from scansaydone import config

def test_normaliza_esquema_postgres():
    assert config.normalizar_url_db("postgres://u:p@h:6543/postgres") == "postgresql+psycopg://u:p@h:6543/postgres"
    assert config.normalizar_url_db("postgresql://u:p@h:5432/postgres") == "postgresql+psycopg://u:p@h:5432/postgres"

def test_elimina_parametros_desconocidos_y_conserva_sslmode():
    url = "postgres://u:p@h:6543/postgres?sslmode=require&supa=base-pooler.x"
    assert config.normalizar_url_db(url) == "postgresql+psycopg://u:p@h:6543/postgres?sslmode=require"

def test_no_toca_urls_sqlite():
    assert config.normalizar_url_db("sqlite:///./x.db") == "sqlite:///./x.db"

def test_database_url_tiene_prioridad(monkeypatch):
    monkeypatch.setenv("POSTGRES_URL", "postgres://a@h/db")
    monkeypatch.setenv("DATABASE_URL", "postgres://b@h/db")
    assert config.obtener_url_db() == "postgresql+psycopg://b@h/db"

def test_sin_url_lanza_configuracion_error(monkeypatch):
    for var in ("DATABASE_URL", "POSTGRES_URL", "POSTGRES_URL_NON_POOLING"):
        monkeypatch.delenv(var, raising=False)
    with pytest.raises(config.ConfiguracionError):
        config.obtener_url_db()

def test_migraciones_prefieren_non_pooling(monkeypatch):
    monkeypatch.setenv("POSTGRES_URL", "postgres://pool@h:6543/db")
    monkeypatch.setenv("POSTGRES_URL_NON_POOLING", "postgres://directa@h:5432/db")
    monkeypatch.delenv("DATABASE_URL", raising=False)
    assert config.obtener_url_migraciones() == "postgresql+psycopg://directa@h:5432/db"

def test_origenes_por_defecto(monkeypatch):
    monkeypatch.delenv("ALLOWED_ORIGINS", raising=False)
    assert config.origenes_permitidos() == ["http://localhost:3000", "https://scansaydone.vercel.app"]

def test_origenes_desde_variable(monkeypatch):
    monkeypatch.setenv("ALLOWED_ORIGINS", "https://a.cl, https://b.cl")
    assert config.origenes_permitidos() == ["https://a.cl", "https://b.cl"]
```

  En `tests/test_importacion.py` va `test_main_importa_sin_variables_de_entorno`. Esta prueba ejecuta `python -c "import main; from scansaydone import db; assert db.obtener_engine.cache_info().currsize == 0"` en un subproceso con `cwd` en `scansaydone-back`, y con un entorno copiado de `os.environ` sin `DATABASE_URL` ni las variables `POSTGRES_*`. Espera `returncode == 0`.

- [ ] **Paso 3: Comprobar que fallan.**

  Ejecutar: `python -m pytest tests/test_config.py tests/test_importacion.py -v`

  Resultado esperado: FAIL con `ModuleNotFoundError: scansaydone`, o con un fallo de la aserción del subproceso.

- [ ] **Paso 4: Implementar `config.py` y `db.py`.**

  **En `config.py`:**
  - Al importar, llama a `load_dotenv(Path(__file__).resolve().parent.parent / ".env")`. No falla si el archivo no existe.
  - `normalizar_url_db` solo transforma URLs con esquema `postgres` o `postgresql`, que pasan a `postgresql+psycopg`.
  - Conserva únicamente estos parámetros de query: `sslmode`, `connect_timeout`, `application_name`, `options` y `target_session_attrs`.
  - Orden de búsqueda de `obtener_url_db`: `DATABASE_URL`, luego `POSTGRES_URL`.
  - Orden de búsqueda de `obtener_url_migraciones`: `POSTGRES_URL_NON_POOLING`, y si no existe, lo mismo que `obtener_url_db`.
  - `regex_origenes` devuelve `ALLOWED_ORIGIN_REGEX`, o `None` si la variable está vacía.

  **En `db.py`:**
  - `obtener_engine` usa `create_engine(url, poolclass=NullPool)`.
  - Si la URL es de PostgreSQL, agrega `connect_args={"prepare_threshold": None}`.
  - `get_session` abre una `Session(obtener_engine())`, la entrega con `yield` y la cierra al final.

- [ ] **Paso 5: Comprobar que pasan.**

  Ejecutar: `python -m pytest tests/test_config.py tests/test_importacion.py -v`

  Resultado esperado: 9 passed.

- [ ] **Paso 6: Actualizar el job `backend-test` de `.github/workflows/ci.yml`.**
  - `cache-dependency-path` pasa a ser una lista con 2 líneas: `scansaydone-back/requirements.txt` y `scansaydone-back/requirements-dev.txt`.
  - El paso de instalación usa `pip install -r requirements-dev.txt`.
  - Después del paso existente de sintaxis se agrega `- name: 🧪 Ejecutar pruebas del Backend`, con `working-directory: scansaydone-back` y `run: python -m pytest -v`.
  - El resto del archivo queda igual.

- [ ] **Paso 7: Commit.**

```bash
git add scansaydone-back/scansaydone scansaydone-back/tests scansaydone-back/requirements*.txt scansaydone-back/pytest.ini scansaydone-back/.env.example scansaydone-back/.gitignore .github/workflows/ci.yml
git commit -m "feat(back): configuración, conexión diferida a BD y pruebas en CI (#12)"
```

---

### Task 2: Reglas derivadas y clasificador NLP

**Archivos:**
- Crear:
  - `scansaydone/reglas.py`
  - `scansaydone/nlp.py`
  - `tests/test_reglas.py`
  - `tests/test_nlp.py`
- Modificar:
  - `../docs/datos/scripts_analitica/pipeline_nlp_y_metricas.py`: solo se agrega un comentario sobre `clasificar_comentario_nlp`, que diga que la lógica está copiada en `scansaydone-back/scansaydone/nlp.py` y que cualquier cambio se aplica en ambos archivos.

**Interfaces:**
- Produce, en `scansaydone.reglas`:
  - `ZONA_HORARIA: ZoneInfo`, con el valor `America/Santiago`.
  - `categoria_nps(p1: int) -> str`
  - `alerta(p1: int, p2: int) -> str`, que devuelve `"ALERTA"` o `""`.
  - `bloque_horario(hora: int) -> str`
  - `@dataclass(frozen=True) class VariablesTemporales`, con los campos `fecha: date`, `hora: time`, `anio: int`, `mes_nombre: str`, `semana_anio: int`, `dia_semana: str` y `bloque_horario: str`.
  - `variables_temporales(momento: datetime) -> VariablesTemporales`. `momento` debe venir con zona horaria; la función lo convierte a Chile y trunca la hora a segundos.
  - `ahora_chile() -> datetime`
- Produce, en `scansaydone.nlp`:
  - `clasificar_comentario(texto: str | None) -> str`

- [ ] **Paso 1: Escribir las pruebas que fallan, en `tests/test_reglas.py`.**

```python
from datetime import datetime, date, time, timezone
import pytest
from scansaydone import reglas

@pytest.mark.parametrize("p1,esperado", [(0,"Detractor"),(6,"Detractor"),(7,"Pasivo"),(8,"Pasivo"),(9,"Promotor"),(10,"Promotor")])
def test_categoria_nps(p1, esperado):
    assert reglas.categoria_nps(p1) == esperado

@pytest.mark.parametrize("p1,p2,esperado", [(6,5,"ALERTA"),(7,2,"ALERTA"),(7,3,""),(10,1,"ALERTA"),(9,5,"")])
def test_alerta(p1, p2, esperado):
    assert reglas.alerta(p1, p2) == esperado

@pytest.mark.parametrize("hora,esperado", [(5,"Noche"),(6,"Mañana"),(11,"Mañana"),(12,"Tarde"),(19,"Tarde"),(20,"Noche"),(0,"Noche")])
def test_bloque_horario(hora, esperado):
    assert reglas.bloque_horario(hora) == esperado

def test_variables_temporales_convierte_utc_a_chile_cerca_de_medianoche():
    # 06-11-2026 02:30 UTC = 05-11-2026 23:30 en Chile (UTC-3, horario de verano)
    v = reglas.variables_temporales(datetime(2026, 11, 6, 2, 30, 15, 999, tzinfo=timezone.utc))
    assert v.fecha == date(2026, 11, 5)
    assert v.hora == time(23, 30, 15)
    assert (v.anio, v.mes_nombre, v.dia_semana, v.bloque_horario) == (2026, "Noviembre", "Jueves", "Noche")
    assert v.semana_anio == 45

def test_variables_temporales_dia_y_mes_con_tilde():
    v = reglas.variables_temporales(datetime(2026, 9, 9, 13, 0, tzinfo=reglas.ZONA_HORARIA))
    assert (v.mes_nombre, v.dia_semana, v.bloque_horario) == ("Septiembre", "Miércoles", "Tarde")

def test_ahora_chile_tiene_zona():
    assert reglas.ahora_chile().tzinfo is not None
```

  En `tests/test_nlp.py` se usan ejemplos del dataset y bordes del clasificador:

```python
import pytest
from scansaydone.nlp import clasificar_comentario

@pytest.mark.parametrize("texto,esperado", [
    (None, "Sin comentario"), ("", "Sin comentario"), ("   \n ", "Sin comentario"),
    ("Los mejores sándwiches de la zona, muy recomendados.", "Felicitación"),
    ("El jugo estaba muy aguado y sin sabor.", "Reclamo"),
    ("Buena atención, ojalá tuvieran más opciones de verduras.", "Sugerencia / mixto"),
    ("El color quedó más claro de lo acordado, no quedé conforme.", "Reclamo"),
    ("Todo normal", "Sugerencia / mixto"),
    ("EXCELENTE servicio", "Felicitación"),
])
def test_clasificar_comentario(texto, esperado):
    assert clasificar_comentario(texto) == esperado
```

- [ ] **Paso 2: Comprobar que fallan.**

  Ejecutar: `python -m pytest tests/test_reglas.py tests/test_nlp.py -v`

  Resultado esperado: FAIL con `ModuleNotFoundError`.

- [ ] **Paso 3: Implementar.**

  **En `reglas.py`:**
  - Nombres de meses y días en español, como tuplas indexadas por número (`date.month`, `date.weekday()`).
  - La semana sale de `date.isocalendar()[1]`.

  **En `nlp.py`:**
  - Copiar literalmente las 3 listas `keywords_*` de `clasificar_comentario_nlp` del pipeline, como constantes `PALABRAS_RECLAMO`, `PALABRAS_SUGERENCIA` y `PALABRAS_FELICITACION`.
  - Mantener el mismo orden: Reclamo, luego Sugerencia, luego Felicitación y, por defecto, `"Sugerencia / mixto"`.
  - Si el texto es `None` o queda vacío tras `strip()`, devolver `"Sin comentario"`.
  - Agregar un comentario de cabecera que apunte al pipeline y pida aplicar los cambios en ambos archivos.
  - Agregar en el pipeline el comentario recíproco.

- [ ] **Paso 4: Comprobar que pasan.**

  Ejecutar: `python -m pytest tests/test_reglas.py tests/test_nlp.py -v`

  Resultado esperado: todas passed.

- [ ] **Paso 5: Commit.**

```bash
git add scansaydone-back/scansaydone/reglas.py scansaydone-back/scansaydone/nlp.py scansaydone-back/tests/test_reglas.py scansaydone-back/tests/test_nlp.py docs/datos/scripts_analitica/pipeline_nlp_y_metricas.py
git commit -m "feat(back): reglas de categoría NPS, alerta, variables temporales y NLP (#13)"
```

---

### Task 3: Separar `main.py` en routers sin cambiar contratos y restringir CORS

**Archivos:**
- Crear:
  - `scansaydone/metricas.py`
  - `scansaydone/routers/__init__.py`
  - `scansaydone/routers/general.py` (`/` y `/health`)
  - `scansaydone/routers/qr.py`
  - `scansaydone/routers/analytics.py`
  - `tests/test_endpoints_existentes.py`
  - `tests/test_cors.py`
- Modificar:
  - `main.py`: queda solo la creación de `app`, CORS, los manejadores de excepción y `include_router`.

**Interfaces:**
- Consume: `config.origenes_permitidos()` y `config.regex_origenes()`.
- Produce, en `scansaydone.metricas`:
  - `calcular_nps(ratings: list[int]) -> dict`, con las claves `total_responses`, `promoters`, `passives`, `detractors`, `nps_score` y `category`.
  - Lanza `ValueError` con el mismo mensaje que hoy entrega el `detail` del 400.
- Produce: `main.app`, que mantiene el título, la descripción y `version="0.1.0"`.

- [ ] **Paso 1: Escribir las pruebas de regresión** contra el `main.py` actual. Deben **pasar** antes del refactor.

```python
from fastapi.testclient import TestClient
from main import app
client = TestClient(app)

def test_root():
    assert client.get("/").json() == {"app": "ScanSayDone API", "team": "Dunk & Code XD", "status": "online", "docs": "/docs"}

def test_health():
    assert client.get("/health").json() == {"status": "ok", "version": "0.1.0"}

def test_qr_png():
    r = client.get("/api/v1/qr/generate", params={"target_url": "https://scansaydone.vercel.app/encuesta/2"})
    assert r.status_code == 200 and r.headers["content-type"] == "image/png" and r.content[:8] == b"\x89PNG\r\n\x1a\n"

def test_nps_calculo():
    r = client.post("/api/v1/nps/calculate", json={"ratings": [10, 9, 8, 4]})
    assert r.json() == {"total_responses": 4, "promoters": 2, "passives": 1, "detractors": 1, "nps_score": 25.0, "category": "Bueno"}

def test_nps_vacio():
    r = client.post("/api/v1/nps/calculate", json={"ratings": []})
    assert r.status_code == 400 and r.json()["detail"] == "La lista de calificaciones no puede estar vacía."

def test_nps_fuera_de_rango():
    r = client.post("/api/v1/nps/calculate", json={"ratings": [11]})
    assert r.status_code == 400 and r.json()["detail"] == "Calificación inválida: 11. Debe ser entre 0 y 10."
```

  En `tests/test_cors.py`, usando `monkeypatch.delenv("ALLOWED_ORIGINS")` y reimportando `main` con `importlib.reload`:
  - `test_preflight_localhost_permitido`: un `OPTIONS /api/v1/nps/calculate` con `Origin: http://localhost:3000` y `Access-Control-Request-Method: POST` responde 200, con `access-control-allow-origin` igual a `http://localhost:3000`.
  - `test_origen_desconocido_rechazado`: la misma petición con `Origin: https://malicioso.example` no trae el header `access-control-allow-origin`.

- [ ] **Paso 2: Comprobar los resultados.**

  Ejecutar: `python -m pytest tests/test_endpoints_existentes.py tests/test_cors.py -v`

  Resultado esperado: las 6 pruebas de regresión pasan; `test_origen_desconocido_rechazado` falla porque hoy CORS es `*`.

- [ ] **Paso 3: Implementar el refactor.**
  - Mover cada endpoint a su router con el mismo path, el mismo `tags` y la misma respuesta.
  - `analytics.py` convierte el `ValueError` de `calcular_nps` en `HTTPException(400, detail=str(e))`.
  - Configurar CORS en `main.py` con `allow_origins=config.origenes_permitidos()`, `allow_origin_regex=config.regex_origenes()`, `allow_credentials=True`, `allow_methods=["*"]` y `allow_headers=["*"]`.

- [ ] **Paso 4: Comprobar que pasan.**

  Ejecutar: `python -m pytest -v`

  Resultado esperado: todas passed, incluidas las de las Tareas 1 y 2.

- [ ] **Paso 5: Commit.**

```bash
git add scansaydone-back/main.py scansaydone-back/scansaydone scansaydone-back/tests
git commit -m "refactor(back): separar main.py en routers y restringir CORS por entorno"
```

---

### Task 4: Modelos, catálogo de rubros y migración Alembic

**Archivos:**
- Crear:
  - `scansaydone/catalogo.py`
  - `scansaydone/models.py`
  - `alembic.ini`
  - `alembic/env.py`
  - `alembic/script.py.mako`
  - `alembic/versions/0001_tablas_iniciales.py`
  - `tests/conftest.py`
  - `tests/test_migracion.py`

**Interfaces:**
- Produce, en `scansaydone.catalogo`:
  - `PREGUNTA_P1: str = "¿Qué tan probable es que recomiendes el negocio a un amigo o familiar?"`
  - `PREGUNTA_P2: str = "En general, ¿qué tan satisfecho/a quedaste?"`
  - `RUBROS: list[dict]`, con 4 dicts de claves `rubro_id`, `nombre`, `p3_label`, `p4_label`, `p3_pregunta`, `p4_pregunta` y `p5_pregunta`. Los valores van en la tabla de abajo.
- Produce, en `scansaydone.models`:
  - `class Base(DeclarativeBase)`
  - `Rubro`, sobre la tabla `dim_rubros`.
  - `Empresa`, sobre `dim_empresas`, con `relationship` `rubro`.
  - `Encuesta`, sobre `fact_encuestas`.
  - Las columnas, tipos y `CHECK` son exactamente los de la spec §7. Los nombres de los atributos son iguales a los de las columnas.
- Produce, en `tests/conftest.py`:
  - Fixture `engine_prueba`: SQLite en memoria con `StaticPool` y `check_same_thread=False`, con `Base.metadata.create_all` y los 4 `RUBROS` insertados.
  - Fixture `sesion`.
  - Fixture `empresa_cafe`: una `Empresa` con `nombre_negocio="Café Rincón Andino"` y `rubro_id=2`, ya guardada.
  - Fixture `client`: `TestClient(app)` con `app.dependency_overrides[get_session]` apuntando a sesiones de `engine_prueba`. Al terminar limpia los overrides.

**Datos de `RUBROS`** (textos sin el sufijo de escala, tomados de la hoja «Preguntas por rubro»):

| id | nombre | p3_label | p4_label | p3_pregunta | p4_pregunta | p5_pregunta |
|---|---|---|---|---|---|---|
| 1 | Minimarket / almacén de barrio | Surtido y disponibilidad | Calidad de la atención | ¿Qué tan fácil fue encontrar los productos que buscabas? | ¿Cómo calificas la amabilidad y disposición de quien te atendió? | ¿Qué es lo primero que cambiarías o mejorarías en nuestro local? |
| 2 | Cafetería / restaurante | Calidad del producto | Tiempo de servicio | ¿Cómo calificas el sabor y la calidad de lo que consumiste? | ¿Qué tan conforme quedaste con el tiempo que tardó en llegar tu pedido? | ¿Qué podríamos hacer para que tu próxima visita sea mejor? |
| 3 | Peluquería / centro de estética | Calidad técnica del servicio | Comunicación y personalización | ¿Qué tan conforme estás con el resultado final de tu servicio? | ¿Qué tanto sentiste que el profesional entendió lo que querías? | ¿Qué podríamos mejorar en tu próxima visita? |
| 4 | Emprendimiento de venta online | Calidad y expectativa del producto | Cumplimiento logístico | ¿Qué tanto coincidió el producto que recibiste con lo que esperabas (descripción y fotos)? | ¿Cómo calificas el cumplimiento del plazo de entrega que te prometimos? | ¿Qué podríamos mejorar en tu experiencia de compra? |

- [ ] **Paso 1: Escribir las pruebas que fallan, en `tests/test_migracion.py`.**

```python
import sqlalchemy as sa
from alembic import command
from alembic.config import Config

def test_migracion_crea_tablas_y_rubros(tmp_path, monkeypatch):
    url = f"sqlite:///{tmp_path / 'm.db'}"
    monkeypatch.setenv("POSTGRES_URL_NON_POOLING", url)
    command.upgrade(Config("alembic.ini"), "head")
    insp = sa.inspect(sa.create_engine(url))
    assert {"dim_rubros", "dim_empresas", "fact_encuestas"} <= set(insp.get_table_names())
    with sa.create_engine(url).connect() as c:
        filas = c.execute(sa.text("select rubro_id, nombre from dim_rubros order by rubro_id")).all()
    assert filas[0] == (1, "Minimarket / almacén de barrio") and len(filas) == 4

def test_check_rechaza_p1_fuera_de_rango(sesion, empresa_cafe):
    # Inserta una Encuesta válida salvo p1_nps=11 → IntegrityError al hacer flush
    ...
```

  `test_check_rechaza_p1_fuera_de_rango` construye una `Encuesta` con todos los campos válidos, salvo `p1_nps=11`, y verifica con `pytest.raises(sa.exc.IntegrityError)` que `sesion.flush()` falla.

- [ ] **Paso 2: Comprobar que fallan.**

  Ejecutar: `python -m pytest tests/test_migracion.py -v`

  Resultado esperado: FAIL, porque faltan `alembic.ini` y los modelos.

- [ ] **Paso 3: Implementar.**
  - **`alembic/env.py`:** toma la URL de `config.obtener_url_migraciones()` y usa `target_metadata = models.Base.metadata`.
  - **Migración `0001`:**
    - Crea las 3 tablas con `op.create_table`, con los tipos y `CHECK` de la spec §7 y el índice sobre `fact_encuestas.empresa_id`.
    - Carga `RUBROS` con `op.bulk_insert`, importando `scansaydone.catalogo`.
    - Si `op.get_bind().dialect.name == "postgresql"`, ejecuta `ALTER TABLE <t> ENABLE ROW LEVEL SECURITY` en las 3 tablas.
    - `downgrade` elimina las 3 tablas.
  - **`creado_en`:** usa `server_default=sa.func.now()`.

- [ ] **Paso 4: Comprobar que pasan.**

  Ejecutar: `python -m pytest -v`

  Resultado esperado: todas passed.

- [ ] **Paso 5: Commit.**

```bash
git add scansaydone-back/scansaydone/catalogo.py scansaydone-back/scansaydone/models.py scansaydone-back/alembic.ini scansaydone-back/alembic scansaydone-back/tests
git commit -m "feat(back): modelos dim_rubros, dim_empresas, fact_encuestas y migración con RLS (#12)"
```

---

### Task 5: `POST /api/v1/respuestas` y `GET /api/v1/empresas/{empresa_id}/encuesta`

**Archivos:**
- Crear:
  - `scansaydone/schemas.py`
  - `scansaydone/routers/respuestas.py`
  - `scansaydone/routers/empresas.py`
  - `tests/test_respuestas.py`
  - `tests/test_empresas.py`
- Modificar:
  - `main.py`: incluir los 2 routers y registrar manejadores de excepción para `sqlalchemy.exc.OperationalError` y `config.ConfiguracionError`. Ambos responden `503` con `{"detail": "Servicio no disponible, intenta nuevamente."}`.

**Interfaces:**
- Consume:
  - De `reglas`: `categoria_nps`, `alerta`, `variables_temporales` y `ahora_chile`.
  - De `nlp`: `clasificar_comentario`.
  - De `models`: `Empresa` y `Encuesta`.
  - De `catalogo`: `PREGUNTA_P1` y `PREGUNTA_P2`.
  - De `db`: `get_session`.
- Produce, en `scansaydone.schemas`:
  - `RespuestaEntrada`, con `extra="forbid"`. Todos los enteros son estrictos: `empresa_id ≥ 1`, `p1_nps` entre 0 y 10, y `p2_csat`, `p3_atributo` y `p4_atributo` entre 1 y 5.
  - En `RespuestaEntrada`, `p5_comentario: str | None` se recorta; si queda vacío pasa a `None`, y tiene un máximo de 300 caracteres después de recortar.
  - `RespuestaCreada(encuesta_id: int)`
  - `EncuestaEmpresa`, con la forma del JSON de la spec §8.
- Produce, en `scansaydone.routers.respuestas`: la dependencia `reloj() -> datetime`, que devuelve `ahora_chile()`. Las pruebas la sobrescriben.

- [ ] **Paso 1: Escribir las pruebas que fallan, en `tests/test_respuestas.py`.**

  Usan las fixtures `client`, `sesion` y `empresa_cafe`. Una fixture local sobrescribe `reloj` con `datetime(2026, 11, 6, 9, 15, tzinfo=reglas.ZONA_HORARIA)`.

```python
VALIDO = {"p1_nps": 5, "p2_csat": 3, "p3_atributo": 2, "p4_atributo": 2, "p5_comentario": "  El jugo estaba muy aguado y sin sabor.  "}

def test_crea_respuesta_con_derivadas(client, sesion, empresa_cafe, reloj_fijo):
    r = client.post("/api/v1/respuestas", json={**VALIDO, "empresa_id": empresa_cafe.empresa_id})
    assert r.status_code == 201 and set(r.json()) == {"encuesta_id"}
    e = sesion.get(Encuesta, r.json()["encuesta_id"])
    assert (e.categoria_nps, e.alerta, e.tipo_comentario) == ("Detractor", "ALERTA", "Reclamo")
    assert e.p5_comentario == "El jugo estaba muy aguado y sin sabor."
    assert (str(e.fecha), str(e.hora), e.mes_nombre, e.dia_semana, e.bloque_horario, e.semana_anio) == ("2026-11-06", "09:15:00", "Noviembre", "Viernes", "Mañana", 45)

def test_comentario_solo_espacios_queda_nulo(client, sesion, empresa_cafe, reloj_fijo):
    r = client.post("/api/v1/respuestas", json={**VALIDO, "empresa_id": empresa_cafe.empresa_id, "p5_comentario": " \n\t "})
    e = sesion.get(Encuesta, r.json()["encuesta_id"])
    assert e.p5_comentario is None and e.tipo_comentario == "Sin comentario"

def test_comentario_300_caracteres_con_tildes_y_emoji_se_acepta(client, empresa_cafe, reloj_fijo):
    texto = ("ñá😀" * 100)  # 300 caracteres
    assert client.post("/api/v1/respuestas", json={**VALIDO, "empresa_id": empresa_cafe.empresa_id, "p5_comentario": f"  {texto}  "}).status_code == 201

def test_comentario_301_caracteres_se_rechaza(client, empresa_cafe):
    assert client.post("/api/v1/respuestas", json={**VALIDO, "empresa_id": empresa_cafe.empresa_id, "p5_comentario": "a" * 301}).status_code == 422

@pytest.mark.parametrize("cambio", [{"p1_nps": 11}, {"p1_nps": -1}, {"p2_csat": 0}, {"p4_atributo": 6},
    {"p1_nps": "9"}, {"p1_nps": 9.0}, {"p1_nps": True}, {"empresa_id": 0}, {"extra": 1}])
def test_payload_invalido_da_422(client, empresa_cafe, cambio):
    assert client.post("/api/v1/respuestas", json={**VALIDO, "empresa_id": empresa_cafe.empresa_id, **cambio}).status_code == 422

def test_sin_comentario_es_valido(client, empresa_cafe, reloj_fijo):
    cuerpo = {k: v for k, v in VALIDO.items() if k != "p5_comentario"}
    assert client.post("/api/v1/respuestas", json={**cuerpo, "empresa_id": empresa_cafe.empresa_id}).status_code == 201

def test_empresa_inexistente_da_404(client, reloj_fijo):
    r = client.post("/api/v1/respuestas", json={**VALIDO, "empresa_id": 999})
    assert r.status_code == 404 and r.json() == {"detail": "Empresa no encontrada."}

def test_bd_caida_da_503():
    # dependency_overrides[get_session] = generador que lanza sa.exc.OperationalError("x", None, Exception())
    ...  # assert status 503 y detail exacto

def test_sin_variables_de_entorno_da_503(monkeypatch):
    # sin overrides, sin DATABASE_URL/POSTGRES_*; obtener_engine.cache_clear() antes y después
    ...  # assert status 503 y detail exacto
```

  En `tests/test_empresas.py`:
  - `test_encuesta_de_empresa`: hace un GET con el id de `empresa_cafe` y espera 200, con:
    - `nombre_negocio == "Café Rincón Andino"` y `rubro == "Cafetería / restaurante"`.
    - `preguntas.p1.texto == PREGUNTA_P1` y `preguntas.p1.escala == [0, 10]`.
    - `preguntas.p3.etiqueta == "Calidad del producto"`.
    - `preguntas.p4.texto == "¿Qué tan conforme quedaste con el tiempo que tardó en llegar tu pedido?"`.
    - `preguntas.p5.max_caracteres == 300`.
  - `test_encuesta_empresa_inexistente_da_404`: espera `{"detail": "Empresa no encontrada."}`.

- [ ] **Paso 2: Comprobar que fallan.**

  Ejecutar: `python -m pytest tests/test_respuestas.py tests/test_empresas.py -v`

  Resultado esperado: FAIL con 404 de ruta inexistente, o con `ImportError`.

- [ ] **Paso 3: Implementar.**
  - **POST:**
    - Responde `status_code=201`.
    - Busca la empresa con `session.get(Empresa, id)`; si no existe, responde `HTTPException(404, "Empresa no encontrada.")`.
    - Calcula las variables con `variables_temporales(reloj())` y crea la `Encuesta` con las derivadas.
    - Hace `commit` y devuelve `RespuestaCreada`.
  - **GET:** arma la respuesta desde `empresa.rubro` y las constantes del catálogo.

- [ ] **Paso 4: Comprobar que pasan.**

  Ejecutar: `python -m pytest -v`

  Resultado esperado: todas passed.

- [ ] **Paso 5: Commit.**

```bash
git add scansaydone-back/main.py scansaydone-back/scansaydone scansaydone-back/tests
git commit -m "feat(back): endpoint POST /api/v1/respuestas y encuesta por empresa (#13)"
```

---

### Task 6: Datos de demostración y documentación

**Archivos:**
- Crear:
  - `scansaydone/demo.py`
  - `scripts/seed_demo.py`
  - `tests/test_demo.py`
- Modificar:
  - `README.md` (del backend)
  - `../docs/roles/02_backend.md`

**Interfaces:**
- Produce, en `scansaydone.demo`:
  - `EMPRESAS_DEMO: list[tuple[str, int]]`, con estos pares: `("Minimarket Don Lucho", 1)`, `("Café Rincón Andino", 2)`, `("Peluquería Estilo Sur", 3)` y `("Cosmos Accesorios (Instagram)", 4)`.
  - `asegurar_empresas_demo(session: Session) -> dict[str, int]`, que devuelve el mapa de nombre a `empresa_id`.
- `scripts/seed_demo.py`: abre `Session(obtener_engine())`, llama a la función, hace `commit` e imprime el mapa.

- [ ] **Paso 1: Escribir la prueba que falla.**

  `test_asegurar_empresas_demo_es_idempotente(sesion)` llama 2 veces a la función y verifica:
  - Los mapas devueltos son iguales.
  - Hay 4 filas en `dim_empresas`.
  - El `rubro_id` de cada una coincide con `EMPRESAS_DEMO`.

- [ ] **Paso 2: Comprobar que falla.**

  Ejecutar: `python -m pytest tests/test_demo.py -v`

  Resultado esperado: FAIL con `ModuleNotFoundError`.

- [ ] **Paso 3: Implementar.** La función busca cada empresa por `nombre_negocio` y crea solo las que falten.

- [ ] **Paso 4: Comprobar que pasa.**

  Ejecutar: `python -m pytest -v`

  Resultado esperado: todas passed.

- [ ] **Paso 5: Actualizar la documentación.**
  - **`README.md` del backend:** estructura, variables de entorno (`.env.example`), `alembic upgrade head`, `python scripts/seed_demo.py`, `python -m pytest` y la tabla de endpoints con los ejemplos de JSON de la spec §8.
  - **`docs/roles/02_backend.md`:** actualizar la tabla de endpoints y cambiar la referencia de despliegue de Render a Vercel (Services).

- [ ] **Paso 6: Commit.**

```bash
git add scansaydone-back/scansaydone/demo.py scansaydone-back/scripts scansaydone-back/tests/test_demo.py scansaydone-back/README.md docs/roles/02_backend.md
git commit -m "feat(back): datos de demostración y documentación del backend (#12 #13)"
```

---

### Task 7: Crear las tablas en Supabase (requiere al usuario)

**Prerrequisito:** el usuario confirma que Supabase está creado en Vercel y que `scansaydone-back/.env` tiene `POSTGRES_URL` y `POSTGRES_URL_NON_POOLING`.

**Antes de empezar:** detener el trabajo y avisar al usuario: «Llegamos al paso de Supabase».

- [ ] **Paso 1: Verificar los nombres de las variables sin mostrar sus valores.**

  Ejecutar: `python -c "from scansaydone import config; import urllib.parse as u; print(u.urlsplit(config.obtener_url_migraciones()).port)"`

  Resultado esperado: un número de puerto, como `5432`, sin imprimir credenciales.

- [ ] **Paso 2: Ejecutar `alembic upgrade head`** (con `timeout 120`, por si la conexión directa no responde).

  Resultado esperado: termina con código 0 sin imprimir nada (`alembic.ini` no configura logging). Confirmar con una consulta: `select version_num from alembic_version` devuelve `0001`.

- [ ] **Paso 3: Ejecutar `python scripts/seed_demo.py`.**

  Resultado esperado: el mapa con los 4 negocios y sus IDs.

- [ ] **Paso 4: Verificar RLS.**

  Ejecutar, con SQLAlchemy contra `obtener_url_migraciones()`: `select relname, relrowsecurity from pg_class where relname in ('dim_rubros','dim_empresas','fact_encuestas','alembic_version')`.

  Resultado esperado: las 4 filas con `True` (`alembic_version` también está en `public`).

- [ ] **Paso 5: Prueba local de punta a punta.**
  1. Levantar `uvicorn main:app`.
  2. Hacer `GET /api/v1/empresas/<id del café>/encuesta`, que debe responder 200.
  3. Hacer `POST /api/v1/respuestas` con el ejemplo de la spec §8, que debe responder 201.
  4. Consultar la fila en `fact_encuestas` y comprobar `categoria_nps="Promotor"`, `alerta=""` y `tipo_comentario="Felicitación"`.
  5. Borrar esa fila de prueba.

- [ ] **Paso 6: Informar al usuario.**
  - Avisarle que el #12 quedó cumplido en Supabase.
  - Entregarle los IDs de los negocios demo para Bernarda (#16).

---

### Task 8: Despliegue con Vercel Services (requiere coordinación)

**Archivos:**
- Crear: `../vercel.json`, en la raíz del repositorio.

**Contexto:** el proyecto `scansaydone` hoy usa *Root Directory* `scansaydone-front`, así que un `vercel.json` en la raíz no lo afecta hasta que cambie esa configuración. La validación se hace en un **proyecto temporal**, para no tocar producción.

- [ ] **Paso 1: Crear `vercel.json` en la raíz** con los servicios y `rewrites` de la spec §10:
  1. `/api/(.*)` → backend.
  2. `/health`, `/docs` y `/openapi.json` → backend.
  3. `/(.*)` → frontend.

  Agregar `"regions": ["gru1"]`. Antes de escribirlo, consultar la documentación vigente de Vercel Services (`search_vercel_documentation`) para confirmar las claves válidas y si `regions` se declara a nivel de proyecto o de servicio.

- [ ] **Paso 2: Commit y push a `dev/JuampaCL`,** con confirmación del usuario.

```bash
git add vercel.json
git commit -m "chore(deploy): configurar Vercel Services para front Next.js y backend FastAPI"
```

- [ ] **Paso 3: El usuario crea el proyecto temporal `scansaydone-services-prueba`.**
  - Usa el mismo repositorio, con *Root Directory* en la raíz y *Framework Preset* `Services`.
  - Despliega la rama `dev/JuampaCL`.
  - Conecta la base de datos `scansaydone-db`.
  - Si Services no está disponible en Hobby, se detiene la tarea y se vuelve a la opción A, según la spec §10.

- [ ] **Paso 4: Verificar en la URL de vista previa:**
  1. `/` carga la página del front.
  2. `/health` devuelve `{"status":"ok","version":"0.1.0"}`.
  3. `/api/v1/empresas/<id>/encuesta` responde 200.
  4. `POST /api/v1/respuestas` responde 201, y la fila aparece en Supabase. Después se borra.
  5. `/docs` carga Swagger.
  6. `vercel inspect` muestra la región `gru1`.

- [ ] **Paso 5: Informar al usuario.**
  - Entregarle el resultado de las verificaciones.
  - Proponerle la secuencia para producción, que él coordina con el equipo de front:
    1. Merge del PR (`Closes #12`, `Closes #13`) a `main`.
    2. Cambiar el proyecto `scansaydone` a *Root Directory* en la raíz con *Framework Preset* `Services`.
    3. Hacer un redeploy.
    4. Repetir las verificaciones del Paso 4.
    5. Si algo falla, volver atrás restaurando el *Root Directory* `scansaydone-front`.
  - Eliminar el proyecto temporal y desconectar la base de datos de él.
