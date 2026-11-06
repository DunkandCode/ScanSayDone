# Documentación UX del frontend — cómo se organiza

> Esta carpeta (`docs/frontend/`) es la **documentación viva** del frontend.
> El snapshot `scansaydone-front/ENTREGA-UX-2026-10-30/` es **histórico congelado**.
> No se mezclan nunca.

---

## 1. Las dos zonas

| Zona | Ruta | Estado | Se edita |
|---|---|---|---|
| Documentación viva | `docs/frontend/` | Vigente | Sí, con fecha nueva |
| Snapshot histórico | `scansaydone-front/ENTREGA-UX-2026-10-30/` | Congelado | **No, nunca** |

El snapshot está fuera de Git a propósito, con manifiesto en `assets/MANIFEST-UX-2026-11-05.md`.
Se conserva como evidencia de lo que se diseñó para el stack anterior.

## 2. Regla de oro

> Si un valor cambia, **no se edita el snapshot**: se escribe un documento nuevo con la fecha del
> cambio y se declara qué reemplaza.

Motivo: el snapshot es la prueba de lo que existía antes. Editarlo destruye la trazabilidad y
mezcla dos verdades en el mismo archivo.

## 3. Convención de nombres

```
<AREA>-<AAAA-MM-DD>.md
```

| Área | Contenido |
|---|---|
| `UX-SPEC` | Inventario de páginas, tokens, componentes, copy, assets |
| `PLANOS` | Retícula, spans, alturas, reflujo por breakpoint |
| `DECISIONES` | Decisiones con razón, evidencia y owner |
| `TECH-*` | Stack técnico y librerías |

Sin sufijos tipo `-v2`, `-final`, `-nuevo`. La fecha ordena. La versión se declara dentro del
documento, no en el nombre.

## 4. Precedencia

Cuando dos documentos discrepan, manda el que esté más abajo en esta lista:

1. `docs/frontend/decisiones/DECISIONES-*.md` — decisión firmada por el operador.
2. `docs/planning/PLAN-FRONTEND-*.md` — orden y alcance del trabajo.
3. `docs/frontend/UX-SPEC-*.md` — inventario y detalles de interfaz.
4. `docs/frontend/planos/PLANOS-*.md` — geometría y reflujo.
5. `docs/planning/TECH-*.md` — stack propuesto.
6. Snapshot `ENTREGA-UX-2026-10-30/` — evidencia histórica, **nunca norma**.

Si el conflicto no se resuelve, se para la implementación y se escribe una decisión nueva. No se
elige la fuente que convenga en el momento.

## 5. Qué se considera vigente hoy

| Documento | Vigencia | Reemplaza a |
|---|---|---|
| `UX-SPEC-2026-11-05.md` | Vigente | Contrato de diseño del snapshot, en tokens y mecanismos |
| `planos/PLANOS-2026-11-05.md` | Vigente | Planos marcados como desactualizados en su propia §6 |
| `assets/MANIFEST-UX-2026-11-05.md` | Vigente | — |
| `../planning/PLAN-FRONTEND-2026-11-05.md` | Vigente | — |
| `decisiones/DECISIONES-2026-11-05.md` | Propuesta hasta firma | — |
| `../planning/TECH-LANDING-2026-11-05.md` | Propuesta hasta firma | — |
| Snapshot del 30-oct | Histórico | — |

## 6. Cómo agregar un documento nuevo

1. Elegir área y fecha real del día en que se escribe.
2. Declarar arriba: qué es, a quién sirve, y qué reemplaza si reemplaza algo.
3. Citar la fuente de cada número: plano, acta, captura o cálculo propio.
4. Si un dato no existe, escribir `sin dato` y nombrar el archivo que debería contenerlo.
5. Agregarlo a la tabla de vigencia de este README.

## 7. Qué no entra aquí

- Código, componentes, estilos: viven en `scansaydone-front/`.
- Contratos de API: los define backend.
- Datos legales, precios y textos finales sin aprobar: se marcan como pendientes y no se inventan.

## 8. Estado del snapshot, en una línea

Diseñado para Next 15 + JavaScript + Bootstrap/Sass. La implementación vigente es Next 16 +
TypeScript + Tailwind 4. Las **cotas** del snapshot siguen sirviendo; sus **mecanismos** no.
