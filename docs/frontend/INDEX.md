# Índice de documentación frontend

Esta carpeta contiene toda la documentación viva del frontend ScanSayDone.

## Documentos vigentes

| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `README.md` | Organización de la documentación, reglas de convivencia con el snapshot, convenciones de nombres y precedencia | vigente |
| `UX-SPEC-2026-11-05.md` | Especificación completa de UX: inventario de páginas, tokens de diseño, componentes, copy y assets | vigente |
| `planos/PLANOS-2026-11-05.md` | Planos técnicos: retícula, spans, alturas, reflujo por breakpoint y geometría de componentes | vigente |
| `planos/L1-HERO-2026-11-05.md` | Contrato de layout y accesibilidad del hero L1 (landing): composición asimétrica 7/5, escala tipográfica, estados de componentes, orden de foco y ratios de contraste WCAG | vigente |
| `planos/L2-COMO-FUNCIONA-2026-11-06.md` | Contrato de la banda 3 del landing (L2 "Cómo funciona"): retícula 3×364, reflujo por breakpoint, anatomía de la tarjeta de paso, conector, copy propuesto, accesibilidad y 26 criterios de aceptación | vigente |
| `assets/MANIFEST-UX-2026-11-05.md` | Manifiesto de assets del snapshot histórico congelado | vigente |
| `decisiones/DECISIONES-2026-11-05.md` | Registro de decisiones técnicas y de diseño con justificación, alternativas rechazadas y owner | vigente |

## Carpetas

| Carpeta | Contenido |
|---------|-----------|
| `planos/` | Documentos de planos técnicos (retícula, geometría, reflujo) |
| `wireframes/` | Wireframes y mockups (vacío por ahora, contiene `.gitkeep`) |
| `assets/` | Manifiestos y referencias a assets del snapshot |
| `decisiones/` | Registro de decisiones (ADRs) |

## Snapshot histórico congelado

El snapshot completo de UX del stack anterior vive en `scansaydone-front/ENTREGA-UX-2026-10-30/` y **no está trackeado por Git**. Fue diseñado para Next 15 + JavaScript + Bootstrap/Sass. La implementación vigente es Next 16 + TypeScript + Tailwind 4.

Las **cotas** del snapshot (retícula, spans, alturas) siguen siendo referencia válida. Los **mecanismos** (Bootstrap/Sass, estructura de componentes) no aplican al stack actual.

Ver `assets/MANIFEST-UX-2026-11-05.md` para el detalle de lo que contiene el snapshot.
