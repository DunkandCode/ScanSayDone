'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import {
  FiHome,
  FiMessageSquare,
  FiSmartphone,
  FiLogOut,
  FiMenu,
  FiX,
  FiCheck,
  FiWifiOff,
  FiRefreshCw,
} from 'react-icons/fi'
import { usePanelDemo } from './panel-demo-context'

const NAV = [
  { href: '/panel', label: 'Resumen', icon: FiHome },
  { href: '/panel/respuestas', label: 'Respuestas', icon: FiMessageSquare },
  { href: '/panel/qr', label: 'Mi QR', icon: FiSmartphone },
]

export default function PanelShell({ children }) {
  const pathname = usePathname()
  const { isDemo, setIsDemo, isOffline } = usePanelDemo()
  const [open, setOpen] = useState(false)
  const burgerRef = useRef(null)
  const sidebarRef = useRef(null)
  const wasOpenRef = useRef(false)

  // Cerrar el drawer al navegar
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Cerrar el drawer con Esc
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Foco del drawer: al abrir va al primer ítem del sidebar, al cerrar vuelve al burger
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true
      const firstItem = sidebarRef.current?.querySelector('.panel-nav-item')
      firstItem?.focus()
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false
      burgerRef.current?.focus()
    }
  }, [open])

  return (
    <div className="panel-app">
      <a className="panel-skip" href="#panel-content">
        Saltar al contenido
      </a>

      <aside
        id="panel-sidebar"
        ref={sidebarRef}
        className={'panel-sidebar' + (open ? ' is-open' : '')}
        aria-label="Secciones del panel"
      >
        <Link href="/" className="panel-brand" aria-label="Volver al sitio">
          <span className="panel-brand-mark" aria-hidden="true" />
          <span className="panel-brand-name">SCAN SAY DONE</span>
          <span className="panel-brand-sep" aria-hidden="true" />
          <span className="panel-brand-overline">PANEL</span>
        </Link>

        <nav>
          {NAV.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={'panel-nav-item' + (active ? ' is-active' : '')}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <Link href="/entrar" className="panel-nav-item panel-nav-exit">
          <FiLogOut size={20} />
          <span>Salir</span>
        </Link>
      </aside>

      <header className="panel-topbar">
        <button
          type="button"
          ref={burgerRef}
          className="panel-burger"
          aria-expanded={open}
          aria-controls="panel-sidebar"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div className="panel-topbar-right">
          <button
            type="button"
            role="switch"
            aria-labelledby="panel-demo-label"
            aria-checked={isDemo}
            className="panel-switch"
            onClick={() => setIsDemo((v) => !v)}
          >
            <span className="panel-switch-knob" aria-hidden="true">
              {isDemo && <FiCheck size={12} />}
            </span>
          </button>
          <span id="panel-demo-label" className="panel-demo-label">
            Ver con datos de ejemplo
          </span>
        </div>
      </header>

      {open && (
        <div
          className="panel-scrim"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <main className="panel-content" id="panel-content" inert={open}>
        {isOffline && (
          <div className="panel-offline" role="status" aria-live="polite">
            <div className="panel-offline-inner">
              <FiWifiOff size={18} aria-hidden="true" />
              <span className="panel-offline-text">
                Vas sin conexión. Conéctate para ver las respuestas nuevas.
              </span>
              <button
                type="button"
                className="panel-btn-ghost"
                onClick={() => window.location.reload()}
              >
                <FiRefreshCw size={14} aria-hidden="true" />
                Reintentar
              </button>
            </div>
          </div>
        )}
        <div className="panel-container">{children}</div>
      </main>
    </div>
  )
}
