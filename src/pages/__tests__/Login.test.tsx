import { screen } from "@testing-library/react";
import Login from "../../pages/Login";
import { renderWithProviders } from "../../tests/test-utils";

test("Login renders and has a submit button", () => {
  renderWithProviders(<Login />);
  expect(
    screen.getByRole("button", { name: /Entrar|Login/i })
  ).toBeInTheDocument();
});
