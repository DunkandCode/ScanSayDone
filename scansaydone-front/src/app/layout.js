import './assets/scss/bootstrap.scss'

import './globals.css'
import './assets/scss/style.scss'

import BootstrapClient from './components/bootstrap-client'
import { SITE } from './data/site'
import { Bebas_Neue, Montserrat } from 'next/font/google'

// route groups pendientes: se crean cuando existan panel y encuesta (/e/[code])
// Mover las 9 rutas actuales a (marketing)/(panel)/(public) rompería el trabajo en curso.

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

// [QUITAR antes de publicar] — robots noindex mientras el cuerpo sea el template
export const metadata = {
  title: {
    template: `%s | ${SITE.name}`,
    default: SITE.name,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.domain),
  robots: { index: false, follow: false },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${bebas.variable} ${montserrat.variable}`}>
      <body className={``}>
        <BootstrapClient />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
