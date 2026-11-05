import Link from 'next/link'

import PageHero from '../components/page-hero/page-hero'
import Navlight from '../components/navbar/navlight'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'
import { SITE, hasPricing } from '../data/site'

export const metadata = {
  title: 'Planes y precios',
  description: 'Planes de Scan-Say-Done para recibir opiniones de tus clientes. Estamos cerrando los detalles; escríbenos y te contamos qué incluye cada plan.',
}

export default function Pricing() {
  const showPricing = hasPricing()

  return (
    <>
      <Navlight />

      <PageHero
        title="Planes y precios"
        breadcrumb="Precios"
      />

      <div className="position-relative">
        <div className="shape overflow-hidden text-white">
          <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {showPricing ? (
            <>
              <div className="row justify-content-center">
                <div className="col-12">
                  <div className="section-title text-center mb-4 pb-2">
                    <h2 className="h4 mb-4 title">Planes</h2>
                    <p className="para-desc mx-auto text-muted">Elige el plan que mejor se adapte a tu negocio.</p>
                  </div>
                </div>
              </div>

              <div className="row g-4">
                {SITE.plans.map((plan, idx) => {
                  const isRecommended = idx === 0
                  return (
                    <div className="col-lg-4 col-md-6 col-12" key={plan.id}>
                      <div className={`pricing-card bg-white rounded position-relative overflow-hidden h-100${isRecommended ? ' border border-primary border-2' : ''}`}>
                        {isRecommended && (
                          <div className="badge bg-primary position-absolute top-0 start-50 translate-middle">Recomendado</div>
                        )}
                        <div className="p-4 pb-0">
                          <h2 className="h4 mb-2">{plan.name}</h2>
                          <p className="text-muted mb-3">{plan.forWho}</p>
                          <div className="d-flex align-items-baseline mb-3">
                            <span className="h2 mb-0 me-1">{plan.price}</span>
                            <span className="text-muted">/ mes</span>
                          </div>
                        </div>
                        <div className="p-4 pt-0">
                          <ul className="list-unstyled mb-4">
                            {plan.features.map((feature, i) => (
                              <li className="text-muted mb-2" key={i}>
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <Link href={plan.cta.href} className={`btn w-100 ${plan.cta.variant === 'primary' || isRecommended ? 'btn-primary' : 'btn-outline-primary'}`}>
                            {plan.cta.label}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10 col-12">
                <div className="text-center">
                  <h2 className="h4 mb-4 title">PLANES</h2>
                  <p className="text-muted para-desc mb-4">Estamos cerrando los planes. Escríbenos y te contamos qué incluye cada uno.</p>
                  <Link href="/contactus" className="btn btn-primary">Contáctanos</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />

      <ScrollToTop />
    </>
  )
}
