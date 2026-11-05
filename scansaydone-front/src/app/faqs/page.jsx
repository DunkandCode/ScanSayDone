import Link from 'next/link'

import PageHero from '../components/page-hero/page-hero'
import Navlight from '../components/navbar/navlight'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'
import { hasPricing } from '../data/site'
import { productFaqData } from '../data/faq-product'

export const metadata = {
  title: 'Preguntas frecuentes',
  description: 'Respuestas a las dudas más comunes sobre Scan-Say-Done: cómo funciona, quién responde, si necesitas registro y qué pasa con los datos.',
}

export default function Faqs() {
  const visibleFaqData = productFaqData.filter(item => !item.requiresPricing || hasPricing())

  return (
    <>
      <Navlight />

      <PageHero
        title="Preguntas frecuentes"
        breadcrumb="FAQ"
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
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10 col-12">
              <div className="section-title" id="general">
                <h2>Dudas sobre Scan-Say-Done</h2>
                <p className="text-muted para-desc mb-0">Cómo funciona el servicio, quién responde, qué pasa con los datos y cuándo tiene sentido usarlo.</p>
              </div>

              <div className="accordion mt-4 pt-2" id="faqPageAccordion">
                {visibleFaqData.map((item, idx) => (
                  <div className="accordion-item rounded shadow mt-2" key={item.id}>
                    <h3 className="accordion-header">
                      <button
                        className={`accordion-button border-0 bg-white shadow${idx === 0 ? '' : ' collapsed'}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faqpage-collapse-${item.id}`}
                        aria-expanded={idx === 0 ? 'true' : 'false'}
                        aria-controls={`faqpage-collapse-${item.id}`}
                      >
                        {item.q}
                      </button>
                    </h3>
                    <div
                      id={`faqpage-collapse-${item.id}`}
                      className={`accordion-collapse border-0 collapse${idx === 0 ? ' show' : ''}`}
                      data-bs-parent="#faqPageAccordion"
                    >
                      <div className="accordion-body text-muted">
                        {item.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 mb-0 text-muted text-center">
                ¿Otra duda? <Link href="/contactus" className="faq__footer-link">Escríbenos</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <ScrollToTop />
    </>
  )
}
