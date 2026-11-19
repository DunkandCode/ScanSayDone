/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import { ResenasNegocio } from "@/components/panel/resenas-negocio";

// Instantánea simulada inválida: el contenido del módulo se oculta y
// queda solo el mensaje explícito. No puede lanzar.
vi.mock("@/lib/panel/instantanea", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("@/lib/panel/instantanea")>();
  return {
    ...original,
    instantanea: { ...original.instantanea, valida: false },
  };
});

describe("ResenasNegocio con instantánea inválida", () => {
  it("oculta el contenido del módulo y muestra el mensaje de sin datos", () => {
    render(<ResenasNegocio empresaId={1} />);

    expect(
      screen.getByText("No hay datos locales disponibles."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Reseñas de este negocio" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
