import { fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { renderWithProviders } from "../../tests/test-utils";
import { BookingForm } from "../BookingForm";

describe("BookingForm", () => {
  it("shows validation and calls onClose on success", async () => {
    const onClose = vi.fn();

    renderWithProviders(<BookingForm isOpen={true} onClose={onClose} />);

    // Try submitting without required fields
    const submitBtn =
      screen.getByRole("button", { name: /salvar/i }) ||
      screen.getByText(/salvar/i);
    fireEvent.click(submitBtn);

    // validation toast should be displayed
    await waitFor(() =>
      expect(
        screen.getByText(/Preencha origem, destino e passageiro/i)
      ).toBeInTheDocument()
    );

    // Fill fields
    fireEvent.change(screen.getByLabelText(/origem/i), {
      target: { value: "A" },
    });
    fireEvent.change(screen.getByLabelText(/destino/i), {
      target: { value: "B" },
    });

    // Wait for employee options to load and pick one
    await waitFor(() =>
      expect(screen.getByText(/João Silva/i)).toBeInTheDocument()
    );
    fireEvent.change(screen.getByLabelText(/passageiro/i), {
      target: { value: "1" },
    });

    fireEvent.click(submitBtn);

    // onClose should be called after success
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
