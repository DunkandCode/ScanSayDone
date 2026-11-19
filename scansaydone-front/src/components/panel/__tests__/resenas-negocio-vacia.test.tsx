/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import { ResenasNegocio } from "@/components/panel/resenas-negocio";

// Negocio sin respuestas (instantánea válida, pero el negocio elegido no
// tiene filas): mensaje explícito, no ceros disfrazados ni lista vacía.
vi.mock("@/lib/panel/instantanea", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("@/lib/panel/instantanea")>();
  return {
    ...original,
    respuestasDeEmpresa: () => [],
  };
});

describe("ResenasNegocio con un negocio sin respuestas", () => {
  it("muestra el mensaje de sin respuestas y no dibuja lista ni filtro", () => {
    render(<ResenasNegocio empresaId={1} />);

    expect(
      screen.getByText("Sin respuestas registradas para este negocio."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Filtrar reseñas")).not.toBeInTheDocument();
    // El encabezado y la etiqueta obligatoria siguen visibles.
    expect(
      screen.getByRole("heading", { name: "Reseñas de este negocio" }),
    ).toBeInTheDocument();
  });
});
