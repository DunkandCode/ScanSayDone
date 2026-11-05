'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { FiCheck, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi'

export default function EntrarPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [touched, setTouched] = useState(false)

  const sentRef = useRef(null)
  const emailRef = useRef(null)

  // No se implementa estado de carga: no hay petición real, solo validación de cliente.
  // Un spinner sería teatro de loading para una acción que no existe.

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
    if (isSubmitted) {
      sentRef.current?.focus()
    }
  }, [isSubmitted])

  const validateEmail = (value) => {
    const clean = String(value ?? '').trim()
    if (!clean) return ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(clean) ? '' : 'Escribe un correo válido, por ejemplo nombre@correo.com'
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    if (touched) {
      setEmailError(validateEmail(value))
    }
  }

  const handleEmailBlur = () => {
    setTouched(true)
    setEmailError(validateEmail(email))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    const error = validateEmail(email)
    setEmailError(error)
    if (!error && email.trim()) {
      setIsSubmitted(true)
    }
  }

  const handleReset = () => {
    setEmail('')
    setEmailError('')
    setIsSubmitted(false)
    setTouched(false)
    requestAnimationFrame(() => emailRef.current?.focus())
  }

  const isEmailValid = email.trim() && !emailError

  return (
    <div className="login-split">
      {/* Lado izquierdo: formulario */}
      <div className="login-left">
        <Link href="/" className="login-back">
          <FiArrowLeft className="login-back-icon" />
          Volver al sitio
        </Link>

        <div className="login-card">
          <div className="login-brand">
            <div className="login-brand-icon" />
            <span className="login-brand-name">SCAN SAY DONE</span>
          </div>

          {!isSubmitted ? (
            <>
              <h1 id="login-heading" className="login-title">
                LEE LO QUE
                <br />
                TE DICEN
              </h1>
              <p className="login-subtitle">
                Escribe tu correo y te enviamos un enlace. Sin contraseña.
              </p>

              {isOffline && (
                <div className="login-offline" role="alert">
                  <FiAlertTriangle className="login-error-icon" />
                  Sin conexión a internet
                </div>
              )}

              <form className="login-form" onSubmit={handleSubmit} noValidate aria-labelledby="login-heading">
                <div>
                  <label htmlFor="email" className="login-label">
                    Tu correo
                  </label>
                  <input
                    id="email"
                    ref={emailRef}
                    type="email"
                    autoComplete="email"
                    spellCheck={false}
                    className={`login-input ${emailError ? 'is-invalid' : ''}`}
                    placeholder="nombre@correo.com"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    aria-describedby={emailError ? 'email-error' : undefined}
                    aria-invalid={emailError ? 'true' : undefined}
                  />
                  {emailError && (
                    <div id="email-error" className="login-error">
                      <FiAlertTriangle className="login-error-icon" />
                      {emailError}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="login-btn-primary"
                  disabled={!isEmailValid || isOffline}
                >
                  ENVIARME EL ENLACE
                </button>

                <div className="login-divider" aria-hidden="true" />

                <Link href="/#panel" className="login-link-demo">
                  Ver la demo del panel
                </Link>

                <p className="login-legal">
                  Al continuar aceptas los{' '}
                  <Link href="/terms">Términos</Link> y la{' '}
                  <Link href="/privacy">Política de privacidad</Link>
                </p>
              </form>
            </>
          ) : (
            <div className="login-sent" ref={sentRef} tabIndex={-1} role="status">
              <div className="login-sent-icon">
                <FiCheck size={32} />
              </div>
              <h1 className="login-sent-title">Revisa tu correo</h1>
              <p className="login-sent-email">{email}</p>
              <div className="login-sent-demo">
                <span>DEMO · no se envía ningún correo</span>
              </div>
              <button type="button" className="login-btn-secondary" onClick={handleReset}>
                Usar otro correo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lado derecho: mock decorativo */}
      <div className="login-right">
        <div className="login-right-wordmark" aria-hidden="true">SCAN SAY DONE</div>

        <div className="login-stack" aria-hidden="true">
          <div className="login-deck">
            <span className="login-deck-title">VISTA DEL PANEL</span>
            <div className="login-deck-row"><span className="login-deck-dot" /><span className="login-deck-bar" /></div>
            <div className="login-deck-row"><span className="login-deck-dot" /><span className="login-deck-bar" /></div>
            <div className="login-deck-row"><span className="login-deck-dot" /><span className="login-deck-bar" /></div>
          </div>

          <div className="login-mock" aria-hidden="true">
            <div className="login-mock-header">
              <span className="login-mock-title">VISTA DE ENCUESTA</span>
              <span className="login-mock-badge">DEMO</span>
            </div>

            <p className="login-mock-question">¿Cómo fue tu atención?</p>

            <div className="login-mock-scale">
              <div className="login-mock-tile">1</div>
              <div className="login-mock-tile">2</div>
              <div className="login-mock-tile">3</div>
              <div className="login-mock-tile">4</div>
              <div className="login-mock-tile is-active">5</div>
            </div>

            <span className="login-mock-btn">
              Enviar
            </span>
          </div>
        </div>

        <p className="login-run">EL CLIENTE ESCANEA · CONTESTA · TÚ LO LEES</p>
        <p className="login-note">ejemplo de referencia · sin funciones</p>
        <p className="login-right-phrase">Panel en construcción. Te avisamos cuando esté.</p>
      </div>
    </div>
  )
}
