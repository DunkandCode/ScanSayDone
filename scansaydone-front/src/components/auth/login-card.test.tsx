/// <reference types="vitest/globals" />
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LoginCard } from "./login-card";
import { CLAVE_SESION, leerSesion } from "@/lib/auth/sesion";

/**
 * LoginCard: login real contra /api/v1/auth/login (fetch mockeado) con
 * navegación mockeada de next/navigation. La tarjeta ya no es demo: sin
 * chip «DEMO» ni mensaje de demostración.
 */

const pushMock = vi.fn();
const replaceMock = vi.fn();
// Identidad estable: useRouter devuelve SIEMPRE este mismo objeto.
const routerMock = { push: pushMock, replace: replaceMock };

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

/** Respuesta fetch mínima con headers.get (lo único que usa el cliente). */
function respuestaHttp(status: number, cuerpo: unknown, contentType = "application/json") {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: {
      get: (nombre: string) =>
        nombre.toLowerCase() === "content-type" ? contentType : null,
    },
    json: async () => cuerpo,
  };
}

function stubLogin(status: number, cuerpo: unknown) {
  return vi.fn(async () => respuestaHttp(status, cuerpo));
}

describe("LoginCard", () => {
  beforeEach(() => {
    window.localStorage.clear();
    pushMock.mockClear();
    replaceMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it("renderiza los dos campos con sus etiquetas y sus autocomplete", () => {
    render(<LoginCard />);

    const usernameInput = screen.getByLabelText("Tu usuario");
    const passwordInput = screen.getByLabelText("Tu contraseña");

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(usernameInput).toHaveAttribute("autocomplete", "username");
    expect(passwordInput).toHaveAttribute("autocomplete", "current-password");
  });

  it("el campo de contraseña es type='password' y el control lo cambia a 'text' y vuelve, con aria-pressed correcto", async () => {
    const user = userEvent.setup();
    render(<LoginCard />);

    const passwordInput = screen.getByLabelText("Tu contraseña");
    const toggleButton = screen.getByRole("button", { name: /ver contraseña/i });

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(toggleButton).toHaveAttribute("aria-pressed", "false");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(toggleButton).toHaveAttribute("aria-pressed", "true");
    expect(toggleButton).toHaveTextContent("Ocultar");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(toggleButton).toHaveAttribute("aria-pressed", "false");
    expect(toggleButton).toHaveTextContent("Ver");
  });

  it("el botón dice ENTRAR y la tarjeta ya no es demo", () => {
    render(<LoginCard />);
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent("ENTRAR");

    // El chip «DEMO» y la confesión de demostración desaparecieron.
    expect(screen.queryByText("DEMO")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Todavía no se abre ninguna sesión."),
    ).not.toBeInTheDocument();
  });

  it("campos vacíos: mensajes de incompletitud y cero llamadas a la API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<LoginCard />);

    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(screen.getByText("Escribe tu usuario para continuar.")).toBeInTheDocument();
    expect(screen.getByText("Escribe tu contraseña para continuar.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("un solo campo lleno muestra solo el mensaje del que falta", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<LoginCard />);

    await user.type(screen.getByLabelText("Tu usuario"), "minimarket_don_lucho");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(
      screen.queryByText("Escribe tu usuario para continuar."),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Escribe tu contraseña para continuar.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("401 → «Usuario o contraseña incorrectos.» y no guarda sesión", async () => {
    vi.stubGlobal(
      "fetch",
      stubLogin(401, { detail: "Usuario o contraseña incorrectos." }),
    );
    const user = userEvent.setup();
    render(<LoginCard />);

    await user.type(screen.getByLabelText("Tu usuario"), "minimarket_don_lucho");
    await user.type(screen.getByLabelText("Tu contraseña"), "malapass");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(
      await screen.findByText("Usuario o contraseña incorrectos."),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem(CLAVE_SESION)).toBeNull();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("422 → «Revisa el usuario y la contraseña.»", async () => {
    vi.stubGlobal("fetch", stubLogin(422, { detail: "Validación" }));
    const user = userEvent.setup();
    render(<LoginCard />);

    await user.type(screen.getByLabelText("Tu usuario"), "x");
    await user.type(screen.getByLabelText("Tu contraseña"), "y");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(
      await screen.findByText("Revisa el usuario y la contraseña."),
    ).toBeInTheDocument();
  });

  it("5xx → «No se pudo consultar el servicio. Intenta de nuevo.»", async () => {
    vi.stubGlobal("fetch", stubLogin(503, {}));
    const user = userEvent.setup();
    render(<LoginCard />);

    await user.type(screen.getByLabelText("Tu usuario"), "cosmos_accesorios");
    await user.type(screen.getByLabelText("Tu contraseña"), "secreta");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(
      await screen.findByText("No se pudo consultar el servicio. Intenta de nuevo."),
    ).toBeInTheDocument();
  });

  it("éxito: guarda la sesión en ssd.sesion y navega a /panel sin mostrar la cuenta", async () => {
    const sesionApi = {
      usuario: "cafe_rincon_andino",
      empresa_id: 2,
      nombre_negocio: "Café Rincón Andino",
    };
    vi.stubGlobal("fetch", stubLogin(200, sesionApi));
    const user = userEvent.setup();
    render(<LoginCard />);

    await user.type(screen.getByLabelText("Tu usuario"), "cafe_rincon_andino");
    await user.type(screen.getByLabelText("Tu contraseña"), "secreta");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/panel");
    });
    expect(leerSesion()).toEqual(sesionApi);

    // La tarjeta no muestra datos de la cuenta.
    expect(screen.queryByText("cafe_rincon_andino")).not.toBeInTheDocument();
    expect(screen.queryByText("Café Rincón Andino")).not.toBeInTheDocument();
  });

  it("mientras envía: botón deshabilitado con «Entrando…» y aria-busy en el formulario", async () => {
    let resolver: ((valor: unknown) => void) | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise<unknown>((resolve) => {
            resolver = resolve;
          }),
      ),
    );
    const user = userEvent.setup();
    render(<LoginCard />);

    await user.type(screen.getByLabelText("Tu usuario"), "minimarket_don_lucho");
    await user.type(screen.getByLabelText("Tu contraseña"), "secreta");
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    await user.click(submitButton);

    // Estado enviando: texto cambiado, deshabilitado y aria-busy.
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Entrando…");
    const formulario = screen.getByLabelText("Tu usuario").closest("form");
    expect(formulario).toHaveAttribute("aria-busy", "true");

    // Resuelve el login: el botón vuelve a habilitarse.
    resolver?.(respuestaHttp(401, { detail: "Usuario o contraseña incorrectos." }));
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    expect(submitButton).toHaveTextContent("ENTRAR");
    expect(formulario).toHaveAttribute("aria-busy", "false");
  });

  it("no hay texto que juzgue credenciales antes de enviar", () => {
    render(<LoginCard />);
    const content = document.body.textContent || "";
    expect(content.toLowerCase()).not.toContain("incorrecta");
    expect(content.toLowerCase()).not.toContain("no existe");
    expect(content.toLowerCase()).not.toContain("contraseña incorrecta");
  });

  it("no aparece 'Ver la demo del panel'", () => {
    render(<LoginCard />);
    expect(screen.queryByText(/ver la demo del panel/i)).not.toBeInTheDocument();
  });

  it("no hay ningún enlace salvo 'Volver al sitio' con href='/'", () => {
    render(<LoginCard />);
    const backLink = screen.getByText("Volver al sitio");
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");

    const allLinks = screen.getAllByRole("link");
    expect(allLinks).toHaveLength(1);
  });

  it("la tarjeta no contiene ningún focable extraño", () => {
    const { container } = render(<LoginCard />);

    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    // Exactamente: 2 inputs + 1 toggle + 1 submit + 1 link.
    expect(focusableElements.length).toBe(5);
  });
});
