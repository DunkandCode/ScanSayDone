// src/app/lib/contact.js
// Helper de contacto — fuente única para CTAs y mailto
import { SITE, has } from '@/app/data/site';

export function isContactChannelReady() {
  return has(SITE.contact.email);
}

export function contactHref(topic = 'encuesta') {
  const email = SITE.contact.email?.trim();
  
  if (!email) {
    return '/contactus';
  }
  
  const subject = topic === 'panel' 
    ? 'Quiero ver el panel' 
    : 'Quiero crear mi encuesta';
  
  const body = [
    'Hola.',
    'Tengo un negocio y me interesa probar la encuesta.',
    'Escríbanme a esta dirección para coordinar.'
  ].join('\n');
  
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return mailto;
}

export function contactMode() {
  if (has(SITE.endpoints.contact)) return 'endpoint';
  if (has(SITE.contact.email)) return 'mailto';
  return 'none';
}

export function buildMailto({ nombre = '', correo = '', negocio = '', mensaje = '' }) {
  const email = SITE.contact.email?.trim();
  if (!email) return '';
  const subject = `Contacto desde el sitio · ${nombre.trim()}`;
  const body = [
    `Nombre: ${nombre.trim()}`,
    `Correo: ${correo.trim()}`,
    negocio.trim() ? `Negocio: ${negocio.trim()}` : null,
    '',
    mensaje.trim(),
  ].filter((linea) => linea !== null).join('\n');
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
