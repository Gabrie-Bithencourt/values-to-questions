import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Index } from "@/routes/index";

// Titles of the sections shown in the generated script (each section card has its title in an input).
const sectionTitles = () =>
  Array.from(document.querySelectorAll("ol li")).map((li) => li.querySelector("input")?.value ?? "");

async function clickFitAndGenerate() {
  fireEvent.click(screen.getByRole("button", { name: /Fit cultural/i }));
  fireEvent.click(screen.getByRole("button", { name: /Gerar roteiro/i }));
  // The script is filled in asynchronously, so wait for a section that is always generated.
  await screen.findByText("Colaboração", undefined, { timeout: 5000 });
}

describe("Fit cultural script generation", () => {
  it("leaves out the 'Pontos de atenção' section when nothing was typed there", async () => {
    render(<Index />);
    await clickFitAndGenerate();

    expect(sectionTitles()).not.toContain("Pontos de atenção");
  });

  it("includes the 'Pontos de atenção' section once the user describes one", async () => {
    render(<Index />);
    fireEvent.click(screen.getByRole("button", { name: /Fit cultural/i }));
    fireEvent.change(screen.getByPlaceholderText(/Falta de comprometimento/i), {
      target: { value: "Falta de comprometimento" },
    });
    await clickFitAndGenerate();

    expect(sectionTitles()).toContain("Pontos de atenção");
  });

  it("shows no time estimate in the generated script", async () => {
    render(<Index />);
    await clickFitAndGenerate();

    expect(screen.queryByText(/duração estimada/i)).toBeNull();
    expect(document.querySelector('ol li input[type="number"]')).toBeNull();
  });
});
