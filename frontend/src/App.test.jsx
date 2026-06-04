import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the landing page", () => {
  render(<App />);
  expect(screen.getAllByText(/Sync-Space/i).length).toBeGreaterThan(0);
});
