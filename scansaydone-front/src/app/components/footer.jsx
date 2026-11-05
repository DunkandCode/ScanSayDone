// Footer del landing — Scan-Say-Done
// Estructura: 4 columnas (marca, producto, recursos, legal) + barra inferior
// Los enlaces se definen inline (no usa footerLink1/footerLink2 de data.js)

import Link from 'next/link'
import LogoSymbol from './brand/logo-symbol'
import { SITE } from '../data/site'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  // Enlaces organizados por categoría
  const productLinks = [
    { name: 'Cómo funciona', link: '/#como-funciona' },
    { name: 'Canales', link: '/#canales' },
    { name: 'Panel', link: '/#panel' },
    ...(SITE.features.showPricing ? [{ name: 'Precios', link: '/pricing' }] : []),
  ]

  const resourceLinks = [
    { name: 'Preguntas frecuentes', link: '/faqs' },
    { name: 'Contacto', link: '/contactus' },
  ]

  const legalLinks = [
    { name: 'Términos', link: '/terms' },
    { name: 'Privacidad', link: '/privacy' },
  ]

  return (
    <footer>
      <div className="container">
        <div className="row">
          {/* Columna 1: Marca */}
          <div className="col-lg-4 col-12 mb-4 mb-lg-0">
            <div className="footer-brand">
              <Link href="/" className="footer-logo" aria-label="Scan-Say-Done — Inicio">
                <LogoSymbol size={36} className="me-2" />
                <span className="footer-wordmark">
                  SCAN-<span className="say">SAY</span>-DONE
                </span>
              </Link>
              <p className="footer-descriptor">
                Mejores experiencias para cada negocio.
              </p>
              <p className="footer-tagline">
                ESCANEA. OPINA. LISTO.
              </p>
              <p className="footer-contact-link">
                <Link href="/contactus" className="text-foot">
                  Escríbenos
                </Link>
              </p>
            </div>
          </div>

          {/* Columna 2: Producto */}
          <div className="col-lg-2 col-md-4 col-6 mb-4 mb-md-0">
            <nav aria-label="Producto">
              <h2 className="footer-head">Producto</h2>
              <ul className="footer-list">
                {productLinks.map((item, index) => (
                  <li key={index}>
                    <Link href={item.link} className="text-foot">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Columna 3: Recursos */}
          <div className="col-lg-3 col-md-4 col-6 mb-4 mb-md-0">
            <nav aria-label="Recursos">
              <h2 className="footer-head">Recursos</h2>
              <ul className="footer-list">
                {resourceLinks.map((item, index) => (
                  <li key={index}>
                    <Link href={item.link} className="text-foot">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Columna 4: Legal */}
          <div className="col-lg-3 col-md-4 col-12">
            <nav aria-label="Legal">
              <h2 className="footer-head">Legal</h2>
              <ul className="footer-list">
                {legalLinks.map((item, index) => (
                  <li key={index}>
                    <Link href={item.link} className="text-foot">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="footer-bar">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-sm-6">
              <p className="mb-2 mb-sm-0 text-muted small">
                © {currentYear} {SITE.legalName || SITE.name}. Todos los derechos reservados.
              </p>
            </div>
            <div className="col-sm-6">
              <ul className="list-inline mb-0 text-sm-end">
                {legalLinks.map((item, index) => (
                  <li key={index} className="list-inline-item ms-3">
                    <Link href={item.link} className="text-muted small">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
