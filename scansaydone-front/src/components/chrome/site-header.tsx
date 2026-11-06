"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavDrawer } from "./nav-drawer";
import { MAIN_ID, SKIP_LINK_ID } from "./chrome-ids";

export function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const prevOpenRef = useRef(drawerOpen);
  const isNavigatingRef = useRef(false);
  const pathname = usePathname();

  const handleClose = () => {
    if (isNavigatingRef.current) {
      // Close without returning focus to burger (navigation occurred)
      setDrawerOpen(false);
      isNavigatingRef.current = false;
    } else {
      setDrawerOpen(false);
    }
  };
  const handleToggle = () => setDrawerOpen((prev) => !prev);

  // Conditional href: if on home page, use relative anchor; otherwise use absolute path
  const faqHref = pathname === "/" ? "#faq" : "/#faq";
  const surveyHref = pathname === "/" ? "#encuesta-demo" : "/#encuesta-demo";
  const comoFuncionaHref = pathname === "/" ? "#como-funciona" : "/#como-funciona";
  const canalesHref = pathname === "/" ? "#canales" : "/#canales";
  const aplicacionesHref = pathname === "/" ? "#aplicaciones" : "/#aplicaciones";

  // Toggle inert on main content and skip-link when drawer opens/closes
  useEffect(() => {
    const main = document.getElementById(MAIN_ID);
    const skipLink = document.getElementById(SKIP_LINK_ID);

    if (drawerOpen) {
      main?.setAttribute("inert", "");
      skipLink?.setAttribute("inert", "");
    } else {
      main?.removeAttribute("inert");
      skipLink?.removeAttribute("inert");
    }

    return () => {
      main?.removeAttribute("inert");
      skipLink?.removeAttribute("inert");
    };
  }, [drawerOpen]);

  // Escape closes the drawer
  useEffect(() => {
    if (!drawerOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [drawerOpen]);

  // Return focus to burger when drawer closes (skip if closed via navigation)
  useEffect(() => {
    if (prevOpenRef.current && !drawerOpen && !isNavigatingRef.current) {
      // Wait for inert to be removed (React render cycle)
      requestAnimationFrame(() => {
        burgerRef.current?.focus();
      });
    }
    prevOpenRef.current = drawerOpen;
  }, [drawerOpen]);

  return (
    <>
      {/* Skip link — first focusable element in the page */}
      <a
        id={SKIP_LINK_ID}
        href={`#${MAIN_ID}`}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]
          focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-[8px] focus:border-2 focus:border-text-primary
          focus:bg-surface-elevated focus:px-4 focus:font-ui focus:text-[15px] focus:font-semibold focus:text-text-primary
          focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
      >
        Saltar al contenido
      </a>

      <header className="fixed inset-x-0 top-0 z-40 h-[76px] w-full border-b border-border-mid bg-background-page px-4">
        <div
          className="mx-auto flex h-full w-full max-w-mkt-sm items-center justify-between md:max-w-mkt-md lg:max-w-mkt-lg xl:max-w-mkt-xl"
        >
          {/* Wordmark + desktop nav — inert when drawer is open */}
          <div
            className="flex h-full flex-1 items-center justify-between"
            inert={drawerOpen || undefined}
          >
            {/* Brand lockup */}
            <Link
              href="/"
              className="inline-flex h-11 items-center
                focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
            >
              <Image
                src="/img/marca/lockup-nav.png"
                width={310}
                height={72}
                alt="Scan-Say-Done"
                className="h-9 w-auto"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-6">
              <ul className="flex list-none items-center gap-6">
                <li>
                  <Link
                    href={comoFuncionaHref}
                    className="inline-flex h-11 items-center rounded-[8px] px-4 font-ui text-[15px] font-medium text-text-primary
                      hover:bg-surface-elevated motion-safe:transition-colors motion-safe:duration-150
                      focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
                  >
                    Cómo funciona
                  </Link>
                </li>
                <li className="hidden xl:inline-flex">
                  <Link
                    href={canalesHref}
                    className="inline-flex h-11 items-center rounded-[8px] px-4 font-ui text-[15px] font-medium text-text-primary
                      hover:bg-surface-elevated motion-safe:transition-colors motion-safe:duration-150
                      focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
                  >
                    Canales
                  </Link>
                </li>
                <li className="hidden xl:inline-flex">
                  <Link
                    href={aplicacionesHref}
                    className="inline-flex h-11 items-center rounded-[8px] px-4 font-ui text-[15px] font-medium text-text-primary
                      hover:bg-surface-elevated motion-safe:transition-colors motion-safe:duration-150
                      focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
                  >
                    Aplicaciones
                  </Link>
                </li>
                <li>
                  <Link
                    href={faqHref}
                    className="inline-flex h-11 items-center rounded-[8px] px-4 font-ui text-[15px] font-medium text-text-primary
                      hover:bg-surface-elevated motion-safe:transition-colors motion-safe:duration-150
                      focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
                  >
                    FAQ
                  </Link>
                </li>
                {/* Precios: sin nodo en el DOM hasta C-55 */}
                <li>
                  <Link
                    href={surveyHref}
                    className="inline-flex h-11 items-center justify-center rounded-[8px] px-4
                      font-ui text-[15px] font-semibold text-text-primary
                      hover:bg-surface-elevated
                      motion-safe:transition-colors motion-safe:duration-150
                      focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
                  >
                    Ver una encuesta de ejemplo
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Burger button (mobile only) — outside inert, always clickable */}
          <button
            ref={burgerRef}
            type="button"
            aria-expanded={drawerOpen}
            aria-controls="nav-movil"
            aria-label={drawerOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={handleToggle}
            className="inline-flex size-11 items-center justify-center rounded-[8px] border-2 border-text-primary text-text-primary
              hover:bg-surface-elevated lg:hidden
              focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary
              motion-safe:transition-colors motion-safe:duration-150"
          >
            <svg
              viewBox="0 0 20 20"
              className="size-5"
              aria-hidden="true"
              focusable="false"
            >
              {drawerOpen ? (
                <>
                  <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Drawer — inside header per landmark requirement (A11Y §2) */}
        <NavDrawer isOpen={drawerOpen} onClose={handleClose} />
      </header>

      {/* Overlay — outside header, covers the 32px gap below header (z-30 < z-40 header, < z-50 drawer) */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-surface-dark/55"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}
