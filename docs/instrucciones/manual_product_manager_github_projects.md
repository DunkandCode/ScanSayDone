# 🎓 Manual Definitivo de Product Manager: Gestión de Sprints en GitHub Projects
## Proyecto: ScanSayDone | Equipo: Dunk & Code XD

Como **Product Manager (PM)** de este proyecto, este tablero no es solo una lista de tareas: es tu **centro de comando**. Te permite ver la velocidad del equipo, anticipar cuellos de botella antes de que ocurran, asegurar que Frontend, Backend, Datos, UX y Ciberseguridad se sincronicen, y garantizar que entreguen el MVP a tiempo para Colabora TD 2026.

---

## 🧐 1. ¿Por qué estaban vacías las dos primeras pestañas?

En tus capturas viste:
- Pestaña **Current iteration** con el filtro: `iteration:@current` ➡️ **Vacía**.
- Pestaña **Next iteration** con el filtro: `iteration:@next` ➡️ **Vacía**.

### La razón técnica:
GitHub Projects funciona con **filtros dinámicos**. 
- Cuando importaste los 11 Issues, GitHub los metió al proyecto con el campo `Iteration` en blanco (`null`).
- Como la pestaña *Current iteration* tiene una regla fija que dice: *"Muéstrame únicamente las tareas que tengan asignado el Sprint de hoy"*, no mostraba ninguna tarjeta.
- **¿Dónde estaban entonces?** Estaban guardadas en la pestaña 3 (**Prioritized backlog**).

> ⚡ **Acción realizada:** Acabo de asignar por terminal las 11 tareas iniciales a la **Iteration 1 (@current)**. Al recargar la página en tu navegador (`Cmd + R` o `F5`), verás las 11 tarjetas vivas en tu tablero.

---

## 🗂️ 2. Desglose Profundo: ¿Para qué sirve y cómo se opera cada Pestaña?

En la barra superior tienes 6 vistas estratégicas. A continuación, el propósito de cada una y cómo debes gestionarla como PM:

```text
[ 📌 Current iteration ] [ ⏭️ Next iteration ] [ 📋 Prioritized backlog ] [ 🗺️ Roadmap ] [ 👀 In review ] [ 👤 My items ]
```

---

### Pestaña 1: 📌 `Current iteration` (El Sprint Activo / El Día a Día)
* **Filtro activo:** `iteration:@current`
* **Formato:** Tablero Kanban (Columnas).
* **¿Para qué sirve?**  
  Es la vista que el equipo debe tener abierta todos los días. Muestra **únicamente lo que se prometió entregar en el Sprint en curso**. Nadie debe distraerse con tareas del futuro; aquí solo vive lo urgente e importante de esta semana.

* **Las 5 Columnas y su significado estricto:**
  1. **Backlog (del Sprint):** Tareas aprobadas para esta semana que aún nadie ha comenzado.
  2. **Ready (Listas para tomar):** Tareas que ya tienen claras sus instrucciones y especificaciones técnicas. Un miembro del equipo que termine su tarea va aquí y se autoasigna una nueva.
  3. **In progress (En desarrollo activo):** Lo que se está programando o diseñando **en este momento**.  
     *Regla de oro de PM:* Máximo 1 tarea activa por persona (2 excepcionalmente). Si ves que alguien tiene 4 tareas en *In progress*, pregúntale: *"¿En cuál estás enfocado hoy para no dispersar esfuerzos?"*.
  4. **In review (En revisión):** Código terminado con Pull Request (PR) abierto o wireframe listo en Figma esperando visto bueno.
  5. **Done (Terminado):** Cumple con la *Definition of Done* (PR revisado, aprobado y mezclado en `main`, o documento aprobado en `/docs`).

---

### Pestaña 2: ⏭️ `Next iteration` (El Siguiente Sprint / Refinamiento)
* **Filtro activo:** `iteration:@next`
* **Formato:** Tablero Kanban.
* **¿Para qué sirve?**  
  Es tu "sala de preparación" para el próximo miércoles. Mientras el equipo programa el Sprint 1, tú como PM vas arrastrando aquí las tareas que se trabajarán la próxima semana (Sprint 2).
* **Tu rol como PM aquí:**  
  Durante la semana, vas redactando los requerimientos de la próxima iteración. Cuando llegue la reunión del miércoles, no partes de cero: ya tienes la pestaña *Next iteration* semi-armada para discutirla con el equipo en el Bloque 3 de la reunión.

---

### Pestaña 3: 📋 `Prioritized backlog` (El Gran Inventario de Ideas y Deuda Técnica)
* **Filtro:** Sin filtro de iteración (o agrupado por Iteraciones).
* **Formato:** Tabla / Lista.
* **¿Para qué sirve?**  
  Es el repositorio de **todas las tareas que existen y existirán en el proyecto**. Aquí viven:
  - Tareas del Sprint 1, Sprint 2, Sprint 3...
  - Bugs futuros detectados.
  - Ideas de mejoras ("Sería genial agregar login con Google").
  - Tareas de marketing o documentación que aún no tienen fecha.
* **Tu rol como PM aquí:**  
  Ordenar por prioridad de arriba a abajo. Lo más crítico para el MVP va arriba; lo prescindible o "nice-to-have" va al fondo. Desde esta vista puedes seleccionar 5 tareas a la vez y cambiarles el campo `Iteration` en bloque.

---

### Pestaña 4: 🗺️ `Roadmap` (La Línea de Tiempo Estratégica / Carta Gantt)
* **Filtro:** Vista de calendario horizontal (meses y días).
* **¿Para qué sirve?**  
  Es la vista para responderle a los evaluadores de Talento Digital o a los coordinadores la pregunta: *¿Cuándo vamos a terminar cada cosa?*.
* **Cómo hacer que aparezcan las barras de tiempo:**
  En tu captura viste la lista de tareas a la izquierda y el calendario vacío a la derecha. Para que aparezca la barra azul de tiempo:
  1. Haz clic en la fila de cualquier tarea (ej. *Setup de Next.js*).
  2. En el panel lateral, asigna una fecha de inicio (**Start date**) y una fecha de fin (**End date**), o simplemente el campo **Iteration**.
  3. Inmediatamente aparecerá la barra horizontal visual en el calendario.

---

### Pestaña 5: 👀 `In review` (Control de Calidad / Cuellos de Botella)
* **Filtro:** `status:"In review"`
* **¿Para qué sirve?**  
  Muestra todas las tareas que los desarrolladores ya terminaron pero que están esperando que otro compañero les revise el código (Pull Request).
* **Tu rol como PM aquí:**  
  Si ves más de 3 tarjetas acumuladas en *In review*, **hay un cuello de botella**. Significa que los programadores están produciendo código pero nadie lo está revisando. En la reunión o por Discord dices: *"Equipo, paremos un momento de programar cosas nuevas y aprobemos los PRs pendientes para que pasen a Done"*.

---

### Pestaña 6: 👤 `My items` (Tu Vista Personal)
* **Filtro activo:** `assignee:@me`
* **¿Para qué sirve?**  
  Filtro personal. Cada persona del equipo que haga clic en esta pestaña verá **única y exclusivamente las tareas asignadas a ella**. Para ti como PM, te mostrará tus tareas de coordinación, minutas o benchmark.

---

## 🔄 3. El Flujo de Trabajo Semanal del Product Manager (Paso a Paso)

### ☀️ De Lunes a Martes (Seguimiento Silencioso - 5 minutos al día)
1. Entras a **Current iteration**.
2. Te fijas si hay tarjetas estancadas en **In progress** por más de 3 días.
3. Si alguien lleva mucho tiempo con una tarea, le escribes por Discord: *"Hola, ¿te trabaste con algo de FastAPI o del modelo NPS? ¿Necesitas apoyo de otro compañero?"*.

---

### 🗓️ El Miércoles (Día de Reunión 30 - 30 - 30)

#### 1. Durante los primeros 30 min (Sprint Review):
- Abres la pestaña **Current iteration**.
- Preguntas por las tareas en **In review**: ¿se aprueban y pasan a **Done** hoy?
- Las que no se alcanzaron a terminar se negocian: o se quedan para el siguiente sprint o se descartan.

#### 2. Durante los siguientes 30 min (Discusión Técnica):
- El equipo debate dudas entre Frontend, Backend, UX, Datos y Ciberseguridad.

#### 3. Durante los últimos 30 min (Sprint Planning):
- Vas a la pestaña **Prioritized backlog**.
- Seleccionas las tareas acordadas para la semana que entra.
- En el campo **Iteration**, les asignas la siguiente iteración.
- Asignas los responsables en el campo **Assignees** (`@JuampaCL`, `@nicolaslopezv`, `@bernarda2020163`, `@thomasrain05-design`, `@DGRcodex`).
- Al terminar la reunión, haces clic en **Next iteration** y ¡el nuevo sprint está listo para arrancar!

---

## ⚡ 4. Atajos y Buenas Prácticas Pro para GitHub Projects

1. **Cómo crear una tarea rápida en vivo:**
   Estando en cualquier columna, presiona la tecla `Enter` o haz clic en `+ Add item`. Escribe el título y presiona Enter. Si escribes `#` puedes convertirla inmediatamente en un Issue del repositorio.
2. **Cómo editar campos sin abrir la tarjeta:**
   En las tarjetas puedes hacer clic directo en la etiqueta de color o en el avatar para cambiar de responsable o de estado en 1 segundo.
3. **Cierre automático por código:**
   Recuerda a los devs que cuando hagan un Pull Request escriban en el mensaje:
   `Closes #1`
   Esto hace que cuando el PR se mezcle en `main`, GitHub mueva la tarjeta de *In review* a **Done** sin intervención humana.
