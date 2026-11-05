# CÓMO VER LA ENTREGA — manual de 5 minutos

> Paquete: `ENTREGA-UX-2026-10-30.zip` · contenido: 137 archivos · no necesitas instalar nada para ver capturas y planos.

---

## 1. Antes de empezar: qué hay dentro

```
ENTREGA-UX-2026-10-30/
├─ INDICE-ENTREGA.txt        ← el mapa. Empieza por aquí
├─ REVISION-UX-2026-10-30.md ← qué mirar y qué se pide de vuelta
├─ capturas/
│   ├─ 2026-10-29/           ← la landing, 19 cortes por banda y por ruta
│   └─ 2026-10-30/           ← login y dashboard, incluidas capturas de página completa
├─ wireframes/               ← planos métricos (SVG) con cotas en píxeles
│   └─ png/                  ← los mismos planos rasterizados, para verlos sin abrir SVG
├─ mockups/                  ← bocetos antiguos: son historia, NO la verdad del producto
├─ referencias/              ← imágenes generadas con IA: son referencia, jamás assets
└─ *.md                      ← especificaciones: login, dashboard, panel, contract de diseño
```

**Orden recomendado de lectura:**

1. `REVISION-UX-2026-10-30.md` — 10 minutos, te dice qué pantalla juzgar y con qué preguntas.
2. Las capturas de `2026-10-30/` — el producto tal como está hoy.
3. Los planos de `wireframes/png/` — solo si quieres ver las medidas.
4. El resto de `.md` — solo si algo te hace dudar.

---

## 2. Ver las capturas (30 segundos)

Descomprimí el zip y hacé doble clic en cualquier `.png`. Se abre con el visor de fotos del sistema.

Las capturas de esta entrega tienen dos tipos de nombre:

| Prefijo | Qué es |
|---|---|
| `full-*` | **página completa**, no solo la ventana. En móvil vas a ver imágenes muy altas: es correcto, es todo el scroll |
| `entrar-*`, `panel-*`, `dash-*` | cortes de la ventana visible, útiles para ver un estado concreto |

Las más útiles para una primera pasada:

```
capturas/2026-10-30/full-login-1440.png
capturas/2026-10-30/full-login-375.png
capturas/2026-10-30/full-panel-resumen-1440.png
capturas/2026-10-30/full-panel-resumen-vacio-1440.png
capturas/2026-10-30/full-panel-respuestas-1440.png
capturas/2026-10-30/full-panel-qr-1440.png
```

---

## 3. Ver los planos SVG

Un `.svg` es un dibujo vectorial: **no pierde nitidez a ningún zoom**. Son los planos con las medidas reales del producto.

**Opción A — navegador (la más simple).** Arrastrá el archivo a una pestaña de Chrome o Firefox. Para leer las cotas, `Ctrl` + `+` varias veces: el texto sigue nítido.

**Opción B — la versión ya rasterizada.** Si no querés lidiar con el zoom, abrí el mismo nombre dentro de `wireframes/png/`. Es el mismo dibujo, ya a tamaño fijo.

**Cómo leer un plano:**

| Elemento | Qué significa |
|---|---|
| Números con flechas o corchetes | cotas en **píxeles reales** a 1440 de ancho (o a 375 en el móvil) |
| Recuadros punteados | retícula de 12 columnas y márgenes del contenedor |
| Texto en monoespaciada | anotaciones: capas, tokens, decisiones |
| Bloque blanco en un lateral | aclaraciones o una vista secundaria (por ejemplo, el estado vacío) |

Planos vigentes hoy: `00-grid-system` (retícula), `09-page-hero` (cabeceras internas), `10-login`, `11-panel`, `12-dashboard`. Los `d01…d04` son **histórico**: describen un panel que se descartó.

---

## 4. Ver el producto de verdad (opcional, 2 minutos)

Las capturas muestran lo que hay; para sentir la interacción hace falta abrirlo.

1. Necesitás el proyecto (`E:\Trabajos\scan`) y Node instalado.
2. Doble clic en **`servidor.bat`** en la raíz del proyecto.
3. Elegí la opción **1 · Ver el sitio**. Compila si hace falta y abre el navegador en `http://localhost:3200`.
4. Para detenerlo: cerrá la ventana que dice `Scan-Say-Done :3200`, o pulsá `4` en el script (limpieza total).

Rutas para recorrer:

```
http://localhost:3200/            ← landing
http://localhost:3200/entrar      ← login (probalo: el error aparece al salir del campo)
http://localhost:3200/panel       ← dashboard
```

En el dashboard hay un interruptor arriba a la derecha: **`Ver con datos de ejemplo`**. Sin él verás el estado vacío, que es el estado real de un local que recién empieza. Con él verás la pantalla llena, rotulada `DATOS DE EJEMPLO`.

**Si el script falla:** el puerto puede estar ocupado. La opción `4 · Limpieza total` libera los puertos y borra la caché de compilación; después volvé a la opción `1`.

---

## 5. Qué NO vas a encontrar (y es a propósito)

| No hay | Por qué |
|---|---|
| Precios publicados | no hay montos reales aprobados; la sección existe pero está oculta por un flag |
| Fotos reales de las aplicaciones | no existen todavía; hay marcos con badge `DEMO` |
| Testimonios, logos de clientes, cifras | prohibido inventar datos; es la regla dura del proyecto |
| Un QR real | el QR se genera con backend; hoy el marco vacío lo declara |
| Datos de clientes en el panel | la encuesta no pide identidad; el dataset de ejemplo solo tiene canal, fecha y tres números |
| Un formulario de contacto | se eligió correo directo; hoy el buzón está vacío y la pantalla lo dice |

---

## 6. Cómo dejar el feedback

En `REVISION-UX-2026-10-30.md` §7 está el formato, pero en corto:

```
pantalla · ancho (1440/375) · qué · por qué · qué harías
```

Ejemplo: `panel · 1440 · el badge DATOS DE EJEMPLO queda suelto bajo las tarjetas · no sé a qué pertenece · pegarlo al borde de la tabla`.

Con eso me alcanza para trabajarlo sin adivinar.

---

## 7. Si algo no abre

| Síntoma | Causa probable | Solución |
|---|---|---|
| El `.svg` se ve en blanco | el visor no interpreta SVG | abrilo con Chrome o mirá `wireframes/png/` |
| `servidor.bat` se cierra solo | falta Node o el build falló | abrí una consola y corré `npm run build` para ver el error |
| El navegador dice "no se puede acceder" | el servidor no llegó a arrancar | ver §4, probá la limpieza total |
| Veo la página sin estilos | el build quedó viejo | opción `3 · Recompilar y ver` |
| Las capturas móviles son larguísimas | son de **página completa** | es lo esperado; hacé scroll en el visor |
