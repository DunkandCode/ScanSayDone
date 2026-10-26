# 📊 Guía de Rol: Analítica & Datos
## Proyecto: ScanSayDone | Dunk & Code XD

* **Área:** Modelado de Datos, Métricas de Satisfacción & Business Intelligence.
* **Tecnologías:** PostgreSQL, Python (Pandas/NumPy), SQL, Modelado ERD, Visualización.
* **Integrantes Asignados:**
  - **Especialista de Datos Principal:** `[Nombre por asignar]` (`@usuario_github`)

---

## 🎯 ¿Cuál es tu misión en ScanSayDone?
Transformar los clics y notas de los clientes en información valiosa y fácil de entender para el comerciante:
1. **Modelado Relacional de Base de Datos (ERD):** Diseñar las tablas para soportar comercios, sucursales, códigos QR, encuestas y respuestas anónimas.
2. **Implementación de Fórmulas y Métricas:**
   - **Net Promoter Score (NPS):** `% Promotores (9-10) - % Detractores (0-6)`.
   - **CSAT (Customer Satisfaction):** Promedio directo de satisfacción.
   - **Tasa de Respuesta y Tiempo de Completado:** Métricas de velocidad (< 30s).
3. **Dataset Sintético para Testing:** Generar un dataset simulado de 200 a 500 respuestas de clientes de cafeterías/restaurantes para probar el dashboard antes de salir a la calle.
4. **Consultas Analíticas:** Escribir las queries en SQL optimizadas para alimentar el dashboard sin saturar el servidor.

---

## 🗄️ Esquema Sugerido de Base de Datos (ERD)

```text
COMERCIOS
├── id (UUID / PK)
├── nombre_comercio (VARCHAR)
├── rubro (VARCHAR: Cafetería, Peluquería, Minimarket, etc.)
├── email_dueño (VARCHAR - Encriptado)
└── fecha_registro (TIMESTAMP)

SUCURSALES_QR
├── id (UUID / PK)
├── comercio_id (FK -> COMERCIOS.id)
├── ubicacion (VARCHAR: "Mesa 1", "Barra", "Caja Principal")
├── codigo_qr_hash (VARCHAR UNIQUE)
└── activo (BOOLEAN)

RESPUESTAS_ENCUESTAS
├── id (UUID / PK)
├── sucursal_qr_id (FK -> SUCURSALES_QR.id)
├── calificacion_nps (INTEGER: 0 a 10)
├── pregunta_2_rapidez (INTEGER: 1 a 5)
├── pregunta_3_calidad (INTEGER: 1 a 5)
├── comentario_opcional (TEXT)
├── fecha_hora (TIMESTAMP)
└── huella_seguridad_hash (VARCHAR - Para control de fraude)
```

---

## 📐 Criterios de Calidad (Definition of Done)
- [ ] Diagrama entidad-relación (ERD) documentado en formato Markdown/Mermaid en `/docs`.
- [ ] Script SQL o archivo de migración listo para ser consumido por los desarrolladores Backend.
- [ ] Validación matemática de los cálculos de NPS verificados con casos extremos (ej. 100% detractores = -100 NPS, 100% promotores = +100 NPS).
