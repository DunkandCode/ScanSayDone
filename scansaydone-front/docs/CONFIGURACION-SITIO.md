# Configuración del Sitio

Fuente única: `src/app/data/site.js` (SITE) + `src/app/data/data.js` (contenido).

## Slots de configuración

| Campo | Variable de entorno | Qué renderiza | Si está vacío |
|-------|---------------------|---------------|---------------|
| `name` | `NEXT_PUBLIC_SITE_NAME` | Nombre en header/footer/título | Usa default "Agencia" |
| `domain` | `NEXT_PUBLIC_SITE_URL` | Canonical URL, og:url | Usa default localhost |
| `description` | (literal) | Meta description, og:description | Requerido |
| `contact.email` | `NEXT_PUBLIC_CONTACT_EMAIL` | Footer, contacto | No se muestra |
| `contact.phone` | `NEXT_PUBLIC_CONTACT_PHONE` | Footer, contacto | No se muestra |
| `contact.address` | `NEXT_PUBLIC_CONTACT_ADDRESS` | Página contacto | No se muestra |
| `contact.mapUrl` | `NEXT_PUBLIC_MAP_URL` | Mapa embed en contacto | No se muestra |
| `endpoints.contact` | `NEXT_PUBLIC_CONTACT_ENDPOINT` | URL POST formulario contacto | Formulario deshabilitado |
| `endpoints.newsletter` | `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` | URL POST suscripción | Formulario deshabilitado |
| `social[]` | (array en site.js) | Iconos redes sociales (footer) | No se muestran |
| `counters[]` | (array en data.js) | Sección contadores (aboutus) | Requiere flag `showCounters: true` |
| `features.showCounters` | (boolean) | Activa sección contadores | false = oculto |
| `features.showTestimonials` | (boolean) | Activa sección testimonios | false = oculto |
| `features.showTeam` | (boolean) | Activa sección equipo | false = oculto |

## Cómo activar

### 1. Publicar con marca real

Editar `src/app/data/site.js`:

```js
export const SITE = {
  name: 'Tu Marca',
  domain: 'https://tudominio.com',
  description: 'Descripción de tu empresa (60-160 caracteres).',
  contact: {
    email: 'contacto@tudominio.com',
    phone: '+56 9 1234 5678',
    address: 'Dirección física',
    mapUrl: 'https://www.google.com/maps/embed?pb=...',
  },
  social: [
    { id: 'linkedin', label: 'LinkedIn', icon: FiLinkedin, url: 'https://linkedin.com/in/...' },
  ],
  endpoints: {
    contact: '/api/contact',
    newsletter: '/api/newsletter',
  },
};
```

O usar variables de entorno (`.env.local`):

```
NEXT_PUBLIC_SITE_NAME=Tu Marca
NEXT_PUBLIC_SITE_URL=https://tudominio.com
NEXT_PUBLIC_CONTACT_EMAIL=contacto@tudominio.com
```

### 2. Activar contadores

En `src/app/data/data.js`, editar `counterData`:

```js
export const counterData = [
  { icon: FiCheckCircle, title: 'Proyectos', value: 50, symbol: '+' },
  { icon: FiCoffee, title: 'Años', value: 8, symbol: '+' },
];
```

En `site.js`, activar el flag:

```js
features: {
  showCounters: true,
}
```

### 3. Activar testimonios y equipo

En `data.js`, editar `clientData` (testimonios) y `teamData` (equipo):

```js
export const clientData = [
  {
    tag: 'Proyecto web',
    image: '/images/team/1.jpg',
    rate: ['mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star', 'mdi mdi-star'],
    desc: 'Testimonio real del cliente.',
    name: 'Nombre del cliente',
    position: 'Cargo, empresa',
  },
];

export const teamData = [
  {
    image: '/images/team/1.jpg',
    name: 'Nombre completo',
    position: 'Cargo',
    social: [FiLinkedin, FiTwitter],
  },
];
```

En `site.js`:

```js
features: {
  showTestimonials: true,
  showTeam: true,
}
```

### 4. Conectar formularios

El endpoint recibe `POST` JSON con los campos del formulario:

```js
// Contacto
fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message }),
});

// Newsletter
fetch('/api/newsletter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email }),
});
```

Respuesta esperada:
- **2xx** = éxito (mensaje "Enviado correctamente")
- **No 2xx** = error (mensaje "Error al enviar")
- **Timeout 10s** = error de red

Implementar el endpoint en `app/api/contact/route.js` y `app/api/newsletter/route.js`.

## Verificación

```bash
# Verificar que no hay placeholders
npm run check:placeholders

# Compilar para producción
npm run build
```

## Seguridad

**Advertencia:** las variables `NEXT_PUBLIC_*` quedan en el bundle del cliente. **Nunca** poner:
- Tokens privados (API keys, JWT secrets)
- Credenciales de base de datos
- Endpoints internos sin autenticación

Usar solo para datos públicos (URLs, emails de contacto, endpoints públicos con rate limiting).

Para lógica server-side (validación, envío de emails, almacenamiento), usar `app/api/...` routes con variables privadas en `.env.local` (sin prefijo `NEXT_PUBLIC_`).
