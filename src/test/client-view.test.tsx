import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Index } from "@/routes/index";

describe("Client view", () => {
  it("offers only the fit cultural mode", { timeout: 20000 }, () => {
    render(<Index />);
    fireEvent.click(screen.getByRole("button", { name: /visão do cliente/i }));

    expect(screen.queryByRole("button", { name: /Roteiro livre/i })).toBeNull();
    expect(screen.getByRole("button", { name: /Fit cultural/i })).toBeTruthy();
  });

  it("brings both modes back when the client view is turned off", { timeout: 20000 }, () => {
    render(<Index />);
    fireEvent.click(screen.getByRole("button", { name: /visão do cliente/i }));
    fireEvent.click(screen.getByRole("button", { name: /visão do cliente/i }));

    expect(screen.getByRole("button", { name: /Roteiro livre/i })).toBeTruthy();
  });
});
