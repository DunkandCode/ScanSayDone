# Wireframes — índice (2026-11-12)

> **Estado: BORRADOR.** Todos los archivos los generó el agente `frontend` a partir de los
> planos de `docs/frontend/planos/`. No son implementación: son dibujos 1:1 en px para
> aprobar antes de escribir código.
>
> **Cómo abrirlos:** doble clic en cualquier `.svg` (se abren en el navegador). Son SVG
> hechos a mano: texto, rectángulos y líneas; sin imágenes embebidas, sin fuentes externas,
> sin scripts, sin sombras.

## Exportaciones PNG

Carpeta `wireframes/png/`: los nueve SVG exportados a PNG con Edge headless a 2× (p. ej.
1440×900 → 2880×1800), fondo incluido, sin scroll. Regenerar:

```powershell
msedge --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 `
  --window-size=1440,900 --screenshot=salida.png "file:///ruta/al/archivo.svg"
```

Los PNG son derivados: si cambia un SVG, se vuelve a exportar. No se editan a mano.

## Encuesta (nueva)

| Archivo | Muestra |
|---|---|
| `encuesta-cliente-375-3pasos.svg` | Cliente en móvil: los tres pasos lado a lado. P1 con fichas 0–10 en rejilla 6+5 (50,5×48, gap 8), P2–P4 con fichas 1–5 (62,2×48), P5 con contador 0/300 y pie honesto «no se envía ni se guarda» |
| `encuesta-cliente-768.svg` | Cliente en tablet: tarjeta 540 centrada, contenido 490, fichas 91,6, acciones en una fila |
| `encuesta-cliente-1440.svg` | Cliente en escritorio: columna 540 centrada, contenido 474, tres grupos 1–5 con fichas 88,4 |
| `encuesta-gestion-1440.svg` | Panel: barra lateral 240, quinto ítem «Encuesta» marcado `[PROP]`, tabla P1–P5 completa, interruptor con aviso de no guardado, respuestas vacías «—» |
| `encuesta-gestion-375.svg` | Panel en móvil: barra superior 56 + fila 44, sección apilada, tabla convertida en lista de definiciones |

## Planos desactualizados — reemplazos visuales

| Archivo | Reemplaza a | Por qué |
|---|---|---|
| `hero-v4-1440.svg` | Imagen del hero del plano L1 | El hero vigente es escena fullbleed con halo radial; el plano mostraba fondo crema sin escena |
| `banda6-panel-1440.svg` | Marco vacío de la banda 6 (L3) | La banda ya muestra el panel demo completo, con datos declarados inventados |
| `navbar-fase2-1440.svg` | Barra de la fase 1 | Ya existe lockup imagen y CTA «Entrar»; la altura 76 y el filete se mantienen |
| `login-430-1440.svg` | Tarjeta 400 del plano LOGIN | La tarjeta construida mide 430, no 400 |

## Qué no está dibujado todavía

- Selección/estado de error y de código desconocido en la encuesta del cliente.
- Vista de gestión en 768 y 992.
- Estados de carga y de error del panel de encuestas.
- Cualquier pantalla que dependa del gate #0 (cinco preguntas) o del gate #14 (código y endpoint).

## Desviaciones registradas dentro de cada SVG

Los dibujos siguen la geometría de los planos, pero en cuatro puntos el encargo fue más
concreto que el plano y quedó anotado en el propio archivo:

1. Zona de encuesta dibujada sobre blanco puro (spec UX), no sobre crema.
2. Progreso por puntos + «Pregunta n de 3»; sin barra de porcentaje.
3. Acciones en una fila en 768 (el plano las apila).
4. Tabla de gestión en móvil como lista de definiciones, contra la decisión G3 del plano
   que prefiere scroll horizontal; requiere decisión del operador.

## Reglas de honestidad aplicadas

- Cero datos reales: el único dataset dibujado es el demo declarado (486 respuestas,
  media 8,5, 377 notas 8–10) y siempre rotulado.
- Cero QR escaneable.
- Cero estado de éxito: los botones no prometen guardar.
