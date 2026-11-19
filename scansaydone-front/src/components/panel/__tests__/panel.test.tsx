/// <reference types="vitest/globals" />
import { render, screen, within, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PanelPage from "@/app/(panel)/panel/page";
import { PanelNavLinks } from "@/components/panel/panel-nav";
import { CLAVE_SESION, guardarSesion, leerSesion } from "@/lib/auth/sesion";
import type { EncuestaEmpresa } from "@/lib/api/encuesta";
import {
  payloadPanelReal,
} from "@/test/fixtures/panel";

/**
 * Panel dependiente de la sesión (mockeada en localStorage):
 * - Sin sesión → redirect a /entrar y esqueleto sin cifras.
 * - Con sesión (empresa 1 del fixture) → cabecera con el nombre del
 *   negocio, botón «Cerrar sesión», sin selector, y los módulos
 *   alimentados con el empresa_id guardado.
 */

const pushMock = vi.fn();
const replaceMock = vi.fn();
// Identidad estable: useRouter devuelve SIEMPRE este mismo objeto. Si
// devolviera un literal nuevo por llamada, cualquier efecto con [router]
// re-dispararía en cada render.
const routerMock = { push: pushMock, replace: replaceMock };

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

const SESION_EMPRESA_1 = {
  usuario: "minimarket_don_lucho",
  empresa_id: 1,
  nombre_negocio: "Minimarket Don Lucho",
};

function payloadEncuesta(id: number, nombre: string): EncuestaEmpresa {
  return {
    empresa_id: id,
    nombre_negocio: nombre,
    rubro: "Rubro de prueba",
    preguntas: {
      p1: { texto: "¿Qué nota le pones a la experiencia?", escala: [0, 10] },
      p2: { texto: "¿Qué tan satisfecho quedaste?", escala: [1, 5] },
      p3: {
        texto: "¿Qué nota le pones al atributo tres?",
        etiqueta: "Atributo tres",
        escala: [1, 5],
      },
      p4: {
        texto: "¿Qué nota le pones al atributo cuatro?",
        etiqueta: "Atributo cuatro",
        escala: [1, 5],
      },
      p5: { texto: "Cuéntanos qué pasó", max_caracteres: 500 },
    },
  };
}

const ENCUESTA_1 = payloadEncuesta(1, SESION_EMPRESA_1.nombre_negocio);

/** Stub de fetch: panel + encuesta de la empresa de la sesión; resto 404. */
function stubFetchServicio() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      const panel = String(url).match(/\/api\/v1\/empresas\/(\d+)\/panel$/);
      if (panel) {
        const id = Number(panel[1]);
        if (payloadPanelReal(id)) {
          return {
            status: 200,
            ok: true,
            headers: {
              get: (nombre: string) =>
                nombre.toLowerCase() === "content-type"
                  ? "application/json"
                  : null,
            },
            json: async () => payloadPanelReal(id),
          };
        }
        return { status: 404, ok: false, json: async () => ({}) };
      }

      const encuesta = String(url).match(/\/api\/v1\/empresas\/(\d+)\/encuesta$/);
      if (encuesta) {
        const id = Number(encuesta[1]);
        if (id === 1) {
          return {
            status: 200,
            ok: true,
            headers: {
              get: (nombre: string) =>
                nombre.toLowerCase() === "content-type"
                  ? "application/json"
                  : null,
            },
            json: async () => ENCUESTA_1,
          };
        }
        return { status: 404, ok: false, json: async () => ({}) };
      }

      return { status: 404, ok: false, json: async () => ({}) };
    }),
  );
}

function abrirPestana(nombre: "Resumen" | "Resultados" | "Encuesta" | "Reseñas") {
  fireEvent.click(screen.getByRole("tab", { name: nombre }));
}

describe("PanelPage: dependiente de la sesión", () => {
  beforeEach(() => {
    window.localStorage.clear();
    pushMock.mockClear();
    replaceMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
    window.history.replaceState(null, "", "#");
  });

  it("1. sin sesión: redirige a /entrar y no muestra cifras ni pestañas", async () => {
    stubFetchServicio();
    render(<PanelPage />);

    // El efecto de montaje manda a /entrar…
    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/entrar");
    });

    // …y mientras tanto solo hay esqueleto: ni pestañas, ni cifras, ni
    // consultas al servicio del negocio.
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText(/^20$/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/por día/)).not.toBeInTheDocument();
  });

  it("2. con sesión: cabecera con el nombre del negocio, sin selector, y cifras de SU empresa", async () => {
    stubFetchServicio();
    guardarSesion(SESION_EMPRESA_1);
    render(<PanelPage />);

    // Cabecera: nombre del negocio de la sesión + cerrar sesión.
    expect(screen.getByText("Minimarket Don Lucho")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cerrar sesión" }),
    ).toBeInTheDocument();

    // Nada de selector de negocio en el panel.
    expect(screen.queryByLabelText("Negocio")).not.toBeInTheDocument();

    // Resumen de la empresa 1 del fixture: 20 respuestas, recomendación
    // neta 25,0 y media 8,05 (números oficiales de su agregado).
    expect(await screen.findByText("25,0")).toBeInTheDocument();
    expect(screen.getByText(/^20$/)).toBeInTheDocument();
    expect(screen.getByText("8,05")).toBeInTheDocument();

    // Ya no existe la tabla de 4 negocios ni los nombres ajenos.
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText("Café Rincón Andino")).not.toBeInTheDocument();
    expect(screen.queryByText("Peluquería Estilo Sur")).not.toBeInTheDocument();
    expect(screen.queryByText("Cosmos Accesorios")).not.toBeInTheDocument();
  });

  it("3. la etiqueta obligatoria de datos simulados está presente", async () => {
    stubFetchServicio();
    guardarSesion(SESION_EMPRESA_1);
    render(<PanelPage />);

    expect(
      screen.getByText(
        "Datos simulados del servicio · 19 al 31 de octubre · no son clientes reales",
      ),
    ).toBeInTheDocument();
    // El resumen llega (no queda en "consultando").
    expect(await screen.findByText("25,0")).toBeInTheDocument();
  });

  it("4. gráfico por día de la empresa (11 días con respuestas) y bloques 2/17/1", async () => {
    stubFetchServicio();
    guardarSesion(SESION_EMPRESA_1);
    render(<PanelPage />);

    const dia = await screen.findByLabelText(
      "Cantidad de respuestas por día, de la más antigua a la más reciente",
    );
    const barras = within(dia).getAllByRole("listitem");
    // La serie de la empresa 1 tiene 11 días con respuestas.
    expect(barras).toHaveLength(11);
    expect(barras[0]).toHaveAttribute("aria-label", "19-10: 1 respuesta");
    expect(barras.at(-1)).toHaveAttribute("aria-label", "31-10: 1 respuesta");

    // Bloques del fixture empresa 1: Mañana 2 · Tarde 17 · Noche 1
    // (muestra mínima en Mañana y Noche).
    const momento = screen.getByLabelText(
      "Cantidad de respuestas por momento del día",
    );
    const bloques = within(momento).getAllByRole("listitem");
    expect(within(bloques[0]).getByText("2")).toBeInTheDocument();
    expect(within(bloques[1]).getByText("17")).toBeInTheDocument();
    expect(within(bloques[2]).getByText("1")).toBeInTheDocument();
    expect(within(bloques[2]).getByText("muestra mínima")).toBeInTheDocument();
  });

  it("5. distribución 11 filas (notas 0 a 10)", async () => {
    stubFetchServicio();
    guardarSesion(SESION_EMPRESA_1);
    render(<PanelPage />);

    const distribucion = await screen.findByLabelText(
      "Cantidad de respuestas por nota, de la 0 a la 10",
    );
    expect(within(distribucion).getAllByRole("listitem")).toHaveLength(11);
  });

  it("6. ninguna palabra prohibida aparece en el panel", async () => {
    stubFetchServicio();
    guardarSesion(SESION_EMPRESA_1);
    render(<PanelPage />);
    expect(await screen.findByText("25,0")).toBeInTheDocument();

    const texto = (document.body.textContent ?? "").toLowerCase();
    const prohibidas = [
      "kpi",
      "csat",
      "nps",
      "score",
      "dashboard",
      "insights",
      "tiempo real",
      "en construcción",
      "próximamente",
      "proximamente",
      "demo",
      "ejemplo",
    ];
    const encontradas = prohibidas.filter((p) => texto.includes(p));
    expect(encontradas).toEqual([]);
  });

  it("7. pestañas sin selector: Resultados usa el empresa_id de la sesión", async () => {
    stubFetchServicio();
    guardarSesion(SESION_EMPRESA_1);
    render(<PanelPage />);

    abrirPestana("Resultados");
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "id",
      "panel-resultados",
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Resultados" }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Negocio")).not.toBeInTheDocument();

    // Empresa 1 del fixture: recomendación neta 25,0 y media 8,05, sin
    // pasar por selector.
    expect(
      await screen.findByRole("heading", { name: "Resultados de este negocio" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("25,0")).toBeInTheDocument();
    expect(screen.getByText("8,05")).toBeInTheDocument();
  });

  it("8. pestaña Encuesta usa el empresa_id de la sesión", async () => {
    stubFetchServicio();
    guardarSesion(SESION_EMPRESA_1);
    render(<PanelPage />);

    abrirPestana("Encuesta");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("id", "panel-encuesta");
    expect(screen.queryByLabelText("Negocio")).not.toBeInTheDocument();
    expect(
      await screen.findByRole("heading", {
        name: "Encuesta definida para este negocio",
      }),
    ).toBeInTheDocument();
  });

  it("9. pestaña Reseñas usa el empresa_id de la sesión (20 · 17 · 5)", async () => {
    stubFetchServicio();
    guardarSesion(SESION_EMPRESA_1);
    render(<PanelPage />);

    abrirPestana("Reseñas");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("id", "panel-resenas");
    expect(screen.queryByLabelText("Negocio")).not.toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "Reseñas de este negocio" }),
    ).toBeInTheDocument();

    // Empresa 1 del fixture: 20 reseñas · 17 con comentario · 5 con alerta.
    expect(
      await screen.findByText("20 reseñas · 17 con comentario · 5 con alerta"),
    ).toBeInTheDocument();
    expect(screen.getByText("Mostrando 20 de 20 reseñas")).toBeInTheDocument();
  });

  it("10. cerrar sesión: borra ssd.sesion y navega a /entrar", async () => {
    stubFetchServicio();
    guardarSesion(SESION_EMPRESA_1);
    render(<PanelPage />);

    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: "Cerrar sesión" }));

    expect(window.localStorage.getItem(CLAVE_SESION)).toBeNull();
    expect(leerSesion()).toBeNull();
    expect(replaceMock).toHaveBeenCalledWith("/entrar");
  });

  it("11. sesión corrupta se trata como sin sesión", async () => {
    stubFetchServicio();
    window.localStorage.setItem(CLAVE_SESION, "{no-es-json");
    render(<PanelPage />);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/entrar");
    });
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });

  it("12. navegación por teclado: la flecha derecha activa y enfoca Resultados", async () => {
    stubFetchServicio();
    guardarSesion(SESION_EMPRESA_1);
    render(<PanelPage />);

    const tablist = await screen.findByRole("tablist");
    fireEvent.keyDown(tablist, { key: "ArrowRight" });

    expect(screen.getByRole("tab", { name: "Resultados" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "id",
      "panel-resultados",
    );
    expect(document.activeElement).toBe(
      screen.getByRole("tab", { name: "Resultados" }),
    );

    // La flecha izquierda vuelve a Resumen (orden circular).
    fireEvent.keyDown(tablist, { key: "ArrowLeft" });
    expect(screen.getByRole("tab", { name: "Resumen" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("13. el hash sincroniza la pestaña (enlaces de la navegación lateral)", async () => {
    stubFetchServicio();
    guardarSesion(SESION_EMPRESA_1);
    render(<PanelPage />);
    await screen.findByRole("tablist");

    window.location.hash = "#encuesta";
    fireEvent(window, new Event("hashchange"));

    expect(screen.getByRole("tab", { name: "Encuesta" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute("id", "panel-encuesta");

    // Un hash desconocido cae a Resumen.
    window.location.hash = "#cualquiera";
    fireEvent(window, new Event("hashchange"));
    expect(screen.getByRole("tab", { name: "Resumen" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("14. activar una pestaña actualiza el hash de la URL", async () => {
    stubFetchServicio();
    guardarSesion(SESION_EMPRESA_1);
    render(<PanelPage />);
    await screen.findByRole("tablist");

    abrirPestana("Resultados");
    expect(window.location.hash).toBe("#resultados");
  });
});

describe("PanelNavLinks: navegación lateral", () => {
  it("15. los módulos vivos son anclas de hash y Resumen queda activo por defecto", () => {
    render(<PanelNavLinks variante="sidebar" />);

    const resumen = screen.getByRole("link", { name: "Resumen" });
    expect(resumen).toHaveAttribute("href", "#resumen");
    expect(resumen).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Resultados" })).toHaveAttribute(
      "href",
      "#resultados",
    );
    expect(screen.getByRole("link", { name: "Encuesta" })).toHaveAttribute(
      "href",
      "#encuesta",
    );
    expect(screen.getByRole("link", { name: "Reseñas" })).toHaveAttribute(
      "href",
      "#resenas",
    );
  });

  it("16. Códigos QR y Ajustes quedan visibles pero deshabilitados, sin href", () => {
    render(<PanelNavLinks variante="topbar" />);

    for (const nombre of ["Códigos QR", "Ajustes"]) {
      const item = screen.getByRole("link", { name: nombre });
      expect(item).toHaveAttribute("aria-disabled", "true");
      expect(item).not.toHaveAttribute("href");
    }

    // Reseñas ya es un módulo vivo: enlace real, nunca deshabilitado.
    const resenas = screen.getByRole("link", { name: "Reseñas" });
    expect(resenas).toHaveAttribute("href", "#resenas");
    expect(resenas).not.toHaveAttribute("aria-disabled");
  });
});
