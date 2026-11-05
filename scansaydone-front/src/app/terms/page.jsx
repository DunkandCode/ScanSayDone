import Link from 'next/link'
import PageHero from '../components/page-hero/page-hero'
import Navlight from '../components/navbar/navlight'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'

export const metadata = {
  title: 'Términos de uso — Scan-Say-Done',
  description: 'Términos de uso de Scan-Say-Done: qué puedes hacer con la encuesta y el panel, límites de uso aceptable, cambios y contacto. En revisión legal.',
}

export default function Terms() {
  return (
    <>
        <Navlight/>  

        <PageHero
          kicker="ACUERDO DE USO"
          title="TÉRMINOS DE USO"
          lead="Son las reglas para usar este sitio y, cuando estén disponibles, la encuesta y el panel. Están en revisión: un abogado tiene que validarlos antes de publicar."
          breadcrumb="Términos de uso"
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
                <div className="row justify-content-center mt-5 pt-2">
                    <div className="col-lg-9">
                        <div className="card bg-light shadow border-0 rounded">
                            <div className="card-body">
                                <div className="alert alert-warning" role="alert">
                                    <b>Documento en revisión legal.</b> Los datos de la entidad (razón social, RUT y domicilio) y la jurisdicción aplicable se publicarán aquí una vez completada la revisión por un abogado.
                                </div>

                                <p className="text-muted">Son las reglas para usar este sitio y, cuando estén disponibles, la encuesta y el panel. Están en revisión: un abogado tiene que validarlos antes de publicar.</p>

                                <h2 className="h5 card-title mt-4">1. Quién publica esto</h2>
                                <p className="text-muted">La entidad detrás de Scan-Say-Done se publicará una vez completada la revisión legal. Sin esos datos, este documento no obliga a nadie, incluido tú.</p>

                                <h2 className="h5 card-title mt-4">2. Al usar esto aceptas</h2>
                                <p className="text-muted">Al navegar el sitio o usar la encuesta aceptas estas reglas. Si no estás de acuerdo con alguna, no uses el sitio.</p>

                                <h2 className="h5 card-title mt-4">3. Lo que puedes hacer</h2>
                                <p className="text-muted">Crear tu encuesta, publicarla por QR o enlace en tus propios canales, recibir respuestas y leerlas en el panel. El contenido que subas y las respuestas que recibas serán tuyos.</p>

                                <h2 className="h5 card-title mt-4">4. Lo que no puedes hacer</h2>
                                <p className="text-muted">Usar la encuesta para pedir datos personales de tus clientes, publicar contenido ilegal o que no sea tuyo, intentar entrar en cuentas ajenas, automatizar respuestas contra el servicio, o revenderlo como producto propio.</p>

                                <h2 className="h5 card-title mt-4">5. Cómo funciona hoy, y puede cambiar</h2>
                                <p className="text-muted">El servicio está en preparación y puede cambiar sin aviso: funciones, pantallas y disponibilidad. Hoy no hay precios, pagos ni contratos firmados; si llegan, se publican antes de que alguien pague nada.</p>

                                <h2 className="h5 card-title mt-4">6. Cambios en estos términos</h2>
                                <p className="text-muted">Podemos modificarlos. Vale la versión publicada en esta página, con su fecha de actualización.</p>

                                <h2 className="h5 card-title mt-4">7. Hasta dónde llegamos</h2>
                                <p className="text-muted">El servicio se entrega tal como está. No respondemos por ventas perdidas ni por decisiones que tomes a partir de las opiniones. Nuestros datos y tu cuenta se rigen por la <Link href="/privacy" className="text-muted text-decoration-underline">Política de privacidad</Link>.</p>

                                <h2 className="h5 card-title mt-4">8. Ley y contacto</h2>
                                <p className="text-muted">La ley y los tribunales aplicables se publicarán una vez completada la revisión legal. Cualquier duda sobre este documento, por correo.</p>

                                <Link href="/contactus" className="btn btn-primary mt-3">Escríbenos</Link>

                                <p className="text-muted mt-4 mb-0 small">Este texto está en revisión legal antes de la publicación.</p>
                            </div>
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
