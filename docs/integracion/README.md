# Integración frontend ↔ backend

> Carpeta de documentos que cruzan los dos lados. **Todo en BORRADOR.** No son contratos
> aprobados: son preguntas y requisitos para revisar en la reunión.
>
> Rama: `dev/nicolaslopezv-front` (`ce7c594`). Fecha: 2026-11-12.

## Documentos

| Archivo | Para quién | Qué contiene |
|---|---|---|
| `PREGUNTAS-BACKEND-2026-11-12.md` | Backend | 18 preguntas de integración con evidencia `archivo:línea`, default recomendado y qué se rompe si quedan sin responder. Incluye archivos consumibles, mapa de campos y brechas bloqueantes |
| `REQUISITOS-FRONTEND-DASHBOARD-2026-11-12.md` | Backend + datos | Qué necesita el panel para dejar de ser demo: bloques, forma de datos, decisiones D1–D6, propuesta de respuesta y qué no debe enviar el backend |

## Documentos relacionados (fuera de esta carpeta)

| Archivo | Por qué se enlaza |
|---|---|
| `../frontend/planos/ENCUESTA-CLIENTE-2026-11-12.md` | Plano de la encuesta del cliente |
| `../frontend/planos/ENCUESTA-GESTION-2026-11-12.md` | Plano de la gestión en el panel |
| `../frontend/planos/PROPUESTA-ENCUESTA-CAFETERIA-2026-11-11.md` | Propuesta y preguntas de producto Q1–Q11 |
| `../frontend/wireframes/` | Wireframes SVG y PNG |

## Orden de lectura sugerido

1. Preguntas: Q1, Q5, Q7, Q8, Q12 (lo que bloquea la primera pantalla).
2. Requisitos del dashboard: §4 (decisiones D1–D6) y §5 (forma de datos).
3. Brechas: §4 de preguntas, §7 de requisitos.

## Convención

- Formato: Markdown, sin código ejecutable.
- Cada afirmación técnica cita `archivo:línea`; lo que el repo no responde va como
  `sin_evidencia`.
- Cambios de contrato se anotan en el documento y se firman en la reunión; no se reescriben
  en silencio.

## Mensaje corto para Discord

```
Nico — dejé 2 docs para la integración en la rama dev/nicolaslopezv-front, carpeta docs/integracion/:

1) PREGUNTAS-BACKEND-2026-11-12.md → 18 preguntas con evidencia y default. Lo que bloquea primero: Q1 (cuál POST es el canónico), Q5 (cómo se resuelve /e/[code] → empresa_id), Q7 (qué URL va en el QR) y Q12 (qué versión del cuestionario se firma).
2) REQUISITOS-FRONTEND-DASHBOARD-2026-11-12.md → qué necesita el panel para salir de demo. Ojo con D1 (¿377 son "promotores 9–10" o "notas 8–10"?) y D2 (no existe columna de canal, y el panel tiene un bloque de canales).

Sin código todavía: son documentos en BORRADOR, rama sin commitear aún. Cuando respondan, cierro el contrato y recién ahí escribo el fetch.
```

> Nota: la rama todavía no tiene estos archivos. El mensaje se envía **después** del commit
> y push, o se cambia la última línea por «aún local, los subo en cuanto aprueben».
