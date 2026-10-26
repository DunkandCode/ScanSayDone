# 🛡️ Guía de Rol: Ciberseguridad & QA
## Proyecto: ScanSayDone | Dunk & Code XD

* **Área:** Seguridad Ofensiva/Defensiva, Privacidad de Datos & Aseguramiento de Calidad.
* **Tecnologías:** OWASP Top 10, Cifrado, Rate Limiting, Sanitización de Inputs, Seguridad API.
* **Integrantes Asignados:**
  - **Especialista de Ciberseguridad Principal:** `[Nombre por asignar]` (`@usuario_github`)

---

## 🎯 ¿Cuál es tu misión en ScanSayDone?
Blindar el sistema para que sea confiable tanto para el cliente final como para los comerciantes. Debes abordar tres frentes críticos:

### 1. Prevención de Fraude y Manipulación de Notas (Anti-Spam)
* **La Amenaza:** Un cliente enojado o un restaurante competidor escanea el QR y envía un bot con 100 respuestas negativas (nota 0) para hundir el puntaje NPS del negocio.
* **Soluciones a Definir:**
  - **Rate Limiting:** Límite de envíos por IP (ejemplo: máximo 2 respuestas por IP cada 3 horas por comercio).
  - **Huella Digital del Navegador (Fingerprint):** Generar un hash irreversible (SHA-256) combinando User-Agent y características del dispositivo para evitar envíos masivos repetidos sin guardar datos personales.
  - **Detección de anomalías en el tiempo:** Respuestas completadas en menos de 2 segundos se descartan o marcan como sospechosas (nadie lee 3 preguntas en 1 segundo).

### 2. Privacidad del Cliente y Cumplimiento Normativo (Ley de Protección de Datos)
* **La Premisa:** ScanSayDone es una plataforma anónima por diseño (*Privacy by Design*).
* **Reglas:**
  - La base de datos **nunca almacena IPs en texto plano**.
  - Si el cliente deja un comentario, no se le pide RUT, teléfono ni tarjeta de crédito.
  - Elaborar un documento breve con los *Términos de Privacidad* para desplegar en el pie de página de la encuesta.

### 3. Seguridad de la API y de la Base de Datos
* **CORS Estricto:** Permitir que solo el dominio de producción en Vercel y localhost puedan consultar la API en producción.
* **Sanitización de Inputs:** Prevenir ataques de inyección SQL y XSS (Cross-Site Scripting) en el campo de comentarios abiertos de la encuesta.
* **Protección de Credenciales:** Verificar que ninguna contraseña, token o variable de entorno (`.env`) se suba jamás a GitHub.

---

## 📐 Criterios de Calidad (Definition of Done)
- [ ] Documento de *Política de Privacidad y Prevención de Fraude* guardado en `/docs/` y vinculado al Issue [#5](https://github.com/DunkandCode/ScanSayDone/issues/5) y [#6](https://github.com/DunkandCode/ScanSayDone/issues/6).
- [ ] Reglas de rate limiting probadas y documentadas para que los desarrolladores Backend las apliquen en FastAPI.
- [ ] Auditoría de seguridad del repositorio verificando que `.gitignore` esté bloqueando todos los archivos sensibles.
