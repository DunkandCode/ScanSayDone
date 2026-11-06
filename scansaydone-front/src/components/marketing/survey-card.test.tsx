/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SurveyCard } from "./survey-card";

describe("SurveyCard", () => {
  it("renders all 0–10 radio options with accessible names", () => {
    render(<SurveyCard />);

    for (let i = 0; i <= 10; i++) {
      const radio = screen.getByRole("radio", { name: String(i) });
      expect(radio).toBeInTheDocument();
    }
  });

  it("radiogroup references the question heading via aria-labelledby", () => {
    render(<SurveyCard />);

    const heading = screen.getByRole("heading", {
      name: /¿Cómo fue tu experiencia hoy\?/i,
    });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute("id", "survey-question");

    const radiogroup = screen.getByRole("radiogroup");
    expect(radiogroup).toHaveAttribute("aria-labelledby", "survey-question");
  });

  it("keyboard arrow navigation updates selection and moves focus", async () => {
    const user = userEvent.setup();
    render(<SurveyCard />);

    const radio0 = screen.getByRole("radio", { name: "0" });
    const radio1 = screen.getByRole("radio", { name: "1" });
    const radio2 = screen.getByRole("radio", { name: "2" });

    // Focus first radio (tabIndex 0 by default when nothing selected)
    radio0.focus();
    expect(radio0).toHaveFocus();

    // ArrowRight → select 1
    await user.keyboard("{ArrowRight}");
    expect(radio1).toHaveAttribute("aria-checked", "true");
    expect(radio1).toHaveFocus();

    // ArrowDown → select 2
    await user.keyboard("{ArrowDown}");
    expect(radio2).toHaveAttribute("aria-checked", "true");
    expect(radio2).toHaveFocus();

    // ArrowLeft → back to 1
    await user.keyboard("{ArrowLeft}");
    expect(radio1).toHaveAttribute("aria-checked", "true");
    expect(radio1).toHaveFocus();
  });

  it("submit button is disabled until a selection is made", async () => {
    const user = userEvent.setup();
    render(<SurveyCard />);

    const submitButton = screen.getByRole("button", { name: /enviar/i });
    expect(submitButton).toBeDisabled();

    // Select a value
    const radio5 = screen.getByRole("radio", { name: "5" });
    await user.click(radio5);

    // Submit should now be enabled
    expect(submitButton).toBeEnabled();
  });

  it("selecting then submitting displays honest demo status without success claim", async () => {
    const user = userEvent.setup();
    render(<SurveyCard />);

    // No status message before submit
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    // Select a value
    const radio7 = screen.getByRole("radio", { name: "7" });
    await user.click(radio7);
    expect(radio7).toHaveAttribute("aria-checked", "true");

    // Submit
    const submitButton = screen.getByRole("button", { name: /enviar/i });
    expect(submitButton).toBeEnabled();
    await user.click(submitButton);

    // Verify honest demo status message appears
    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent(
      "Demostración: todavía no guardamos respuestas."
    );

    // Ensure no false success claims
    expect(status).not.toHaveTextContent(/enviada/i);
    expect(status).not.toHaveTextContent(/guardada/i);
    expect(status).not.toHaveTextContent(/éxito/i);
    expect(status).not.toHaveTextContent(/success/i);
  });

  it("changing selection after submit hides the status message", async () => {
    const user = userEvent.setup();
    render(<SurveyCard />);

    // Select and submit
    await user.click(screen.getByRole("radio", { name: "5" }));
    await user.click(screen.getByRole("button", { name: /enviar/i }));

    // Status should be visible
    expect(screen.getByRole("status")).toBeInTheDocument();

    // Change selection
    await user.click(screen.getByRole("radio", { name: "8" }));

    // Status should disappear
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("keyboard re-selection after submit hides the status message", async () => {
    const user = userEvent.setup();
    render(<SurveyCard />);

    // Select via click and submit to show demo note
    await user.click(screen.getByRole("radio", { name: "3" }));
    await user.click(screen.getByRole("button", { name: /enviar/i }));

    // Status should be visible
    expect(screen.getByRole("status")).toBeInTheDocument();

    // Focus the selected radio and use arrow to change selection
    const radio3 = screen.getByRole("radio", { name: "3" });
    radio3.focus();
    await user.keyboard("{ArrowRight}"); // moves to 4

    // Status should disappear — same reset behavior as click
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("keyboard Home and End keys navigate to first and last options", async () => {
    const user = userEvent.setup();
    render(<SurveyCard />);

    const radio0 = screen.getByRole("radio", { name: "0" });
    const radio10 = screen.getByRole("radio", { name: "10" });

    // Focus first radio
    radio0.focus();

    // End → select 10
    await user.keyboard("{End}");
    expect(radio10).toHaveAttribute("aria-checked", "true");
    expect(radio10).toHaveFocus();

    // Home → back to 0
    await user.keyboard("{Home}");
    expect(radio0).toHaveAttribute("aria-checked", "true");
    expect(radio0).toHaveFocus();
  });
});
