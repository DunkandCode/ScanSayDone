/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Faqs } from "./faqs";

const PREGUNTAS = [
  "¿Tengo que instalar algo?",
  "¿Mis clientes tienen que instalar algo o crear una cuenta?",
  "¿Dónde veo lo que responden?",
  "¿Tengo que reimprimir el QR cada vez?",
  "¿Lo que se ve en esta página es real?",
];

const RESPUESTAS = [
  "No. La encuesta funciona en el navegador, el tuyo y el de tus clientes. No hay que descargar nada.",
  "Tampoco. Enfocan el teléfono al QR y la encuesta se abre en el navegador.",
  "En tu panel. Cada opinión entra con su fecha, su canal y lo que contestó.",
  "El mismo QR sirve para siempre: no hay que reimprimirlo.",
  "No. Es un ejemplo. Cuando falta un dato o una foto reales, la página lo dice con letras.",
];

describe("Faqs", () => {
  it("renders exactly one h2 with 'LO QUE PUEDES PREGUNTARTE'", () => {
    render(<Faqs />);
    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s).toHaveLength(1);
    expect(h2s[0]).toHaveTextContent("LO QUE PUEDES PREGUNTARTE");
  });

  it("section is findable by region role with accessible name and has id='faq'", () => {
    render(<Faqs />);
    const section = screen.getByRole("region", {
      name: "LO QUE PUEDES PREGUNTARTE",
    });
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("id", "faq");
  });

  it("renders exactly 5 buttons with the 5 questions in order", () => {
    render(<Faqs />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
    PREGUNTAS.forEach((q, i) => {
      expect(buttons[i]).toHaveTextContent(q);
    });
  });

  it("renders exactly 5 h3 headings and each contains a button", () => {
    render(<Faqs />);
    const h3s = screen.getAllByRole("heading", { level: 3 });
    expect(h3s).toHaveLength(5);
    h3s.forEach((h3) => {
      const button = h3.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  });

  it("initially all buttons have aria-expanded='false' and all panels are hidden", () => {
    render(<Faqs />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute("aria-expanded", "false");
    });
    for (let i = 1; i <= 5; i++) {
      const panel = document.getElementById(`l6-a${i}`);
      expect(panel).toHaveAttribute("hidden", "");
    }
  });

  it("clicking button 1 opens it: aria-expanded='true' and panel visible with exact text in role=region", async () => {
    const user = userEvent.setup();
    render(<Faqs />);
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    const panel = screen.getByRole("region", { name: PREGUNTAS[0] });
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveTextContent(RESPUESTAS[0]);
  });

  it("clicking button 1 again closes it: aria-expanded='false' and panel hidden", async () => {
    const user = userEvent.setup();
    render(<Faqs />);
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    await user.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "false");
    const panel = document.getElementById("l6-a1");
    expect(panel).toHaveAttribute("hidden", "");
  });

  it("multiple items can be open at once", async () => {
    const user = userEvent.setup();
    render(<Faqs />);
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);
    await user.click(buttons[2]);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[2]).toHaveAttribute("aria-expanded", "true");
    const panel1 = screen.getByRole("region", { name: PREGUNTAS[0] });
    const panel3 = screen.getByRole("region", { name: PREGUNTAS[2] });
    expect(panel1).toBeInTheDocument();
    expect(panel3).toBeInTheDocument();
  });

  it("each button has aria-controls matching its panel id, and each panel has aria-labelledby matching its button id", () => {
    render(<Faqs />);
    for (let i = 1; i <= 5; i++) {
      const button = document.getElementById(`l6-q${i}`);
      const panel = document.getElementById(`l6-a${i}`);
      expect(button).toHaveAttribute("aria-controls", `l6-a${i}`);
      expect(panel).toHaveAttribute("aria-labelledby", `l6-q${i}`);
    }
  });

  it("all 5 answers match the exact approved strings", () => {
    render(<Faqs />);
    RESPUESTAS.forEach((a) => {
      expect(screen.getByText(a)).toBeInTheDocument();
    });
  });

  it("has exactly one link with href='/contactus' and accessible name 'Escríbenos'", () => {
    render(<Faqs />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/contactus");
    expect(links[0]).toHaveTextContent("Escríbenos");
  });

  it("renders the eyebrow, lead, and footer text", () => {
    render(<Faqs />);
    expect(screen.getByText("DUDAS")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Son las que este producto ya puede responder. Las demás, escríbenos."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("¿Otra duda?")).toBeInTheDocument();
  });

  it("all SVGs have aria-hidden='true', focusable='false', and data-decorativo", () => {
    render(<Faqs />);
    const svgs = document.querySelectorAll(
      "svg[data-decorativo='chevron-acordeon']"
    );
    expect(svgs).toHaveLength(5);
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("focusable", "false");
    });
  });
});
