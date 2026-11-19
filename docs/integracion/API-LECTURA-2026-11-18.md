# API de lectura — qué responde hoy el despliegue y qué falta

> **Estado: BORRADOR 2026-11-18.** Sondeo read-only del dominio público. No se enviaron
> datos, no se usaron credenciales y no se probó ningún POST.
> Objetivo del operador: **llegar a las APIs y sacar datos desde ahí**, porque Supabase está
> aislado (sin acceso directo a la base).

## 1. Sondeo del despliegue (evidencia real)

| URL | Resultado |
|---|---|
| `https://scansaydone.vercel.app/` | **200** — sirve la landing (Next) |
| `https://scansaydone.vercel.app/health` | **404** |
| `https://scansaydone.vercel.app/openapi.json` | **404** |
| `https://scansaydone.vercel.app/api/openapi.json` | **404** |
| `https://scansaydone.vercel.app/api/v1/empresas/1/encuesta` | **404** |
| `https://scansaydone-back.vercel.app/health` | **404** |
| `https://scansaydone-api.vercel.app/health` | **404** |

Conclusión: en ese dominio **solo responde el frontend**. El servicio `backend` de
`vercel.json:9-20` no está entregando rutas. Sin acceso al panel de Vercel no se puede
distinguir entre «servicio no desplegado», «Services no habilitado» y «rewrite inactivo»:
`sin_evidencia`.

El frontend sí usa rutas relativas coherentes con ese esquema: `/api/(.*)` y `/health` van
al backend según `vercel.json:15-19`.

## 2. Aunque el backend estuviera arriba, hoy no entrega datos

Endpoints montados (`main.py:52-56`):

| Endpoint | Lee BD | Devuelve filas de `fact_encuestas` |
|---|---|---|
| `GET /` | no | no |
| `GET /health` | no | no |
| `GET /api/v1/qr/generate` | no | no |
| `POST /api/v1/nps/calculate` | no | no (calcula sobre lo que le envías) |
| `GET /api/v1/empresas/{empresa_id}/encuesta` | sí | no: solo `dim_empresas` + `dim_rubros` |
| `POST /api/v1/respuestas` | sí | **escribe** |

No existe ningún `GET` de respuestas ni de resumen. Por eso «sacar los datos por API» no es
posible hoy: falta la superficie de lectura.

## 3. Superficie mínima que hay que agregar (propuesta)

Todo de solo lectura, sin PII, con periodo explícito.

| Método y ruta | Devuelve | Para qué |
|---|---|---|
| `GET /api/v1/rubros` | `rubro_id`, `nombre`, `p3_label`, `p4_label` | Catálogo estable; hoy solo se obtiene dentro del GET de encuesta |
| `GET /api/v1/empresas` | `empresa_id`, `nombre_negocio`, `rubro_id` | Saber qué negocios existen (hoy no hay forma) |
| `GET /api/v1/empresas/{id}/resumen?dias=30` | totales, distribución 0–10, promedios, serie diaria, últimas respuestas | Alimenta el panel y los cálculos |
| `GET /api/v1/empresas/{id}/respuestas?desde=&hasta=&limit=&cursor=` | filas crudas: `p1_nps`, `p2_csat`, `p3_atributo`, `p4_atributo`, `p5_comentario`, `fecha`, `hora`, `categoria_nps`, `alerta`, `tipo_comentario` | Exportar y recalcular fuera del backend |

Forma sugerida del resumen (ya detallada en `REQUISITOS-FRONTEND-DASHBOARD-2026-11-12.md:§5`):

```jsonc
{
  "empresa_id": 1,
  "periodo": { "desde": "2026-10-19", "hasta": "2026-11-18", "dias": 30 },
  "totales": { "respuestas": 486, "media_p1": 8.5, "promotores": 277, "altas_8_10": 377 },
  "distribucion": [ { "nota": 0, "count": 1 } ],
  "serie_diaria": [ { "fecha": "2026-10-19", "respuestas": 11, "suma_p1": 92 } ],
  "ultimas": [ { "encuesta_id": 1, "p1": 10, "p5": "texto o null",
                 "creado_en": "2026-11-02T18:04:00-03:00" } ]
}
```

Reglas que el frontend y los scripts asumen: números crudos, fechas ISO 8601, `null` cuando
no hay dato, listas vacías en vez de ceros inventados, y el mismo cuerpo de error de la API
(`404` empresa inexistente, `503` servicio no disponible).

## 4. Seguridad mínima antes de exponer lectura

1. **Sin PII:** nada de nombres, correos, teléfonos ni identificadores de encuestado. Hoy no
   existen esas columnas, pero la regla debe quedar escrita.
2. **Alcance por negocio:** mientras no haya autenticación, cualquier `empresa_id` es
   legible. Es aceptable para demo, no para datos reales de pilotos.
3. **Rate limit:** aplica a la escritura pendiente (#15) y conviene a la lectura.
4. **CORS:** si el panel llama por rutas relativas `/api/...`, no hay CORS de por medio. Un
   script externo sí necesita el origen permitido (`config.py:70-80`).
5. **Nunca** una variable `NEXT_PUBLIC_*` con la cadena de base de datos.

## 5. Desbloqueo del despliegue (primero esto)

| Paso | Qué verificar | Cómo |
|---|---|---|
| 1 | El proyecto tiene un servicio `backend` activo | Panel de Vercel → Project → Deployments → Services |
| 2 | El dominio público enruta `/api/*` | Probar `GET /health`; debe dar `{"status":"ok"}` |
| 3 | El servicio tiene las variables `POSTGRES_URL` y `POSTGRES_URL_NON_POOLING` | `vercel env ls` (solo nombres) |
| 4 | La base responde | `GET /api/v1/empresas/1/encuesta` → 200 |

Mientras `/health` devuelva 404, no hay API que consumir: no es un problema del frontend.

## 6. Alternativa mientras tanto

Si el objetivo inmediato es solo calcular métricas con datos ya cargados:

1. **Supabase → SQL Editor** con las consultas de `SUPABASE-LECTURA-2026-11-18.md:§6`.
2. Exportar el resultado a CSV y calcular fuera.
3. No usar `anon` ni claves públicas: RLS está sin políticas (`0001:83-87`).

## 7. Orden recomendado

1. Confirmar y arreglar el despliegue del backend (paso §5).
2. Definir y firmar los 4 endpoints de lectura (§3).
3. Implementarlos con tests y desplegar.
4. Recién entonces el panel y los scripts consumen la API.
