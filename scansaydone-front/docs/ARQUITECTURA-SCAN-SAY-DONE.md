# Arquitectura Scan-Say-Done (v3)

> Fecha 27-oct-2026 · Cierre MVP 18-nov-2026 · Stack **Next.js 15.4.1 + Supabase** (sin Python en el MVP).
> v3 cierra los 6 bloqueantes de la validacion `backend-advanced-5.2` (APROBADO CON CAMBIOS) sobre v2.
> Insumos: `docs/PLAN-SCAN-SAY-DONE.md` §1-§3 · `opendesign/*` · auditorias `reviewer-alibaba` y `senior-auditor`.

## 1. Repositorio y route groups

| Grupo | Contenido | Hoja de estilos |
|---|---|---|
| `(marketing)` | las **9 rutas** actuales movidas (8 `page.jsx` + `page.js` raiz). URLs sin cambios | `bootstrap.scss` compilado desde `bootstrap/scss` con `$theme-colors` |
| `(panel)` | `/panel`, `/opiniones`, `/respuestas`, `/encuestas`, `/ajustes` | `_panel.scss` (no carga las 3.299 lineas del landing) |
| `(public)` | `/e/[code]` encuesta | hoja minima propia (tokens + primitivas), **no** `_panel.scss` |
| raiz | `layout.js` solo con tokens y fuentes (`next/font`) | — |

Rutas del panel (3 destinos de primer nivel): `/panel` (overview con tarjeta de alertas), `/panel/opiniones`, `/panel/respuestas` (lista canonica del texto literal del cliente; filtros: Todas · Sin responder · En revision · Resueltas — las alertas son un **filtro** dentro de esta vista). `/panel/encuestas` y `/panel/ajustes` se mantienen. `/panel/alertas` queda **eliminada** como ruta.

```
src/app/
├── layout.js                 # tokens + fuentes, NO style.scss
├── (marketing)/layout.js     # bootstrap.scss
├── (panel)/layout.js         # _panel.scss
├── (public)/layout.js        # hoja minima
├── entrar/page.js  └ api/responses/route.js └ api/businesses/route.js
src/lib/supabase/{client,server,admin}.js
supabase/migrations/{001_schema,002_rls,003_rate_bucket}.sql
```
## 1B. Fase 0 — Design System (27-30 oct)
`_tokens.scss` (teal→coral/ciruela) · Bebas Neue + Montserrat por `next/font` · `react-icons` reemplaza `@mdi/font` (reescribir `_components.scss:366` y `:480`) · logo navbar 108×36 · Bootstrap compilado.
**Gate de salida**: `grep -r "0e6e5c"` = 0 · `grep -r "mdi-"` = 0 · build verde · WCAG AA en las 9 rutas.
## 2. Esquema de datos (DDL verificable)

```sql
create table business (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  timezone text not null default 'America/Santiago',
  owner_id uuid not null,
  created_at timestamptz not null default now(),
  unique (owner_id)
);
create table channel (code text primary key, label text not null);
insert into channel(code,label) values
  ('fisico','Mostrador'),('instagram','Instagram'),('whatsapp','WhatsApp'),
  ('tiktok_live','TikTok Live'),('web','Web');
create table business_channel (
  business_id uuid not null references business(id) on delete cascade,
  channel_code text not null references channel(code),
  primary key (business_id, channel_code)
);
create table survey (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references business(id) on delete restrict,
  short_code text not null unique check (char_length(short_code) between 8 and 10),
  qr_code uuid not null default gen_random_uuid() unique,
  title text not null check (char_length(title) between 3 and 80),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (id, business_id)
);
create table question (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references survey(id) on delete cascade,
  position smallint not null check (position between 1 and 3),
  prompt text not null check (char_length(prompt) <= 160),
  unique (survey_id, position)
);
create table campaign (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references business(id) on delete cascade,
  channel_code text not null,
  name text not null check (char_length(name) between 1 and 60),
  starts_at timestamptz, ends_at timestamptz,
  unique (id, business_id, channel_code),
  foreign key (business_id, channel_code) references business_channel(business_id, channel_code)
);
create table response (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null,
  business_id uuid not null,
  channel_code text not null,
  campaign_id uuid null,
  idempotency_key uuid not null unique,
  q1 smallint not null check (q1 between 1 and 5),
  q2 smallint not null check (q2 between 1 and 5),
  q3 smallint not null check (q3 between 1 and 5),
  comment text null check (char_length(comment) <= 500),
  business_day date not null default ((now() at time zone 'America/Santiago')::date),
  flagged boolean not null default false,
  flag_reason text null check (char_length(flag_reason) <= 120),
  created_at timestamptz not null default now(),
  foreign key (survey_id, business_id)    references survey(id, business_id),
  foreign key (business_id, channel_code) references business_channel(business_id, channel_code),
  foreign key (campaign_id, business_id, channel_code) references campaign(id, business_id, channel_code)
);
create index on response (survey_id, created_at desc);
create index on response (business_day);
create index on response (business_id, channel_code);
create index on response (business_id, created_at desc);
```

**Por que:** FK compuestas impiden responder con canal de otro negocio; **no** se guarda IP/UA. FK `auth.users(id)` en `002_rls`.
**Alerta:** derivada de respuesta (≤2), `alert.response_id` NOT NULL — sin alertas huerfanas; si manual, revisar fusion.
**Texto literal:** lista ≤90 chars; detalle completo. **Sin enmascaramiento** (heuristicas fallan en espanol). Proteccion: encuesta sin datos personales + aviso + retencion.
## 3. Contrato por endpoint (IDs siempre derivados del servidor)

Regla: ningun handler acepta `business_id`, `survey_id` ni `owner_id` del cliente. Se derivan de la sesion validada y del recurso padre.

| Endpoint | Quien | Sesion | Ownership | IDs derivados |
|---|---|---|---|---|
| `GET /e/[code]` | publico | — | — | `survey` por `short_code` con `service_role` en Server Component |
| `POST /api/responses` | publico | — | — | `survey_id`/`business_id` resueltos desde `short_code`; canal validado contra `business_channel` |
| `GET /api/metrics` | dueno | magic link | `business.owner_id = auth.uid()` | `business_id` de la sesion |
| `GET /api/responses` | dueno | magic link | idem | filtros acotados al negocio de la sesion |
| `PATCH /api/alerts/[id]` | dueno | magic link | alerta→negocio de la sesion | — |
| `POST /api/surveys` | dueno | magic link | negocio de la sesion | `short_code` y `qr_code` generados en servidor |
| `POST /api/businesses` | dueno (alta inicial) | magic link | primer negocio con `service_role` | `owner_id` del token |
## 4. RLS, grants y frontera de seguridad

```sql
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
grant select on channel, business, response to authenticated;
grant select, insert, delete on survey to authenticated;
grant update (title, is_active) on survey to authenticated;
grant select, insert, update, delete on question, campaign, business_channel to authenticated;
-- anon: CERO grants · rate_bucket: sin RLS (solo service_role)
alter table business, survey, question, campaign, business_channel, channel, response enable row level security;
create policy business_sel on business for select to authenticated using (owner_id = auth.uid());
create policy survey_all on survey for all to authenticated
  using (business_id in (select id from business where owner_id = auth.uid()))
  with check (business_id in (select id from business where owner_id = auth.uid()));
create policy question_all on question for all to authenticated
  using (survey_id in (select s.id from survey s join business b on b.id = s.business_id where b.owner_id = auth.uid()))
  with check (survey_id in (select s.id from survey s join business b on b.id = s.business_id where b.owner_id = auth.uid()));
create policy campaign_all on campaign for all to authenticated
  using (business_id in (select id from business where owner_id = auth.uid()))
  with check (business_id in (select id from business where owner_id = auth.uid()));
create policy bchannel_all on business_channel for all to authenticated
  using (business_id in (select id from business where owner_id = auth.uid()))
  with check (business_id in (select id from business where owner_id = auth.uid()));
create policy channel_read on channel for select to authenticated using (true);
create policy response_sel on response for select to authenticated
  using (business_id in (select id from business where owner_id = auth.uid()));
```

**Frontera:** `service_role` solo en `/api/responses` y `/e/[code]`; bypassa RLS. `authenticated` lee con RLS.

**Codigos inmutables:** `short_code` y `qr_code` no actualizables. Encuesta desactivada conserva resolucion.
## 5. Rate limiting e idempotencia
`rate_bucket(survey_id, minute_bucket, count)` — incremento atomico (0 filas = 429):
```sql
insert into rate_bucket (survey_id, minute_bucket, count) values ($1, date_trunc('minute', now()), 1)
on conflict (survey_id, minute_bucket) do update set count = rate_bucket.count + 1 where rate_bucket.count < 10 returning count;
```

- Tope **10/min**; limpieza en cron diario. **Agotamiento**: defensa en plataforma + **honeypot**.
- **Orden handler**: (1) resolver `survey`; (2) `idempotency_key` — mismo payload → `200`; distinto → `409`; (3) evaluar bucket; (4) insertar. Sin `GET status`.
- **Anti-manipulacion**: respuestas atipicas → `flagged`, excluidas de KPI.
## 6. Politica del QR permanente

| Mitigacion | Detalle |
|---|---|
| Plan Pro obligatorio | **US$25/mes**; gate "Generar QR" validado en servidor |
| URL estable | `https://scan.<dominio>/e/<short_code>`; migracion = cambio DNS, no QR |
| Codigos inmutables | `short_code` UNIQUE + `qr_code` UNIQUE; ninguno se recicla |
| Encuesta cerrada | `is_active=false` mantiene resolucion con pagina informativa |
| Monitor | cron 24 h sin respuestas en 7 dias → correo al dueno |
| Respaldo | `pg_dump` semanal + prueba de restauracion (RPO 7 d, RTO <1 h) |

**URL:** 36-38 bytes → **V3-M**; host hasta 27 chars → **V4-M**. **Gate**: medir antes de imprimir.
## 7. Prueba de un dia (gate de S1, no de S3)

**Implementar (4 h)**: migraciones 001-003 · `/api/responses` con validacion + bucket + idempotencia · cliente con UUID en `localStorage`.
**Medir (2 h)**: (a) 100 POST misma key → 1×201 y 99×200/409, **1 fila**; (b) 15 POST <1 min → 10 aceptadas, resto 429; (c) 2 usuarios → B recibe 0 filas de A; (d) canal de otro negocio → rechazada por FK; (e) URL final medida.
**Criterio**: (a)-(d) pasan. Si falla → revisar constraint/condicion/indice. **Persiste tras 2 intentos** → FastAPI.
## 8. Fases

| Bloque | Fechas | Entregable | Gate |
|---|---|---|---|
| **Fase 0** | 27-30 oct | design system + retheme + iconos + logo | `grep 0e6e5c`=0 · `grep "mdi-"`=0 · build verde |
| **S1** | 31-oct → 5-nov | migraciones · magic link · alta negocio · encuesta · `/api/responses` · QR | prueba 1 dia + multi-tenant + URL |
| **S2** | 6-11 nov | panel: 4 KPI · opiniones · respuestas (filtro alertas) · estado vacio · 4 estados | KPIs correctos con y sin datos |
| **S3** | 12-17 nov | alerta (tarjeta overview + filtro en respuestas) · Resend · ajustes · cron inactividad | alerta visible en panel |
| **Entrega** | 18 nov | Supabase Pro · dominio · deploy · backup · 3 QR | prod estable antes de imprimir |

**Recorte** (si aprieta): alerta correo → solo panel · cron → manual · filtro canal → fuera. **Nunca**: QR, multi-tenant, inmutabilidad.
## 9. Smoke tests

| # | Test | Esperado |
|---|---|---|
| 1 | Magic link email nuevo | link <2 min, sesion activa |
| 2 | Crear negocio + encuesta | aparece en `/panel/encuestas` |
| 3 | Descargar QR | 8-10 chars legible, escaneable en 3 dispositivos |
| 4 | Escanear → encuesta | 3 preguntas, escala 1-5, targets ≥44 px |
| 5 | Enviar respuesta | "gracias" + aparece en opiniones <5 s |
| 6 | Reenviar misma key | no duplica (200 mismo id); payload distinto → 409 |
| 7 | 15 envios en <1 min | 10 aceptados, resto 429 |
| 8 | KPIs con n<10 | "aun son pocos clientes (3)", sin porcentajes |
| 9 | 3 respuestas negativas en 1 h | tarjeta alerta en `/panel` con accion |
| 10 | Encuesta inactiva 7 dias | correo al dueno |
| 11 | **Multi-tenant** | 0 datos cruzados |
| 12 | **Canal cruzado** | rechazado (FK) |
| 13 | **URL QR** | bytes medidos |
| 14 | Encuesta desactivada | "cerrada", no reutiliza |
## 10. Riesgos

| # | Riesgo | P×I | Mitigacion |
|---|---|---|---|
| 1 | Supabase free | Alta×Critico | Pro antes de imprimir |
| 2 | QR errado | Alta×Critico | medir URL + prueba impresion |
| 3 | IDOR | Media×Critico | IDs derivados + smoke 11 |
| 4 | Metricas manipuladas | Media×Alto | bucket + honeypot + `flagged` |
| 5 | Bucket agotado | Media×Alto | rate limit + honeypot |
| 6 | Duplicados | Media×Alto | `UNIQUE(idempotency_key)` |
| 7 | Dominio tarde | Media×Alto | cerrar antes S3 |
| 8 | Resend 100/dia | Bajo×Medio | monitor → upgrade |
| 9 | Perdida datos | Bajo×Critico | backup + restore test |
| 10 | Fase 0 margen | Alta×Alto | gate 30-oct |
## Decisiones
1. Route groups con hojas separadas; 9 rutas movidas. Bootstrap compilado con `$theme-colors`.
2. Route Handlers + Server Components; **`anon` sin privilegios**. FK compuestas; codigos inmutables.
3. Rate limit 10/min + defensa plataforma; sin IP. Idempotencia en POST (200/409).
4. Metricas `flagged` excluidas; crudas visibles. Escala 1-5; sin NPS.
5. Prueba dia en **S1**; seguridad no se recorta. Panel: **3 destinos** (overview, opiniones, respuestas); alertas como tarjeta + filtro.
