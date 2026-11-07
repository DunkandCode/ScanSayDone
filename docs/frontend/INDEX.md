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
| `planos/L3-PANEL-2026-11-06.md` | Contrato de la banda 6 del landing (L3 "Qué ve el dueño"): única banda xxl (1320 → marco 872×545), estado vacío honesto mientras no exista captura del panel, anatomía del marco, copy propuesto, accesibilidad, 26 criterios y acta del gate de implementación | vigente |
| `planos/L4-CANALES-2026-11-06.md` | Contrato de la banda 4 del landing (L4 "Canales"): 4 tarjetas 267 → 2×2 de 468 en lg, ilustraciones SVG propias declaradas (QR decorativo no escaneable, tablet sin numerales), copy propuesto, accesibilidad, 28 criterios y acta del gate | vigente |
| `planos/L5-APLICACIONES-2026-11-06.md` | Contrato de la banda 5 del landing (L5 "Aplicaciones / Para quién"): 3 marcos 4/3 de 364 en xl con borde discontinuo, badge DEMO y declaración de vacío (no hay fotos), audiencias restaurante/café/comercio, cierre de C-32 por alternancia de fondos, criterios y acta del gate | vigente |
| `planos/L6-FAQ-2026-11-06.md` | Contrato de la banda 8 del landing (L6 "Preguntas frecuentes"): única banda con container 960 y columna de lectura 632 (8 col + offset 2), acordeón ARIA (h3>button+region, múltiples abiertos), 5 preguntas respondibles hoy con 10 datos faltantes registrados con owner, anillo de foco propuesto pendiente de firma, criterios y acta del gate | vigente |
| `planos/NAVBAR-Y-FOOTER-2026-11-06.md` | Contrato de la barra y el pie: altura 76, logotipo imagen, mapa de navegación, drawer, filetes del pie y `Volver arriba` | vigente |
| `planos/PASE-VISUAL-2-2026-11-06.md` | Contrato de profundidad del landing: familia de degradados G1-G6 entre tokens, revelado CSS sin librerías, tratamiento de la franja, halos, sombras cerradas a dos nodos | vigente |
| `planos/BANDAS-2-Y-9-Y-EXTRAS-2026-11-06.md` | Contrato de la franja de confianza y del cierre sobre escena, más los extras de la tanda visual | vigente |
| `planos/MEJORA-VISUAL-2026-11-06.md` | Ilustraciones de la banda 5 (tres, generadas por IA y declaradas), escena de cierre, encargo de los prompts y decisiones de marca | vigente |
| `planos/LOGIN-2026-11-06.md` | Contrato de `/entrar`: columnas a sangre, tarjeta 430/343, degradado G6, escena con velo, placa de captions, validación local y estados. **§11-bis** fija usuario + contraseña | vigente |
| `planos/PANEL-2026-11-06.md` | Contrato de `/panel`: barra lateral 240, bloques, dataset canónico, interruptor de datos de ejemplo, estados, cotas y accesibilidad. **§12** decide el delta de referencias; **§13** fija el salto visual | vigente |
| `ESTADO-2026-11-06.md` | Estado real al cierre de la jornada: rutas que existen y rutas vacías, banda por banda, chrome, `/entrar`, `/panel`, sistema visual, dataset canónico, batería de verificación, firmas aplicadas, lo que espera confirmación y pendientes vivos | vigente |
| `assets/MANIFEST-UX-2026-11-05.md` | Manifiesto de assets del snapshot histórico congelado | vigente |
| `decisiones/DECISIONES-2026-11-05.md` | Registro de decisiones técnicas y de diseño con justificación, alternativas rechazadas y owner | vigente |

## Carpetas

| Carpeta | Contenido |
|---------|-----------|
| `planos/` | Contratos técnicos y de diseño: retícula, geometría, copy, accesibilidad y criterios de aceptación |
| `features/` | **Referencias visuales del operador sin versionar** (mockups, capturas de problemas, variantes de logotipo). No es documentación: es material de entrada. Ver `ESTADO §11.7` |
| `wireframes/` | Wireframes y mockups |
| `assets/` | Manifiestos y referencias a assets del snapshot |
| `decisiones/` | Registro de decisiones (ADRs) |

## Assets de marca

| Archivo | Contenido |
|---------|-----------|
| `../../assets/marca/MANIFEST-ASSETS.md` | Inventario de la marca: cuatro PNG originales con hash, seis variantes webp del lockup y el hallazgo del recorte del wordmark |
| `scansaydone-front/public/img/marca/lockup-nav.png` | Lockup compuesto que usan la barra, el pie, la barra lateral del panel y la barra móvil |
| `scansaydone-front/public/img/marca/logo-dunk.png` | Logotipo de la empresa desarrolladora |

## Snapshot histórico congelado

El snapshot completo de UX del stack anterior vive en `scansaydone-front/ENTREGA-UX-2026-10-30/` y **no está trackeado por Git**. Fue diseñado para Next 15 + JavaScript + Bootstrap/Sass. La implementación vigente es Next 16 + TypeScript + Tailwind 4.

Las **cotas** del snapshot (retícula, spans, alturas) siguen siendo referencia válida. Los **mecanismos** (Bootstrap/Sass, estructura de componentes) no aplican al stack actual.

Ver `assets/MANIFEST-UX-2026-11-05.md` para el detalle de lo que contiene el snapshot.
