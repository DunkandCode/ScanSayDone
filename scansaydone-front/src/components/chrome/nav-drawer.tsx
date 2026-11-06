"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
  const pathname = usePathname();

  // Conditional href: if on home page, use relative anchor; otherwise use absolute path
  const comoFuncionaHref = pathname === "/" ? "#como-funciona" : "/#como-funciona";
  const canalesHref = pathname === "/" ? "#canales" : "/#canales";
  const aplicacionesHref = pathname === "/" ? "#aplicaciones" : "/#aplicaciones";
  const faqHref = pathname === "/" ? "#faq" : "/#faq";
  const surveyHref = pathname === "/" ? "#encuesta-demo" : "/#encuesta-demo";
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap: cycle through close → FAQ → CTA → close
  useEffect(() => {
    if (!isOpen) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    // Focus close button when drawer opens
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusable = drawer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    drawer.addEventListener("keydown", handleKeyDown);
    return () => drawer.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div
      id="nav-movil"
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      inert={!isOpen || undefined}
      className={`fixed inset-y-0 right-0 z-50 w-[343px] max-w-[calc(100vw-2rem)] border-l border-border-mid bg-surface-default
        motion-safe:transition-transform motion-safe:duration-200
        ${isOpen ? "translate-x-0" : "invisible translate-x-full"}`}
    >
      {/* Top row: label + close button */}
      <div className="flex h-[76px] items-center justify-between border-b border-border-mid px-4">
        <span className="font-ui text-[13px] font-semibold uppercase tracking-[0.14em] text-text-primary">
          Menú
        </span>
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          className="inline-flex size-11 items-center justify-center rounded-[8px] border-2 border-text-primary text-text-primary
            hover:bg-surface-elevated
            focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary
            motion-safe:transition-colors motion-safe:duration-150"
        >
          <svg
            viewBox="0 0 20 20"
            className="size-5"
            aria-hidden="true"
            focusable="false"
          >
            <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Nav links */}
      <nav aria-label="Navegación del menú" className="px-4 py-6">
        <ul className="flex flex-col gap-4 list-none">
          <li>
            <Link
              href={comoFuncionaHref}
              onClick={onClose}
              className="flex min-h-11 w-full items-center justify-center rounded-[8px] font-ui text-[17px] font-medium text-text-primary
                hover:bg-surface-elevated
                focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary
                motion-safe:transition-colors motion-safe:duration-150"
            >
              Cómo funciona
            </Link>
          </li>
          <li>
            <Link
              href={canalesHref}
              onClick={onClose}
              className="flex min-h-11 w-full items-center justify-center rounded-[8px] font-ui text-[17px] font-medium text-text-primary
                hover:bg-surface-elevated
                focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary
                motion-safe:transition-colors motion-safe:duration-150"
            >
              Canales
            </Link>
          </li>
          <li>
            <Link
              href={aplicacionesHref}
              onClick={onClose}
              className="flex min-h-11 w-full items-center justify-center rounded-[8px] font-ui text-[17px] font-medium text-text-primary
                hover:bg-surface-elevated
                focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary
                motion-safe:transition-colors motion-safe:duration-150"
            >
              Aplicaciones
            </Link>
          </li>
          <li>
            <Link
              href={faqHref}
              onClick={onClose}
              className="flex min-h-11 w-full items-center justify-center rounded-[8px] font-ui text-[17px] font-medium text-text-primary
                hover:bg-surface-elevated
                focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary
                motion-safe:transition-colors motion-safe:duration-150"
            >
              FAQ
            </Link>
          </li>
          <li>
            <Link
              href="/entrar"
              onClick={onClose}
              className="flex min-h-11 w-full items-center justify-center rounded-[8px] font-ui text-[17px] font-medium text-text-primary
                hover:bg-surface-elevated
                focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary
                motion-safe:transition-colors motion-safe:duration-150"
            >
              Entrar
            </Link>
          </li>
          <li>
            <Link
              href={surveyHref}
              onClick={onClose}
              className="flex h-12 w-full items-center justify-center rounded-[8px] border-2 border-text-primary bg-transparent
                font-ui text-[17px] font-semibold text-text-primary
                hover:bg-surface-elevated active:bg-surface-dark active:text-on-dark
                focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary
                motion-safe:transition-colors motion-safe:duration-150"
            >
              Ver una encuesta de ejemplo
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
