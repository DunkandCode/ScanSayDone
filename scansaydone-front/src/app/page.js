import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiSmartphone, FiMonitor, FiInstagram, FiMessageCircle, FiVideo, FiCalendar, FiBarChart2 } from 'react-icons/fi';

import Navlight from "./components/navbar/navlight";
import LogoSymbol from "./components/brand/logo-symbol";
import Footer from "./components/footer";
import ScrollToTop from "./components/scroll-to-top";
import { SITE, hasPricing } from "./data/site";
import { productFaqData } from "./data/faq-product";
import { contactHref } from "./lib/contact";

export default function Home() {
  return (
    <>
      <Navlight/>

      <section className="hero-band">
        <div className="container-xl">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="hero-kicker">3 PREGUNTAS. UN QR. LISTO.</span>
              <h1 className="hero-title">¿QUÉ DICEN<br/>TUS <span className="hero__accent">CLIENTES?</span></h1>
              <p className="hero-subtitle">Tus clientes responden tres preguntas desde el navegador. Las respuestas quedan ordenadas en tu panel.</p>
              <div className="hero-cta-group">
                <Link href={contactHref()} className="btn btn-primary btn-lg">Crear mi encuesta <FiArrowRight aria-hidden="true" /></Link>
                <Link href="#como-funciona" className="btn btn-outline-light btn-lg">Ver los pasos</Link>
              </div>
              <p className="hero-transparency">Tú entras con tu correo, sin contraseña y sin app.</p>
            </div>
            <div className="col-lg-5 mt-5 mt-lg-0">
              <div className="hero-phone-wrap" aria-hidden="true">
                <span className="hero-phone-badge">3 preguntas</span>
                <div className="hero-phone-card">
                  <div className="hero-phone-header">
                    <LogoSymbol size={22} />
                    <span>Scan-Say-Done</span>
                  </div>
                  <p className="hero-phone-question">¿Cómo fue tu atención?</p>
                  <div className="hero-phone-scale">
                    <span className="hero-phone-scale-btn">
                      <span className="hero-phone-scale-num">1</span>
                      <span className="hero-phone-scale-label">Muy mala</span>
                    </span>
                    <span className="hero-phone-scale-btn">
                      <span className="hero-phone-scale-num">2</span>
                      <span className="hero-phone-scale-label">Mala</span>
                    </span>
                    <span className="hero-phone-scale-btn">
                      <span className="hero-phone-scale-num">3</span>
                      <span className="hero-phone-scale-label">Regular</span>
                    </span>
                    <span className="hero-phone-scale-btn">
                      <span className="hero-phone-scale-num">4</span>
                      <span className="hero-phone-scale-label">Buena</span>
                    </span>
                    <span className="hero-phone-scale-btn hero-phone-scale-btn--active">
                      <span className="hero-phone-scale-num">5</span>
                      <span className="hero-phone-scale-label">Muy buena</span>
                    </span>
                  </div>
                  <div className="hero-phone-comment">
                    <span className="hero-phone-comment-field">¿Algún comentario?</span>
                  </div>
                  <span className="hero-phone-submit">Enviar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="position-relative">
        <div className="shape overflow-hidden text-white">
            <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation" aria-hidden="true">
                <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
            </svg>
        </div>
      </div>

      <section id="como-funciona" className="how">
        <div className="container-xl">
          <div className="how__head">
            <div className="how__headline">
              <span className="section-kicker">SIMPLE Y RÁPIDO</span>
              <h2 className="how__title">ASÍ FUNCIONA</h2>
            </div>
            <Link href="#panel" className="btn btn-outline-dark d-none d-md-inline-flex">Ver ejemplo de encuesta</Link>
          </div>
          <p className="how__lead">Tú lo armas en minutos. El cliente responde en segundos.</p>
          <div className="row g-4 mt-4">
            <div className="col-md-4">
              <div className="how__step">
                <span className="how__badge">1</span>
                <h3 className="how__step-title">ESCANEA</h3>
                <p className="how__step-body">Tus clientes escanean el QR del mostrador o tocan el enlace de tus redes. El mismo QR sirve para siempre.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="how__step">
                <span className="how__badge">2</span>
                <h3 className="how__step-title">OPINA</h3>
                <p className="how__step-body">Tres preguntas, una por pantalla. Sin registro y sin datos personales.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="how__step">
                <span className="how__badge">3</span>
                <h3 className="how__step-title">LISTO</h3>
                <p className="how__step-body">Terminó su opinión: la lees en tu panel, desde el celular.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="canales" className="canales">
        <div className="container-xl">
          <div className="canales__head">
            <span className="section-kicker">SIEMPRE CERCA DE TUS CLIENTES</span>
            <h2 className="canales__title">TUS CUATRO CANALES</h2>
          </div>
          <p className="canales__lead">Donde ya está tu cliente: el local, sus redes y el chat.</p>
          <div className="row g-4 mt-5">
            <div className="col-12 col-lg-6 col-xl-3">
              <div className="canales__card">
                <span className="canales__card-index" aria-hidden="true">01</span>
                <div className="canales__card-icon-wrap" aria-hidden="true">
                  <FiMonitor className="canales__card-icon" aria-hidden="true" />
                </div>
                <h3 className="canales__card-title">EN EL MOSTRADOR</h3>
                <p className="canales__card-desc">Coloca el QR en la mesa o el mesón. El cliente escanea, responde y sigue su día.</p>
                <div className="canales__card-label">QR impreso en la mesa</div>
              </div>
            </div>
            <div className="col-12 col-lg-6 col-xl-3">
              <div className="canales__card">
                <span className="canales__card-index" aria-hidden="true">02</span>
                <div className="canales__card-icon-wrap" aria-hidden="true">
                  <FiInstagram className="canales__card-icon" aria-hidden="true" />
                </div>
                <h3 className="canales__card-title">INSTAGRAM</h3>
                <p className="canales__card-desc">Tus seguidores opinan desde el enlace de tu bio o de tus historias.</p>
                <div className="canales__card-label">Enlace en la bio</div>
              </div>
            </div>
            <div className="col-12 col-lg-6 col-xl-3">
              <div className="canales__card">
                <span className="canales__card-index" aria-hidden="true">03</span>
                <div className="canales__card-icon-wrap" aria-hidden="true">
                  <FiMessageCircle className="canales__card-icon" aria-hidden="true" />
                </div>
                <h3 className="canales__card-title">WHATSAPP</h3>
                <p className="canales__card-desc">Envías el enlace por WhatsApp después de la venta. Responden simple, desde el navegador.</p>
                <div className="canales__card-label">Enlace en el chat</div>
              </div>
            </div>
            <div className="col-12 col-lg-6 col-xl-3">
              <div className="canales__card">
                <span className="canales__card-index" aria-hidden="true">04</span>
                <div className="canales__card-icon-wrap" aria-hidden="true">
                  <FiVideo className="canales__card-icon" aria-hidden="true" />
                </div>
                <h3 className="canales__card-title">TIKTOK LIVE</h3>
                <p className="canales__card-desc">Muestras el QR o el enlace en pantalla durante tus lives. Tu público deja su opinión.</p>
                <div className="canales__card-label">QR o enlace en pantalla</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          APLICACIONES — "Así se ve en tu local" (F5)
          3 tarjetas con foto 4/3 + caption: dos ilustraciones de ambiente
          y una captura real de la pantalla de encuesta.
          ========================================================================== */}
      <section id="aplicaciones" className="apps">
        <div className="container-xl">
          <div className="apps__head">
            <span className="section-kicker">APLICACIONES</span>
            <h2 className="apps__title">ASÍ SE VE EN TU LOCAL</h2>
          </div>

          {/* Cartel de mesa: ilustración de ambiente (portatarjetas en blanco) */}
          <div className="row g-4 mt-4">
            <div className="col-12 col-lg-4">
              <figure className="apps__card">
                <div className="apps__frame">
                  <Image
                    src="/images/apps/cartel-mesa.jpg"
                    alt="Mesa de café junto a un ventanal, con un portatarjetas de sobremesa que muestra un código QR y una taza de café."
                    width={728}
                    height={546}
                    sizes="(max-width: 991px) 92vw, 364px"
                  />
                </div>
                <figcaption className="apps__caption">
                  <span className="apps__caption-title">Cartel de mesa</span>
                  <span className="apps__caption-body">En la mesa, junto al plato o la cuenta.</span>
                </figcaption>
              </figure>
            </div>
            <div className="col-12 col-lg-4">
              <figure className="apps__card">
                <div className="apps__frame">
                  <Image
                    src="/images/apps/pantalla-encuesta.jpg"
                    alt="La encuesta en pantalla: cinco opciones de 1 a 5, la quinta marcada, y el botón Enviar."
                    width={728}
                    height={546}
                    sizes="(max-width: 991px) 92vw, 364px"
                  />
                </div>
                <figcaption className="apps__caption">
                  <span className="apps__caption-title">Pantalla de encuesta</span>
                  <span className="apps__caption-body">Lo que ve tu cliente: del 1 al 5, una pregunta por vez.</span>
                </figcaption>
              </figure>
            </div>
            <div className="col-12 col-lg-4">
              <figure className="apps__card">
                <div className="apps__frame">
                  <Image
                    src="/images/apps/vinilo-vitrina.jpg"
                    alt="Vitrina de un local con marco de madera y un adhesivo pegado en el vidrio que muestra un código QR, con la calle reflejada."
                    width={728}
                    height={546}
                    sizes="(max-width: 991px) 92vw, 364px"
                  />
                </div>
                <figcaption className="apps__caption">
                  <span className="apps__caption-title">Vinilo de vitrina</span>
                  <span className="apps__caption-body">El QR a la calle, para quien solo pasa.</span>
                </figcaption>
              </figure>
            </div>
          </div>
          <p className="apps__note">Las fotos de ambiente son ilustraciones; la encuesta y el panel son capturas reales del producto.</p>
        </div>
      </section>

      {/* ==========================================================================
          PANEL — "Todo en una pantalla" (F6)
          Captura real del panel (/panel) con datos de ejemplo.
          ========================================================================== */}
      <section id="panel" className="panel-preview">
        <div className="container-xl">
          <div className="row align-items-lg-center">
            <div className="col-lg-4 order-lg-2">
              <div className="panel-preview__head">
                <div className="panel-preview__headline">
                  <span className="section-kicker">TUS OPINIONES, EN UN PANEL</span>
                  <h2 className="panel-preview__title">TODO EN UNA PANTALLA</h2>
                </div>
                <Link href="/panel" className="btn btn-outline-dark panel-preview__cta">
                  VER EL PANEL
                </Link>
              </div>
              <p className="panel-preview__note">El panel ya funciona: se puede ver con datos de ejemplo.</p>
              <p className="panel-preview__subtitle">Entras, lees las respuestas por pregunta, ves la tabla. Nada que configurar de más.</p>
              <ul className="panel-preview__bullets">
                <li>
                  <FiCalendar className="panel-preview__bullet-icon" aria-hidden="true" />
                  <span>Opiniones con fecha y canal: mostrador, Instagram, WhatsApp o live.</span>
                </li>
                <li>
                  <FiBarChart2 className="panel-preview__bullet-icon" aria-hidden="true" />
                  <span>Cada pregunta se resume del 1 al 5 en una tarjeta.</span>
                </li>
                <li>
                  <FiSmartphone className="panel-preview__bullet-icon" aria-hidden="true" />
                  <span>Lo abres en el celular entre un cliente y otro.</span>
                </li>
              </ul>
            </div>
            <div className="col-lg-8 order-lg-1 mt-4 mt-lg-0">
              <div className="panel-preview__frame">
                <Image
                  src="/images/apps/panel-captura.png"
                  alt="Panel de Scan-Say-Done con datos de ejemplo: tres tarjetas de resultados por pregunta y la tabla de últimas respuestas."
                  width={1160}
                  height={806}
                  sizes="(max-width: 991px) 92vw, 872px"
                  className="panel-preview__shot"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          PRECIOS — Seccion de planes (F7)
          Gated por SITE.features.showPricing + 3 planes con precio.
          No se renderiza ni enlaza hasta tener montos reales.
          ========================================================================== */}
      {hasPricing() && (
        <section id="precios" className="pricing">
          <div className="container-xl">
            <span className="section-kicker">Sin permanencia</span>
            <h2 className="pricing__title">PLANES</h2>
            <div className="row g-4 mt-4">
              {SITE.plans.map((plan, idx) => {
                // Orden del DOM: recomendado (idx 0) → básico (idx 1) → negocio (idx 2)
                // Orden visual en lg+: básico (order-lg-1) → recomendado (order-lg-2) → negocio (order-lg-3)
                const orderClass = idx === 0 ? 'order-lg-2' : idx === 1 ? 'order-lg-1' : 'order-lg-3';
                const isRecommended = idx === 0;

                return (
                  <div key={plan.id} className={`col-12 col-lg-4 ${orderClass}`}>
                    <div className={`pricing__card ${isRecommended ? 'pricing__card--recommended' : ''}`}>
                      {isRecommended && <span className="pricing__badge">RECOMENDADO</span>}
                      <h3 className="pricing__card-name">{plan.name}</h3>
                      <p className="pricing__card-forwho">{plan.forWho}</p>
                      <div className="pricing__card-price">
                        <span className="pricing__card-price-amount">{plan.price}</span>
                        <span className="pricing__card-price-period">/ mes</span>
                      </div>
                      <ul className="pricing__card-features">
                        {plan.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                      <a
                        href={plan.cta.href}
                        className={`btn ${plan.cta.variant === 'primary' || isRecommended ? 'btn-primary' : 'btn-outline-dark'}`}
                      >
                        {plan.cta.label}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================================================
          FAQ — Preguntas frecuentes (F8)
          Acordeón Bootstrap con 5 preguntas + 6.ª condicional (pricing).
          Banda crema, container-lg, col-lg-8 offset-lg-2.
          ========================================================================== */}
      <section id="faq" className="faq">
        <div className="container-lg">
          <div className="row justify-content-center">
            <div className="col-lg-8 offset-lg-2">
              <div className="faq__head">
                <span className="section-kicker">DUDAS COMUNES</span>
                <h2 className="faq__title">PREGUNTAS FRECUENTES</h2>
              </div>

              <div className="accordion faq__accordion" id="faqAccordion">
                {productFaqData
                  .filter(item => !item.requiresPricing || hasPricing())
                  .map((item, idx) => (
                    <div className="accordion-item" key={item.id}>
                      <h3 className="accordion-header">
                        <button
                          className={`accordion-button${idx === 0 ? '' : ' collapsed'}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#faq-collapse-${item.id}`}
                          aria-expanded={idx === 0 ? 'true' : 'false'}
                          aria-controls={`faq-collapse-${item.id}`}
                        >
                          {item.q}
                        </button>
                      </h3>
                      <div
                        id={`faq-collapse-${item.id}`}
                        className={`accordion-collapse collapse${idx === 0 ? ' show' : ''}`}
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <p className="faq__footer">
                ¿Otra duda? <Link href={contactHref()} className="faq__footer-link">Escríbenos</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          CTA FINAL — Llamada a la acción final (F8)
          Banda ciruela, contenido centrado, botón coral.
          ========================================================================== */}
      <section id="cta-final" className="cta-final">
        <div className="container-lg">
          <div className="cta-final__content">
            <span className="section-kicker section-kicker--on-dark">COMIENZA HOY</span>
            <h2 className="cta-final__title">CREA TU PRIMERA ENCUESTA</h2>
            <p className="cta-final__subtitle">Del QR a la primera opinión, sin equipo técnico.</p>
            <Link href={contactHref()} className="btn btn-primary cta-final__btn">
              Crear mi primera encuesta
            </Link>
            <p className="cta-final__honesty">
              Si no recibes clientes en el local ni vendes por redes, hoy esto todavía no te sirve.
            </p>
          </div>
        </div>
      </section>

    <Footer/>

    <ScrollToTop/>

   
    </>
  );
}
