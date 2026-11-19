/// <reference types="vitest/globals" />
import { render, screen, within, fireEvent } from "@testing-library/react";
import { ResenasNegocio } from "@/components/panel/resenas-negocio";
import { respuestasDeEmpresa } from "@/lib/panel/instantanea";

/**
 * Reseñas por negocio con la instantánea real (60 respuestas, 4 empresas).
 * Cifras por empresa (verificadas contra el JSON):
 * - Empresa 1: 15 respuestas, 10 con comentario, 0 con alerta.
 * - Empresa 2: 15 respuestas, 10 con comentario, 5 con alerta.
 * La respuesta más reciente de la empresa 1 es de las 23:19:07 del
 * 2026-11-18: nota 10, "Un local acogedor en el barrio", Felicitación.
 */

function listaResenas() {
  return document.querySelector(
    'ul[aria-label^="Reseñas del negocio"]',
  ) as HTMLElement | null;
}

describe("ResenasNegocio con la instantánea real", () => {
  it("1. encabezado, etiqueta obligatoria y línea de resumen del negocio", () => {
    render(<ResenasNegocio empresaId={1} />);

    expect(
      screen.getByRole("heading", { name: "Reseñas de este negocio" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Datos de prueba locales · instantánea del 18-11-2026 · no son clientes reales",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("15 reseñas · 10 con comentario · 0 con alerta"),
    ).toBeInTheDocument();
  });

  it("2. lista semántica con 15 ítems y conteo visible en role=status", () => {
    render(<ResenasNegocio empresaId={1} />);

    const lista = listaResenas();
    expect(lista).toBeInTheDocument();
    expect(lista!.children).toHaveLength(15);

    expect(screen.getByText("Mostrando 15 de 15 reseñas")).toBeInTheDocument();
    // El conteo vive en una región role="status" (aria-live implícito).
    const estados = screen.getAllByRole("status");
    expect(
      estados.some((n) => n.textContent?.includes("Mostrando 15 de 15")),
    ).toBe(true);
  });

  it("3. la más reciente primero: nota 10, comentario de las 23:19:07 y fecha dd-mm-yyyy", () => {
    render(<ResenasNegocio empresaId={1} />);

    const items = within(listaResenas()!).getAllByRole("listitem");
    expect(items).toHaveLength(15);

    // Primera de la lista = la de hora mayor (23:19:07, nota 10).
    expect(within(items[0]).getByText("10 / 10")).toBeInTheDocument();
    expect(
      within(items[0]).getByText("Un local acogedor en el barrio"),
    ).toBeInTheDocument();
    expect(within(items[0]).getByText("Felicitación")).toBeInTheDocument();
    expect(within(items[0]).getByText("18-11-2026")).toBeInTheDocument();

    // La más antigua (23:19:05) queda al final; la primera no puede ser
    // una respuesta con hora menor.
    const ultima = items[items.length - 1];
    const respuestasOrdenadas = [...respuestasDeEmpresa(1)].sort((a, b) =>
      `${b.fecha}${b.hora}`.localeCompare(`${a.fecha}${a.hora}`),
    );
    expect(within(ultima).getByText("18-11-2026")).toBeInTheDocument();
    expect(
      within(items[0]).getByText(`${respuestasOrdenadas[0].p1_nps} / 10`),
    ).toBeInTheDocument();
    expect(
      within(ultima).getByText(`${respuestasOrdenadas.at(-1)!.p1_nps} / 10`),
    ).toBeInTheDocument();
  });

  it("4. sin comentario: el texto secundario aparece en los 5 ítems sin comentario", () => {
    render(<ResenasNegocio empresaId={1} />);

    const items = within(listaResenas()!).getAllByRole("listitem");
    expect(screen.getAllByText("Sin comentario")).toHaveLength(5);
    // El texto secundario no es un control interactivo anidado.
    for (const item of items) {
      expect(item.querySelector("a,button,select,input")).toBeNull();
    }
  });

  it("5. filtro Con comentario: 10 ítems, todos con texto real y conteo actualizado", () => {
    render(<ResenasNegocio empresaId={1} />);

    fireEvent.change(screen.getByLabelText("Filtrar reseñas"), {
      target: { value: "comentario" },
    });

    expect(screen.getByText("Mostrando 10 de 15 reseñas")).toBeInTheDocument();
    const items = within(listaResenas()!).getAllByRole("listitem");
    expect(items).toHaveLength(10);
    expect(screen.queryAllByText("Sin comentario")).toHaveLength(0);
  });

  it("6. filtro Con alerta en un negocio sin alertas: mensaje de filtro vacío", () => {
    render(<ResenasNegocio empresaId={1} />);

    fireEvent.change(screen.getByLabelText("Filtrar reseñas"), {
      target: { value: "alerta" },
    });

    expect(screen.getByText("Mostrando 0 de 15 reseñas")).toBeInTheDocument();
    expect(
      screen.getByText("No hay reseñas con ese filtro."),
    ).toBeInTheDocument();
    expect(listaResenas()).toBeNull();
  });

  it("7. empresa 2: 5 alertas con etiqueta Requiere atención (ícono + texto)", () => {
    render(<ResenasNegocio empresaId={2} />);

    expect(screen.getByText("15 reseñas · 10 con comentario · 5 con alerta")).toBeInTheDocument();
    const etiquetas = screen.getAllByText("Requiere atención");
    expect(etiquetas).toHaveLength(5);

    // La etiqueta lleva un ícono SVG decorativo junto al texto: el color
    // no es el único canal.
    const etiqueta = etiquetas[0].closest("span");
    expect(etiqueta?.querySelector("svg[aria-hidden='true']")).not.toBeNull();
  });

  it("8. filtro Con alerta en la empresa 2: solo los 5 ítems con alerta", () => {
    render(<ResenasNegocio empresaId={2} />);

    fireEvent.change(screen.getByLabelText("Filtrar reseñas"), {
      target: { value: "alerta" },
    });

    expect(screen.getByText("Mostrando 5 de 15 reseñas")).toBeInTheDocument();
    const items = within(listaResenas()!).getAllByRole("listitem");
    expect(items).toHaveLength(5);
    for (const item of items) {
      expect(within(item).getByText("Requiere atención")).toBeInTheDocument();
    }
  });
});

describe("ResenasNegocio sin negocio seleccionado", () => {
  it("9. empresaId null: no renderiza nada", () => {
    const { container } = render(<ResenasNegocio empresaId={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
