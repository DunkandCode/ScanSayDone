# Registro de riesgos de usuario — Scan-Say-Done

> Revisión del 27-oct-2026 sobre lo ya decidido. **Riesgo de usuario = lo que hace que el dueño (o su cliente) abandone, desconfíe o decida mal.**
> Escala: severidad (impacto si ocurre) × probabilidad. Cada riesgo tiene mitigación **y** donde se verifica.

## A. Riesgos del cliente final (el que responde la encuesta)

| # | Riesgo | Sev × Prob | Por qué ocurre | Mitigación | Verificación |
|---|---|---|---|---|---|
| A1 | **"¿Esto es del local o es una estafa?"** — abandona al abrir el QR | Alta × Alta | el QR lleva a un dominio desconocido sin contexto del negocio | logo del negocio + nombre + "encuesta de <local>" en la primera pantalla; dominio propio; sin login; sin campos personales | prueba con 3 usuarios reales en mostrador (piloto): ≥80% responde sin ayuda |
| A2 | **Abandona a mitad** por fricción | Media × Alta | teclado móvil, targets chicos, luz de vitrina, prisa | 3 preguntas, 1 por pantalla, auto-avance, targets ≥44 px, texto ≥16 px, sin campos obligatorios salvo la escala | cronómetro: QR → primer toque <10 s; taps hasta enviar ≤3 |
| A3 | **Doble envío** por reintento de red → 2 opiniones y 2 alertas | Media × Media | el móvil reenvía al perder señal | `idempotency_key` + `UNIQUE` (200 mismo payload / 409 distinto) | smoke: reenviar la misma key no duplica |
| A4 | **Escribe datos personales** en el comentario (nombre, teléfono) | Media × Alta | el campo es libre | la encuesta no los pide; aviso bajo el campo; retención definida; **sin enmascarado automático** (mutila el texto) | revisión de 20 respuestas del piloto: 0 con datos identificables |
| A5 | **Responde condicionado** (el empleado mira) | Media × Media | el QR está en el mesón | copy neutro ("tu opinión nos ayuda"), sin recompensa, sin pedir nombre | observación en piloto: anotar si el personal interviene |

## B. Riesgos del dueño (el que usa el panel)

| # | Riesgo | Sev × Prob | Por qué ocurre | Mitigación | Verificación |
|---|---|---|---|---|---|
| B1 | **El aviso urgente se entierra** | Alta × Alta | al eliminar el destino `alertas`, el reclamo depende de una tarjeta | contador visible en la tarjeta del overview + enlace directo `respuestas?filtro=sin-responder` + badge en el ítem de navegación | smoke: 3 respuestas negativas → la tarjeta muestra 3 y el enlace abre la lista filtrada |
| B2 | **Lee un número con n=1 como tendencia** | Alta × Alta | con 5 respuestas todo parece una señal | sin porcentajes con n<10; aviso literal "aun son pocos clientes (3)"; la métrica abre la lista, no un gráfico | gate de copy: prohibido `%` cuando n<10 |
| B3 | **Compara canales con datos ínfimos** y retira un canal por ruido | Media × Alta | "1 opinión en TikTok" parece un veredicto | prohibido cualquier ratio por canal con n<10; la tarjeta invita a leer el texto, no a comparar | revisión de la vista de opiniones con 4 canales y 6 respuestas |
| B4 | **Se topa con un comentario hostil** y deja el panel | Media × Alta | texto libre sin curación | se muestra **citado** ("esto dijo tu cliente"), nunca como conclusión del sistema; acción única "Responder" con borrador; sin notificaciones repetidas | revisión de 10 comentarios negativos reales del piloto |
| B5 | **El dashboard miente** (métricas infladas por spam) | Media × Crítico | endpoint público sin registro | rate bucket 10/min + honeypot + respuestas `flagged` excluidas del cálculo + crudas visibles | prueba adversarial: 15 envíos en <1 min → 10 pasan, resto 429, sin duplicar |
| B6 | **Primer uso vacío** → no vuelve a entrar | Alta × Alta | acaba de imprimir el QR, nadie ha respondido | estado vacío con acción "Abrir mi QR" + 3 pasos (imprime, coloca, espera) + correo de activación a los 2 días sin respuestas | smoke: cuenta nueva sin datos muestra la acción, no un panel en cero |
| B7 | **No entiende la interfaz** (jerga) | Media × Media | el rubro habla de CSAT/NPS | lista negra: `CSAT`, `NPS`, `score`, `KPI`, `tendencia`, `engagement`; vocabulario: opiniones / comentarios / avisos / mejorar | grep de la lista negra en el copy del panel = 0 |
| B8 | **No ve la alerta porque solo llega por correo** | Media × Media | muchos dueños no revisan correo | la alerta también aparece en el panel al entrar; el correo es refuerzo, no canal único | smoke: alerta creada y visible en panel sin abrir el correo |
| B9 | **No puede usarlo en el celular con una mano** | Media × Media | lo abre en el mostrador | sidebar → drawer nativo; targets ≥44 px; nada depende de hover; tablas ≤3 columnas en móvil | prueba en 375 px de las 3 vistas |
| B10 | **Paga el plan y no hay QR** (o al revés) | Baja × Crítico | el QR impreso es irreversible | gate **server-side** de plan Pro antes de generar QR + checklist pre-impresión + monitor de encuestas sin respuestas a 7 días | checklist firmado antes de imprimir el primer lote |

## C. Riesgos de plataforma que llegan al usuario

| # | Riesgo | Sev × Prob | Mitigación | Verificación |
|---|---|---|---|---|
| C1 | **QR muerto** por pausa del proveedor (free tier) o migración mal hecha | Baja × Crítico | plan Pro antes de imprimir + dominio propio + `short_code` inmutable + monitor de 7 días + backup **con prueba de restauración** | restauración de ensayo antes del piloto |
| C2 | **Encuesta desactivada** con QR pegado en la vitrina | Media × Media | `is_active=false` resuelve el código con página "encuesta cerrada", nunca 404 | smoke: desactivar y escanear el QR real |
| C3 | **Comentario se pierde** por fallo de red en el envío | Media × Media | 4 estados con reintento y **respuesta conservada** en el formulario | corte de red simulado en la encuesta |

## D. Riesgos de la landing (marketing) que afectan la confianza

| # | Riesgo | Sev × Prob | Mitigación |
|---|---|---|---|
| D1 | **Promesa que el producto no cumple** ("20 segundos", "gratis para siempre") | Media × Alta | el copy solo afirma lo verificable en el piloto; "20 s" sale del cronómetro medido, no del deseo |
| D2 | **Prueba social inventada** (cifras, logos, testimonios) | Alta × Media | cero datos inventados; si no hay casos, se declara "piloto en curso" |
| D3 | **El hueco entre marca y producto** (teal de agencia vs coral del producto) | Media × Alta | Fase 0 antes de publicar: un solo sistema de tokens en landing, encuesta y panel |
| D4 | **QR de demostración** que no funciona | Media × Media | el QR de la sección "así se ve en tu local" apunta a una encuesta demo real y viva |

## E. Los 5 que vigilaría primero

1. **A1** confianza al escanear (define si hay datos).
2. **B1** aviso enterrado (define si el producto sirve).
3. **B5** métricas manipuladas (un panel que miente es peor que uno caído).
4. **B2** números con n=1 (define si el dueño decide bien).
5. **C1** QR muerto (define si el negocio pierde la cara frente a su cliente).

## F. Gate de aceptación para el piloto (5 negocios)

Antes de dar por bueno el MVP, cada punto debe tener evidencia, no opinión:

| Gate | Umbral |
|---|---|
| Encuesta sin ayuda | ≥80% de éxito en 3 usuarios por negocio |
| Tiempo de respuesta | mediana <30 s |
| Aviso visible | 100% de las alertas generadas aparecen en el panel al entrar |
| Cero duplicados | 0 en la prueba de reintento |
| Cero porcentajes con n<10 | grep del panel + revisión de 3 capturas |
| Dueño identifica una mejora | 3 de 5 negocios responden *"¿qué decisión tomaste gracias a esto?"* con algo concreto |
