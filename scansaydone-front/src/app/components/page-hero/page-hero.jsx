import Image from 'next/image'
import Link from 'next/link'
import { SITE } from '../../data/site'

export default function PageHero({
  kicker,
  title,
  lead,
  breadcrumb,
  imageSrc,
  imageAlt,
  imageWidth = 900,
  imageHeight = 675,
}) {
  return (
    <section className={`page-hero${imageSrc ? ' page-hero--with-image' : ''}`}>
      <div className="container-xl">
        <div className="page-hero__inner">
          <div className="page-hero__text">
            <nav aria-label="Ruta de navegación">
              <ol className="page-hero__breadcrumb breadcrumb mb-0 p-0">
                <li className="breadcrumb-item">
                  <Link href="/">{SITE.name}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {breadcrumb}
                </li>
              </ol>
            </nav>
            {kicker && <span className="section-kicker section-kicker--on-dark">{kicker}</span>}
            <h1 className="page-hero__title">{title}</h1>
            {lead && <p className="page-hero__lead">{lead}</p>}
          </div>
          {imageSrc && (
            <figure className="page-hero__media">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                sizes="(max-width: 991.98px) 100vw, 420px"
                priority
              />
            </figure>
          )}
        </div>
      </div>
    </section>
  )
}
