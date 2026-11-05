'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoSymbol from '../brand/logo-symbol';
import { SITE } from '../../data/site';

export default function Navlight() {
    let [toggle, setToggle] = useState(false);

    let current = usePathname();

    useEffect(()=>{
        if (!window.location.hash) window.scrollTo(0, 0);
    },[current])

    return (
        <header id="topnav" className="defaultscroll">
            <div className="container">
                <Link className="logo" href="/" aria-label="Scan-Say-Done — inicio">
                    <LogoSymbol
                        size={36}
                        className="me-2 align-middle"
                    />
                    <span className="ssd-wordmark">
                        SCAN-<span className="say">SAY</span>-DONE
                    </span>
                </Link>

                <div className="menu-extras">
                    <div className="menu-item">
                        <button
                            type="button"
                            className={`navbar-toggle ${toggle ? 'open' : ''}`}
                            id="isToggle"
                            onClick={()=>setToggle(!toggle)}
                            aria-label={toggle ? 'Cerrar menú' : 'Abrir menú'}
                            aria-expanded={toggle}
                            aria-controls="navigation"
                        >
                            <div className="lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </button>
                    </div>
                </div>

                <ul className="buy-button list-inline mb-0 d-none d-lg-block">
                    <li className="list-inline-item mb-0">
                        <Link href="/contactus" className="btn btn-primary">
                            Crear mi encuesta
                        </Link>
                    </li>
                </ul>

                <div id="navigation" className={toggle ? 'open' : ''}>
                    <nav aria-label="Navegacion principal">
                    <ul className="navigation-menu nav-right nav-light">
                        <li>
                            <Link href="/#como-funciona" className="sub-menu-item" onClick={() => setToggle(false)}>Cómo funciona</Link>
                        </li>

                        <li>
                            <Link href="/#canales" className="sub-menu-item" onClick={() => setToggle(false)}>Canales</Link>
                        </li>

                        <li>
                            <Link href="/#panel" className="sub-menu-item" onClick={() => setToggle(false)}>Panel</Link>
                        </li>

                        {SITE.features.showPricing && (
                            <li className={`${current === '/pricing' ? 'active' : ''}`}>
                                <Link href="/pricing" className="sub-menu-item" onClick={() => setToggle(false)}>Precios</Link>
                            </li>
                        )}

                        <li className={`${current === '/faqs' ? 'active' : ''}`}>
                            <Link href="/faqs" className="sub-menu-item" onClick={() => setToggle(false)}>Preguntas</Link>
                        </li>

                        <li className={`${current === '/contactus' ? 'active' : ''}`}>
                            <Link href="/contactus" className="sub-menu-item" onClick={() => setToggle(false)}>Contacto</Link>
                        </li>

                        <li className="d-lg-none mt-2 mb-2">
                            <Link href="/contactus" className="btn btn-primary" onClick={() => setToggle(false)}>
                                Crear mi encuesta
                            </Link>
                        </li>
                    </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}
