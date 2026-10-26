# 💻 Guía de Rol: Desarrollo Frontend
## Proyecto: ScanSayDone | Dunk & Code XD

* **Área:** Ingeniería Web & Móvil (Client-side).
* **Ubicación en el Monorepo:** `/scansaydone-front`
* **Tecnologías:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Vercel.
* **Integrantes Asignados:**
  - **Desarrollador Frontend Principal:** `[Nombre por asignar]` (`@usuario_github`)
  - **Desarrollador Frontend / UI:** `[Nombre por asignar]` (`@usuario_github`)

---

## 🎯 ¿Cuál es tu misión en ScanSayDone?
Construir las interfaces que usarán dos tipos de usuarios:
1. **El Cliente Final (Vista Móvil de Encuesta):**
   - Una pantalla ultra rápida, responsiva y táctil que se abre al escanear el QR.
   - 3 preguntas visuales (evaluación con caritas o números 0-10 para NPS + 2 preguntas breves).
   - **Regla estricta:** Cero registro, carga en menos de 2 segundos, completado en menos de 30 segundos.
2. **El Dueño del Negocio (Dashboard Web):**
   - Panel donde visualiza el puntaje NPS en tiempo real (semáforo Verde/Amarillo/Rojo).
   - Contador de encuestas respondidas hoy y lista de comentarios recientes.
   - Botón para ver y descargar en alta calidad el código QR de su local.

---

## 🚀 ¿Qué ya está hecho y cómo empezar a trabajar?

La base de Next.js ya está creada, configurada y testeada en `/scansaydone-front`.

### Paso 1: Clonar y levantar el entorno local
Abre tu terminal en la carpeta del frontend:
```bash
cd scansaydone-front
npm install
npm run dev
```
Abre tu navegador en [http://localhost:3000](http://localhost:3000) para ver la app corriendo.

### Paso 2: Flujo de trabajo en Git
1. Crea tu rama a partir de `main`:
   ```bash
   git checkout -b feat/frontend-encuesta-movil
   ```
2. Programa tus componentes en `src/app/` y `src/components/`.
3. Haz commits claros:
   ```bash
   git commit -m "feat(front): formulario de encuesta con escala 0-10 para NPS"
   ```
4. Sube tu rama y abre un Pull Request hacia `main` enlazando el Issue (`Closes #2`).

---

## 🔗 Conexión con el Backend
El backend de FastAPI expone una API REST (ej. `http://localhost:8000` o la URL en Render).
- Para enviar las respuestas de la encuesta:
  - `POST /api/v1/encuestas/responder` enviando el payload JSON con las notas.
- Para obtener el QR generado:
  - `GET /api/v1/qr/generate?target_url=https://...` (devuelve el PNG directamente).

---

## 📐 Criterios de Calidad (Definition of Done)
- [ ] La interfaz se adapta perfectamente a pantallas de celulares de 360px a 430px de ancho.
- [ ] No hay errores de TypeScript (`npm run build` compila con éxito en 0 errores).
- [ ] Cada Pull Request es revisado por otro compañero antes de fusionar.
