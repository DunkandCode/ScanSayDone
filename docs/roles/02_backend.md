# ⚙️ Guía de Rol: Desarrollo Backend
## Proyecto: ScanSayDone | Dunk & Code XD

* **Área:** Ingeniería de Servidores, APIs & Lógica de Negocio.
* **Ubicación en el Monorepo:** `/scansaydone-back`
* **Tecnologías:** Python 3.10+, FastAPI, Uvicorn, Pydantic, SQLAlchemy, Alembic, QRCode (Pillow), PostgreSQL (Supabase).
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

La API FastAPI vive en `scansaydone-back/` (`main.py` y el paquete `scansaydone/`). La guía completa de puesta en marcha, variables de entorno, migraciones y endpoints está en [`scansaydone-back/README.md`](../../scansaydone-back/README.md).

### Paso 1: Levantar el entorno virtual en tu máquina
Desde la raíz del repositorio, entra a la carpeta y crea el entorno:

**En Mac / Linux:**
```bash
cd scansaydone-back
python3 -m venv venv
source venv/bin/activate
pip install -r requirements-dev.txt
```

**En Windows (PowerShell):**
```bash
cd scansaydone-back
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
```

### Paso 2: Ejecutar el servidor local
```bash
uvicorn main:app --reload
```
Abre tu navegador en:
- API viva: [http://localhost:8000](http://localhost:8000)
- Documentación Swagger interactiva: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📋 Endpoints Implementados

| Método | Ruta | Descripción |
| :---: | :--- | :--- |
| `GET` | `/health` | Chequeo de salud del servicio (monitoreo). |
| `GET` | `/api/v1/qr/generate?target_url=...` | Genera una imagen PNG del código QR al vuelo. |
| `POST`| `/api/v1/nps/calculate` | Recibe una lista de enteros `[10, 9, 8, 4]` y devuelve el score NPS y categoría. |
| `GET` | `/api/v1/empresas/{empresa_id}/encuesta` | Negocio y textos de las 5 preguntas de su rubro (para armar la encuesta en el front). |
| `POST`| `/api/v1/respuestas` | Registra una encuesta anónima de 5 preguntas; el servidor calcula la categoría NPS, la alerta, el tipo de comentario y las variables temporales. |

> **Regla de arquitectura:** solo el backend escribe en la base de datos y todos los cálculos se hacen en Python. El frontend envía las respuestas con `POST /api/v1/respuestas`; no escribe directamente en Supabase.

---

## 🛠️ Tareas Siguientes para el Backend
1. 🚧 **Conexión a Base de Datos** (#12): modelos SQLAlchemy, migración Alembic con RLS y negocios de demostración listos en el código; falta ejecutar `alembic upgrade head` contra Supabase.
2. ✅ **Endpoint de Registro de Respuesta** (#13): `POST /api/v1/respuestas`.
3. **Rate Limiting y sanitización de comentarios** (#15, Ciberseguridad): límites de peticiones por IP.
4. **Carga del dataset de 80 encuestas** (#16, Datos): usar los IDs que imprime `scripts/seed_demo.py`.
5. **Dashboard** (Sprint 4): endpoints de métricas (NPS, CSAT, promedios y Top Box de P3/P4) y autenticación con Supabase Auth.

---

## 📐 Criterios de Calidad (Definition of Done)
- [ ] Todo endpoint nuevo tiene su modelo de entrada y salida validado con `Pydantic`.
- [ ] La documentación en `/docs` se actualiza automáticamente con descripciones claras.
- [ ] Se respetan las buenas prácticas de Python (PEP 8) y no se suben archivos `.venv` al repositorio.
