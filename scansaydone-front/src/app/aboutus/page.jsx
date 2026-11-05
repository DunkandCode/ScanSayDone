import React from 'react'
import Link from 'next/link'
import PageHero from '../components/page-hero/page-hero'
import Navlight from '../components/navbar/navlight'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'

export const metadata = {
  title: 'Qué es — encuestas de 3 preguntas por QR',
  description: 'Encuesta de tres preguntas para negocios chicos. Tus clientes responden desde el navegador, sin cuenta. Tú lees opiniones y avisos en el panel.',
}

export default function AboutUs() {
  return (
    <>
        <Navlight/>

        <PageHero
          title="PREGUNTAS CORTAS, RESPUESTAS CLARAS"
          lead="Scan-Say-Done es una encuesta de tres preguntas que tus clientes responden desde el navegador, sin instalar nada. Cuando el panel esté listo, vas a leer ahí lo que dicen."
          breadcrumb="El producto"
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
                <div className="row mt-1 pt-0">
                    <div className="col-lg-6 col-md-6 mt-4">
                        <div className="d-flex">
                            <div className="flex-1">
                                <h2 className="h5 mb-3">Para quién es</h2>
                                <p className="text-muted para-desc mb-0">Para el negocio que atiende de cara al público: almacén, peluquería, cafetería, local de barrio. Si no recibes clientes en el local ni vendes por redes, hoy esto todavía no te sirve.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 mt-4">
                        <div className="d-flex">
                            <div className="flex-1">
                                <h2 className="h5 mb-3">Qué es hoy</h2>
                                <p className="text-muted para-desc mb-0">El producto está en preparación. La encuesta y el panel todavía no están en línea en este sitio: lo que se muestra es un marco de referencia con etiqueta <span className="fw-semibold">DEMO</span>.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 mt-4">
                        <div className="d-flex">
                            <div className="flex-1">
                                <h2 className="h5 mb-3">Cómo hablamos</h2>
                                <p className="text-muted para-desc mb-0">No publicamos cifras de clientes, logos ni testimonios porque todavía no existen. No prometemos más ventas. Si algo no está construido, lo decimos aquí mismo.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 mt-4">
                        <div className="d-flex">
                            <div className="flex-1">
                                <h2 className="h5 mb-3">Qué hace el dueño</h2>
                                <p className="text-muted para-desc mb-0">Armarás la encuesta una vez, pegarás el QR o compartirás el enlace, y entrarás al panel cuando quieras saber qué están diciendo.</p>
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
