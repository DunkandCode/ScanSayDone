/// <reference types="vitest/globals" />
import { render, screen, within } from "@testing-library/react";
import { ResultadosNegocio } from "@/components/panel/resultados-negocio";
import { formatear1 } from "@/lib/panel/calculos";

/* ── Render por empresa ───────────────────────────────────────────────────── */

describe("ResultadosNegocio", () => {
  it("empresa 1: etiqueta obligatoria, cifras y etiquetas p3/p4 del negocio", () => {
    render(<ResultadosNegocio empresaId={1} />);

    // Etiqueta obligatoria de origen de los datos.
    expect(
      screen.getByText(
        "Datos de prueba locales · instantánea del 18-11-2026 · no son clientes reales",
      ),
    ).toBeInTheDocument();

    // Título de la sección y bloque con el nombre sin siglas.
    expect(
      screen.getByRole("heading", { name: "Resultados de este negocio" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Recomendación neta")).toBeInTheDocument();

    // Cifras de la empresa 1.
    expect(screen.getByText("15")).toBeInTheDocument(); // respuestas
    expect(screen.getByText("9,3")).toBeInTheDocument(); // media nota 1
    expect(screen.getByText("13")).toBeInTheDocument(); // promotores
    expect(screen.getByText("86,7")).toBeInTheDocument(); // recomendación neta

    // Etiquetas del negocio desde la instantánea.
    expect(screen.getByText(/Surtido y disponibilidad/)).toBeInTheDocument();
    expect(screen.getByText(/Calidad de la atención/)).toBeInTheDocument();

    // Línea de comentarios y alertas.
    expect(screen.getByText("10 con comentario · 0 con alerta")).toBeInTheDocument();
  });

  it("empresa 3: sus propias cifras (media 7,1, recomendación neta -20)", () => {
    render(<ResultadosNegocio empresaId={3} />);

    expect(screen.getByText("7,1")).toBeInTheDocument();
    // El negativo se formatea con la misma función del componente.
    expect(screen.getByText(formatear1(-20))).toBeInTheDocument();
    expect(screen.getByText("10 con comentario · 3 con alerta")).toBeInTheDocument();
  });

  it("empresa 2: recomendación neta 0 real, mostrada con un decimal", () => {
    render(<ResultadosNegocio empresaId={2} />);
    expect(screen.getByText("0,0")).toBeInTheDocument();
    expect(screen.getByText("10 con comentario · 5 con alerta")).toBeInTheDocument();
  });

  it("cambiar de empresa cambia los números", () => {
    const { rerender } = render(<ResultadosNegocio empresaId={1} />);
    expect(screen.getByText("86,7")).toBeInTheDocument();

    rerender(<ResultadosNegocio empresaId={4} />);
    expect(screen.queryByText("86,7")).not.toBeInTheDocument();
    expect(screen.getByText(formatear1(80))).toBeInTheDocument();
    expect(screen.getByText("8,9")).toBeInTheDocument();
  });

  it("negocio sin respuestas: mensaje explícito, sin ceros disfrazados", () => {
    render(<ResultadosNegocio empresaId={999} />);
    expect(
      screen.getByText("Sin respuestas registradas para este negocio."),
    ).toBeInTheDocument();
    // La etiqueta obligatoria sigue visible.
    expect(screen.getByText(/Datos de prueba locales/)).toBeInTheDocument();
  });

  it("sin id todavía (selector cargando): no renderiza nada", () => {
    const { container } = render(<ResultadosNegocio empresaId={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("no tiene botones: la sección es de solo lectura", () => {
    render(<ResultadosNegocio empresaId={1} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("la distribución 0–10 muestra los 11 valores con sus conteos", () => {
    render(<ResultadosNegocio empresaId={1} />);
    const lista = screen.getByLabelText(
      "Cantidad de respuestas por nota, de la 0 a la 10",
    );
    const filas = within(lista).getAllByRole("listitem");
    expect(filas).toHaveLength(11);
    // Empresa 1: nota 8 → 2, nota 9 → 6, nota 10 → 7.
    expect(within(filas[8]).getByText("2")).toBeInTheDocument();
    expect(within(filas[9]).getByText("6")).toBeInTheDocument();
    expect(within(filas[10]).getByText("7")).toBeInTheDocument();
  });
});
