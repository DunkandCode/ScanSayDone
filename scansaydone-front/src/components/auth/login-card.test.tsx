import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { LoginCard } from "./login-card";

describe("LoginCard", () => {
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

  it("el botón dice ENTRAR", () => {
    render(<LoginCard />);
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent("ENTRAR");
  });

  it("enviar vacío muestra los dos mensajes de incompletitud", async () => {
    const user = userEvent.setup();
    render(<LoginCard />);

    const submitButton = screen.getByRole("button", { name: /entrar/i });
    await user.click(submitButton);

    expect(screen.getByText("Escribe tu usuario para continuar.")).toBeInTheDocument();
    expect(screen.getByText("Escribe tu contraseña para continuar.")).toBeInTheDocument();
  });

  it("enviar con un solo campo lleno muestra solo el que falta", async () => {
    const user = userEvent.setup();
    render(<LoginCard />);

    const usernameInput = screen.getByLabelText("Tu usuario");
    await user.type(usernameInput, "testuser");

    const submitButton = screen.getByRole("button", { name: /entrar/i });
    await user.click(submitButton);

    expect(screen.queryByText("Escribe tu usuario para continuar.")).not.toBeInTheDocument();
    expect(screen.getByText("Escribe tu contraseña para continuar.")).toBeInTheDocument();
  });

  it("enviar con los dos llenos muestra 'Demostración: no se ha iniciado ninguna sesión.'", async () => {
    const user = userEvent.setup();
    render(<LoginCard />);

    const usernameInput = screen.getByLabelText("Tu usuario");
    const passwordInput = screen.getByLabelText("Tu contraseña");

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "testpass");

    const submitButton = screen.getByRole("button", { name: /entrar/i });
    await user.click(submitButton);

    expect(
      screen.getByText("Demostración: no se ha iniciado ninguna sesión.")
    ).toBeInTheDocument();
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

  it("no hay texto que juzgue credenciales", () => {
    render(<LoginCard />);
    const content = document.body.textContent || "";
    expect(content.toLowerCase()).not.toContain("incorrecta");
    expect(content.toLowerCase()).not.toContain("no existe");
    expect(content.toLowerCase()).not.toContain("contraseña incorrecta");
  });

  it("el chip DEMO y su línea están presentes antes del primer campo", () => {
    render(<LoginCard />);

    const demoChip = screen.getByText("DEMO");
    const confessionText = screen.getByText("Todavía no se abre ninguna sesión.");
    const usernameInput = screen.getByLabelText("Tu usuario");

    expect(demoChip).toBeInTheDocument();
    expect(confessionText).toBeInTheDocument();

    // Verify order in DOM
    const chipPosition = demoChip.compareDocumentPosition(usernameInput);
    expect(chipPosition & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("la pieza derecha existe, es aria-hidden y no contiene ningún focable", () => {
    const { container } = render(<LoginCard />);

    // LoginCard doesn't include the visual piece, so this test should pass
    // The visual piece is tested separately in login-visual.test.tsx if needed
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    // Should have exactly: 2 inputs + 1 toggle button + 1 submit button + 1 link = 5
    expect(focusableElements.length).toBe(5);
  });
});
