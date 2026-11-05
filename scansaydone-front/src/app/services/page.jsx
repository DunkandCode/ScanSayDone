import React from 'react'
import Link from 'next/link'
import PageHero from '../components/page-hero/page-hero'
import Navlight from '../components/navbar/navlight'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'

export const metadata = {
  title: 'Qué incluye hoy — encuesta, QR y canales',
  description: 'Lo que incluye Scan-Say-Done hoy: encuesta de tres preguntas, un QR que no se reimprime, cuatro canales y un panel todavía en preparación.',
}

export default function Services() {
  return (
    <>
        <Navlight/>

        <PageHero
          kicker="QUÉ INCLUYE HOY"
          title="CUATRO PIEZAS, UN SOLO QR"
          lead="Esto es lo que hay hoy: una encuesta corta, un QR que no se reimprime, cuatro canales donde ya está tu cliente y un panel que todavía se está construyendo."
          breadcrumb="Qué incluye"
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
                <div className="row mt-3 pt-2">
                    <div className="col-lg-6 col-md-6 mt-4">
                        <div className="d-flex">
                            <div className="flex-1">
                                <h2 className="h5 mb-3">La encuesta</h2>
                                <p className="text-muted para-desc mb-0">Tres preguntas, una por pantalla, del 1 al 5, con un comentario opcional.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 mt-4">
                        <div className="d-flex">
                            <div className="flex-1">
                                <h2 className="h5 mb-3">El QR y el enlace</h2>
                                <p className="text-muted para-desc mb-0">El mismo QR sirve para siempre: no hay que reimprimirlo. Cada encuesta tiene además un enlace, para compartir donde no hay mostrador.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 mt-4">
                        <div className="d-flex">
                            <div className="flex-1">
                                <h2 className="h5 mb-3">Los canales</h2>
                                <p className="text-muted para-desc mb-0">Mostrador, Instagram, WhatsApp y TikTok. Es siempre el mismo QR o el mismo enlace: no hay cuatro encuestas que mantener. <Link href="/#canales" className="text-primary">Ver los canales en la portada</Link>.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 mt-4">
                        <div className="d-flex">
                            <div className="flex-1">
                                <h2 className="h5 mb-3">El panel</h2>
                                <p className="text-muted para-desc mb-0">Aquí se leerán las opiniones y los avisos. Todavía no está en línea: en este sitio aparece como marco de referencia con etiqueta <span className="fw-semibold">DEMO</span>. Panel en construcción. Te avisamos cuando esté.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-5 pt-4">
                    <div className="col-12 text-center">
                        <Link href="/contactus" className="btn btn-primary">Escríbenos</Link>
                        <Link href="/faqs" className="btn btn-outline-primary ms-2 mt-2 mt-sm-0">Ver preguntas frecuentes</Link>
                    </div>
                </div>
            </div>
        </section>

        <Footer/>

        <ScrollToTop/>
    </>
  )
}
