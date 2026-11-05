import React from 'react'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import PageHero from '../components/page-hero/page-hero'
import Navlight from '../components/navbar/navlight'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'

export const metadata = {
  title: 'El recorrido de una encuesta — Scan-Say-Done',
  description: 'Recorrido de una encuesta Scan-Say-Done: qué ve tu cliente en el QR, qué queda guardado y cómo aparece en el panel, todavía en preparación.',
}

const bloques = [
    { id: 'cliente', label: 'Lo que ve tu cliente' },
    { id: 'dueno', label: 'Lo que haces tú' },
    { id: 'respuesta', label: 'Qué pasa con una respuesta' },
    { id: 'demo', label: 'Lo que este sitio muestra' },
]

export default function ServiceDetail() {
  return (
    <>
        <Navlight/>

        <PageHero
          kicker="EL RECORRIDO"
          title="DEL MOSTRADOR AL PANEL"
          lead="Así vive la encuesta cada una de las dos partes: tu cliente, frente al QR, y tú, desde el celular."
          breadcrumb="El recorrido"
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
                <div className="row g-4">
                    <div className="col-lg-8 col-md-7">
                        <div id="cliente" className="mb-5">
                            <h2 className="h5 mb-3">Lo que ve tu cliente</h2>
                            <p className="text-muted para-desc mb-0">Escanea el QR del mostrador o toca el enlace de tu perfil. Ve una pregunta por pantalla, responde del 1 al 5 y puede dejar un comentario. No crea cuenta, no instala nada, no deja nombre ni correo.</p>
                        </div>

                        <div id="dueno" className="mb-5">
                            <h2 className="h5 mb-3">Lo que haces tú</h2>
                            <p className="text-muted para-desc mb-0">Armarás la encuesta una vez y repetirás el mismo QR o el mismo enlace todos los días. Para leer las respuestas entrarás al panel con tu correo.</p>
                        </div>

                        <div id="respuesta" className="mb-5">
                            <h2 className="h5 mb-3">Qué pasa con una respuesta</h2>
                            <p className="text-muted para-desc mb-0">La opinión queda guardada con su fecha y su canal. Las que necesitan acción aparecen primero, no al final de la lista.</p>
                        </div>

                        <div id="demo" className="mb-5">
                            <h2 className="h5 mb-3">Lo que este sitio muestra y lo que no</h2>
                            <p className="text-muted para-desc mb-0">Las pantallas de ejemplo llevan etiqueta <span className="fw-semibold">DEMO</span>: son el marco de referencia, no el producto terminado. Esta página se actualiza cuando el panel exista.</p>
                        </div>

                        <div className="mt-4">
                            <Link href="/contactus" className="btn btn-primary">Escríbenos <FiArrowRight className="align-middle" aria-hidden="true" /></Link>
                            <Link href="/#como-funciona" className="btn btn-outline-primary ms-2 mt-2 mt-sm-0">Ver cómo funciona</Link>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-5 col-12">
                        <div className="sticky-bar">
                            <h3 className="h6 text-uppercase text-muted fw-semibold mb-3">En esta página</h3>
                            {bloques.map((item, index) => (
                                <a href={`#${item.id}`} className="bg-light rounded d-flex justify-content-between text-dark py-3 px-4 mb-2 text-decoration-none" key={index}>
                                    <span className="fw-semibold">{item.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Footer/>

        <ScrollToTop/>
    </>
  )
}
