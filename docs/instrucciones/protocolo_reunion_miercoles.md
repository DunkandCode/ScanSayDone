# ⏱️ Protocolo de Reunión Semanal: Los Miércoles de Dunk & Code XD
## Dinámica 30 - 30 - 30 para ScanSayDone

Para mantener el ritmo de desarrollo ágil sin reuniones interminables, los días **miércoles** (día de corte oficial de Sprints) implementaremos una sesión estructurada de **90 minutos**, dividida en 3 bloques de 30 minutos.

---

### 🕒 Bloque 1: Revisión y Retrospectiva del Sprint (30 minutos)
**Objetivo:** Rendición de cuentas visual, celebrar avances y detectar cuellos de botella.

1. **Pase por el Tablero (15 min):**
   - Abrir el proyecto en [GitHub Projects](https://github.com/orgs/DunkandCode/projects/1/views/1).
   - Cada responsable muestra rápidamente lo que pasó a la columna **Done**.
   - Solo se considera terminado lo que cumple la *Definition of Done* (código en `main` mediante PR o documento entregable en `/docs`).
2. **Mini-Retrospectiva (15 min):**
   - *¿Qué salió bien esta semana?*
   - *¿Qué nos retrasó o nos generó fricción?*
   - *¿Qué acuerdo tomamos para la próxima semana?*

---

### 🧠 Bloque 2: Discusión Técnica y Alineación Multidisciplinaria (30 minutos)
**Objetivo:** Resolver dependencias entre las diferentes áreas del equipo para que nadie quede bloqueado.

1. **UX ↔ Frontend:**
   - Revisión de wireframes móviles de la encuesta QR para asegurar que los componentes de Next.js sean viables y responsivos (< 30 segundos de carga y respuesta).
2. **Datos ↔ Backend:**
   - Cómo el backend de FastAPI entregará las respuestas al modelo de cálculo de NPS y CSAT sin saturar la base de datos.
3. **Ciberseguridad ↔ Desarrollo:**
   - Definición del rate limiting (límite de respuestas por minuto/IP) y hashing de huella digital del cliente para evitar manipulación maliciosa de calificaciones sin invadir la privacidad.
4. **Marketing/Mercado ↔ Producto:**
   - Resultados del benchmark con comercios locales y feedback de los primeros comerciantes contactados.

---

### 🎯 Bloque 3: Sprint Planning y Asignación de Tareas (30 minutos)
**Objetivo:** Salir de la reunión con el siguiente Sprint 100% comprometido y asignado en GitHub.

1. **Fijar el Objetivo del Sprint (5 min):**
   - Una frase clara: *"Al finalizar el sprint debemos tener la encuesta desplegada en Vercel recibiendo respuestas de prueba"*.
2. **Priorización del Backlog (15 min):**
   - Mover los Issues correspondientes desde *Prioritized backlog* a la vista *Current iteration*.
3. **Asignación y Compromiso (10 min):**
   - Cada miembro del equipo se asigna formalmente a sus tarjetas (`Assignee`).
   - Nadie se va de la reunión sin tener sus tarjetas asignadas para la semana.

---

## 👥 Matriz de Roles y Responsabilidades del Equipo

| Área / Rol | Responsables Principales | Foco de Entrega en el Sprint |
| :--- | :--- | :--- |
| **Desarrollo Frontend** | Dev Frontend | Next.js en `scansaydone-front`, vistas mobile-first, conexión API, Vercel |
| **Desarrollo Backend** | Dev Backend / Python | FastAPI en `scansaydone-back`, generación de QRs dinámicos, endpoints REST |
| **Datos & Analytics** | Especialista de Datos | Modelo de cálculo NPS, queries analíticas, pipeline de métricas |
| **Ciberseguridad** | Seguridad Informática | Anti-spam, rate limiting, anonimización y protección de datos |
| **UX / UI Design** | Diseñador UX/UI | Flujo de escaneo ultra rápido (< 30s), wireframes del dashboard de MiPymes |
| **Marketing & Mercado**| Comercial / Producto | Benchmark competitivo, propuesta de valor, validación con comercios piloto |
| **Coordinación (Scrum)**| Coordinador / Suplente | Moderar la reunión 30-30-30, desbloquear al equipo, seguimiento en GitHub |
