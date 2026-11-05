'use client'

import Link from 'next/link'
import {
  PANEL_QUESTIONS,
  PANEL_DEMO_ROWS,
  PANEL_TOTALS,
  PANEL_TOTAL_RESPONSES,
  PANEL_SCALE_LABELS,
} from '@/app/data/panel-demo'
import { usePanelDemo } from './panel-demo-context'

export default function PanelPage() {
  const { isDemo, setIsDemo } = usePanelDemo()

  const totalResponses = isDemo ? PANEL_TOTAL_RESPONSES : 0
  const previewRows = PANEL_DEMO_ROWS.slice(0, 5)

  return (
    <>
      <h1 className="panel-title">LO QUE DICEN TUS CLIENTES</h1>
      <p className="panel-sub">
        Las respuestas de tus clientes, ordenadas por pregunta.
      </p>
      {isDemo && (
        <p className="panel-scale-note">
          Cada pregunta se califica del 1 (muy mala) al 5 (muy buena).
        </p>
      )}

      {/* Resumen por pregunta — 3 tarjetas de distribución */}
      <section className="panel-summary" aria-labelledby="resumen-title">
        <h2 id="resumen-title" className="sr-only">
          Resumen por pregunta
        </h2>
        {PANEL_QUESTIONS.map((q, qi) => (
          <article className="panel-card" key={q.id}>
            <h3 className="panel-card-q">{q.label}</h3>
            {isDemo ? (
              <div className="panel-bars">
                {PANEL_TOTALS[qi].map((n, i) => (
                  <div
                    className="panel-bar-row"
                    key={i}
                    aria-label={`${n} de ${totalResponses} dijeron ${PANEL_SCALE_LABELS[i]}`}
                  >
                    <span className="panel-bar-digit">{i + 1}</span>
                    <span className="panel-bar-track">
                      <span
                        className="panel-bar-fill"
                        style={{ width: `${(n / totalResponses) * 100}%` }}
                      />
                    </span>
                    <span className="panel-bar-count">{n}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="panel-card-empty">
                <span className="panel-card-dash">—</span>
                <span>Sin respuestas</span>
              </div>
            )}
            {isDemo && (
              <p className="panel-card-foot">
                <span className="panel-card-total">{totalResponses}</span>
                <span className="panel-card-total-label">RESPUESTAS</span>
              </p>
            )}
          </article>
        ))}
      </section>

      {/* Badge + línea aclaratoria — la nota es región aria-live y vive siempre */}
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
          {/* Preview de últimas 5 respuestas */}
          <section aria-labelledby="ultimas-title">
            <h2 id="ultimas-title" className="panel-bandeja-overline">
              ÚLTIMAS RESPUESTAS
            </h2>
            <table className="panel-table">
              <caption className="sr-only">
                Las 5 respuestas más recientes
              </caption>
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
                {previewRows.map((row, ri) => (
                  <tr key={ri}>
                    <td data-label="Fecha">
                      <time dateTime={row.iso} title={row.iso}>
                        {row.when}
                      </time>
                    </td>
                    <td data-label="Canal" className="panel-td-channel">
                      {row.channel}
                    </td>
                    {row.answers.map((a, ai) => (
                      <td key={ai} data-label={PANEL_QUESTIONS[ai].label}>
                        <span className="panel-chip">{a}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <Link href="/panel/respuestas" className="panel-table-more">
              Ver todas las respuestas
            </Link>
          </section>
        </>
      ) : (
        <div className="panel-empty">
          <p className="panel-empty-overline">AÚN NADA QUE LEER</p>
          <p className="panel-empty-title">Aún no hay respuestas</p>
          <p className="panel-empty-text">
            Cuando alguien escanee tu QR y conteste, lo verás acá.
          </p>
          <button
            type="button"
            className="panel-btn-ghost"
            onClick={() => setIsDemo(true)}
          >
            Ver con datos de ejemplo
          </button>
        </div>
      )}
    </>
  )
}
