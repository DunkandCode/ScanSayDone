# 📚 Guía Completa: GitHub Projects (Sprints) y Despliegue en Vercel (Monorepo)

Este documento explica paso a paso cómo estructurar el flujo de trabajo del equipo en **GitHub Projects** (tablero ágil tipo Trello) y cómo configurar correctamente **Vercel** para la arquitectura de nuestro proyecto **ScanSayDone**.

---

## 🎯 PARTE 1: ¿Por qué y cómo configurar GitHub Projects?

### 1. ¿Por qué usamos GitHub Projects en lugar de Trello externo?
En Trello tradicional, las tarjetas son notas de texto desconectadas de tu código. Si terminas una tarea, tienes que acordarte de mover la tarjeta a mano.

Con **GitHub Projects**:
- Las tarjetas **son Issues reales** del repositorio.
- Se conectan directamente con las ramas de Git y los Pull Requests.
- Si un desarrollador abre un PR con la palabra `Closes #1`, cuando el PR se aprueba y se une a `main`, **la tarjeta se mueve automáticamente a "Done"**.
- Todo el equipo ve el avance sin salir de GitHub.

---

### 2. Paso a paso para crear el Tablero (desde la Web)

1. **Entrar al repositorio:**
   Ve en tu navegador a: [github.com/DunkandCode/ScanSayDone/projects](https://github.com/DunkandCode/ScanSayDone/projects)
2. **Crear nuevo proyecto:**
   Haz clic en el botón verde **"New project"** (en el centro o arriba a la derecha).
3. **Elegir la plantilla:**
   Selecciona la plantilla **"Board"** (esto genera de inmediato la vista de columnas estilo Trello/Kanban).
4. **Asignar el nombre:**
   Nombra el proyecto: `ScanSayDone MVP - Tablero de Sprints`.
5. **Hacer clic en "Create".**

---

### 3. Las Columnas de Nuestro Tablero
Tu tablero tendrá 4 columnas estándar por defecto:
- 📋 **Todo (Por hacer):** Tareas pendientes aprobadas para trabajar.
- 🚧 **In Progress (En progreso):** Alguien ya tomó la tarea y está programando en su rama.
- 👀 **In Review (En revisión):** Se abrió un Pull Request y está esperando aprobación de un compañero.
- ✅ **Done (Terminado):** El código fue probado y fusionado en `main`.

---

### 4. Cómo agregar los 4 Issues ya creados al Tablero
Ya dejamos creados los primeros 4 Issues en el repositorio:
- `#1 feat(back): Setup de FastAPI`
- `#2 feat(front): Setup de Next.js`
- `#3 datos: Modelo para cálculo de NPS`
- `#4 ux: Diseño de la encuesta QR`

**Para meterlos al tablero:**
1. Ve a la columna **Todo**.
2. Al final de la columna, haz clic en **`+ Add item`**.
3. Escribe el símbolo `#`.
4. Aparecerá un buscador con los issues del repositorio. Haz clic en cada uno para agregarlo como tarjeta a la columna.

---

### 5. Cómo activar los "Sprints" (Iteraciones automáticas)
Para que el tablero trabaje con metodología Scrum/Sprints:
1. En la parte superior derecha de tu tablero, haz clic en el ícono de tres puntos **`...`** (o en la barra de configuración) y selecciona **`+ New field`**.
2. Tipo de campo: selecciona **`Iteration`**.
3. Nombre del campo: escribe **`Sprint`**.
4. Define:
   - **Duración:** 1 o 2 semanas (según acuerde el equipo).
   - **Start date:** Fecha de inicio de este primer Sprint.
5. Haz clic en **Save**.
6. Ahora cada tarjeta tendrá una propiedad para asignarle a qué Sprint pertenece (*Sprint 1*, *Sprint 2*, etc.).

---

## 🚀 PARTE 2: Vercel y el concepto de Monorepo

### 1. ¿Qué es un Monorepo?
Un **Monorepo** es un único repositorio de GitHub que contiene varias aplicaciones o módulos independientes dentro de subcarpetas.

En nuestro repositorio `ScanSayDone` tenemos esta estructura:
```text
ScanSayDone/             <-- Raíz del repositorio
├── scansaydone-front/        <-- Aplicación web (Next.js / React) -> Va en Vercel
├── scansaydone-back/         <-- API y backend (FastAPI / Python)  -> Va en Render/Railway
└── docs/               <-- Documentación del equipo
```

---

### 2. ¿Qué hace Vercel por defecto y por qué fallaría si no lo configuramos?
- **Vercel es una plataforma para Frontend** (especializada en Next.js, React, Vue, etc.).
- Cuando conectas un repositorio de GitHub a Vercel, Vercel asume por defecto que el proyecto web está en la **raíz (`/`)**.
- Vercel busca en la raíz un archivo llamado `package.json` para ejecutar `npm install` y `npm run build`.
- **El problema:** En la raíz de `ScanSayDone` **no hay ningún archivo `package.json`**, porque todo el código de Next.js vivirá dentro de la subcarpeta `scansaydone-front/`.
- Si lo dejas como está, Vercel intentará construir desde `/` y arrojará el error:  
  `Error: No Next.js or package.json found in root directory`.

---

### 3. Solución: Configurar el "Root Directory" en Vercel (Paso a Paso)

Debemos indicarle a Vercel: *"No leas la raíz del repositorio, entra únicamente a la carpeta `scansaydone-front`"*.

1. Inicia sesión en [vercel.com](https://vercel.com) y entra al proyecto de **ScanSayDone**.
2. En la barra superior de navegación, haz clic en **Settings**.
3. En el menú lateral izquierdo, haz clic en **General**.
4. Baja hasta la sección llamada **Build & Development Settings**.
5. Busca el campo **Root Directory**.
6. Haz clic en el botón **Edit**.
7. Escribe exactamente:
   ```text
   scansaydone-front
   ```
   *(Si Vercel te muestra un botón para seleccionar la carpeta, simplemente elige `scansaydone-front`).*
8. Haz clic en **Save**.

---

### 4. ¿Por qué el despliegue no funcionará de inmediato y cuándo empezará a funcionar?
Actualmente la carpeta `scansaydone-front` solo tiene un archivo `README.md`. Aún no tiene código de Next.js instalado.

- **Ahora:** Si Vercel intenta compilar, no encontrará archivos de código web aún.
- **Cuándo funcionará:** En cuanto el responsable del **Issue #2 (`feat(front): Setup de Next.js`)** ejecute la inicialización de Next.js dentro de `scansaydone-front/` y suba los cambios a GitHub.
- A partir de ese momento, **cada vez que alguien haga un commit o un Pull Request en el frontend**, Vercel compilará automáticamente y les dará un enlace público funcional (ej. `scansaydone.vercel.app`) para probar la app en vivo.

---

## 📋 Resumen de Acción Inmediata

| Tarea | Dónde se hace | Estado |
| :--- | :--- | :--- |
| **Crear Issues #1, #2, #3, #4** | GitHub | ✅ **Hecho** (ya están en el repo) |
| **Crear Tablero "Board"** | [github.com/.../projects](https://github.com/DunkandCode/ScanSayDone/projects) | ⏳ Pendiente (hacer clic en "New project") |
| **Agregar Issues al Tablero** | En la columna Todo (`+ Add item` -> `#`) | ⏳ Pendiente tras crear el tablero |
| **Cambiar Root Directory a `scansaydone-front`** | En [vercel.com](https://vercel.com) -> Settings -> General | ⏳ Pendiente |
| **Inicializar Next.js en `scansaydone-front`** | En el Issue #2 | ⏳ Pendiente de desarrollo |
