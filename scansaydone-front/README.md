# Scan-Say-Done

Landing y panel de un SaaS de encuestas de 3 preguntas por código QR para negocios pequeños.
El cliente escanea, responde en el navegador (sin app y sin cuenta) y el dueño lee las
respuestas en un panel.

> **Estado (2026-11-05): solo frontend.** El backend será **Python / FastAPI** y lo desarrolla
> otro equipo; todavía no está conectado. Mientras no exista, la interfaz no inventa respuestas:
> lo dice en pantalla o usa datos de ejemplo marcados como tales. Ver `AGENTS.md` §1.

---

## Requisitos

| Herramienta | Versión | Probado con |
|---|---|---|
| Node.js | 20 o superior | 24.16.0 |
| npm | 10 o superior | 11.18.0 |

## Instalación

```bash
git clone <URL-del-repositorio>
cd scan-say-done

# trabajar SIEMPRE en tu rama personal
git fetch origin
git checkout dev/<tu-usuario>

npm install
```

## Ejecutar

```bash
npm run dev          # desarrollo, con Turbopack → http://localhost:3000
```

Producción:

```bash
npm run build
npm start
```

> **No corras `npm run dev` y `npm run build` a la vez**: comparten la carpeta `.next` y el
> servidor queda sirviendo un build viejo sin avisar.

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Compila para producción |
| `npm start` | Sirve el build compilado |
| `npm run lint` | ESLint (flat config, incluye `.jsx`) |
| `npm test` | Tests de datos con `node --test` |
| `npm run check:tokens` | Verifica que los tokens SCSS se emiten |
| `npm run check:placeholders` | Falla si queda un placeholder sin resolver |

**Antes de abrir un Pull Request**, los cinco deben pasar: `build`, `lint` (0 errores),
`test`, `check:tokens`, `check:placeholders`.

## Rutas

| Ruta | Qué es |
|---|---|
| `/` | Landing |
| `/entrar` | Acceso (split a pantalla completa, sin navbar) |
| `/contactus` | Contacto: formulario en `col-lg-8`, página normal del sitio |
| `/panel` | Panel: resumen con datos de ejemplo (badge `DATOS DE EJEMPLO`) |
| `/panel/respuestas` | Panel: tabla de respuestas |
| `/panel/qr` | Panel: marco del QR (sin QR generado todavía) |
| `/aboutus`, `/services`, `/service-detail`, `/faqs`, `/pricing`, `/privacy`, `/terms` | Páginas internas |

## Configuración

Todas las variables son `NEXT_PUBLIC_*`, **opcionales** y se leen en `src/app/data/site.js`.
Sin ellas la interfaz se degrada sola: no hay valores por defecto inventados.

| Variable | Efecto | Si falta |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canónica (`metadataBase`) | usa `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_NAME` | Nombre del sitio | `Scan-Say-Done` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Correo de contacto y destino del formulario | el formulario avisa que no puede enviar |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | Endpoint `POST` del backend | no se usa |
| `NEXT_PUBLIC_CONTACT_PHONE` | Teléfono | no se publica teléfono |
| `NEXT_PUBLIC_CONTACT_ADDRESS` | Dirección | no se publica dirección |
| `NEXT_PUBLIC_LEGAL_NAME` | Razón social | no se muestra |
| `NEXT_PUBLIC_MAP_URL` | Mapa | no se muestra mapa |

### El formulario de contacto tiene tres modos

Se decide en tiempo de **build**:

| Configuración | Comportamiento |
|---|---|
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | `POST` real con estado de carga (integración FastAPI) |
| solo `NEXT_PUBLIC_CONTACT_EMAIL` | Abre el programa de correo con el mensaje escrito (`mailto:`) |
| ninguna | No envía: aviso **antes** de los campos y botón `ENVÍO NO DISPONIBLE` |

Contrato que emite el frontend cuando hay endpoint:

```http
POST {NEXT_PUBLIC_CONTACT_ENDPOINT}
Content-Type: application/json

{ "nombre": "string", "correo": "string", "negocio": "string", "mensaje": "string" }
```

`2xx` → mensaje enviado. Cualquier otra respuesta o fallo de red → error con reintento.
Sin cookies, sin tokens, sin autenticación. La validación de cliente es usabilidad:
**el backend debe revalidar**.

## Estructura

```
src/app/
  page.js                 landing
  entrar/ contactus/ panel/ …   una carpeta por ruta
  components/             navbar, footer, page-hero, scroll-to-top
  data/                   site.js (config) + datos de ejemplo
  lib/                    helpers (contacto, panel)
  assets/scss/            tokens, Bootstrap custom, un parcial por pantalla
public/images/            logo, fotos de ambiente, captura del panel
opendesign/               specs, auditorías, wireframes, actas de decisión
docs/                     arquitectura, configuración, plan, publicación
tests/                    tests de datos con node --test
scripts/                  validadores y arranque local
```

## Cómo se trabaja

1. **Rama propia**: `dev/<tu-usuario>`. Nunca se empuja a `main` ni a la rama de otro.
   Los cambios llegan a `main` por Pull Request. Detalle: `docs/PUBLICAR-RAMA.md`.
2. **No se inventan datos**: ni precios, ni cifras, ni testimonios, ni direcciones, ni plazos.
3. **Nada de botones sin acción** ni estados de éxito falsos.
4. **Español de Chile/LatAm, tuteo.** Vetado en texto visible: `KPI`, `CSAT`, `NPS`, `score`,
   `dashboard`, `insights`, `tiempo real`, `en construcción`, `próximamente`.
5. **`opendesign/` manda**: si el documento y el código se contradicen, se corrige uno y se
   escribe la razón.

Reglas completas y trampas del proyecto: **`AGENTS.md`**.

## Documentación

| Archivo | Para qué |
|---|---|
| `AGENTS.md` | Anchor del proyecto: reglas, ramas, mapa, trampas |
| `docs/ENTREGA-FRONTEND-2026-11-05.md` | Documento de entrega para quien revisa: qué se sube, cómo se ejecuta, qué falta |
| `docs/PLAN-SUBIDA-RAMA.md` | Determinación de cómo subir a la rama, para aprobar |
| `docs/PUBLICAR-RAMA.md` | Cómo dejar listo y subir un avance a tu rama |
| `docs/ARQUITECTURA-SCAN-SAY-DONE.md` | Arquitectura y decisiones |
| `docs/CONFIGURACION-SITIO.md` | Variables y degradación |
| `opendesign/wireframes/INDEX.md` | Inventario de planos y su estado |
| `opendesign/*.md` | Specs por pantalla y actas de verificación |

## Deuda conocida

- **QR del producto**: no existe generación de QR real; `/panel/qr` es un marco vacío y los QR
  de las fotos de ambiente son decorativos (no escanean).
- **Formulario de contacto**: inerte hasta configurar correo o endpoint.
- **PNG de los wireframes**: no generados. La rasterización está bloqueada por herramienta
  (sin `sharp`); el SVG es la fuente de verdad y se abre en el navegador.
- **Dependencias posiblemente sin uso** tras la purga de plantilla: `react-countup`,
  `react-type-animation`, `swiper`, `tiny-slider-react`, `yet-another-react-lightbox`.
  No se retiraron sin medir antes.
- `_contact.scss` quedó huérfano (`.error`, `.contact-loader` sin uso).
