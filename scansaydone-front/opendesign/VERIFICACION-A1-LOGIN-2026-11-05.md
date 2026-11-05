# VERIFICACIÓN — Lote A1 del login (05-nov-2026)

> Origen: `ANALISIS-REFERENCIA-LOGIN-2026-11-05.md` §7.2, opción **A** recomendada y autorizada por el operador.
> Alcance: **dos ajustes** — la regla divisoria sin etiqueta y el ritmo vertical del bloque secundario.
> Capturas: `capturas/2026-10-30/a1-login-1440.png`, `a1-login-375.png`, `a1-login-enviado.png`.

## 1. Qué se cambió

| # | Archivo | Antes | Después |
|---|---|---|---|
| 1 | `src/app/entrar/page.jsx` | `<div className="login-divider"><span>o</span></div>` | `<div className="login-divider" aria-hidden="true" />` |
| 2 | `_login.scss` `.login-form` | `gap: 16px` | `gap: 10px` |
| 3 | `_login.scss` `.login-label` | `margin-bottom: 6px` | `margin-bottom: 8px` (ver §3, defecto 1) |
| 4 | `_login.scss` `.login-divider` | `display: flex` + `::before`/`::after` + `span` + `margin: 24px 0` | regla de **1 px** sola, sin pseudoelementos, `margin: 40px 0 32px` |
| 5 | `_login.scss` `.login-legal` | `margin-top: 20px` | `margin-top: 44px` |
| 6 | `_login.scss` `.login-legal` | alineación por defecto; enlaces partibles | `text-align: center` + `white-space: nowrap` en los enlaces (ver §3, defecto 2) |

**Por qué la regla y no el "o":** no existe un segundo método de acceso. El "o" centrado anunciaba una alternativa que no hay — el mismo tipo de promesa vacía que un botón muerto. Una línea de 1 px separa igual, sin mentir.

## 2. Medidas en navegador (Playwright, escala CSS 1:1)

| Hueco | Antes | Ahora 1440 | Ahora 375 |
|---|---|---|---|
| etiqueta → campo | 16 | **8** | **8** |
| campo → botón | 16 | **10** | **10** |
| botón → regla | 24 | **50** | **50** |
| regla → "Ver la demo" | 24 | **42** | **42** |
| demo → legal | 36 | **54** | **54** |
| alto de la regla | 2 líneas con texto | **1 px** | **1 px** |
| tarjeta | 400 × 706 | **400 × 745** | **343 × 671** |
| scroll horizontal | 0 | **0** | **0** |

El patrón que se buscaba: **formulario agrupado** (8–10 px) y **lo secundario separado** (42–54 px), con la regla en medio. La referencia mide 7 / 10 / 53 / 51 / 56 a 1440; nuestros valores caen dentro de ±3 px en todos los huecos salvo `regla → demo`, que mide 42 midiendo el borde de la caja y ~54 midiendo el texto (el enlace tiene 44 px de alto con el texto centrado).

## 3. Defectos encontrados al medir

| # | Defecto | Causa | Corrección | Prueba |
|---|---|---|---|---|
| 1 | Tras el primer pase, **etiqueta → campo = 0 px** | la etiqueta vive dentro del envoltorio del campo, no es hija del `<form>`: el `gap: 10px` no la separa, y al poner `margin-bottom: 0` se quedó sin aire | `margin-bottom: 8px` | medido 8 en 1440 y 375 |
| 2 | `Política de privacidad` **se partía en dos líneas** (`Política` / `de privacidad`) y el bloque iba a la izquierda mientras el enlace demo iba centrado | sin `nowrap` el navegador corta donde le conviene; el bloque heredaba alineación de párrafo | `white-space: nowrap` en los enlaces + `text-align: center` | ambos enlaces miden **1 línea** en 1440 y 375; `text-align: center` confirmado |

El defecto 2 no estaba en el encargo: apareció al comparar la captura con la referencia. Se corrigió porque es el mismo bloque y porque un enlace de texto legal roto a mitad de frase es un defecto de lectura, no de gusto.

## 4. Regresiones comprobadas

| Qué | Prueba | Resultado |
|---|---|---|
| Subrayados de los enlaces | `text-decoration-line` leído en navegador | `underline` en demo y en ambos enlaces legales |
| Estado enviado | correo válido + envío → ¿cambia el `h1`? | `h1 = "Revisa tu correo"`, aviso `DEMO` presente, formulario y regla fuera del DOM |
| Desbordamiento | `scrollWidth − clientWidth` | 0 en 1440 y en 375 |
| Tokens | `npm run check:tokens` | OK |
| Placeholders | `npm run check:placeholders` | 0 |
| Build | `next build` | `✓ Compiled successfully` |

## 5. Lo que **no** se tocó (y por qué)

| Elemento | Motivo |
|---|---|
| Color del botón (ciruela sobre coral) | ya cumple **5.08:1**; la referencia da 6.53 con otro coral, pero ambas pasan AA |
| Borde del input (`--border-strong`) | **3.03:1** cumple 1.4.11; el de la referencia mide **1.47:1** y no cumple |
| Altura del botón (52) | cambiar a los 62 de la referencia rompería el ritmo del resto del sitio |
| Radio de la tarjeta (16) | era opcional en el análisis; se deja para no arrastrar cambios sin necesidad |
| Composición split con mock | descartado en §7.2: el mock es lo único que explica el producto dentro del login |

## 6. Pendiente

- **El plano `10-login.svg` no se redibujó.** La regla divisoria y los márgenes nuevos todavía no están cotados ahí. Si A1 se consolida, corresponde una revisión del plano (`10-login` v2.2) para que el plano y el código no diverjan — que es exactamente el desfase que este proyecto ya corrigió dos veces.
