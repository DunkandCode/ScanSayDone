'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { FiCheck, FiAlertTriangle } from 'react-icons/fi'

import { SITE } from '../data/site'
import { contactMode, buildMailto } from '../lib/contact'

import Navlight from '../components/navbar/navlight'
import PageHero from '../components/page-hero/page-hero'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'

const validar = {
  nombre: (v) =>
    String(v ?? '').trim().length >= 2 ? '' : 'Escribe tu nombre.',
  correo: (v) => {
    const clean = String(v ?? '').trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(clean)
      ? ''
      : 'Escribe un correo válido, por ejemplo nombre@correo.com'
  },
  mensaje: (v) =>
    String(v ?? '').trim().length >= 10
      ? ''
      : 'Cuéntanos un poco más (al menos 10 caracteres).',
}

export default function ContactusPage() {
  const modo = contactMode()

  const [valores, setValores] = useState({ nombre: '', correo: '', negocio: '', mensaje: '' })
  const [errores, setErrores] = useState({ nombre: '', correo: '', mensaje: '' })
  const [tocados, setTocados] = useState({ nombre: false, correo: false, mensaje: false })
  // idle | enviando | ok | error | handoff
  const [estado, setEstado] = useState('idle')
  const [isOffline, setIsOffline] = useState(false)

  const sentRef = useRef(null)
  const nombreRef = useRef(null)
  const correoRef = useRef(null)
  const mensajeRef = useRef(null)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    setIsOffline(!navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (estado === 'ok' || estado === 'handoff') {
      sentRef.current?.focus()
    }
  }, [estado])

  const handleChange = (campo) => (e) => {
    const valor = e.target.value
    setValores((prev) => ({ ...prev, [campo]: valor }))
    if (tocados[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: validar[campo](valor) }))
    }
  }

  const handleBlur = (campo) => () => {
    setTocados((prev) => ({ ...prev, [campo]: true }))
    setErrores((prev) => ({ ...prev, [campo]: validar[campo](valores[campo]) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (modo === 'none' || estado === 'enviando') return

    const siguientes = {
      nombre: validar.nombre(valores.nombre),
      correo: validar.correo(valores.correo),
      mensaje: validar.mensaje(valores.mensaje),
    }
    setTocados({ nombre: true, correo: true, mensaje: true })
    setErrores(siguientes)

    if (siguientes.nombre || siguientes.correo || siguientes.mensaje) {
      const ref = siguientes.nombre
        ? nombreRef
        : siguientes.correo
          ? correoRef
          : mensajeRef
      ref.current?.focus()
      return
    }

    if (modo === 'mailto') {
      window.location.href = buildMailto({
        nombre: valores.nombre,
        correo: valores.correo,
        negocio: valores.negocio,
        mensaje: valores.mensaje,
      })
      setEstado('handoff')
      return
    }

    if (modo === 'endpoint') {
      setEstado('enviando')
      try {
        const res = await fetch(SITE.endpoints.contact, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: valores.nombre,
            correo: valores.correo,
            negocio: valores.negocio,
            mensaje: valores.mensaje,
          }),
        })
        if (!res.ok) {
          setEstado('error')
          return
        }
        setEstado('ok')
      } catch {
        setEstado('error')
      }
    }
  }

  const handleReset = () => {
    setValores({ nombre: '', correo: '', negocio: '', mensaje: '' })
    setErrores({ nombre: '', correo: '', mensaje: '' })
    setTocados({ nombre: false, correo: false, mensaje: false })
    setEstado('idle')
    requestAnimationFrame(() => nombreRef.current?.focus())
  }

  const esFinal = estado === 'ok' || estado === 'handoff'
  const botonLabel =
    estado === 'enviando'
      ? 'Enviando…'
      : modo === 'none'
        ? 'ENVÍO NO DISPONIBLE'
        : modo === 'mailto'
          ? 'ABRIR MI CORREO CON EL MENSAJE'
          : 'ENVIAR MENSAJE'
  const botonDisabled =
    modo === 'none' ||
    estado === 'enviando' ||
    (modo === 'endpoint' && isOffline)

  return (
    <>
      <Navlight />

      <PageHero
        title="ESCRÍBENOS"
        lead="Cuéntanos de tu negocio. Te responde una persona, no un robot."
        breadcrumb="Contacto"
        imageSrc="/images/contacto-hero.jpg"
        imageAlt="Mesa de madera junto a una ventana con una taza de café, una libreta abierta y unas gafas, en un local cálido."
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
              <div className="contacto-panel">
                {!esFinal ? (
                  <>
                    <h2 id="contacto-form-titulo" className="contacto-panel-titulo">Tu mensaje</h2>
                    <p className="contacto-panel-lead">
                      {modo === 'mailto'
                        ? `Cuéntanos qué tipo de local tienes y qué quieres resolver. Si prefieres el correo directo, escríbenos a ${SITE.contact.email}.`
                        : 'Cuéntanos qué tipo de local tienes y qué quieres resolver. Con eso podemos responderte bien.'}
                    </p>

                    {modo === 'none' && (
                      <div className="contacto-aviso" role="status">
                        El envío no está disponible: este sitio todavía no tiene configurado el correo de contacto.
                      </div>
                    )}

                    {isOffline && (
                      <div className="contacto-aviso contacto-aviso--alerta" role="alert">
                        <FiAlertTriangle />
                        Sin conexión a internet
                      </div>
                    )}

                    <form className="contacto-form" onSubmit={handleSubmit} noValidate aria-labelledby="contacto-form-titulo">
                      <div className="contacto-fila">
                        <div className="contacto-campo">
                          <label htmlFor="nombre" className="contacto-label">
                            Nombre
                          </label>
                          <input
                            id="nombre"
                            ref={nombreRef}
                            type="text"
                            autoComplete="name"
                            maxLength={80}
                            className={`contacto-input ${errores.nombre ? 'is-invalid' : ''}`}
                            value={valores.nombre}
                            onChange={handleChange('nombre')}
                            onBlur={handleBlur('nombre')}
                            aria-describedby={errores.nombre ? 'nombre-error' : undefined}
                            aria-invalid={errores.nombre ? 'true' : undefined}
                          />
                          {errores.nombre && (
                            <div id="nombre-error" className="contacto-error">
                              <FiAlertTriangle />
                              {errores.nombre}
                            </div>
                          )}
                        </div>

                        <div className="contacto-campo">
                          <label htmlFor="correo" className="contacto-label">
                            Correo
                          </label>
                          <input
                            id="correo"
                            ref={correoRef}
                            type="email"
                            autoComplete="email"
                            spellCheck={false}
                            className={`contacto-input ${errores.correo ? 'is-invalid' : ''}`}
                            placeholder="nombre@correo.com"
                            value={valores.correo}
                            onChange={handleChange('correo')}
                            onBlur={handleBlur('correo')}
                            aria-describedby={errores.correo ? 'correo-error' : undefined}
                            aria-invalid={errores.correo ? 'true' : undefined}
                          />
                          {errores.correo && (
                            <div id="correo-error" className="contacto-error">
                              <FiAlertTriangle />
                              {errores.correo}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="contacto-campo">
                        <label htmlFor="negocio" className="contacto-label">
                          Negocio
                        </label>
                        <input
                          id="negocio"
                          type="text"
                          autoComplete="organization"
                          maxLength={80}
                          className="contacto-input"
                          placeholder="Cafetería, peluquería, tienda…"
                          value={valores.negocio}
                          onChange={handleChange('negocio')}
                        />
                        <p className="contacto-ayuda">Si quieres, dinos qué tipo de local es.</p>
                      </div>

                      <div className="contacto-campo">
                        <label htmlFor="mensaje" className="contacto-label">
                          Mensaje
                        </label>
                        <textarea
                          id="mensaje"
                          ref={mensajeRef}
                          className={`contacto-input contacto-textarea ${errores.mensaje ? 'is-invalid' : ''}`}
                          minLength={10}
                          maxLength={800}
                          rows={4}
                          value={valores.mensaje}
                          onChange={handleChange('mensaje')}
                          onBlur={handleBlur('mensaje')}
                          aria-describedby={errores.mensaje ? 'mensaje-error' : undefined}
                          aria-invalid={errores.mensaje ? 'true' : undefined}
                        />
                        {errores.mensaje && (
                          <div id="mensaje-error" className="contacto-error">
                            <FiAlertTriangle />
                            {errores.mensaje}
                          </div>
                        )}
                        <div className="contacto-contador">{valores.mensaje.length}/800</div>
                      </div>

                      {estado === 'error' && (
                        <div className="contacto-error" role="alert">
                          <FiAlertTriangle />
                          No pudimos enviar el mensaje. Inténtalo de nuevo.
                        </div>
                      )}

                      <button type="submit" className="contacto-submit" disabled={botonDisabled}>
                        {botonLabel}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="contacto-final" ref={sentRef} tabIndex={-1} role="status" aria-live="polite">
                    <FiCheck size={32} />
                    {estado === 'ok' ? (
                      <>
                        <h2 className="contacto-final-titulo">MENSAJE ENVIADO</h2>
                        <p className="contacto-final-texto">Te respondemos a {valores.correo}.</p>
                      </>
                    ) : (
                      <>
                        <h2 className="contacto-final-titulo">REVISA TU CORREO</h2>
                        <p className="contacto-final-texto">
                          Se abrió tu programa de correo con el mensaje listo. Revísalo y pulsa enviar.
                        </p>
                        <p className="contacto-final-nota">Si no se abrió, escríbenos a {SITE.contact.email}</p>
                      </>
                    )}
                    <button type="button" className="contacto-submit-secundario" onClick={handleReset}>
                      Escribir otro mensaje
                    </button>
                  </div>
                )}
              </div>

              <div className="contacto-pasos">
                <h3>Qué pasa después</h3>
                <ol>
                  <li>Tu mensaje llega a nuestra bandeja.</li>
                  <li>Te respondemos por correo.</li>
                  <li>Coordinamos por correo, sin llamadas.</li>
                </ol>
              </div>

              <p className="contacto-nota">
                No hay teléfono de atención ni oficina para visitar: este sitio no publica números ni direcciones que no
                estén operando. Si tu duda está entre las frecuentes, puede estar en{' '}
                <Link href="/faqs">preguntas frecuentes</Link>.
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
