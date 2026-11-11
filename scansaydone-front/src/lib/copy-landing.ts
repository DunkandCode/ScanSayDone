/**
 * Cadenas canónicas compartidas entre componentes del landing.
 *
 * Regla: ningún componente escribe estas literales a mano;
 * todos importan desde este módulo (UX-SPEC §5.1 regla 9,
 * enmendada 2026-11-06 por el operador — C-84).
 */

/** Título del claim 3 en la franja de confianza (banda 2). */
export const QR_CLAIM_TITLE = "TU QR NO CAMBIA";

/**
 * Cuerpo del claim 3 en la franja de confianza (banda 2)
 * y respuesta de la FAQ "¿Tengo que reimprimir el QR cada vez?" (banda 8).
 */
export const QR_CLAIM_BODY =
  "Si imprimes otro cartel, el código es el mismo.";
