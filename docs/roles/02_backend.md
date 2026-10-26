# ⚙️ Guía de Rol: Desarrollo Backend
## Proyecto: ScanSayDone | Dunk & Code XD

* **Área:** Ingeniería de Servidores, APIs & Lógica de Negocio.
* **Ubicación en el Monorepo:** `/scansaydone-back`
* **Tecnologías:** Python 3.10+, FastAPI, Uvicorn, Pydantic, QRCode (Pillow), PostgreSQL.
* **Integrantes Asignados:**
  - **Desarrollador Backend Principal:** `[Nombre por asignar]` (`@usuario_github`)
  - **Desarrollador Backend / Integraciones:** `[Nombre por asignar]` (`@usuario_github`)

---

## 🎯 ¿Cuál es tu misión en ScanSayDone?
Construir el motor central del sistema que procesa los datos y expone los servicios a la aplicación:
1. **Generación de Códigos QR Dinámicos:** Generar imágenes PNG con el QR único de cada comercio para imprimir en mesas o cajas.
2. **Recepción de Encuestas:** Recibir las respuestas anónimas desde el frontend de forma segura y validar la integridad de los datos.
3. **Cálculo de Métricas:** Calcular el Net Promoter Score (NPS) y clasificar las notas en Promotores (9-10), Pasivos (7-8) y Detractores (0-6).
4. **Sistema de Alertas (MVP):** Detectar cuando un cliente evalúa con nota baja (detractor) para notificar al comerciante en tiempo real.

---

## 🚀 ¿Qué ya está hecho y cómo empezar a trabajar?

La base de FastAPI ya está lista y funcional en `scansaydone-back/main.py`.

### Paso 1: Levantar el entorno virtual en tu máquina
Desde la raíz del repositorio, entra a la carpeta y crea el entorno:

**En Mac / Linux:**
```bash
cd scansaydone-back
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**En Windows (PowerShell):**
```bash
cd scansaydone-back
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Paso 2: Ejecutar el servidor local
```bash
uvicorn main:app --reload
```
Abre tu navegador en:
- API viva: [http://localhost:8000](http://localhost:8000)
- Documentación Swagger interactiva: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📋 Endpoints Ya Implementados en `main.py`

| Método | Ruta | Descripción |
| :---: | :--- | :--- |
| `GET` | `/health` | Chequeo de salud del servicio (para Render y monitoreo). |
| `GET` | `/api/v1/qr/generate?target_url=...` | Genera una imagen PNG del código QR al vuelo. |
| `POST`| `/api/v1/nps/calculate` | Recibe una lista de enteros `[10, 9, 8, 4]` y devuelve el score NPS y categoría. |

---

## 🛠️ Tareas Siguientes para el Backend
1. **Conexión a Base de Datos:** Integrar SQLAlchemy con PostgreSQL para persistir comercios y respuestas.
2. **Endpoint de Registro de Respuesta:** `POST /api/v1/comercios/{id}/respuestas`.
3. **Rate Limiting:** Coordinar con el encargado de Ciberseguridad para incorporar límites de peticiones por minuto.

---

## 📐 Criterios de Calidad (Definition of Done)
- [ ] Todo endpoint nuevo tiene su modelo de entrada y salida validado con `Pydantic`.
- [ ] La documentación en `/docs` se actualiza automáticamente con descripciones claras.
- [ ] Se respetan las buenas prácticas de Python (PEP 8) y no se suben archivos `.venv` al repositorio.
