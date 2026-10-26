# 📋 Guía de Plantillas de GitHub Projects para Dunk & Code XD (ScanSayDone)

Este documento detalla para qué sirve cada plantilla de GitHub Projects y cuál es la ideal para la metodología de trabajo de nuestro equipo en el proyecto **ScanSayDone** (Colabora TD 2026).

---

## 🏆 ¿Cuál debemos elegir para ScanSayDone?

### 👉 Opción Recomendada: **Iterative development** (Desarrollo por Iteraciones / Sprints)
**¿Por qué es la ideal para ScanSayDone?**
Revisando los documentos en `/docs` (específicamente la planilla de *Seguimiento del Proyecto - Colabora TD*), nuestro equipo trabaja por **semanas/sprints definidos**:
- Semana 1 (15 - 21 Oct)
- Semana 2 (22 - 28 Oct) *(Sprint actual)*
- Semana 3 (29 Oct - 04 Nov)
- Semana 4 (05 - 11 Nov)
- Semana 5 (12 - 18 Nov)

La plantilla **Iterative development** ya viene configurada exactamente para este ritmo con 4 vistas listas:
1. **Current iteration:** Tablero Kanban (estilo Trello) que muestra **solo las tareas del Sprint en curso**.
2. **Next iteration:** Tareas planificadas para la próxima semana.
3. **Prioritized backlog:** Lista de todas las tareas futuras del MVP divididas por rol (Dev, Datos, UX).
4. **Roadmap:** Barra de tiempo para ver cuándo entregamos cada etapa.

---

### 👉 Opción Alternativa: **Kanban** (o "Board" desde cero)
Si el equipo prefiere **cero complejidad y máxima simplicidad** (un tablero idéntico a un Trello básico de 4 columnas: *Backlog*, *Ready*, *In progress*, *In review*, *Done*) sin preocuparse todavía por configurar semanas o sprints.

---

## 🔍 Análisis de cada plantilla disponible en GitHub

A continuación, la explicación de para qué sirve cada una de las 8 plantillas mostradas en pantalla:

| Plantilla | ¿Para qué sirve? | ¿Aplica para ScanSayDone? |
| :--- | :--- | :--- |
| **1. Iterative development** ⭐ | **Planificar iteraciones / Sprints.** Diseñada para equipos ágiles (Scrum) que entregan valor semana a semana o cada 15 días. Separa lo que se hace hoy de lo que viene después. | **La mejor opción.** Calza perfecto con nuestro cronograma de Colabora TD. |
| **2. Kanban** | **Flujo continuo y visual.** Ideal para equipos que no trabajan por sprints cerrados, sino que van tomando tareas a medida que se liberan columnas. Muy simple e intuitivo. | **Buena opción alternativa** si buscan un clon directo y simple de Trello. |
| **3. Team planning** | **Capacidad de equipo y carga de trabajo.** Similar a la de iteraciones, pero enfocada en medir cuántas horas o puntos de historia puede asumir cada integrante sin sobrecargarse. | Útil si el coordinador quiere medir la carga individual de Devs, Datos y UX. |
| **4. Feature release** | **Lanzamiento de una funcionalidad grande.** Se usa cuando un equipo se enfoca en entregar un único módulo complejo (por ejemplo, "Sistema de Pagos") coordinando dependencias. | No recomendada ahora; ScanSayDone requiere montar el MVP completo (front, back, datos). |
| **5. Bug tracker** | **Seguimiento y triage de errores.** Pensada para equipos de QA o soporte. Clasifica por severidad (Crítico, Medio, Leve) y estado del bug. | No para arrancar; será muy útil más adelante en la fase de testing del MVP. |
| **6. Product launch** | **Lanzamiento comercial del producto.** Mezcla tareas de desarrollo con marketing, diseño de marca, redes sociales y aspectos legales del lanzamiento al mercado. | Excede el alcance técnico del sprint actual de desarrollo. |
| **7. Roadmap** | **Línea de tiempo a largo plazo.** Muestra barras de Gantt/cronograma a meses vista para stakeholders o directores de proyecto. | No permite gestionar el día a día del código como un tablero Kanban. |
| **8. Team retrospective** | **Reunión de retrospectiva (Post-Sprint).** Organizada en columnas: *¿Qué salió bien?*, *¿Qué podemos mejorar?*, *Acciones a tomar*. | Muy buena para usar al final de cada semana en las minutas de reunión. |

---

## 🚀 Pasos para crear el proyecto con "Iterative development"

1. En la ventana modal de GitHub, selecciona la tarjeta **Iterative development**.
2. Dale a **Next** (o **Create**).
3. Nombre del proyecto: `ScanSayDone MVP - Sprints`.
4. En cuanto cargue el proyecto, vincula el repositorio:
   - Haz clic en el botón de configuración del proyecto (ícono de engranaje o `...` arriba a la derecha).
   - Ve a **Linked repositories** y selecciona `DunkandCode/ScanSayDone`.
5. Ve a la vista **Current iteration** o **Prioritized backlog** y añade los 4 Issues ya creados (`#1`, `#2`, `#3`, `#4`).
