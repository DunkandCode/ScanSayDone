import Link from 'next/link'
import PageHero from '../components/page-hero/page-hero'
import Navlight from '../components/navbar/navlight'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'

export const metadata = {
  title: 'Privacidad — Scan-Say-Done',
  description: 'Qué guarda Scan-Say-Done: las respuestas, sin nombre ni correo, con su fecha y su canal, y el correo del dueño. Retención y derechos, en revisión legal.',
}

export default function Privacy() {
  return (
    <>
     <Navlight/> 

      <PageHero
        kicker="TUS DATOS"
        title="QUÉ DATOS GUARDAMOS"
        lead="La encuesta no pide nombre, correo ni teléfono. Se guardarán las respuestas y lo que tú registres para entrar al panel."
        breadcrumb="Privacidad"
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
                <div className="col-lg-9">
                    <div className="card bg-light shadow border-0 rounded">
                        <div className="card-body">
                            <div className="alert alert-warning" role="alert">
                                <b>Documento en revisión legal.</b> Los datos de la entidad (razón social, RUT y domicilio), la norma aplicable y los plazos de retención se publicarán una vez completada la revisión por un abogado.
                            </div>

                            <p className="text-muted">La encuesta no pide nombre, correo ni teléfono. Se guardarán las respuestas y lo que tú registres para entrar al panel.</p>

                            <p className="text-muted">Hoy el producto no está en línea: no se está recogiendo ninguna respuesta ni ningún dato.</p>

                            <h2 className="h5 card-title mt-4">1. Quién responde la encuesta</h2>
                            <p className="text-muted">Guardamos la calificación, el comentario si lo escribe, la fecha y el canal por el que llegó la respuesta. No pedimos identificación. Si alguien escribe su nombre dentro del comentario, eso es texto libre, no un dato que hayamos pedido.</p>

                            <h2 className="h5 card-title mt-4">2. El dueño del negocio</h2>
                            <p className="text-muted">Guardaremos tu correo para que puedas entrar al panel y para responderte.</p>

                            <h2 className="h5 card-title mt-4">3. Para qué</h2>
                            <p className="text-muted">Para mostrarte las opiniones, ordenar los avisos que necesitan acción y responderte cuando escribes. No usamos estos datos para publicidad de terceros ni los vendemos.</p>

                            <h2 className="h5 card-title mt-4">4. Cuánto tiempo</h2>
                            <p className="text-muted">No se declara un plazo hasta que la revisión legal defina retención y procedimiento de baja.</p>

                            <h2 className="h5 card-title mt-4">5. Quién más los ve</h2>
                            <p className="text-muted">Solo el hosting y el servicio de correo, cuando tratan datos por nuestra cuenta, y las autoridades cuando la ley lo exige.</p>

                            <h2 className="h5 card-title mt-4">6. Tus derechos</h2>
                            <p className="text-muted">Puedes pedir acceso, rectificación, cancelación u oposición al tratamiento escribiendo al correo de contacto. El medio de acreditación de identidad se publicará una vez validado por un abogado.</p>

                            <h2 className="h5 card-title mt-4">7. Norma aplicable</h2>
                            <p className="text-muted">La referencia legal vigente y la jurisdicción se publicarán una vez completada la revisión legal.</p>

                            <h2 className="h5 card-title mt-4">8. Cambios y contacto</h2>
                            <p className="text-muted">Cualquier cambio se publica en esta página con su fecha. Dudas de privacidad, por correo.</p>

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
