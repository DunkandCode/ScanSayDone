/// <reference types="vitest/globals" />
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SiteHeader } from "./site-header";
import { MAIN_ID } from "./chrome-ids";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

describe("SiteHeader", () => {
  beforeEach(() => {
    // Clean up any inert attributes from previous tests
    document.querySelectorAll("[inert]").forEach((el) => {
      el.removeAttribute("inert");
    });
  });

  it("renders header with nav labeled 'Navegación principal'", () => {
    render(<SiteHeader />);
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    const nav = screen.getByRole("navigation", { name: "Navegación principal" });
    expect(nav).toBeInTheDocument();
  });

  it("skip-link is first focusable and points to #contenido", () => {
    render(<SiteHeader />);
    const skipLink = screen.getByText("Saltar al contenido");
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#contenido");

    // Verify it's the first link in the document
    const allLinks = screen.getAllByRole("link");
    expect(allLinks[0]).toBe(skipLink);
  });

  it("has FAQ link with href '#faq' on home page", () => {
    render(<SiteHeader />);
    const desktopNav = screen.getByRole("navigation", { name: "Navegación principal" });
    const faqLink = within(desktopNav).getByRole("link", { name: "FAQ" });
    expect(faqLink).toBeInTheDocument();
    expect(faqLink).toHaveAttribute("href", "#faq");
  });

  it("has CTA link with correct name and href '#encuesta-demo' on home page", () => {
    render(<SiteHeader />);
    const desktopNav = screen.getByRole("navigation", { name: "Navegación principal" });
    const ctaLink = within(desktopNav).getByRole("link", {
      name: "Ver una encuesta de ejemplo",
    });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute("href", "#encuesta-demo");
  });

  it("has section links 'Cómo funciona', 'Canales', and 'Aplicaciones' in desktop nav", () => {
    render(<SiteHeader />);
    const desktopNav = screen.getByRole("navigation", { name: "Navegación principal" });
    
    const comoFuncionaLink = within(desktopNav).getByRole("link", { name: "Cómo funciona" });
    expect(comoFuncionaLink).toBeInTheDocument();
    expect(comoFuncionaLink).toHaveAttribute("href", "#como-funciona");

    const canalesLink = within(desktopNav).getByRole("link", { name: "Canales" });
    expect(canalesLink).toBeInTheDocument();
    expect(canalesLink).toHaveAttribute("href", "#canales");

    const aplicacionesLink = within(desktopNav).getByRole("link", { name: "Aplicaciones" });
    expect(aplicacionesLink).toBeInTheDocument();
    expect(aplicacionesLink).toHaveAttribute("href", "#aplicaciones");
  });

  it("does not contain 'Precios' or 'Entrar' links", () => {
    render(<SiteHeader />);
    const allLinks = screen.getAllByRole("link");
    const linkTexts = allLinks.map((link) => link.textContent?.trim());

    expect(linkTexts).not.toContain("Precios");
    expect(linkTexts).not.toContain("Entrar");

    // Also verify no href to /pricing or /entrar
    const allHrefs = allLinks.map((link) => link.getAttribute("href"));
    expect(allHrefs).not.toContain("/pricing");
    expect(allHrefs).not.toContain("/entrar");
  });

  it("burger has aria-expanded='false' initially and drawer is closed", () => {
    render(<SiteHeader />);
    const burger = screen.getByRole("button", { name: "Abrir menú" });
    expect(burger).toHaveAttribute("aria-expanded", "false");

    const drawer = document.getElementById("nav-movil");
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveAttribute("inert");
    expect(drawer).toHaveClass("invisible");
  });

  it("clicking burger sets aria-expanded='true' and shows drawer", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const burger = screen.getByRole("button", { name: "Abrir menú" });
    await user.click(burger);

    expect(burger).toHaveAttribute("aria-expanded", "true");
    expect(burger).toHaveAttribute("aria-label", "Cerrar menú");

    const drawer = document.getElementById("nav-movil");
    expect(drawer).not.toHaveAttribute("inert");
    expect(drawer).not.toHaveClass("invisible");
    expect(drawer).toHaveClass("translate-x-0");
  });

  it("Escape closes drawer and returns focus to burger", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const burger = screen.getByRole("button", { name: "Abrir menú" });
    await user.click(burger);

    const drawer = document.getElementById("nav-movil");
    expect(drawer).not.toHaveAttribute("inert");

    await user.keyboard("{Escape}");

    expect(burger).toHaveAttribute("aria-expanded", "false");
    expect(drawer).toHaveAttribute("inert");
    await waitFor(() => {
      expect(document.activeElement).toBe(burger);
    });
  });

  it("close button in drawer closes and returns focus to burger", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const burger = screen.getByRole("button", { name: "Abrir menú" });
    await user.click(burger);

    const drawer = document.getElementById("nav-movil");
    expect(drawer).toBeInTheDocument();
    
    const drawerCloseButton = within(drawer!).getByRole("button", { name: "Cerrar menú" });
    await user.click(drawerCloseButton);

    expect(burger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => {
      expect(document.activeElement).toBe(burger);
    });
  });

  it("drawer contains full section map and CTA with nav labeled 'Navegación del menú'", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const burger = screen.getByRole("button", { name: "Abrir menú" });
    await user.click(burger);

    const drawerNav = screen.getByRole("navigation", {
      name: "Navegación del menú",
    });
    expect(drawerNav).toBeInTheDocument();

    // Verify all section links are present
    const comoFunciona = within(drawerNav).getByRole("link", { name: "Cómo funciona" });
    expect(comoFunciona).toBeInTheDocument();
    expect(comoFunciona).toHaveAttribute("href", "#como-funciona");

    const canales = within(drawerNav).getByRole("link", { name: "Canales" });
    expect(canales).toBeInTheDocument();
    expect(canales).toHaveAttribute("href", "#canales");

    const aplicaciones = within(drawerNav).getByRole("link", { name: "Aplicaciones" });
    expect(aplicaciones).toBeInTheDocument();
    expect(aplicaciones).toHaveAttribute("href", "#aplicaciones");

    const drawerFaq = within(drawerNav).getByRole("link", { name: "FAQ" });
    expect(drawerFaq).toBeInTheDocument();
    expect(drawerFaq).toHaveAttribute("href", "#faq");

    const drawerCta = within(drawerNav).getByRole("link", {
      name: "Ver una encuesta de ejemplo",
    });
    expect(drawerCta).toBeInTheDocument();
    expect(drawerCta).toHaveAttribute("href", "#encuesta-demo");
  });

  it("burger aria-controls matches drawer id", () => {
    render(<SiteHeader />);
    const burger = screen.getByRole("button", { name: "Abrir menú" });
    expect(burger).toHaveAttribute("aria-controls", "nav-movil");

    const drawer = document.getElementById("nav-movil");
    expect(drawer).toBeInTheDocument();
  });

  it("overlay click closes the drawer", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const burger = screen.getByRole("button", { name: "Abrir menú" });
    await user.click(burger);

    const drawer = document.getElementById("nav-movil");
    expect(drawer).not.toHaveAttribute("inert");

    // Find overlay by data-testid or by class pattern
    const overlay = document.querySelector("[aria-hidden='true']");
    expect(overlay).toBeInTheDocument();
    
    await user.click(overlay!);

    expect(burger).toHaveAttribute("aria-expanded", "false");
    expect(drawer).toHaveAttribute("inert");
  });

  it("Tab cycles through drawer focusable elements: close → section links → FAQ → CTA → close", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const burger = screen.getByRole("button", { name: "Abrir menú" });
    await user.click(burger);

    const drawer = document.getElementById("nav-movil");
    expect(drawer).not.toHaveAttribute("inert");

    // Get focusable elements in drawer
    const closeButton = within(drawer!).getByRole("button", { name: "Cerrar menú" });
    const comoFuncionaLink = within(drawer!).getByRole("link", { name: "Cómo funciona" });
    const canalesLink = within(drawer!).getByRole("link", { name: "Canales" });
    const aplicacionesLink = within(drawer!).getByRole("link", { name: "Aplicaciones" });
    const faqLink = within(drawer!).getByRole("link", { name: "FAQ" });
    const ctaLink = within(drawer!).getByRole("link", {
      name: "Ver una encuesta de ejemplo",
    });

    // Focus should be on close button initially
    await waitFor(() => {
      expect(document.activeElement).toBe(closeButton);
    });

    // Tab through all section links
    await user.keyboard("{Tab}");
    expect(document.activeElement).toBe(comoFuncionaLink);

    await user.keyboard("{Tab}");
    expect(document.activeElement).toBe(canalesLink);

    await user.keyboard("{Tab}");
    expect(document.activeElement).toBe(aplicacionesLink);

    await user.keyboard("{Tab}");
    expect(document.activeElement).toBe(faqLink);

    // Tab to CTA
    await user.keyboard("{Tab}");
    expect(document.activeElement).toBe(ctaLink);

    // Tab wraps back to close button
    await user.keyboard("{Tab}");
    expect(document.activeElement).toBe(closeButton);
  });

  it("main element receives and loses inert attribute when drawer opens/closes", async () => {
    const user = userEvent.setup();
    
    // Render SiteHeader with a main element fixture
    render(
      <>
        <SiteHeader />
        <main id={MAIN_ID}>Main content</main>
      </>
    );

    const main = document.getElementById(MAIN_ID);
    expect(main).toBeInTheDocument();
    expect(main).not.toHaveAttribute("inert");

    const burger = screen.getByRole("button", { name: "Abrir menú" });
    await user.click(burger);

    expect(main).toHaveAttribute("inert");

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(main).not.toHaveAttribute("inert");
    });
  });
});
