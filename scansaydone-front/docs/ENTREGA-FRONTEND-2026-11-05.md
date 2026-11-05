# Entrega — frontend Scan-Say-Done

> Documento para quien revisa e integra. Responde tres preguntas: **qué se sube**, **cómo se
> ejecuta** y **qué falta**.
> Fecha: 2026-11-05 · Rama: `dev/nicolaslopezv` · Commit: `3f551a7`

---

## 1. Qué se entrega

El **frontend completo** de Scan-Say-Done: landing, acceso, panel de resultados y páginas
internas, con su documentación de diseño y sus assets.

**Alcance: solo frontend.** El backend será **Python / FastAPI** y lo desarrolla otro equipo.
Todavía no existe, y la interfaz no finge lo contrario: donde no hay dato, lo dice.

| | |
|---|---|
| Stack | Next.js 15 (App Router) · React 19 · SCSS con tokens · Bootstrap 5 (grid y utilidades) |
| Node requerido | 20 o superior (probado con 24.16.0) |
| Commits | 162, del 2026-10-27 al 2026-11-05 |
| Archivos versionados | 408 |
| Tamaño del repositorio | **65 MB** (136 imágenes de producto + 65 capturas de diseño) |

## 2. Cómo ejecutarlo

```bash
git clone <URL-del-repositorio>
cd scan-say-done
git checkout dev/nicolaslopezv

npm ci          # instalación reproducible (package-lock.json está versionado)
npm run dev     # http://localhost:3000
```

Producción:

```bash
npm run build
npm start
```

> **No ejecutar `npm run dev` y `npm run build` a la vez**: comparten la carpeta `.next` y el
> servidor termina sirviendo un build viejo sin avisar.

**Sin variables de entorno funciona.** Todas son opcionales (`NEXT_PUBLIC_*`) y la interfaz se
degrada sola. Detalle: `README.md` § Configuración.

## 3. Rutas incluidas

| Ruta | Estado |
|---|---|
| `/` | Landing completa |
| `/entrar` | Acceso por correo (flujo de demostración: no envía correo) |
| `/contactus` | Contacto con formulario validado |
| `/panel` | Panel: resumen con badge `DATOS DE EJEMPLO` |
| `/panel/respuestas` | Tabla de respuestas |
| `/panel/qr` | Marco del QR — **sin QR generado** |
| `/aboutus` · `/services` · `/service-detail` · `/faqs` · `/pricing` · `/privacy` · `/terms` | Páginas internas |

## 4. Qué **no** incluye

Esto es lo que el administrador debe saber antes de aprobar:

| Falta | Consecuencia |
|---|---|
| **Backend** (FastAPI, otro equipo) | El panel muestra datos de ejemplo, no reales. El acceso no envía correo |
| **Generación de QR** | `/panel/qr` es un marco vacío. Los QR de las fotos son **decorativos: no escanean** |
| **Precios** | La sección está sellada como no publicada (`hasPricing() = false`) |
| **Datos del operador** | Falta razón social, RUT, jurisdicción, retención y correo de contacto |
| **Formulario activo** | Inerte hasta configurar `NEXT_PUBLIC_CONTACT_EMAIL` o `NEXT_PUBLIC_CONTACT_ENDPOINT` |

Ninguna de estas ausencias se disimula en pantalla: cada una se declara donde corresponde.

## 5. Validación ejecutada

```
npm run build             ✓ Compilado sin errores
npm run lint              ✓ 0 errores · 7 warnings conocidos (label-has-associated-control)
npm test                  ✓ 3/3
npm run check:tokens      ✓ OK
npm run check:placeholders ✓ 0 placeholders
```

Las **13 rutas** responden `200`. Sin desborde horizontal (`scrollX = 0`) a 1440 y 375.

Los 7 warnings son un falso positivo conocido de `eslint-plugin-jsx-a11y`: los `<label>` sí
tienen `htmlFor` con control asociado. No se silenciaron.

## 6. Reglas del proyecto

Se aplicaron de forma estricta; si algo las incumple, es un bug:

1. **No se inventan datos**: ni precios, ni cifras, ni testimonios, ni direcciones, ni plazos.
2. **Nada de botones sin acción.** Si un botón no puede hacer nada, está deshabilitado y dice por qué.
3. **Ningún estado de éxito falso.** Sin petición real, la pantalla no dice "enviado".
4. **Las fotos de ambiente son ilustraciones** y la página lo declara.
5. Español de Chile/LatAm, tuteo.

Reglas completas y trampas técnicas: **`AGENTS.md`**.

## 7. Cómo revisarlo en diez minutos

| # | Qué mirar | Dónde |
|---|---|---|
| 1 | La landing completa, de arriba a abajo | `/` |
| 2 | Que el panel declara que los datos son de ejemplo | `/panel` → badge `DATOS DE EJEMPLO` |
| 3 | Que el formulario avisa antes de escribir que no puede enviar | `/contactus` |
| 4 | Que ninguna foto promete algo que no existe | `/` sección "Así se ve en tu local" |
| 5 | Contraste y foco de teclado | `Tab` por cualquier página |
| 6 | La documentación de diseño | `opendesign/wireframes/INDEX.md` |

## 8. Composición del repositorio

| Carpeta | Archivos | Qué es |
|---|---|---|
| `public/images/` | 136 | Logo, fotos de ambiente, captura del panel |
| `opendesign/capturas/` | 65 | Capturas de referencia y verificación |
| `src/app/` | 59 | Rutas, componentes, datos, estilos |
| `opendesign/wireframes/` | 38 | Planos métricos SVG + índice |
| `opendesign/mockups/` · `referencias/` · `brand-src/` | 38 | Material de diseño |
| `docs/` · `tests/` · `scripts/` | 15 | Arquitectura, tests y validadores |

## 9. Riesgos conocidos

| Riesgo | Mitigación |
|---|---|
| Imágenes pesadas (65 MB de repo) | Versionadas y optimizadas por `next/image`; los fondos CSS van comprimidos (56-106 KB) |
| Dependencias posiblemente sin uso tras la purga de plantilla | Listadas en `README.md` § Deuda; no se retiraron sin medir |
| PNG de los wireframes sin generar | La rasterización está bloqueada por herramienta; el SVG es la fuente de verdad |
| Divergencia de rama al primer push | Si la rama remota ya tiene commits, usar `git pull --rebase` antes de subir |

## 10. Cómo subirlo

```bash
git remote add origin <URL-del-repositorio>
git fetch origin
git push -u origin dev/nicolaslopezv
```

Después, Pull Request `dev/nicolaslopezv` → `main`. **No se empuja nunca directo a `main`.**
Procedimiento completo y prohibiciones: `docs/PUBLICAR-RAMA.md`.
