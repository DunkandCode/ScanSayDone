/// <reference types="vitest/globals" />
import { render } from "@testing-library/react";
import { ResultadosNegocio } from "@/components/panel/resultados-negocio";

// Instantánea simulada inválida: la sección debe ocultarse por completo y
// no lanzar (los bloques DEMO del panel quedan intactos fuera de aquí).
vi.mock("@/lib/panel/instantanea", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("@/lib/panel/instantanea")>();
  return {
    ...original,
    instantanea: { ...original.instantanea, valida: false },
  };
});

describe("ResultadosNegocio con instantánea inválida", () => {
  it("se oculta por completo y no lanza", () => {
    const { container } = render(<ResultadosNegocio empresaId={1} />);
    expect(container).toBeEmptyDOMElement();
  });
});
