# LOGIN-DECISIONES — librerías, componentes, tokens y riesgos del login

> 30-oct-2026 · designer-alibaba · complementa a `LOGIN-UX.md` · cero código de producto.
> Stack real verificado (`package.json` + `node_modules`): Next 15.4.1 · React 19.1 · Bootstrap 5.3.7 compilado desde Sass · `react-icons/fi` (Feather) ya en uso (`src/app/page.js:2`) · `next/font` Bebas+Montserrat.

## 1. Librerías: instalar / no instalar

Lo que **ya tenemos y no se duplica**: Bootstrap 5.3 (formularios + validación + utilidades), react-icons set Feather (`Fi*`), next/font (2 familias, subset). Añadir cualquier alternativa = tercera vía sobre el mismo territorio; el contrato prohíbe la tercera familia tipográfica y los sets de iconos extra.

| Territorio | Candidato | Veredicto | Razón (fuente verificada) |
|---|---|---|---|
| Campos de formulario | `react-hook-form`, `formik` | **NO** | 1 campo. Bootstrap `form-control`/`form-label`/`form-text` cubre; context7 `/twbs/bootstrap` valida el mecanismo completo sin JS de librería |
| Validación | librerías de esquema (`zod`, `yup`) | **NO** | context7 `/twbs/bootstrap` (validation.mdx): servidor `is-invalid`/`is-valid` + cliente `:invalid` bajo `was-validated` (5.3.7 verificado en `node_modules/bootstrap/scss/mixins/_forms.scss:7`); el email se valida con `type=email` nativo; nota v6: upstream migra a `data-bs-validate` — no aplica al repo, no instalar nada hoy |
| `input-otp` (6 dígitos) | `input-otp` (`/guilhermerodz/input-otp`, context7: 109 snippets, input oculto único + espejo de slots, `autoComplete="one-time-code"` por default) | **NO (hoy)** — candidato único si el magic-link falla | El mecanismo decidido es enlace al correo, no código: no hay 6 dígitos que espejar. Si el piloto exige fallback por código, esta (y no otro) es la librería: resuelve teclado móvil y gestores de contraseñas sin estilos propios |
| Iconos nuevos | `lucide-react` | **NO** | `react-icons/fi` ya cubre los 6 que pide el diseño: `FiArrowLeft` `FiKey` `FiMail` `FiCheck` `FiAlertTriangle` `FiRefreshCw` — todos existen en Feather (uso actual: `src/app/page.js:2`, `pricing.jsx:2`) |
| Fuentes | `next/font/google` extra (Geist, Inter…) | **NO** | contrato §3: dos familias (Bebas 400 / Montserrat 400·500·600) y ninguna tercera; la referencia IA sugiere "Inter o DM Sans" — slop tell confirmado por el propio `ANALISIS-LOGIN-wan.md` (score 60/100, bandera `default_fonts`) |
| Gestión de foco / trap | `focus-trap-react`, `aria-hidden` | **NO** | no hay modales ni drawers en esta pantalla; foco = CSS nativo (`outline:3px` contrato §5) + `.focus()` al pasar a "revisa tu correo" |
| Medidor de contraseña | `zxcvbn` | **NO APLICA** | no hay contraseña: campo vetado por diseño (producto = magic link); instalarlo sería diseñar un acceso que el sitio niega |
| Passkeys (WebAuthn) | librería frontend | **NO** | `navigator.credentials.create({ publicKey })` es API nativa; lo que falta es backend (rpId, challenge, registro) — territorio de backend, no de UI (ver §5) |
| Toasts | `sonner` | **NO** | el envío del enlace es estado persistente de la vista (region `status`), no aviso fugaz; `sonner` queda para el panel (deuda declarada en contrato §2) |

## 2. Componentes nuevos (especificación, sin código)

| Nombre | responsabilidad | props mínimas | estados propios |
|---|---|---|---|
| `LoginSplit` | layout de la pantalla: mitad crema + mitad ciruela con glow; en <992 → franja + columna | `children: {form, aside}` | ninguno (CSS puro por breakpoint) |
| `BrandRail` | franja superior móvil (glow + wordmark, h 96→88) | `variant: 'strip'` | ninguno |
| `MagicLinkForm` | label + input email + primario + pie legal | `onRequest(email)`, `status`, `serverError` | idle · invalido-blur · loading · disabled-offline |
| `SentNotice` | región `role="status"`: "Revisa tu correo", eco del correo, reenviar con cooldown, "usar otro correo" | `email`, `canResend`, `onResend`, `onRestart` | sent · countdown-real |
| `PasskeyButton` | secundario passkey; se oculta si WebAuthn no está disponible | `supported` (feature detect), `onCreate` | unsupported-oculto · idle · loading |
| `OfflineBanner` | aviso conectado a `navigator.onLine` + eventos `online/offline` | — | online-oculto · offline visible (icono+texto) |
| `SurveyMockPanel` | mitad derecha: tarjeta 1–5 con badge `DEMO`, `aria-hidden` | — | estático (sin estados funcionales: es dibujo) |

Composición de la vista: `LoginSplit( MagicLinkForm | SentNotice , SurveyMockPanel )` + `OfflineBanner` dentro de la tarjeta.

## 3. Tokens nuevos

**Cero.** El split reutiliza `--bg`/`--surface`/`--border-strong`/`--link`/`--text-2`/`--action-primary*`/`--error*`/`--focus-ring` (contrato §2). Dos cosas quedan registradas como gobernanza, no como token:

1. **Glow:** el login es la **3.ª colocación** de `--glow-hero`; el contrato §2/EFECTOS §2.1 fija "2 colocaciones · 1 por página". El valor no cambia; lo que se debe enmendar es la lista de colocaciones cuando el operador apruebe el diseño. Alternativa descartada: `--glow-login` con el mismo valor (token duplicado = slop de gobernanza).
2. **Zona:** la pantalla no es marketing/encuesta/panel. Si se implementa, abre `body.zone-auth` con los mismos primitivos de la zona panel (superficie blanca sobre crema) — reutiliza, no crea paleta.

## 4. Patrones 2026

**Sí valen** (para esta pantalla):

| Patrón | por qué aquí | fuente |
|---|---|---|
| Magic link como vía principal, correo único campo | coincide con la promesa escrita del producto ("sin contraseña, sin app"); el formulario de 1 campo es el más corto posible | [web: https://www.loginradius.com/blog/identity/passwordless-authentication-magic-links] |
| Enlace con ventana corta reutilizable + copy de expiración | los lectores de correo (prefetch de seguridad) "pican" el enlace antes que el humano; el diseño debe prever el "¿no llega?" sin culpa de nadie | [web: https://www.getfluxly.com/blog/magic-link-email-best-practices] |
| Passkey como acelerador secundario, no como única vía | consenso de adopción 2026 = híbrido; even Google llega al 28 % de logins con passkey en su "Power 20" → 7 de cada 10 siguen sin él | [web: https://www.dashlane.com/blog/passkey-report-2026] · [web: https://thebackenddevelopers.substack.com/p/passkeys-in-2026-ux-security-and] |
| Fin del OTP por SMS como fallback | reguladores 2025–2026 lo están retirando (phishing); no diseñar nunca "enviar código por SMS" | [web: https://mojoauth.com/blog/passwordless-passkeys-what-the-adoption-data-shows] |
| Split-screen: función + contexto de marca lado a lado | default seguro del login SaaS 2026: el formulario corto gana contexto sin pedir atención | [web: https://www.eleken.co/blog-posts/login-page-examples] · [web: https://theplusaddons.com/blog/login-page-examples/] |

**Modas que NO:** campo de contraseña "por si acaso" · wall de OAuth con 3 proveedores sin backend · métricas de "usuarios activos" en el login · glassmorphism en la tarjeta · orbes animados fuera de token · Inter/Geist como tercera familia · `input-otp` decorativo con 6 casillas cuando el producto manda un enlace.

RAG: 2 consultas (`login form design usability error message`, `passwordless authentication magic link`) — el corpus devolvió material de código/seguridad (Django, ASP.NET), **no** chunks de diseño aplicables; nada se apoya en RAG en este documento. [criterio propio] el resto de decisiones de gusto (flip, radios, franja móvil).

## 5. Riesgos de diseñar login sin backend de auth

| # | Riesgo | Qué queda explícito en el diseño |
|---|---|---|
| 1 | La pantalla **promete una puerta a un panel que no existe** | badge `DISEÑO` + nota "pantalla de diseño: ningún botón abre correo todavía" dentro de la tarjeta (mismo tratamiento honesto que el marco del panel en la landing) |
| 2 | Capturar correos sin poder entregarlos (el canal de contacto del sitio está sin configurar) | el estado "enviado" solo existe como dibujo de especificación; al implementar, el botón no puede mostrarse hasta que exista envío real — prohibido simular el éxito |
| 3 | Passkey sin contexto seguro ni rpId | `PasskeyButton` se oculta por feature-detection; nunca aparece un botón que devuelve error |
| 4 | El "reenviar" sugiere rate-limit que nadie implementó | el cooldown se dibuja con número solo cuando el backend defina el valor; mientras, copy: "¿No llega? Reenviar" sin promesa de plazo |
| 5 | Tráfico de correo = dato personal en un sitio con términos sin revisar | la nota legal enlaza a `/terms` y `/privacy` que ya avisan de su estado (revisión legal pendiente, bloqueo del operador §ENTREGA-UX 7.2) — el login no añade promesas de retención |
| 6 | Que el plano se lea como ruta viva | en `wireframes/INDEX.md`: **VIGENTE (diseño, no implementado)**; `src/app` sigue sin ruta `/login` (prohibido inventarla, regla `COPY-INTERNAS` l.4) |
