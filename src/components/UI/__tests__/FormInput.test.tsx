import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../tests/test-utils";
import FormInput from "../../UI/FormInput";

test("FormInput renders label and allows input", () => {
  renderWithProviders(<FormInput label="Email" name="email" />);
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
});
