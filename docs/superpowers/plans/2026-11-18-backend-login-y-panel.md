# Login de demostración y endpoint del panel — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tabla `dim_usuarios` con un usuario por empresa, `POST /api/v1/auth/login` y `GET /api/v1/empresas/{empresa_id}/panel` con agregado y detalle.

**Architecture:** Cifrado con `hashlib.pbkdf2_hmac` en `seguridad.py`; migración Alembic 0002; script de dos pasos para las credenciales; el agregado es una función pura en `panel.py` que la ruta llama con las filas de la empresa.

**Tech Stack:** FastAPI, Pydantic 2, SQLAlchemy 2, Alembic, pytest (SQLite).

**Spec:** `docs/integracion/BACKEND-LOGIN-Y-PANEL-2026-11-18.md`

## Global Constraints

- Sin dependencias nuevas (solo librería estándar para cifrar).
- RLS activado en `dim_usuarios` en PostgreSQL, igual que la 0001.
- Contraseñas en texto plano solo en `scansaydone-back/credenciales_demo.csv`, ignorado por git.
- Contratos existentes sin cambios. El endpoint del panel no filtra por fechas.
- Mensajes y nombres en español. **Sin commits automáticos**: los hace el usuario.
- Comandos desde `scansaydone-back/` con `./venv/Scripts/python -m pytest`.

## Review Focus

- Usuario con mayúsculas o espacios en el login (`" Cafe_Rincon_Andino "`) → entra igual (Task 4).
- Contraseña vacía o solo espacios → 422, no 401 (Task 4).
- Hash con formato inválido en la base → `verificar_contrasena` devuelve `False`, no 500 (Task 1).
- Empresa sin respuestas → 200 con `null` y listas vacías (Task 5).
- CSV con un `empresa_id` inexistente → error y nada guardado (Task 3).

---

### Task 1: Cifrado de contraseñas

**Files:** Create `scansaydone/seguridad.py`, `tests/test_seguridad.py`

**Interfaces — Produces:** `cifrar_contrasena(texto: str) -> str`, `verificar_contrasena(texto: str, cifrada: str) -> bool`. Formato `pbkdf2_sha256$600000$<sal_b64>$<hash_b64>`, sal de 16 bytes.

- [ ] Tests: el cifrado empieza con `pbkdf2_sha256$600000$`; dos cifrados de la misma contraseña difieren; verificar la correcta → `True`, otra → `False`; `verificar_contrasena("x", "basura")` y `"pbkdf2_sha256$abc$$"` → `False`.
- [ ] Verlos fallar, implementar, verlos pasar.

### Task 2: Modelo `Usuario` y migración 0002

**Files:** Modify `scansaydone/models.py`; Create `alembic/versions/0002_usuarios.py`; Modify `tests/test_migracion.py`

**Interfaces — Produces:** `Usuario` (`dim_usuarios`): `usuario_id` Integer PK autoincremental, `usuario` String(40) con `UniqueConstraint(name="uq_dim_usuarios_usuario")`, `hash_contrasena` String(255), `empresa_id` Integer FK `dim_empresas.empresa_id`, `creado_en` DateTime(timezone=True) `server_default=func.now()`; relación `empresa`.

- [ ] Tests: `dim_usuarios` existe tras `upgrade head`; el SQL offline contiene `ALTER TABLE dim_usuarios ENABLE ROW LEVEL SECURITY`; insertar dos veces el mismo `usuario` falla con `IntegrityError`. `test_migracion_coincide_con_los_modelos` debe seguir pasando.
- [ ] Verlos fallar, implementar (0002 con `down_revision = "0001"`, RLS solo en PostgreSQL, `downgrade` borra la tabla), verlos pasar.

### Task 3: Script de credenciales en dos pasos

**Files:** Create `scansaydone/usuarios_demo.py`, `scripts/usuarios_demo.py`, `tests/test_usuarios_demo.py`; Modify `.gitignore` (agregar `credenciales_demo*.csv`)

**Interfaces — Consumes:** Task 1 y 2. **Produces:**
- `nombre_usuario(nombre_negocio: str) -> str`
- `generar_credenciales(sesion: Session) -> list[Credencial]` (`Credencial`: `usuario`, `contrasena`, `empresa_id`, `nombre_negocio`); contraseña `secrets`, 12 caracteres; si dos nombres chocan, el segundo lleva `_<empresa_id>`.
- `escribir_csv(ruta, credenciales, forzar=False)` → `FileExistsError` si existe y no se fuerza; `leer_csv(ruta) -> list[Credencial]` (UTF-8).
- `cargar_credenciales(sesion, credenciales) -> ResumenUsuarios(creados, actualizados)`: valida todas las empresas antes de escribir (`ValueError` si falta alguna); sin commit.
- CLI: `generar [--archivo] [--forzar]`, `cargar [--archivo]`.

- [ ] Tests: `nombre_usuario("Café Rincón Andino") == "cafe_rincon_andino"`, `nombre_usuario("Cosmos Accesorios (Instagram)") == "cosmos_accesorios"`; `generar_credenciales` da 4 usuarios con contraseñas de 12 caracteres distintas; `escribir_csv` sin `forzar` sobre un archivo existente → `FileExistsError`; ida y vuelta `escribir_csv`/`leer_csv`; `cargar_credenciales` crea 4, una segunda carga actualiza 4, y la contraseña guardada verifica; un `empresa_id` inexistente → `ValueError` y 0 usuarios; script `generar` + `cargar` contra SQLite migrada.
- [ ] Verlos fallar, implementar, verlos pasar.

### Task 4: `POST /api/v1/auth/login`

**Files:** Create `scansaydone/routers/auth.py`, `tests/test_auth.py`; Modify `scansaydone/schemas.py`, `main.py`

**Interfaces — Produces:** `LoginEntrada` (`extra="forbid"`; `usuario` 1–40 y `contrasena` 1–128, con strip y no vacíos); `SesionDemo(usuario, empresa_id, nombre_negocio)`.

- [ ] Tests: correcto → 200 con `{"usuario", "empresa_id", "nombre_negocio"}`; usuario `" Cafe_Rincon_Andino "` → 200; contraseña mala y usuario inexistente → 401 `{"detail": "Usuario o contraseña incorrectos."}`; contraseña `"   "` → 422; campo extra → 422.
- [ ] Verlos fallar, implementar, verlos pasar.

### Task 5: Agregado y `GET /api/v1/empresas/{empresa_id}/panel`

**Files:** Create `scansaydone/panel.py`, `tests/test_panel.py`; Modify `scansaydone/schemas.py`, `scansaydone/routers/empresas.py`

**Interfaces — Produces:** `calcular_agregado(encuestas: list[Encuesta], p3_etiqueta: str, p4_etiqueta: str) -> Agregado`; esquemas `PanelEmpresa {empresa, agregado, respuestas}` con la forma exacta de §6.5 del spec.

- [ ] Tests del cálculo con los 20 datos reales del Café (cargados con `cargar_simulacion` desde el Excel): `respuestas 20`, `nps 25.0`, `promotores 10`, `pasivos 5`, `detractores 5`, `notas_8_a_10 14`, `media_p1 8.15`, `csat 70.0`, `p3 media 3.75 top_box 70.0`, `p4 media 4.1 top_box 85.0`, `alertas 5`, comentarios `9/3/3/5`, `desde 2026-10-19`, `hasta 2026-10-31`, `distribucion_p1` con 11 filas que suman 20.
- [ ] Test de lista vacía: `nps`, `media_p1`, `csat`, `media_p2`, `p3.media`, `p3.top_box`, `desde`, `hasta` en `None`; conteos en 0; `distribucion_p1` con 11 ceros; `serie_diaria == []`.
- [ ] Tests del endpoint: 200 con `empresa.nombre_negocio`, 20 `respuestas` ordenadas por `creado_en` descendente, `alerta` booleana; 404 para una empresa inexistente; 422 para `empresa_id` 0.
- [ ] Verlos fallar, implementar, verlos pasar. Suite completa en verde.

### Task 6: Documentación y puesta en marcha

- [ ] README del backend: estructura, comandos y endpoints nuevos.
- [ ] En Supabase: `alembic upgrade head`, `usuarios_demo.py generar` (mostrar las credenciales al usuario), `usuarios_demo.py cargar`, y probar el login y el panel contra la base real.
- [ ] Marcar el spec como implementado.
