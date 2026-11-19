# Backend: login de demostración y endpoint del panel

> **Estado: IMPLEMENTADO 2026-11-18** en `dev/JuampaCL`. Migración 0002 aplicada en Supabase y
> 4 usuarios de demostración cargados. Diferencias con lo propuesto, al final (§11).
> **Autor:** Juan Pablo Ahumada (`@JuampaCL`), con Claude Code · **Rama:** `dev/JuampaCL`
> **Relacionado:** `REQUISITOS-FRONTEND-DASHBOARD-2026-11-12.md` (requisitos del panel, Nicolás)
> y `PREGUNTAS-BACKEND-2026-11-12.md` (preguntas de integración).

## 1. Qué se busca y por qué

El panel (`/panel`) hoy muestra un dataset inventado y el login (`/entrar`) no abre sesión.
Desde el 18-11 Supabase tiene las 80 encuestas simuladas cargadas (#16), así que ya hay datos
reales de demostración que mostrar.

Para la demo se necesita:

1. Que un comerciante **entre con usuario y contraseña** y el sistema sepa **a qué empresa
   pertenece**.
2. Que el panel consulte **los datos de esa empresa**: el **detalle de cada respuesta** y el
   **agregado** (NPS, CSAT, atributos, alertas, comentarios, distribución y serie diaria).

Es una demo: la seguridad no es prioridad. En el Sprint 4 el login se reemplaza por
Supabase Auth.

## 2. Objetivos

1. Tabla `dim_usuarios` creada con una migración (0002): un usuario por empresa.
2. Generar las credenciales **antes** de cifrarlas, para poder guardarlas.
3. `POST /api/v1/auth/login`: valida usuario y contraseña y devuelve la empresa.
4. `GET /api/v1/empresas/{empresa_id}/panel`: devuelve la empresa, el agregado y el detalle
   de todas sus respuestas.

## 3. Fuera de alcance

| Tema | Motivo / dónde va |
|---|---|
| Tokens, sesiones, cerrar sesión, cambiar contraseña | Sprint 4 (Supabase Auth) |
| Restringir el endpoint del panel a la empresa del usuario | Se decidió la opción B (§5); el cambio a token queda para después |
| Filtro por fechas | El endpoint entrega **todo el historial**, sin filtrar (§6.4) |
| Canal / origen de la respuesta | Se quita del panel; no existe en el modelo |
| Cambios en el frontend | El código de Nicolás no se toca; él conecta el panel cuando quiera |
| Rate limit del login y de las respuestas | #15 (Daniel) |

## 4. Restricciones

- No se agregan dependencias: el cifrado usa `hashlib` de la librería estándar de Python.
- La tabla nueva sigue el patrón de la 0001: RLS activado sin políticas. Solo el backend lee
  y escribe; la API pública de Supabase no tiene acceso.
- Las contraseñas en texto plano **nunca** se suben a git ni se guardan en la base.
- Los contratos existentes (`/encuesta`, `/respuestas`, QR, NPS) no cambian.
- Pruebas con TDD en SQLite, como el resto del backend.

## 5. Enfoques considerados

**Dónde viven los usuarios**

| Opción | Ventaja | Costo | Decisión |
|---|---|---|---|
| Usuarios fijos en el código | Sin migración | No es una tabla; poco realista | Descartada |
| **Tabla `dim_usuarios`** | Realista; se puede regenerar | Migración y cifrado | **Elegida**: «con eso sirve para la demo» |
| Supabase Auth | La solución final | Más trabajo; Sprint 4 | Después |

**Cómo sabe el endpoint de qué empresa son los datos**

| Opción | Cómo funciona | Riesgo | Decisión |
|---|---|---|---|
| A. Token firmado | El login devuelve un token; `GET /api/v1/panel` lee la empresa del token | Requiere una clave secreta en `.env` y Vercel | Para más adelante |
| **B. ID en la URL** | El login devuelve `empresa_id`; el panel llama a `/empresas/{id}/panel` | Quien cambie el número en la URL ve otra empresa | **Elegida por ahora**: más simple y aceptable para la demo |

Pasar de B a A más adelante significa agregar el token al login y una ruta que lo lea; el
cálculo del panel se reutiliza tal cual.

## 6. Diseño

### 6.1 Migración 0002: `dim_usuarios`

| Columna | Tipo | Regla |
|---|---|---|
| `usuario_id` | Integer, PK autoincremental | |
| `usuario` | String(40) | Único (`uq_dim_usuarios_usuario`), en minúsculas |
| `hash_contrasena` | String(255) | Nunca la contraseña en texto plano |
| `empresa_id` | Integer, FK → `dim_empresas.empresa_id` | Obligatorio |
| `creado_en` | DateTime con zona horaria | `now()` por defecto |

- Se agrega el modelo `Usuario` en `models.py`. La prueba que compara modelos y migraciones
  debe seguir pasando.
- RLS activado en `dim_usuarios` (solo en PostgreSQL), igual que en la 0001.
- `downgrade` borra la tabla.

### 6.2 Cifrado de contraseñas

Módulo `scansaydone/seguridad.py`:

- `cifrar_contrasena(texto) -> str`: PBKDF2-SHA256 con 600 000 iteraciones y sal aleatoria de
  16 bytes. Guarda todo en un solo texto: `pbkdf2_sha256$600000$<sal>$<hash>` (base64).
- `verificar_contrasena(texto, cifrada) -> bool`: recalcula y compara con
  `hmac.compare_digest`. Si el formato no es válido, devuelve `False` en vez de fallar.

### 6.3 Credenciales de demostración, en dos pasos

Script `scripts/usuarios_demo.py`:

**Paso 1: `python scripts/usuarios_demo.py generar`**

- Lee las empresas de `dim_empresas`.
- Crea un usuario por empresa a partir del nombre: minúsculas, sin tildes, sin lo que vaya
  entre paréntesis, palabras unidas con `_`.

  | empresa_id | Negocio | Usuario |
  |---|---|---|
  | 1 | Minimarket Don Lucho | `minimarket_don_lucho` |
  | 2 | Café Rincón Andino | `cafe_rincon_andino` |
  | 3 | Peluquería Estilo Sur | `peluqueria_estilo_sur` |
  | 4 | Cosmos Accesorios (Instagram) | `cosmos_accesorios` |

- Genera una contraseña aleatoria de 12 caracteres con `secrets`.
- Escribe `scansaydone-back/credenciales_demo.csv` (`usuario,contrasena,empresa_id,nombre_negocio`)
  y muestra la tabla en pantalla. **El archivo queda fuera de git** (se agrega a `.gitignore`).
- Si el archivo ya existe, no lo sobrescribe salvo con `--forzar`, para no perder
  credenciales ya repartidas.
- No escribe nada en la base.

**Entre los pasos:** guardar las credenciales donde corresponda (gestor de contraseñas o
mensaje privado al equipo).

**Paso 2: `python scripts/usuarios_demo.py cargar`**

- Lee el CSV, valida que cada `empresa_id` exista, cifra cada contraseña y guarda los usuarios.
- Es idempotente: crea los que faltan y, si un usuario ya existe, actualiza su contraseña.
  Así, generar de nuevo y cargar sirve para cambiar las contraseñas.
- Muestra cuántos creó y cuántos actualizó.

### 6.4 `POST /api/v1/auth/login`

Petición:

```json
{ "usuario": "cafe_rincon_andino", "contrasena": "••••••••••••" }
```

- Mismas reglas estrictas que el resto de la API: campos desconocidos rechazados (422) y
  ambos campos obligatorios y no vacíos.
- El usuario se compara en minúsculas y sin espacios al inicio ni al final.

Respuestas:

| Código | Cuerpo | Cuándo |
|---|---|---|
| 200 | `{ "usuario": "cafe_rincon_andino", "empresa_id": 2, "nombre_negocio": "Café Rincón Andino" }` | Credenciales correctas |
| 401 | `{ "detail": "Usuario o contraseña incorrectos." }` | Usuario inexistente **o** contraseña mala (mismo mensaje en los dos casos) |
| 422 | Error de validación de FastAPI | Cuerpo mal formado |
| 503 | `{ "detail": "Servicio no disponible, intenta nuevamente." }` | Base de datos caída (ya existe) |

### 6.5 `GET /api/v1/empresas/{empresa_id}/panel`

- **Sin filtro de fechas:** entrega todas las respuestas de la empresa. El periodo que
  aparece en el agregado (`desde`/`hasta`) son la primera y la última fecha que hay en los
  datos. Con la simulación son el 19-10-2026 y el 31-10-2026.
- `404 {"detail": "Empresa no encontrada."}` si no existe; `503` si la base está caída.
- Números crudos y fechas ISO 8601; el frontend formatea (regla de Nicolás).

Respuesta 200:

```jsonc
{
  "empresa": { "empresa_id": 2, "nombre_negocio": "Café Rincón Andino",
               "rubro": "Cafetería / restaurante" },
  "agregado": {
    "respuestas": 20,
    "desde": "2026-10-19", "hasta": "2026-10-31",
    "nps": 25.0,                       // % promotores − % detractores, 1 decimal
    "promotores": 9, "pasivos": 6, "detractores": 5,   // 9–10 / 7–8 / 0–6
    "notas_8_a_10": 12,                // lo que el demo actual rotula «Notas 8–10»
    "media_p1": 7.85,                  // 2 decimales
    "csat": 70.0,                      // % de P2 en 4 o 5, 1 decimal
    "media_p2": 3.9,
    "p3": { "etiqueta": "Calidad del producto", "media": 4.1, "top_box": 75.0 },
    "p4": { "etiqueta": "Tiempo de servicio",   "media": 3.6, "top_box": 55.0 },
    "alertas": 5,                      // P1 ≤ 6 o P2 ≤ 2
    "comentarios": { "felicitacion": 8, "reclamo": 4, "sugerencia": 5, "sin_comentario": 3 },
    "distribucion_p1": [ { "nota": 0, "cantidad": 0 }, /* … siempre 11 filas, 0 a 10 */ ],
    "serie_diaria": [ { "fecha": "2026-10-19", "respuestas": 2, "suma_p1": 17, "media_p1": 8.5 } ]
  },
  "respuestas": [
    {
      "encuesta_id": 81, "fecha": "2026-10-19", "hora": "10:15:00",
      "creado_en": "2026-10-19T13:15:00Z",
      "p1_nps": 9, "p2_csat": 5, "p3_atributo": 4, "p4_atributo": 4,
      "p5_comentario": "Los mejores sándwiches de la zona, muy recomendados.",
      "categoria_nps": "Promotor", "alerta": false,
      "tipo_comentario": "Felicitación", "bloque_horario": "Mañana"
    }
  ]
}
```

*(Los valores del ejemplo son ilustrativos, salvo los del periodo y la primera respuesta.)*

Reglas del agregado:

- Mismas fórmulas que el pipeline del área de datos (`calcular_metricas_satisfaccion` en
  `docs/datos/scripts_analitica/pipeline_nlp_y_metricas.py`), para que los números coincidan
  con los suyos. El NPS reutiliza `metricas.calcular_nps`.
- `respuestas` viene ordenado del más reciente al más antiguo (`creado_en` descendente).
- `alerta` se entrega como `true`/`false` (en la base es `"ALERTA"` o `""`).
- `serie_diaria` trae solo los días con respuestas, en orden ascendente; el frontend rellena
  los días vacíos si los quiere mostrar.
- **Empresa sin respuestas:** 200 con conteos en `0`, listas `respuestas` y `serie_diaria`
  vacías, `distribucion_p1` con 11 filas en `0`, y `null` en lo que no se puede calcular
  (`nps`, medias, `csat`, `top_box`, `desde`, `hasta`). Nunca `0` para «sin datos».
- El cálculo vive en un módulo propio (`scansaydone/panel.py`) como función pura, separado
  de la ruta, para poder reutilizarlo cuando se pase a la opción A.

## 7. Pasos de implementación

Cada paso con TDD: prueba que falla, código mínimo, suite completa en verde.

1. `seguridad.py`: cifrar y verificar contraseñas.
2. Modelo `Usuario` y migración 0002 con RLS.
3. Script `usuarios_demo.py` (`generar` y `cargar`) y `credenciales_demo.csv` en `.gitignore`.
4. `POST /api/v1/auth/login`.
5. `panel.py` (cálculo del agregado) y `GET /api/v1/empresas/{empresa_id}/panel`.
6. README del backend y este documento actualizados con lo que quede implementado.

## 8. Puesta en marcha en Supabase

Desde `scansaydone-back/`, después de implementar:

```powershell
alembic upgrade head                          # crea dim_usuarios (migración 0002)
python scripts/usuarios_demo.py generar       # crea credenciales_demo.csv y las muestra
# → guardar las credenciales antes de seguir
python scripts/usuarios_demo.py cargar        # cifra y guarda los 4 usuarios
uvicorn main:app --reload                     # probar en http://localhost:8000/docs
```

Prueba rápida:

1. `POST /api/v1/auth/login` con un usuario del CSV → 200 con su `empresa_id`.
2. `GET /api/v1/empresas/{empresa_id}/panel` → 20 respuestas y el NPS de esa empresa
   (Minimarket 25, Café 25, Peluquería 50, Cosmos 5).

## 9. Para coordinar con Nicolás

- El panel puede pasar de `panel-data.ts` a estos dos endpoints cuando él decida; el backend
  no le impone fechas: el selector 7/30/90 puede filtrar en el navegador.
- Su documento de requisitos pedía no enviar «categorías tipo NPS/CSAT». Aquí van como
  **nombres de campo** (`categoria_nps`, `nps`, `csat`), no como texto para mostrar: el
  frontend decide qué se ve y con qué palabras.
- El bloque «Canales» queda sin datos: se quita del panel.
- «Promotores» (9–10) y «Notas 8–10» van en campos separados, así el rótulo del demo
  deja de ser ambiguo.

## 10. Riesgos aceptados para la demo

- Con la opción B, cualquiera que conozca un `empresa_id` puede ver el panel de esa empresa,
  incluidos los comentarios. Los datos son simulados; antes de usar datos reales hay que pasar
  a la opción A o a Supabase Auth.
- El login no tiene límite de intentos (#15).
- Las credenciales en texto plano existen solo en el CSV local, fuera de git.

## 11. Implementación (18-11-2026)

Lo implementado sigue este documento, con dos ajustes:

- **La contraseña no se recorta.** El usuario se normaliza (sin espacios a los lados y en
  minúsculas), pero la contraseña se compara exacta; solo se rechaza (422) si está vacía o es
  solo espacios. Recortarla cambiaría el secreto.
- **El NPS del panel no usa `metricas.calcular_nps`.** Esa función redondea a 2 decimales;
  volver a redondear a 1 puede diferir del pipeline en casos límite. `panel.py` aplica la
  fórmula del pipeline con un solo redondeo.

Verificado contra Supabase: los 4 usuarios entran con su contraseña y el panel de cada
empresa devuelve 20 respuestas con NPS 25 / 25 / 50 / 5, igual que la hoja «Resumen» del Excel.
