import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("tiene un footer landmark (contentinfo)", () => {
    render(<SiteFooter />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("tiene exactamente 3 encabezados de columna: Producto, Contacto, Legal", () => {
    render(<SiteFooter />);
    
    // Buscar los 3 headings de columna
    const productoHeading = screen.getByRole("heading", { name: /producto/i });
    const contactoHeading = screen.getByRole("heading", { name: /contacto/i });
    const legalHeading = screen.getByRole("heading", { name: /legal/i });
    
    expect(productoHeading).toBeInTheDocument();
    expect(contactoHeading).toBeInTheDocument();
    expect(legalHeading).toBeInTheDocument();
    
    // Verificar que ScanSayDone (marca) NO es un heading
    const allHeadings = screen.getAllByRole("heading");
    expect(allHeadings).toHaveLength(3);
    
    // La marca es un div, no un heading
    const marcaElement = screen.getByText("ScanSayDone");
    expect(marcaElement.tagName).toBe("DIV");
  });

  it("contiene el tagline ESCANEA. OPINA. LISTO.", () => {
    render(<SiteFooter />);
    const tagline = screen.getByText(/escanea\. opina\. listo\./i);
    expect(tagline).toBeInTheDocument();
  });

  it("tiene los 4 enlaces de Producto con href exactos", () => {
    render(<SiteFooter />);
    
    const comoFunciona = screen.getByRole("link", { name: /cómo funciona/i });
    const canales = screen.getByRole("link", { name: /^canales$/i });
    const aplicaciones = screen.getByRole("link", { name: /aplicaciones/i });
    const preguntas = screen.getByRole("link", { name: /preguntas frecuentes/i });
    
    expect(comoFunciona).toHaveAttribute("href", "/#como-funciona");
    expect(canales).toHaveAttribute("href", "/#canales");
    expect(aplicaciones).toHaveAttribute("href", "/#aplicaciones");
    expect(preguntas).toHaveAttribute("href", "/#faq");
  });

  it("tiene un enlace Contáctanos con href /contactus", () => {
    render(<SiteFooter />);
    const contactanos = screen.getByRole("link", { name: /contáctanos/i });
    expect(contactanos).toBeInTheDocument();
    expect(contactanos).toHaveAttribute("href", "/contactus");
  });

  it("contiene el párrafo legal exacto", () => {
    render(<SiteFooter />);
    const legalText = screen.getByText(
      /las reglas de uso y la política de privacidad se publicarán una vez completada la revisión legal\./i
    );
    expect(legalText).toBeInTheDocument();
  });

  it("la línea de copyright contiene el año actual y ScanSayDone", () => {
    render(<SiteFooter />);
    const currentYear = new Date().getFullYear();
    const copyright = screen.getByText(new RegExp(`© ${currentYear} scansaydone`, "i"));
    expect(copyright).toBeInTheDocument();
  });

  it("NO contiene botones interactivos y tiene exactamente 5 enlaces", () => {
    render(<SiteFooter />);
    
    // Verificar que no hay botones
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    
    // Verificar que hay exactamente 5 enlaces (4 de Producto + 1 de Contacto)
    const allLinks = screen.getAllByRole("link");
    expect(allLinks).toHaveLength(5);
    
    // Verificar que ninguno apunta a rutas placeholder
    const hrefs = allLinks.map((link) => link.getAttribute("href"));
    expect(hrefs).not.toContain("/privacy");
    expect(hrefs).not.toContain("/terms");
    expect(hrefs).not.toContain("/pricing");
    expect(hrefs).not.toContain("/faqs");
    expect(hrefs).not.toContain("/panel");
    
    // Verificar que no hay enlaces que empiecen con /e/
    const hasERoute = hrefs.some((href) => href && href.startsWith("/e/"));
    expect(hasERoute).toBe(false);
  });
});
