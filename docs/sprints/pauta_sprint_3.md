# 📋 Pauta de Reunión & Acuerdos: Sprint 3 (Dunk & Code XD)
> **Fecha:** Miércoles 04 de Noviembre de 2026  
> **Proyecto:** ScanSayDone  
> **Tablero GitHub:** https://github.com/orgs/DunkandCode/projects/1  
> **Deploy de Producción:** https://scansaydone.vercel.app/

---

## 🎯 Objetivo Central del Sprint 3 (04 Nov - 11 Nov)
> **"Conectar la encuesta móvil con la base de datos Supabase/PostgreSQL y validar el cálculo de métricas NPS/CSAT con el dataset de 80 respuestas."**

---

## 🚀 1. Puntos a Mostrar en la Reunión (Demo & Avances)

* **🌐 Deploy en Vivo:** https://scansaydone.vercel.app/
  * Despliegue automático 100% operativo en Vercel con Next.js 16 y Tailwind CSS.
  * Pipeline de CI en GitHub Actions funcionando y testeando en cada push.
* **📊 Avances del Área de Datos (Bernarda & Juampa):**
  * Todos los activos quedaron centralizados en la carpeta `docs/datos/`:
    * `docs/datos/metodologia/`: Cuestionarios NPS para 4 rubros (Minimarket, Cafetería, Peluquería, Tienda Online).
    * `docs/datos/modelo_relacional/`: Esquema de datos relacional y tabla `fact_encuestas`.
    * `docs/datos/datasets/`: Dataset con 80 encuestas simuladas.
    * `docs/datos/scripts_analitica/`: Motor de clasificación NLP léxico para comentarios abiertos y prototipo Streamlit.

---

## 💡 2. Decisiones Técnicas & Desbloqueos

### 🔧 A. Variables de Entorno Supabase en Vercel (Issue #25 - Juampa)
* **Vercel no necesita GitHub Secrets:** Vercel administra sus variables de forma autónoma.
* **Solución directa:** Entrar a **Vercel Dashboard → Proyecto scansaydone → Settings → Environment Variables** y registrar:
  * `NEXT_PUBLIC_SUPABASE_URL`
  * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* Para FastAPI / Backend local, seguimos usando el archivo local `.env` (ignorado en `.gitignore`).

### 💻 B. Arquitectura de Dashboards (Streamlit vs Next.js)
* **Producto oficial para comercios:** Se desarrolla en **Next.js** en `scansaydone-front` para tener carga móvil ultra rápida, marca blanca y dominio único.
* **Streamlit:** Se mantiene como **banco de pruebas analítico y sandbox interno** para el equipo de datos.

### 🎨 C. Brief Cerrado para UX/UI (Thomas - Issues #4 y #9)
Para acelerar el diseño en Figma sin partir de cero:
1. **Flujo Móvil de Encuesta (< 30 seg):**
   * Usar la estructura oficial de **5 preguntas** definida por metodología:
     * **P1:** NPS (escala táctil de botones grandes del 0 al 10).
     * **P2:** Satisfacción global CSAT (escala 1 a 5 estrellas o caritas).
     * **P3 y P4:** Atributos del rubro (1 a 5 estrellas, ej: Calidad y Rapidez).
     * **P5:** Caja de texto abierta opcional («¿Qué podemos mejorar?»).
     * **Pantalla de cierre:** Mensaje de agradecimiento inmediato post-envío.
2. **Dashboard del Comercio:**
   * Pasar a Figma los gráficos ya validados en Streamlit: tarjeta con semáforo NPS, desglose de promotores/detractores y tabla de comentarios clasificados con etiquetas de color (reclamos/felicitaciones).

---

## 📋 3. Asignación de Tareas Sprint 3 (GitHub Projects)

* **Juampa (`@JuampaCL`):**
  * **Issue #12:** Configuración de tablas en Supabase/PostgreSQL (`fact_encuestas`).
  * **Issue #13:** Endpoints FastAPI `POST /api/v1/respuestas` y validación con Pydantic.
* **Nicolás (`@nicolaslopezv`):**
  * **Issue #14:** Conexión del formulario en Next.js para enviar las 5 respuestas a la base de datos.
  * Apoyo en la documentación y minutas del sprint.
* **Bernarda (`@bernarda2020163`):**
  * **Issue #16:** Carga del dataset de 80 encuestas a Supabase y validación de las fórmulas de NPS y CSAT.
* **Thomas (`@thomasrain05-design`):**
  * **Issues #4 y #9:** Enlace de Figma con los wireframes móviles de las 5 preguntas y la maqueta del dashboard.
* **Daniel (`@DGRcodex`):**
  * **Issue #15:** Middleware de Rate Limiting por IP para evitar spam y sanitización de texto contra ataques XSS/inyección en P5.
* **Fabiana Cueto:**
  * Contacto y seguimiento con los locales piloto para validar las preguntas de sus rubros.

---

## 📅 Próximos Hitos del Sprint
* **Domingo 08 de Noviembre (18:00 hrs):** Check-in asíncrono por Discord (verificar estado de Supabase y wireframes de Figma).
* **Miércoles 11 de Noviembre (20:00 hrs):** Cierre oficial de Sprint 3 y planificación de Sprint 4.
