// Fuente única de FAQs del producto Scan-Say-Done
// Usada por: landing page (sección FAQ) y página /faqs
// La 6.ª pregunta (pricing) es condicional y se filtra en el consumo

export const productFaqData = [
  {
    id: 1,
    q: '¿Cuánto demora mi cliente en responder?',
    a: 'Tres preguntas cortas, una por pantalla. Sin registro ni instalación: se responderán en el momento, ahí mismo.',
  },
  {
    id: 2,
    q: '¿Necesito que mis clientes se registren?',
    a: 'No. Abrirán el QR o el enlace y responderán. Sin cuenta, sin app, sin datos personales.',
  },
  {
    id: 3,
    q: '¿Sirve si vendo por Instagram o TikTok?',
    a: 'Sí. Cada encuesta tendrá un enlace que irá en tu bio, en tus historias, en un chat de WhatsApp o en pantalla durante un live.',
  },
  {
    id: 4,
    q: '¿Qué pasa si pierdo el QR?',
    a: 'El código no cambia: lo podrás imprimir de nuevo desde el panel o volverás a compartir el mismo enlace, sin crear otra encuesta.',
  },
  {
    id: 5,
    q: '¿Quién ve las opiniones?',
    a: 'Solo tú, con tu cuenta. El cliente dejará su opinión y no verá las de otros. Nunca pedimos datos personales.',
  },
  {
    id: 6,
    q: '¿Puedo probarlo antes de pagar?',
    a: 'Cuando esté listo, podrás armar tu encuesta y ver cómo llega tu primera opinión.',
    requiresPricing: true, // Solo se renderiza si SITE.features.showPricing es true
  },
];
