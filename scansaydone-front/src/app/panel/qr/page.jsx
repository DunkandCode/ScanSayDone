import { FiGrid } from 'react-icons/fi'

export default function QrPage() {
  return (
    <>
      <h1 className="panel-title">ASÍ CONTESTAN TUS CLIENTES</h1>
      <p className="panel-sub">
        Tu marcador todavía está vacío. Cuando alguien escanee, verás las respuestas acá.
      </p>

      <div className="panel-qr-grid">
        {/* Columna izquierda — tarjeta del QR */}
        <div className="panel-card panel-qr-card">
          <div className="panel-qr-head">
            <span className="panel-overline">TU QR</span>
            <span className="panel-qr-badge">DEMO</span>
          </div>

          <div className="panel-qr-frame">
            <div className="panel-qr-slot">
              <FiGrid size={48} aria-hidden="true" />
              <span className="panel-qr-slot-text">Aquí va tu QR</span>
            </div>
          </div>

          <p className="panel-qr-note">Todavía no hay QR.</p>
        </div>

        {/* Columna derecha — tarjeta de instrucciones */}
        <div className="panel-card panel-instructions-card">
          <span className="panel-overline">ASÍ LLEGA A TUS CLIENTES</span>

          <ol className="panel-steps">
            <li className="panel-step">
              <span className="panel-step-num" aria-hidden="true">1</span>
              <div className="panel-step-body">
                <span className="panel-step-title">ESCANEA</span>
                <span className="panel-step-text">Con la cámara del móvil, sin app.</span>
              </div>
            </li>
            <li className="panel-step">
              <span className="panel-step-num" aria-hidden="true">2</span>
              <div className="panel-step-body">
                <span className="panel-step-title">CONTESTA</span>
                <span className="panel-step-text">Tres preguntas del 1 al 5. Sin nombre.</span>
              </div>
            </li>
            <li className="panel-step">
              <span className="panel-step-num" aria-hidden="true">3</span>
              <div className="panel-step-body">
                <span className="panel-step-title">LEES</span>
                <span className="panel-step-text">Lo lees acá, en Respuestas.</span>
              </div>
            </li>
          </ol>

          <span className="panel-overline panel-overline-link">ENLACE DE TU ENCUESTA</span>

          <div className="panel-link-row">
            <input
              type="text"
              className="panel-link-field"
              readOnly
              value="https://tu-dominio/e/XXXXXXXX"
              aria-label="Enlace de tu encuesta"
            />
            <span className="panel-link-suffix" aria-hidden="true">· ejemplo</span>
          </div>

          <p className="panel-qr-honesty">
            El QR y el enlace reales llegan con el backend.
            <br />
            Hoy el marcador está vacío y el enlace no abre nada.
          </p>
        </div>
      </div>
    </>
  )
}
