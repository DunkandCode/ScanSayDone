# Plan de proyecto — Frontend ScanSayDone

> **Estado**: aprobado por el operador el 2026-11-05. Documento de trabajo.
> **Alcance**: `scansaydone-front/`. El backend lo lleva otro equipo.
> **Principio rector**: primero el frontend completo con datos de demostración honestos; después la integración.

---

## 1. Base verificada

| Elemento | Estado |
|---|---|
| Ruta activa | `E:\Trabajos\ScanSayDone` |
| Rama de trabajo | `dev/nicolaslopezv`, desde `main` |
| Stack | Next.js 16.4.3 · React 19.3 · TypeScript 5 · Tailwind CSS 4 |
| Frontend actual | Scaffold de `create-next-app` + una página demo con datos inventados |
| Backend actual | `/health`, generación de QR y cálculo NPS. Sin persistencia de respuestas |
| CI actual | Build del frontend, sintaxis del backend y escaneo de `.env`. Sin lint, tests ni typecheck |
| UX del 30-oct | 148 archivos. Referencia histórica, escrita para un stack anterior |
| Avance previo | Conservado en `refs/archive/pre-rebuild/*`, bundle y ZIP |

**Stack no negociable**: Next 16 + TypeScript + Tailwind 4. No se reintroduce Bootstrap, Sass ni el proyecto en JavaScript.

---

## 2. Fuentes de verdad

| Dato | Fuente autoritativa |
|---|---|
| Stack y versiones | `scansaydone-front/package.json`, `tsconfig.json`, `next.config.ts` |
| Producto y sprints | `docs/sprints/`, `docs/roles/`, `docs/implementaciones/` |
| Diseño visual | Snapshot `ENTREGA-UX-2026-10-30` + contrato de diseño revisado |
| Marca | Logos reales del bundle local. Los mockups de IA no son asset ni copy |
| Copy | Solo textos aprobados. Sin cifras, precios, testimonios ni logos de clientes inventados |
| API | Contrato único definido por el equipo de backend |

Regla: si dos documentos contradicen, se resuelve en un acta y se corrige el documento, no el código.

---

## 3. Orden de trabajo

```
F0 Base  →  L Landing  →  A Login  →  P Panel  →  I Internas  →  E Encuesta  →  Backend
```

- **Solo frontend.** Ni una llamada a la API en esta fase: todo funciona con datos de demostración
  aislados. La integración con backend es la última etapa, cuando el contrato exista.
- Cada etapa se aprueba antes de la siguiente.
- Si un gate falla, no se avanza: se corrige en la misma etapa.
- La encuesta queda al final porque depende de decisiones de producto y de un endpoint que hoy no
  existe.
- El landing se construye sección por sección, revisando las capturas existentes en cada una.

### 3.1 Documentación: dos zonas que no se mezclan

| Zona | Ruta | Estado |
|---|---|---|
| Documentación viva | `docs/ux/` | Vigente, se edita con fecha nueva |
| Snapshot histórico | `scansaydone-front/ENTREGA-UX-2026-10-30/` | Congelado, nunca se edita |

Regla: si un valor cambia, se escribe un documento nuevo con la fecha del cambio y se declara qué
reemplaza. El snapshot no se toca. Convención completa en `docs/ux/README.md`.

---

## 4. Forma de trabajo

### 4.1 Ramas

- Trabajo en `dev/nicolaslopezv`, creada desde `main`.
- `main` no se toca directamente. Todo entra por Pull Request.
- Prohibido: `--force`, `reset --hard`, `clean`, borrar ramas ajenas.

### 4.2 Sincronización con otras áreas

```powershell
git fetch origin
git merge origin/main
```

- Los cambios de otros bajan hacia nuestra rama; nunca al revés.
- Sin `rebase` sobre rama ya publicada.
- En conflicto se conservan ambos avances. Descartar el propio no es una resolución.
- Al cerrar cada lote: push a la rama personal, para que el avance exista fuera del disco.

### 4.3 Commits

- Convencionales: `feat`, `fix`, `docs`, `chore`.
- Por path explícito, nunca `git add .`.
- Un lote cerrado = commits coherentes, no un commit gigante.

### 4.4 Regla de no pérdida

- Toda operación destructiva exige respaldo verificado antes.
- La carpeta UX del 30 se preserva. Queda fuera de Git con regla explícita y manifiesto.
- Los respaldos existentes (bundle, ZIP) no se borran durante el proyecto.

---

## 5. Agentes y uso del manual

Todo agente que participe debe trabajar según `docs/standards/MANUAL-HERRAMIENTAS-AGENTES.md` y `docs/standards/PROJECT-DOCTRINE-10-MANDAMIENTOS.md` del ecosistema.

| Etapa | Agente | Responsabilidad |
|---|---|---|
| F0 | `architect-alibaba` | Estructura de rutas, límites cliente/servidor |
| F0 | `frontend-alibaba` | Tokens, fuentes, primitivos |
| F0 | `gitops-alibaba` | CI: lint, typecheck, tests |
| L / A / P / I | `frontend-alibaba` | Implementación por lote |
| L / A / P / I | `designer-alibaba` | Validación visual, assets, contraste |
| Todas | `reviewer-alibaba` | Gate final, lectura crítica |
| Backend | `backend-alibaba` | Solo cuando el contrato exista |

Reglas del manual que aplican siempre:

- Un dominio por delegación; dos especialistas nunca escriben las mismas rutas.
- PASS exige salida de comando y código de salida, no afirmaciones.
- Una sola fuente de verdad por dato.
- Fallo ruidoso: si algo falta o degrada, se declara.
- Cierre limpio: gates, capturas, pendientes dichos.

---

## 6. Etapa F0 — Base

| Lote | Entrega | Criterio de aceptación |
|---|---|---|
| F0.1 | Grupos de ruta `(marketing)`, `(survey)`, `(auth)`, `(panel)` | Build verde; URLs sin cambios; cada zona aísla su layout |
| F0.2 | Tokens en `globals.css` con `@theme` | Cero colores sueltos en componentes; tokens por zona |
| F0.3 | Fuentes de marca con `next/font` | Sin Arial ni Geist heredado; sin bloqueo de render |
| F0.4 | `lint`, `tsc --noEmit` y tests en CI | El pipeline falla si hay error |
| F0.5 | `src/lib/config` y tipos de API | Cero `process.env` disperso; datos demo aislados |

**Bloqueo**: F0.2 requiere paleta aprobada. Sin esa decisión, F0.1 y F0.3 pueden avanzar; F0.2 no.

---

## 7. Etapa L — Landing

Estructura de ocho bloques, decidida antes de maquetar. Referencias: artículo de Shopify sobre landing pages, `landing-page-design` y sus referencias, snapshot UX del 30.

| Lote | Sección | Contenido honesto | Criterio |
|---|---|---|---|
| L1 | Hero | Oferta única, CTA principal, acceso a demo | H1 único, contraste ≥4.5:1, sin animación de entrada |
| L2 | Cómo funciona | Tres pasos reales del producto | Sin capturas falsas ni tiempos inventados |
| L3 | Qué ve el dueño | Captura real del panel con banda DEMO | Imagen con dimensiones y `alt` real |
| L4 | Canales | QR en mesa, cartel, tablet | Sin QR escaneable falso; declarado como ilustración |
| L5 | Para quién | Restaurantes, cafés, comercios pequeños | Sin logos de clientes |
| L6 | Preguntas frecuentes | Qué se guarda, quién lo ve, cuánto tarda | Acordeón accesible por teclado |
| L7 | Cierre | Repetición del CTA + aviso de estado demo | Mismo destino que el hero |
| L8 | Footer | Contacto real | Sin enlaces muertos |

Aplicación de los principios del artículo, con corrección de honestidad:

- Un objetivo, una audiencia, una acción.
- Oferta explícita, no "conoce más".
- Vender el resultado, no la función.
- Prueba social: **bloqueada** mientras no existan clientes reales. Se sustituye por demostración y transparencia.
- CTA repetido y consistente; evaluar versión pegajosa solo en desktop.
- Sin animación sobre el pliegue: evita CLS y retraso del LCP.
- Imagen principal del hero con carga prioritaria.

Cada lote L cierra con: build, lint, typecheck, axe, captura de viewport y commit por path.

---

## 8. Etapa A — Login

- Layout partido, tarjeta de acceso, estados completos.
- Aviso visible de que es demostración: sin autenticación real hasta que exista backend.
- Sin almacenamiento de credenciales, sin correo real enviado.
- Gate: seis estados por control, foco visible, teclado completo.

---

## 9. Etapa P — Panel

- Shell con barra lateral y barra superior; versión con cajón en pantallas angostas.
- Resumen, respuestas y QR, cada uno con estados de carga, vacío y error.
- Datos de demostración aislados y etiquetados. Nunca métricas inventadas sin banda DEMO.
- Sin gráficos de terceros: barras propias con tokens.
- Gate: tabla con encabezados accesibles, sin trampa de teclado, cero cifras falsas.

---

## 10. Etapa I — Páginas internas

Ocho rutas con el mismo patrón de cabecera. Los datos legales pendientes se muestran como marcadores visibles, nunca inventados.

---

## 11. Etapa E — Encuesta (bloqueada)

Depende de tres decisiones ajenas al frontend:

1. Tres o cinco preguntas.
2. Nombre y forma del endpoint de respuestas.
3. Política de retención y datos personales.

Hasta entonces no se implementa la pantalla pública de encuesta.

---

## 12. Gate de cada lote

```
npm run build
npm run lint
npx tsc --noEmit
npm test
axe / Playwright en la vista tocada
captura de viewport
```

Un lote sin salida de comandos no está terminado. Un PASS sin evidencia no cuenta.

---

## 13. Definición de terminado

- Build, lint, tipos y tests en verde, con salida pegada.
- Accesibilidad: sin violaciones críticas ni graves en la vista tocada.
- Contraste medido, no supuesto.
- Estados de carga, vacío, error y éxito presentes.
- Copy sin datos inventados.
- Captura de la vista y commit por path.
- Pendientes declarados.

---

## 14. Decisiones pendientes

| # | Decisión | Quién |
|---|---|---|
| 1 | Dirección de color | Operador |
| 2 | Tres o cinco preguntas | PM / equipo |
| 3 | Contrato de respuestas | Backend |
| 4 | Datos legales y de contacto | Operador |
| 5 | Precios | PM |

---

## 15. Riesgos

| Riesgo | Mitigación |
|---|---|
| Cambios de backend rompen el frontend | Adaptador tipado aislado; datos demo separados |
| Documentos de UX contradicen el stack nuevo | Contrato de diseño revisado antes de F0.2 |
| Archivos pesados entran a Git | Regla de `.gitignore` y manifiesto |
| Pérdida de avance local | Push al cerrar cada lote; respaldos verificados |
| Datos inventados llegan a producción | Guardrail de copy y banda DEMO obligatoria |
