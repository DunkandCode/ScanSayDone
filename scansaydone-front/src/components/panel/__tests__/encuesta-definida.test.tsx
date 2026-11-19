/// <reference types="vitest/globals" />
import { render, screen, within } from "@testing-library/react";
import { EncuestaDefinida } from "@/components/panel/encuesta-definida";
import type { EncuestaEmpresa } from "@/lib/api/encuesta";

/* ── Payload de prueba ────────────────────────────────────────────────────── */

function encuestaCompleta(): EncuestaEmpresa {
  return {
    empresa_id: 1,
    nombre_negocio: "Minimarket Don Lucho",
    rubro: "Minimarket / almacén de barrio",
    preguntas: {
      p1: { texto: "¿Qué nota le pones a la experiencia?", escala: [0, 10] },
      p2: { texto: "¿Qué tan satisfecho quedaste?", escala: [1, 5] },
      p3: {
        texto: "¿Qué nota le pones al surtido?",
        etiqueta: "Surtido y disponibilidad",
        escala: [1, 5],
      },
      p4: {
        texto: "¿Qué nota le pones a la atención?",
        etiqueta: "Calidad de la atención",
        escala: [1, 5],
      },
      p5: { texto: "Cuéntanos qué pasó", max_caracteres: 300 },
    },
  };
}

function stubFetchOk(encuesta: EncuestaEmpresa) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      status: 200,
      ok: true,
      headers: {
        get: (nombre: string) =>
          nombre.toLowerCase() === "content-type" ? "application/json" : null,
      },
      json: async () => encuesta,
    })),
  );
}

/* ── Suite ────────────────────────────────────────────────────────────────── */

describe("EncuestaDefinida", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("muestra los textos de p1 a p5 con sus etiquetas", async () => {
    stubFetchOk(encuestaCompleta());
    render(<EncuestaDefinida empresaId={1} />);

    expect(
      await screen.findByText("¿Qué nota le pones a la experiencia?"),
    ).toBeInTheDocument();
    expect(screen.getByText("¿Qué tan satisfecho quedaste?")).toBeInTheDocument();
    expect(screen.getByText("Cuéntanos qué pasó")).toBeInTheDocument();
    // Etiquetas de p3/p4 visibles.
    expect(screen.getByText(/Surtido y disponibilidad/)).toBeInTheDocument();
    expect(screen.getByText(/Calidad de la atención/)).toBeInTheDocument();
  });

  it("p5 es respuesta abierta: texto, recuadro de solo lectura y sin controles", async () => {
    stubFetchOk(encuestaCompleta());
    const { container } = render(<EncuestaDefinida empresaId={1} />);

    // El dd con el texto de la pregunta es el dato accesible.
    expect(await screen.findByText("Cuéntanos qué pasó")).toBeInTheDocument();
    expect(
      screen.getByText("Pregunta 5 · Respuesta abierta"),
    ).toBeInTheDocument();

    // Recuadro decorativo del campo (máximo de caracteres de p5).
    expect(
      screen.getByText("El cliente escribe su respuesta (máximo 300 caracteres)"),
    ).toBeInTheDocument();

    // Vista de definición: ningún textarea ni input en la sección.
    expect(container.querySelectorAll("textarea, input")).toHaveLength(0);
  });

  it("expande la escala [0,10] en 11 fichas y la [1,5] en 5", async () => {
    stubFetchOk(encuestaCompleta());
    render(<EncuestaDefinida empresaId={1} />);

    const escalaP1 = await screen.findByLabelText("Escala de la 0 a la 10");
    const fichasP1 = within(escalaP1).getAllByRole("listitem");
    expect(fichasP1).toHaveLength(11);
    expect(within(escalaP1).getByText("0")).toBeInTheDocument();
    expect(within(escalaP1).getByText("10")).toBeInTheDocument();

    // p2, p3 y p4 comparten escala [1,5]: las tres grillas con 5 fichas.
    const escalas15 = screen.getAllByLabelText("Escala de la 1 a la 5");
    expect(escalas15).toHaveLength(3);
    for (const escala of escalas15) {
      expect(within(escala).getAllByRole("listitem")).toHaveLength(5);
    }
    expect(within(escalas15[0]).getByText("1")).toBeInTheDocument();
    expect(within(escalas15[0]).getByText("5")).toBeInTheDocument();
  });

  it("si el servicio falla, muestra el mensaje de fallo sin botones", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );
    render(<EncuestaDefinida empresaId={1} />);

    expect(
      await screen.findByText("No se pudo consultar el servicio."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("si el negocio no tiene encuesta, lo dice sin tratarlo como fallo", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ status: 404, ok: false, json: async () => ({}) })),
    );
    render(<EncuestaDefinida empresaId={99} />);

    expect(
      await screen.findByText("Este negocio todavía no tiene encuesta."),
    ).toBeInTheDocument();
  });

  it("sin id todavía no renderiza nada", () => {
    const { container } = render(<EncuestaDefinida empresaId={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
