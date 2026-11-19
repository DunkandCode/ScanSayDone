/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import { ResenasNegocio } from "@/components/panel/resenas-negocio";
import { payloadPanelConRespuestas } from "@/test/fixtures/panel";

// Negocio sin respuestas (el servicio responde 200, pero la lista viene
// vacía): mensaje explícito, no ceros disfrazados ni lista vacía.
describe("ResenasNegocio con un negocio sin respuestas", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("muestra el mensaje de sin respuestas y no dibuja lista ni filtro", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        status: 200,
        ok: true,
        headers: {
          get: (nombre: string) =>
            nombre.toLowerCase() === "content-type" ? "application/json" : null,
        },
        json: async () => payloadPanelConRespuestas(5, []),
      })),
    );

    render(<ResenasNegocio empresaId={5} />);

    expect(
      await screen.findByText("Sin respuestas registradas para este negocio."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Filtrar reseñas")).not.toBeInTheDocument();
    // El encabezado y la etiqueta obligatoria siguen visibles.
    expect(
      screen.getByRole("heading", { name: "Reseñas de este negocio" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Datos simulados del servicio local/),
    ).toBeInTheDocument();
  });
});
