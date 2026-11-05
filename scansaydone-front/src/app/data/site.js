// Fuente única de configuración del sitio
// Editar aquí. Los valores vacíos ('') NO se renderizan: la UI se degrada sola.
// Las variables de entorno NEXT_PUBLIC_* son OVERRIDE opcional, no obligatorias.

const env = {
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME ?? '',
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? '',
  NEXT_PUBLIC_LEGAL_NAME: process.env.NEXT_PUBLIC_LEGAL_NAME ?? '',
  NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
  NEXT_PUBLIC_CONTACT_PHONE: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '',
  NEXT_PUBLIC_CONTACT_ADDRESS: process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? '',
  NEXT_PUBLIC_MAP_URL: process.env.NEXT_PUBLIC_MAP_URL ?? '',
  NEXT_PUBLIC_CONTACT_ENDPOINT: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? '',
  NEXT_PUBLIC_NEWSLETTER_ENDPOINT: process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT ?? '',
};

export const SITE = {
  name: env.NEXT_PUBLIC_SITE_NAME.trim() || 'Scan-Say-Done',
  domain: env.NEXT_PUBLIC_SITE_URL.trim() || 'http://localhost:3000',
  description: 'Encuestas de 3 preguntas por QR para pequeños negocios. Tus clientes responden sin cuenta; tú ves opiniones y avisos en un panel.',
  legalName: env.NEXT_PUBLIC_LEGAL_NAME.trim(),
  contact: {
    email: env.NEXT_PUBLIC_CONTACT_EMAIL.trim(),
    phone: env.NEXT_PUBLIC_CONTACT_PHONE.trim(),
    address: env.NEXT_PUBLIC_CONTACT_ADDRESS.trim(),
    mapUrl: env.NEXT_PUBLIC_MAP_URL.trim(),
  },
  social: [], // rellenar cuando existan URLs reales: { id, label, icon, url }
  // Rellenar cuando existan montos reales. Sin 3 planes con precio, la seccion no se renderiza.
  // { id, name, forWho, price, currency, period, features: [], cta: { label, href, variant } }
  plans: [],
  endpoints: {
    contact: env.NEXT_PUBLIC_CONTACT_ENDPOINT.trim(),
    newsletter: env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT.trim(),
  },
  features: {
    showCounters: false,
    showTestimonials: false,
    showTeam: false,
    showPricing: false,
  },
};

export const has = (v) => typeof v === 'string' ? v.trim().length > 0 : Boolean(v);

export const hasPricing = () => SITE.features.showPricing && Array.isArray(SITE.plans) && SITE.plans.length === 3 && SITE.plans.every(p => p && typeof p.price === 'string' && p.price.trim() !== '');
