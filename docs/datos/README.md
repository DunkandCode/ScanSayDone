# 📊 Repositorio de Analítica & Datos — ScanSayDone
## Dunk & Code XD

Esta carpeta centraliza todos los activos metodológicos, modelos relacionales, datasets sintéticos y scripts analíticos desarrollados por el área de **Datos & Business Intelligence** (Bernarda Rodríguez y Juan Pablo Ahumada).

---

### 📂 Estructura de Contenidos

1. **`metodologia/`**
   - [`cuestionarios_nps_por_rubro.docx`](cuestionarios_nps_por_rubro.docx): Cuestionarios oficiales de 5 preguntas estandarizadas por sector (Minimarket, Cafetería/Restaurante, Peluquería/Estética, Tienda Online).
   - Estructura fija:
     - **P1:** NPS (0 al 10).
     - **P2:** CSAT Satisfacción global (1 al 5).
     - **P3 & P4:** Atributos específicos del rubro (1 al 5).
     - **P5:** Pregunta abierta opcional analizada con NLP.

2. **`modelo_relacional/`**
   - [`esquema_modelo_datos_erd.docx`](esquema_modelo_datos_erd.docx): Especificación del modelo de datos normalizado (tabla transaccional `fact_encuestas`, dimensiones y lógica de variables derivadas).

3. **`datasets/`**
   - [`simulacion_80_encuestas.xlsx`](simulacion_80_encuestas.xlsx): Dataset sintético con 80 encuestas simuladas para pruebas de volumen, cálculo de NPS y validación de dashboards.

4. **`scripts_analitica/`**
   - [`pipeline_nlp_y_metricas.py`](pipeline_nlp_y_metricas.py): Motor de Python con clasificación léxica de sentimientos para comentarios abiertos (Reclamo, Felicitación, Sugerencia) y cálculo automático de métricas NPS/CSAT.
   - [`dashboard_streamlit.py`](dashboard_streamlit.py): Prototipo de panel interactivo en Streamlit + Plotly para exploración de métricas y validación rápida.
