# Supabase — cómo leer los datos (Vercel) y llegar a las tablas

> **Estado: BORRADOR 2026-11-18.** Análisis estático. Nadie se conectó a Supabase, ejecutó
> consultas ni imprimió secretos. Documenta **cómo leer** datos para cálculos, sin escribir.
> Hechos de repo con `archivo:línea`; comportamiento de plataforma marcado `sin_evidencia (repo)`.

## 1. Dónde están las credenciales

| Hecho | Cita |
|---|---|
| `POSTGRES_*` las crea la integración de Supabase en Vercel | `.env.example:2`; `README.md:41` |
| Variables: `POSTGRES_URL` (runtime), `POSTGRES_URL_NON_POOLING` (migraciones), `DATABASE_URL` (override) | `.env.example:3-6` |
| Solo el servicio `backend` las consume; el frontend no tiene ninguna variable de BD | `vercel.json:9-13`; `scansaydone-front/src/lib/config/site.ts:11-13` |
| «Solo este backend accede a los datos» | `README.md:60` |

Rutas de Vercel (`vercel.json:15-20`): `/api/*`, `/health`, `/docs`, `/openapi.json` van a FastAPI; el resto a Next.

## 2. Rutas de acceso para leer

| Ruta | Credencial | ¿Alcanza las 3 tablas? | Riesgo si filtra |
|---|---|---|---|
| **A. Postgres directo** (script local, psycopg/SQLAlchemy) | cadena de conexión de Supabase | **Sí** (rol dueño, RLS no aplica) | Alto: el dueño puede escribir y borrar |
| B. REST Supabase (`anon`) | anon key | **No**: RLS activo sin políticas → 0 filas | Bajo pero inútil hoy (`0001_tablas_iniciales.py:83-87`) |
| C. REST Supabase (`service_role`) | service_role | Sí | Máximo: bypassa RLS; key viva en headers |
| D. FastAPI desplegado | ninguna | **No para métricas**: ningún endpoint devuelve filas de `fact_encuestas` | Nulo |
| E. Dashboard → SQL Editor | login de cuenta | Sí | Cuenta comprometida = BD completa |

Detalle de D: los 6 endpoints montados (`main.py:52-56`) no exponen respuestas; `POST /api/v1/nps/calculate` calcula sin BD (`routers/analytics.py:22-31`), y `GET /api/v1/empresas/{id}/encuesta` solo lee `dim_empresas` + `dim_rubros` (`routers/empresas.py:30-44`).

## 3. Qué cadena usar para leer

| Opción | Puerto | Preparadas | Uso recomendado |
|---|---|---|---|
| Transaction pooler | 6543 | No (por eso el repo usa `prepare_threshold=None`, `db.py:21-24`) | SELECT cortos; `SET` de sesión no persiste |
| **Session pooler** | 5432 | Sí | **Recomendada**: sesión estable, permite `statement_timeout` y modo read-only |
| Directa `db.<ref>.supabase.co` | 5432 | Sí | Solo con IPv6; el repo la reserva para Alembic (`config.py:62-67`) |

No importes `obtener_engine()` de la app para leer: hereda la URL de escritura. Crea una conexión propia.

## 4. Patrón read-only (sin escrituras)

```python
import psycopg  # psycopg 3, el mismo driver del repo (requirements.txt:7)

conn = psycopg.connect(
    "<session-pooler :5432>",
    connect_timeout=5,
    options="-c statement_timeout=15000 -c default_transaction_read_only=on",
)
with conn.cursor() as cur:
    cur.execute("select current_user, current_database(), inet_server_addr();")
    for fila in cur.fetchall():
        print(fila)
conn.close()
```

`default_transaction_read_only=on` hace que el servidor **rechace** escrituras y DDL aunque el script se equivoque. `options` está en la allowlist del normalizador (`config.py:22-24`).

Reglas del script lector:

1. Solo `SELECT`. Nunca `create_all`, `alembic`, seed ni `commit`.
2. No importar `scansaydone.models` para evitar `create_all` accidental.
3. Cadena en `scansaydone-back/.env` (ignorado por git, `.gitignore:24`), nunca en el historial de PowerShell.

## 5. Verificación de que llegaste a las tablas

| # | Consulta | Esperado |
|---|---|---|
| 1 | `select current_user, current_database(), inet_server_addr();` | 1 fila; usuario de la URL; base `postgres` |
| 2 | `select count(*) from dim_empresas;` | ≥ 4 si corrió el seed (`scansaydone/demo.py:21-34`) |
| 3 | `select rubro_id, nombre from dim_rubros order by rubro_id;` | Exactamente 4 filas (ids 1–4, `catalogo.py:12-49`) |
| 4 | `select count(*), min(fecha), max(fecha) from fact_encuestas;` | 0 si nadie cargó la simulación; N>0 si el área de datos ya cargó |

Si el paso 2 o 4 da 0: **no corras seed ni migraciones desde el script lector**. Ambas escriben (`scripts/seed_demo.py:22-25`; `0001:90-94`).

## 6. Consultas de métricas con las columnas que existen

Umbrales del repo: promotor 9–10, pasivo 7–8, detractor 0–6 (`scansaydone/reglas.py:31-37`); NPS = %promotores − %detractores (`metricas.py:22`).

```sql
-- NPS por mes (mes_nombre es texto: ordenar por fecha, no alfabéticamente)
select anio, mes_nombre, count(*) as respuestas,
       round(100.0 * count(*) filter (where p1_nps >= 9) / count(*), 1) as pct_prom,
       round(100.0 * count(*) filter (where p1_nps <= 6) / count(*), 1) as pct_detr,
       round(100.0 * (count(*) filter (where p1_nps >= 9)
                    - count(*) filter (where p1_nps <= 6)) / count(*), 1) as nps
from fact_encuestas
group by anio, mes_nombre
order by min(fecha);

-- NPS por semana ISO (agrupar año + semana)
select anio, semana_anio, count(*) as respuestas,
       round(100.0 * (count(*) filter (where p1_nps >= 9)
                    - count(*) filter (where p1_nps <= 6)) / count(*), 1) as nps
from fact_encuestas group by anio, semana_anio order by 1, 2;

-- Promedios y distribución
select round(avg(p1_nps)::numeric, 2) as prom_p1,
       round(avg(p2_csat)::numeric, 2) as prom_csat from fact_encuestas;
select p1_nps, count(*) from fact_encuestas group by p1_nps order by p1_nps;

-- Por rubro (etiquetas P3/P4 viven en dim_rubros)
select r.rubro_id, r.nombre, r.p3_label, r.p4_label, count(*) as respuestas,
       round(avg(e.p3_atributo)::numeric, 2) as prom_p3,
       round(avg(e.p4_atributo)::numeric, 2) as prom_p4
from fact_encuestas e
join dim_empresas em on em.empresa_id = e.empresa_id
join dim_rubros r on r.rubro_id = em.rubro_id
group by r.rubro_id, r.nombre, r.p3_label, r.p4_label
order by r.rubro_id;
```

**No calculable hoy:** canal/origen, dispositivo, identificador de encuestado, tiempo de respuesta. No existen esas columnas (`models.py:78-99`).

## 7. Obtener las credenciales desde Vercel (sin exponerlas)

| Acción | Semántica | Nota del repo |
|---|---|---|
| `vercel env ls` | lista **nombres** y entornos, sin valores | `sin_evidencia (repo)` |
| `vercel env pull` | descarga valores desencriptados a `.env.local` (por defecto entorno Development) | `sin_evidencia (repo)` |

**Trampa importante:** el backend carga **solo** `scansaydone-back/.env` (`config.py:13-14`). Un `.env.local` en la raíz o en `scansaydone-front/` no lo lee nadie. Después del pull, copia los valores a `scansaydone-back/.env` o expórtalos en la sesión (el entorno real gana sobre `.env`).

Alternativa sin Vercel CLI: Dashboard de Supabase → Project Settings → Database → Connection string.

## 8. Riesgos

| Riesgo | Detalle | Cita |
|---|---|---|
| RLS sin políticas | Solo funciona con el rol dueño; con `anon` verás 0 filas | `0001_tablas_iniciales.py:83-87` |
| Credencial de dueño | Permite escribir y borrar; hay que forzar read-only | `db.py:15-29` |
| Previews con BD de producción | Las previews heredan las mismas variables; `POST /respuestas` es público y sin rate limit | `config.py:79`; `README.md:138` |
| Dos URLs, dos bases | Migraciones y runtime pueden apuntar a bases distintas | `config.py:54-67` |
| `downgrade` destructivo | Borra las 3 tablas con datos | `0001:90-94` |
| `NEXT_PUBLIC_*` con URL de BD | Incrustaría la credencial en el JS del navegador | `site.ts:11-13` |
| Historial de consola | PowerShell guarda lo que pegues | `BACKEND-SUPABASE-2026-11-18.md:113` |

## 9. Rol de solo lectura (opción endurecida)

Pedir al dueño que ejecute en el SQL Editor:

```sql
create role lector_metricas login password '<nueva>' noinherit;
grant connect on database postgres to lector_metricas;
grant usage on schema public to lector_metricas;
grant select on public.dim_rubros, public.dim_empresas, public.fact_encuestas to lector_metricas;
-- RLS sigue activo sin políticas: además hace falta
create policy lectura_metricas on public.fact_encuestas
  for select to lector_metricas using (true);
-- repetir la policy en dim_rubros y dim_empresas
```

Sin la política, el GRANT no basta: RLS filtra a 0 filas. Con la cadena del dueño no hace falta nada de esto, pero se asume el riesgo de escritura (mitigado con `default_transaction_read_only=on`).

## 10. Checklist final

1. Confirmar con `vercel env ls` que existen las 3 variables (sin ver valores).
2. Sacar la cadena **session pooler 5432** y guardarla en `scansaydone-back/.env`.
3. Conectar con `connect_timeout=5` y `default_transaction_read_only=on`.
4. Ejecutar las 4 consultas de §5 y anotar resultados.
5. Recién entonces correr las métricas de §6.
6. No migrar, no sembrar, no escribir.
