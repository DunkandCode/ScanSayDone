# 🚀 Manual de Inicio Rápido: De Cero a Desarrollar en 5 Minutos
## Equipo Dunk & Code XD — Proyecto ScanSayDone

¡Bienvenid@ al equipo! Esta guía te muestra exactamente cómo clonar el repositorio, levantar el proyecto en tu máquina y empezar a colaborar según tu especialidad.

---

## 💻 1. Requisitos Previos en tu Computador
- **Git** instalado (`git --version`)
- **Node.js 18+** instalado (`node -v` y `npm -v`)
- **Python 3.10+** instalado (`python3 --version` o `python --version`)
- **Visual Studio Code** (o tu editor favorito)

---

## 📥 2. Clonar el Repositorio

Abre tu terminal y ejecuta:
```bash
git clone https://github.com/DunkandCode/ScanSayDone.git
cd ScanSayDone
```

---

## 🏃 3. Cómo levantar cada parte del proyecto

### A) Si trabajas en el Frontend (`scansaydone-front`):
```bash
cd scansaydone-front
npm install
npm run dev
```
👉 Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### B) Si trabajas en el Backend (`scansaydone-back`):
**En Mac / Linux:**
```bash
cd scansaydone-back
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**En Windows (PowerShell):**
```powershell
cd scansaydone-back
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```
👉 Abre [http://localhost:8000/docs](http://localhost:8000/docs) para ver la API interactiva de FastAPI.

---

## 🌿 4. El Flujo de Git del Equipo (Nuestras 3 Reglas de Oro)

1. **La rama `main` es sagrada:** Nunca hagas `git push origin main` directo.
2. **Crea siempre una rama para tu tarea:**
   ```bash
   git checkout -b feat/nombre-de-tu-tarea
   ```
   - Usa prefijos simples: `feat/` (nueva función), `fix/` (arreglo de bug), `docs/` (documentación).
3. **Abre un Pull Request (PR) y vincúlalo:**
   - Sube tu rama: `git push -u origin feat/nombre-de-tu-tarea`
   - En GitHub, abre un Pull Request y escribe en la descripción: `Closes #NumeroIssue` (ej. `Closes #2`).
   - Pídele a un compañero que lo revise y le dé "Approve".

---

## 📌 5. Dónde encontrar tus tareas
- Todas las tareas están organizadas en:  
  👉 **[GitHub Projects - ScanSayDone](https://github.com/orgs/DunkandCode/projects/1)**
- Si aún no tienes un rol definido, revisa la **[Matriz de Roles y Equipo](roles/MATRIZ_EQUIPO_Y_ROLES.md)** y la guía específica de tu área en `docs/roles/`.
