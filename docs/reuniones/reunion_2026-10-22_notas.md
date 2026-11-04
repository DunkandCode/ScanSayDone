oct 22, 2026

## **Reunión del 22 oct 2026 a las 20:59 GMT-03:00**

Registros de la reunión [Transcripción](https://docs.google.com/document/d/1VwxQSEzNPw246z0U6y5ORgTZDN4zb2PKNMnDjPIszMA/edit?usp=drive_web&tab=t.mqr7i2mfovc) 

### **Resumen**

Configuración inicial y validación de encuestas con definición tecnológica y acuerdos de gestión.

**Configuración y validación inicial**  
Establecieron el repositorio y revisaron borradores de encuestas para prevalidar problemáticas. Recopilaron encuestas piloto aplicando escalas de satisfacción.

**Definición tecnológica y roles**  
Acordaron usar Next.js con Vercel para el frontend y Python para el backend. Asignaron roles de desarrollo de software y análisis estadístico.

**Gestión y control**  
Propusieron utilizar GitHub Projects para centralizar tareas. Acordaron trabajar sobre ramas individuales.

### **Decisiones**

## Acordada

* **Adopción de la pila tecnológica Next.js y Python** Se acordó utilizar Next.js en Vercel junto con Python en un monorrepo como la pila tecnológica principal del proyecto.

* **Centralización de la gestión en GitHub Projects** Se aprobó utilizar GitHub Projects en lugar de Trello para centralizar la gestión de tareas del equipo.

* **Implementación de invitaciones de calendario para reuniones** Se acordó programar las reuniones del equipo mediante invitaciones de calendario en lugar de avisos por chat para mejorar la convocatoria.

### **Próximos pasos**

- [ ] \[Daniel Garcia Rojas\] Crear cuenta Vercel: Cree un correo electrónico y una cuenta de Vercel para el equipo.

- [ ] \[Nicolás López Vásquez\] Subir logos: Suba al repositorio los logos del equipo y del proyecto.

- [ ] \[Bernarda Rodriguez\] Investigar validación QR: Investigue el funcionamiento de los códigos QR y los métodos de validación de sesión para evitar respuestas duplicadas.

- [ ] \[Daniel Garcia Rojas\] Crear diagrama de flujo: Elabore un diagrama de flujo para la primera etapa del proyecto.

- [ ] \[Nicolás López Vásquez\] Redactar minuta: Redacte la minuta de la reunión utilizando el resumen enviado por Daniel.

- [ ] \[Bernarda Rodriguez\] Subir minuta: Suba la minuta a la carpeta compartida en Drive con la fecha correspondiente.

- [ ] \[Fabi Cueto\] Enviar análisis encuestas: Envíe el análisis de las encuestas recopiladas hasta el momento.

- [ ] \[The group\] Agendar reuniones: Agende las futuras reuniones del equipo a través de calendario para recibir recordatorios automáticos.

- [ ] \[Daniel Garcia Rojas\] Implementar reunión recurrente: Configurar una cita periódica en el calendario e incluir los correos de todos los integrantes del equipo.

- [ ] \[El grupo\] Solicitar correo: Pedir la dirección electrónica del integrante de experiencia de usuario para evitar el uso exclusivo de Discord.

- [ ] \[Daniel Garcia Rojas\] Enviar propuesta de trabajo: Remitir el documento con la propuesta laboral para el equipo.

- [ ] \[Daniel Garcia Rojas\] Enviar diagrama de flujo: Compartir el esquema de procesos del proyecto.

- [ ] \[Daniel Garcia Rojas\] Confirmar reunión: Ratificar la fecha del próximo encuentro el mismo lunes antes de proceder.

### **Detalles**

**Configuración del repositorio y denominación del producto**: Daniel Garcia Rojas configuró un repositorio de equipo en GitHub bajo el nombre de equipo Anco Anco (también denominado Duck and Code), mientras que Bernarda Rodriguez asignó de forma provisional un nombre al producto y realizó una publicación inicial ([00:01:53](?tab=t.mqr7i2mfovc#heading=h.z4o2734re884)). Daniel Garcia Rojas y Bernarda Rodriguez coincidieron en que la elección del nombre temporal fue oportuna ([00:03:49](?tab=t.mqr7i2mfovc#heading=h.l8qiutrwi3sl)).

---

**Distribución de tareas de prevalidación y cuestionarios**: Bernarda Rodriguez asignó a Fabiana Cueto la tarea de recopilar entre 5 y 20 encuestas de emprendedores y pequeñas empresas con el fin de prevalidar sus problemáticas utilizando un cuestionario de cinco preguntas que incluye el nombre de la empresa y el rubro, con fecha límite para el martes o miércoles ([00:05:25](?tab=t.mqr7i2mfovc#heading=h.gn4kg6m2mptu)). Asimismo, Bernarda Rodriguez compartió en Discord cuatro borradores de encuestas orientados a distintos rubros bajo el nombre provisional de tablero "Opina ya" ([00:07:19](?tab=t.mqr7i2mfovc#heading=h.t9824w6uxi8n)).

---

**Estructura de las encuestas y uso de hojas de cálculo**: Bernarda Rodriguez detalló que las encuestas comienzan con una escala de recomendación Net Promoter Score de 0 a 10, seguida de dos o tres preguntas con puntuación de 1 a 5 mediante estrellas, y una pregunta abierta opcional para reclamos o felicitaciones ([00:08:37](?tab=t.mqr7i2mfovc#heading=h.u05lnm23mvyn)). Daniel Garcia Rojas indicó que la hoja de cálculo de seguimiento en la nube de Valentina es utilizada por la administración para supervisar el avance sin que se requiera un envío formal ([00:09:59](?tab=t.mqr7i2mfovc#heading=h.q2eopovf9xbp)).

---

**Clarificación sobre la guía interna del equipo**: Juan Pablo Ahumada aclaró que la hoja de cálculo compartida funciona como una estructura guía interna para el equipo y no como un documento destinado a entregas externas. Bernarda Rodriguez confirmó que la publicación del producto en la comunidad de talento de LinkedIn se configuró para visualización pública tras restricciones iniciales, lo cual recibió reacciones positivas de Juan Pablo Ahumada y Nicolás López Vásquez ([00:11:41](?tab=t.mqr7i2mfovc#heading=h.aw2o4g3iwu6y)).

---

**Publicación en redes y logotipos del proyecto**: Bernarda Rodriguez informó sobre la revisión positiva de los perfiles y publicaciones por parte de compañeros universitarios y miembros de la comunidad de talento ([00:12:36](?tab=t.mqr7i2mfovc#heading=h.psbdkronf2l3)). Nicolás López Vásquez compartió en Discord múltiples propuestas de logotipos para el equipo y el proyecto, explicando que los formatos de diseño y variaciones de color dependen del fondo del repositorio de GitHub y que dichas referencias deben enviarse posteriormente al diseñador de experiencia de usuario ([00:14:01](?tab=t.mqr7i2mfovc#heading=h.ffzo1h36fb1q)).

---

**Definición de la pila tecnológica y despliegue en Vercel**: Daniel Garcia Rojas, Juan Pablo Ahumada y Nicolás López Vásquez evaluaron y acordaron descartar Google Cloud Platform en favor de una arquitectura monorepo utilizando Next.js con Vercel para el frontend y Python para el backend ([00:18:13](?tab=t.mqr7i2mfovc#heading=h.8pupux6n0egq)) ([00:21:26](?tab=t.mqr7i2mfovc#heading=h.nrpqrg1zd4nl)). Juan Pablo Ahumada recomendó Vercel debido a su rapidez, automatización, capa gratuita generosa, integración directa con GitHub y provisión de dominios temporales ideales para la creación de prototipos ([00:19:23](?tab=t.mqr7i2mfovc#heading=h.lwe23tmtdp0f)).

---

**Asignación de roles en el desarrollo**: Nicolás López Vásquez asumió el rol de desarrollo de software para conectar el frontend y el backend, Bernarda Rodriguez se encargará de la metodología de encuestas y el análisis estadístico de los datos, y Juan Pablo Ahumada se enfocará en el backend y en el modelado de datos ([00:22:50](?tab=t.mqr7i2mfovc#heading=h.1q5jni2g9t5b)) ([00:26:18](?tab=t.mqr7i2mfovc#heading=h.24bsvi2iazg3)). Daniel Garcia Rojas estableció que Juan Pablo Ahumada propondrá la arquitectura del backend para coordinarse con Bernarda Rodriguez, mientras que Nicolás López Vásquez traducirá dichos componentes hacia la interfaz de usuario ([00:27:16](?tab=t.mqr7i2mfovc#heading=h.w6n8qy5qc7ol)).

---

**Configuración de la cuenta de Vercel para el equipo**: Daniel Garcia Rojas y Juan Pablo Ahumada discutieron la gestión de los recursos en las capas gratuitas de Vercel y acordaron crear una cuenta de correo electrónico grupal en Gmail para centralizar el registro en Vercel y compartir las credenciales entre los participantes ([00:27:56](?tab=t.mqr7i2mfovc#heading=h.z5n7pp7i0mb9)).

---

**Detalles de los cuestionarios piloto por rubro**: Bernarda Rodriguez repasó la estructura de las encuestas piloto para cuatro sectores (minimarkets, restaurantes y cafeterías, peluquerías y estética en línea, y tiendas virtuales), centradas en medir la satisfacción global, la calidad del producto y el tiempo de servicio en escalas de 1 a 5 ([00:28:43](?tab=t.mqr7i2mfovc#heading=h.2ppec43fheq1)) ([00:32:11](?tab=t.mqr7i2mfovc#heading=h.kemr8c3pds00)). Fabi Cueto informó que cuenta con aproximadamente seis encuestas aplicadas en diversos negocios, incluyendo minimarkets, un restaurante chino, una tienda de ropa y una tienda virtual de transmisiones en vivo por TikTok ([00:31:04](?tab=t.mqr7i2mfovc#heading=h.kbirvv4cc7lk)).

---

**Validación técnica y seguridad de los códigos QR**: Bernarda Rodriguez planteó la necesidad de implementar mecanismos de seguridad en los códigos QR para evitar respuestas duplicadas o spam, tomando como referencia restricciones de sesión única observadas en aplicaciones bancarias ([00:33:21](?tab=t.mqr7i2mfovc#heading=h.zefolz6eq4ym)). Juan Pablo Ahumada explicó que los códigos QR o los accesos mediante tokens pueden configurarse para caducar tras un solo uso, aunque la viabilidad práctica dependerá de si los códigos se imprimen en los locales o se muestran dinámicamente en pantallas ([00:35:24](?tab=t.mqr7i2mfovc#heading=h.a4ueks2zjo8b)).

---

**Metodología de gestión y control de versiones en GitHub**: Daniel Garcia Rojas propuso utilizar GitHub Projects en lugar de Trello para centralizar la gestión de tareas ([00:37:23](?tab=t.mqr7i2mfovc#heading=h.pljw4bwz2br4)). En cuanto al control de versiones, Juan Pablo Ahumada y Daniel Garcia Rojas acordaron que cada participante trabajará sobre ramas individuales por usuario y utilizarán convenciones de nomenclatura para las confirmaciones de cambios como "fit" o "bug" ([00:39:47](?tab=t.mqr7i2mfovc#heading=h.35mqvyoe38uv)). Daniel Garcia Rojas se comprometió a crear el repositorio con la pila tecnológica seleccionada y configurar la cuenta grupal en Vercel ([00:40:39](?tab=t.mqr7i2mfovc#heading=h.ls9uzn4fwlek)).

---

**Planificación de minutas y programación de reuniones**: Nicolás López Vásquez acordó redactar y subir las minutas de la reunión a Google Drive a más tardar la mañana siguiente, utilizando el resumen automático proporcionado por Daniel Garcia Rojas ([00:41:40](?tab=t.mqr7i2mfovc#heading=h.trxmld58vgig)). Juan Pablo Ahumada sugirió programar las citas recurrentes del equipo mediante invitaciones de calendario en Google Meet en lugar de depender exclusivamente del chat de Discord para mejorar la asistencia ([00:42:39](?tab=t.mqr7i2mfovc#heading=h.9kvcake9ee4t)). La próxima sesión quedó programada tentativamente para el lunes, a la espera de la distribución del diagrama de flujo que Daniel Garcia Rojas enviará previamente ([00:44:27](?tab=t.mqr7i2mfovc#heading=h.l9nhskbfygs7)).

*Revisa las notas de Gemini para asegurarte de que sean precisas. [Obtén sugerencias y descubre cómo Gemini toma notas](https://support.google.com/meet/answer/14754931)*

*Cómo es la calidad de **estas notas específicas?** [Responde una breve encuesta](https://google.qualtrics.com/jfe/form/SV_5bXzKQfylMIhSXc?confid=Wzy2OV_jmowdmcBLnnAkDxIQOBEQAjIGCIoCIAAYBQg&detailLevel=standard&hasImages=False&entryPoint=footerMain&isGoogler=False&lang=es-US) para darnos tu opinión; por ejemplo, cuán útiles te resultaron las notas.*