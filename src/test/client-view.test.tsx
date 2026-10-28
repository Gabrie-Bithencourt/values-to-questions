import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RoteiroBuilder } from "@/components/roteiro/RoteiroBuilder";

describe("Visão da empresa", () => {
  it("offers only the fit cultural fields", { timeout: 20000 }, () => {
    render(<RoteiroBuilder variant="empresa" />);

    expect(screen.queryByRole("button", { name: /Roteiro livre/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /Fit cultural/i })).toBeNull();
    expect(screen.getByText(/Quais são os valores mais importantes da empresa/i)).toBeTruthy();
  });

  it("offers both modes in the admin view", { timeout: 20000 }, () => {
    render(<RoteiroBuilder variant="admin" />);

    expect(screen.getByRole("button", { name: /Roteiro livre/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Fit cultural/i })).toBeTruthy();
  });
});
