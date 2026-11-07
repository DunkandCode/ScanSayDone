import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Panel — ScanSayDone",
  description: "Panel de ejemplo con datos inventados.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col min-[993px]:flex-row">
      {/* ── Topbar (≤992) ───────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 flex h-[56px] items-center justify-between border-b border-border-subtle bg-surface-default px-4 min-[993px]:hidden"
      >
        <Image
          src="/img/marca/lockup-nav.png"
          alt="ScanSayDone"
          width={119}
          height={28}
          priority
        />
      </header>

      {/* ── Nav row mobile (≤992) ───────────────────────────────────────── */}
      <nav
        aria-label="Navegación del panel"
        tabIndex={0}
        className="sticky top-[56px] z-20 flex h-[44px] items-center gap-1 overflow-x-auto border-b border-border-subtle bg-surface-default px-4 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary min-[993px]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <PanelNavLink active label="Resumen" />
        <PanelNavLink label="Reseñas" disabled title="no disponible en el panel de ejemplo" />
        <PanelNavLink label="Códigos QR" disabled title="no disponible en el panel de ejemplo" />
        <PanelNavLink label="Ajustes" disabled title="no disponible en el panel de ejemplo" />
      </nav>

      {/* ── Sidebar (≥993) ──────────────────────────────────────────────── */}
      <aside
        aria-label="Panel"
        className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-border-subtle min-[993px]:flex"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, color-mix(in srgb, #F0D8BD 26%, #FFFFFF) 100%)",
        }}
      >
        {/* Marca — F-O8 */}
        <div className="flex items-center px-6" style={{ paddingTop: 16, paddingBottom: 24 }}>
          <Image
            src="/img/marca/lockup-nav.png"
            alt="ScanSayDone"
            width={168}
            height={40}
            priority
          />
        </div>

        {/* Nav */}
        <nav aria-label="Navegación del panel" className="flex flex-1 flex-col gap-1 px-3 py-4">
          <SidebarNavLink active label="Resumen" />
          <SidebarNavLink label="Reseñas" disabled title="no disponible en el panel de ejemplo" />
          <SidebarNavLink label="Códigos QR" disabled title="no disponible en el panel de ejemplo" />
          <SidebarNavLink label="Ajustes" disabled title="no disponible en el panel de ejemplo" />
        </nav>

        {/* Footer */}
        <div className="border-t border-border-subtle px-6 py-4">
          <p className="font-ui text-[13px] text-text-secondary">
            Sesión de demostración. No hay cuenta real detrás.
          </p>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main
        id="panel-main"
        tabIndex={-1}
        className="flex-1 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
        style={{
          background:
            "linear-gradient(180deg, #F7E5C8 0%, #F0D8BD 100%)",
          minHeight: "100svh",
        }}
      >
        <div className="mx-auto w-full max-w-[1056px] px-4 py-6 xs:px-4 md:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

/* ── Link components ─────────────────────────────────────────────────────── */

function SidebarNavLink({
  label,
  active,
  disabled,
  title,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  const base =
    "flex h-[44px] items-center rounded-[6px] px-3 font-ui text-[14px] font-medium focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary";

  if (active) {
    return (
      <span
        aria-current="page"
        className={`${base} font-semibold text-text-primary`}
        style={{
          background: "color-mix(in srgb, #F0D8BD 62%, #FFFFFF)",
          borderLeft: "3px solid #8A6F55",
          transition: "color 150ms, background-color 150ms",
        }}
      >
        {label}
      </span>
    );
  }

  if (disabled) {
    return (
      <span
        role="link"
        aria-disabled="true"
        title={title}
        className={`${base} cursor-not-allowed text-text-secondary`}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className={`${base} text-text-secondary`}
      style={{
        transition: "color 150ms, background-color 150ms",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "color-mix(in srgb, #F0D8BD 35%, #FFFFFF)";
        e.currentTarget.style.color = "#1A181B";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "";
        e.currentTarget.style.color = "";
      }}
    >
      {label}
    </span>
  );
}

function PanelNavLink({
  label,
  active,
  disabled,
  title,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  const base =
    "flex h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-[6px] px-3 font-ui text-[14px] font-medium focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary";

  if (active) {
    return (
      <span
        aria-current="page"
        className={`${base} font-semibold text-text-primary`}
        style={{
          background: "color-mix(in srgb, #F0D8BD 62%, #FFFFFF)",
          borderLeft: "3px solid #8A6F55",
          transition: "color 150ms, background-color 150ms",
        }}
      >
        {label}
      </span>
    );
  }

  if (disabled) {
    return (
      <span
        role="link"
        aria-disabled="true"
        title={title}
        className={`${base} cursor-not-allowed text-text-secondary`}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className={`${base} text-text-secondary`}
      style={{
        transition: "color 150ms, background-color 150ms",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "color-mix(in srgb, #F0D8BD 35%, #FFFFFF)";
        e.currentTarget.style.color = "#1A181B";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "";
        e.currentTarget.style.color = "";
      }}
    >
      {label}
    </span>
  );
}
