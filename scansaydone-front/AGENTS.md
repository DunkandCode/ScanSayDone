# Scan-Say-Done — anchor de proyecto

> Archivo de anclaje. Se lee al empezar cualquier sesión en este repo, antes de tocar código.
> Última revisión: 2026-11-05.

---

## 1. Qué es este proyecto

SaaS de encuestas de 3 preguntas por código QR para negocios pequeños. El cliente escanea,
responde en el navegador (sin app ni cuenta) y el dueño lee las respuestas en un panel.

Stack: **Next.js 15 (App Router)** + SCSS con tokens. Sin LSP: la validación es explícita
(`npm run build`, `npm run lint`, `npm test`, `check:tokens`, `check:placeholders`).

### Reparto de trabajo (2026-11-05)

| Parte | Estado | Quién |
|---|---|---|
| **Frontend** (este repo) | En desarrollo activo | nicolaslopezv |
| **Backend** | Lo desarrolla **otro equipo**, en **Python / FastAPI** | equipo de backend |

**Hoy se trabaja solo frontend.** No existe backend al que consultar, así que el frontend no
inventa respuestas: cuando necesita datos que aún no existen, lo dice en pantalla o usa datos
de ejemplo marcados como tales.

La integración con FastAPI llega **después**. Por eso el formulario de contacto ya tiene un
modo `endpoint` preparado (§6): cuando el backend exista, basta con definir la URL y el
frontend empieza a enviar. Mientras no exista, ese modo no se usa.

---

## 2. Rama y remoto — REGLA DURA

**Solo se empuja a la rama propia. Nunca a `main`. Nunca a la rama de otra persona.**

| Regla | Detalle |
|---|---|
| Rama de trabajo | `dev/nicolaslopezv` (una rama por integrante: `dev/<usuario>`) |
| Destino de los cambios | Pull Request desde la rama propia hacia `main` |
| `main` | Protegida. Sin push directo. |
| Ramas ajenas | No se tocan, ni con `push` ni con `reset` |

Comandos del flujo:

```bash
git fetch origin
git checkout dev/nicolaslopezv
# trabajar y commitear
git push origin dev/nicolaslopezv
# abrir Pull Request en GitHub: dev/nicolaslopezv → main
```

### Estado real de este checkout (2026-11-05)

Este directorio **todavía no está conectado al remoto**: `git remote -v` no devuelve nada y
la rama local es `master`. La regla de arriba es la convención del equipo, pero **no se puede
cumplir aquí hasta configurar el remoto**. Cuando exista la URL del repositorio:

```bash
git remote add origin <URL-del-repo>
git fetch origin
git switch -c dev/nicolaslopezv --track origin/dev/nicolaslopezv
```

Verificación: `git remote -v` debe mostrar `origin` y `git branch --show-current` debe
devolver `dev/nicolaslopezv` **antes** de commitear.

---

## 3. Equipo

- Organización: **DunkandCode** — `https://github.com/orgs/DunkandCode`
- Tablero: `https://github.com/orgs/DunkandCode/projects`
- Integrantes con permiso de escritura: **5** (al 2026-11-05).
- Operador de este checkout: **nicolaslopezv**.

---

## 4. Reglas de contenido (no negociables)

1. **No se inventan datos.** Ni precios, ni cifras, ni testimonios, ni logos, ni fotos con
   personas, ni direcciones, ni teléfonos, ni plazos de respuesta.
2. **Nada de botones sin acción.** Un botón deshabilitado debe decir por qué lo está.
3. **Ningún estado de éxito falso.** Si no hubo petición, no se dice "enviado".
4. **Español de Chile/LatAm, tuteo.** Vetado en texto visible: `KPI`, `CSAT`, `NPS`, `score`,
   `dashboard`, `insights`, `tiempo real`, `en construcción`, `próximamente`.
5. **Las fotos de ambiente son ilustraciones** y la página lo declara. Los códigos QR de esas
   fotos son decorativos: no escanean.
6. **`opendesign/` manda.** Si el documento y el código se contradicen, se corrige uno y se
   escribe la razón.

---

## 5. Mapa rápido

| Ruta | Qué es |
|---|---|
| `src/app/page.js` | Landing |
| `src/app/entrar/` | Login (split a pantalla completa, gramática propia) |
| `src/app/contactus/` | Contacto: página normal del sitio, formulario en `col-lg-8` |
| `src/app/panel/` | Panel de resultados (datos de ejemplo, badge visible) |
| `src/app/assets/scss/` | Tokens + parciales por página (`_home`, `_login`, `_contacto`, …) |
| `public/images/apps/` | Fotos de ambiente del producto |
| `opendesign/` | Specs, auditorías, wireframes, decisiones de diseño |

---

## 6. Estado del formulario de contacto

Tres modos, decididos por configuración en tiempo de build:

| Configuración | Comportamiento | Hoy |
|---|---|---|
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | `POST` real, con estado de carga | **esperando al backend** |
| solo `NEXT_PUBLIC_CONTACT_EMAIL` | Abre el programa de correo con el mensaje escrito (`mailto:`) | disponible al configurarla |
| ninguna | No envía: aviso visible **antes** de los campos y botón `ENVÍO NO DISPONIBLE` | **estado actual** |

### Contrato que el frontend ya emite (para el equipo de FastAPI)

Cuando `NEXT_PUBLIC_CONTACT_ENDPOINT` esté definida, el formulario hace **exactamente esto**:

```http
POST {NEXT_PUBLIC_CONTACT_ENDPOINT}
Content-Type: application/json

{ "nombre": "string", "correo": "string", "negocio": "string", "mensaje": "string" }
```

- `negocio` puede ir vacío (es opcional en el formulario).
- Respuesta **2xx** → el formulario muestra "MENSAJE ENVIADO".
- Cualquier otra respuesta, o fallo de red → estado de error con reintento. **No hay éxito
  optimista**: si el backend no contesta bien, la pantalla no dice que se envió.
- El frontend no envía cookies, ni tokens, ni identificadores. No hay autenticación.
- Los límites se validan en cliente (`nombre` ≤ 80, `negocio` ≤ 80, `mensaje` ≤ 800, mínimo 10),
  pero **el backend debe revalidar**: la validación de cliente es usabilidad, no seguridad.

Nada de esto está implementado en servidor todavía. Es la forma del contrato, no una promesa
de que exista.

---

## 7. Trampas conocidas

- `_bootstrap-custom.scss:22-27` emite `h1…h6 { font-size: … !important }`: toda clase
  tipográfica sobre un `h2`/`h3` necesita `!important` en `font-size`.
- `_general.scss` fuerza `a { text-decoration: none !important }`.
- `globals.css` pone `main { padding-top: 76px }`; las rutas sin navbar lo cancelan con
  `main:has(> .X)`.
- **No correr `npm run dev` y `npm run build` a la vez**: comparten `.next`.
- Las capturas `fullPage` con Playwright congelan un frame intermedio de las animaciones de
  opacidad: para medir contraste, usar captura de viewport.
- Reemplazar una imagen con el mismo nombre exige borrar `.next/cache/images`.
