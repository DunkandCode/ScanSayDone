'use client'

import { useState, useRef, useCallback } from 'react'
import { PANEL_QUESTIONS, PANEL_CHANNELS, PANEL_DEMO_ROWS } from '@/app/data/panel-demo'
import { usePanelDemo } from '../panel-demo-context'

export default function RespuestasPage() {
  const { isDemo } = usePanelDemo()
  const [activeChannel, setActiveChannel] = useState(0)
  const chipsRef = useRef(null)

  const handleChipKeyDown = useCallback((e, index) => {
    const chips = chipsRef.current?.querySelectorAll('[role="radio"]')
    if (!chips) return

    let newIndex = index
    if (e.key === 'ArrowRight') {
      newIndex = (index + 1) % chips.length
      e.preventDefault()
    } else if (e.key === 'ArrowLeft') {
      newIndex = (index - 1 + chips.length) % chips.length
      e.preventDefault()
    }

    if (newIndex !== index) {
      chips[newIndex].focus()
      setActiveChannel(newIndex)
    }
  }, [])

  const handleChipClick = useCallback((index) => {
    setActiveChannel(index)
    const chips = chipsRef.current?.querySelectorAll('[role="radio"]')
    chips?.[index]?.focus()
  }, [])

  return (
    <>
      <h1 className="panel-title">TODAS TUS RESPUESTAS</h1>
      <p className="panel-sub">Las respuestas de tus clientes, del más reciente al más antiguo.</p>

      <div className="panel-filters">
        <div className="panel-chips" role="radiogroup" aria-label="Filtrar por canal" ref={chipsRef}>
          {PANEL_CHANNELS.map((channel, index) => (
            <button
              key={channel}
              type="button"
              role="radio"
              aria-checked={activeChannel === index}
              tabIndex={activeChannel === index ? 0 : -1}
              className={`panel-chip-btn ${activeChannel === index ? 'is-active' : ''}`}
              disabled={!isDemo}
              aria-disabled={!isDemo}
              onClick={() => handleChipClick(index)}
              onKeyDown={(e) => handleChipKeyDown(e, index)}
            >
              {channel}
            </button>
          ))}
        </div>

        <div className="panel-dates">
          <label className="panel-date-label">
            Desde
            <input type="date" className="panel-date-input" disabled={!isDemo} />
          </label>
          <label className="panel-date-label">
            Hasta
            <input type="date" className="panel-date-input" disabled={!isDemo} />
          </label>
        </div>
      </div>

      {/* La nota es región aria-live y vive siempre */}
      {isDemo && (
        <div className="panel-demo-row">
          <span className="panel-demo-badge">DATOS DE EJEMPLO</span>
        </div>
      )}
      <p className="panel-demo-note" aria-live="polite">
        {isDemo ? 'Mostrando datos de ejemplo. No vienen de clientes reales.' : null}
      </p>

      {isDemo ? (
        <>
          <table className="panel-table">
            <caption className="sr-only">Respuestas de tus clientes, más recientes primero</caption>
            <thead>
              <tr>
                <th scope="col">Fecha</th>
                <th scope="col">Canal</th>
                {PANEL_QUESTIONS.map((q) => (
                  <th scope="col" key={q.id}>
                    {q.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PANEL_DEMO_ROWS.map((row, index) => (
                <tr key={index}>
                  <td data-label="Fecha">{row.when}</td>
                  <td data-label="Canal">{row.channel}</td>
                  {row.answers.map((answer, ai) => (
                    <td key={ai} data-label={PANEL_QUESTIONS[ai].label}>
                      <span className="panel-chip">{answer}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="panel-empty">
          <p className="panel-empty-overline">AÚN NADA QUE LEER</p>
          <p className="panel-empty-title">Aún no hay respuestas</p>
          <p className="panel-empty-text">Cuando alguien escanee tu QR y conteste, lo verás acá.</p>
        </div>
      )}
    </>
  )
}
