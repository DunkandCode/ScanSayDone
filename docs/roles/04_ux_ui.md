# 🎨 Guía de Rol: Diseño de Experiencia (UX / UI)
## Proyecto: ScanSayDone | Dunk & Code XD

* **Área:** Experiencia de Usuario, Arquitectura de Información & Diseño de Interfaces.
* **Herramientas:** Figma, Whimsical / Miro, Tailwind UI, Material Icons.
* **Integrantes Asignados:**
  - **Diseñador UX / UI Principal:** `[Nombre por asignar]` (`@usuario_github`)

---

## 🎯 ¿Cuál es tu misión en ScanSayDone?
Garantizar que nadie abandone la encuesta y que el comerciante entienda su negocio en 5 segundos. Debes diseñar dos experiencias completamente diferentes:

### 1. La Encuesta Móvil del Cliente (B2C - Mobile-First)
* **El Reto:** El cliente acaba de comer, pagar o recibir su pedido; no tiene paciencia para formularios aburridos.
* **Reglas de Oro de Diseño:**
  - **3 Preguntas:** NPS (0-10 con selector de botones grandes o emojis) + 2 preguntas tipo estrellas (1 a 5) + 1 campo de texto breve opcional.
  - **Cero Registro:** Nunca pedir crear cuenta ni contraseña.
  - **Tiempo límite:** Debe poder responderse con una sola mano en **menos de 30 segundos**.
  - **Pantalla de Agradecimiento:** Mensaje amigable con animación de éxito ("¡Gracias por ayudarnos a mejorar!").

### 2. El Dashboard del Comerciante (B2B - Responsive)
* **El Reto:** Los dueños de pequeños negocios no son analistas de datos; necesitan información clara y accionable.
* **Elementos Clave:**
  - **Semáforo NPS:** Número grande con color claro (Verde = +50 Excelente, Amarillo = 0-49 Bueno, Rojo = Negativo Crítico).
  - **Métricas del Día:** "14 personas opinaron hoy".
  - **Feed de Alertas:** Resaltar en rojo los comentarios negativos para que el dueño actúe de inmediato.
  - **Generador de QR:** Botón prominente *"Descargar QR para imprimir"*.

---

## 📦 Entregables Requeridos para el Sprint
1. **Wireframes Móviles (Figma / Bocetos):** Flujo de 3 pantallas (Inicio de encuesta ➡️ Preguntas ➡️ Éxito).
2. **Wireframe del Panel Web:** Vista de escritorio y móvil del Dashboard del comerciante.
3. **Guía de Estilos Básica:** Paleta de colores (contrastes accesibles WCAG AA), tipografías y botones reutilizables compatibles con Tailwind CSS.

---

## 📐 Criterios de Calidad (Definition of Done)
- [ ] Los enlaces a los tableros de Figma o las imágenes de wireframes están enlazados en el Issue [#4](https://github.com/DunkandCode/ScanSayDone/issues/4) y [#9](https://github.com/DunkandCode/ScanSayDone/issues/9).
- [ ] Los tamaños de botones táctiles tienen un mínimo de 48px x 48px para evitar clics erróneos en celulares.
- [ ] Revisión conjunta con los desarrolladores Frontend para validar la factibilidad técnica en Next.js.
