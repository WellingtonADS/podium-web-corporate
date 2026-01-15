import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../tests/test-utils";
import Bookings from "../Bookings";

describe("Bookings page", () => {
  it("renders bookings list and cancels booking", async () => {
    renderWithProviders(<Bookings />);

    await waitFor(() =>
      expect(screen.getByText(/Reservas/i)).toBeInTheDocument()
    );

    // Create a new booking via the modal
    await waitFor(() =>
      screen.getByRole("button", { name: /\+ Nova Reserva/i })
    );
    fireEvent.click(screen.getByRole("button", { name: /\+ Nova Reserva/i }));

    await waitFor(() => screen.getByLabelText(/Origem/i));
    fireEvent.change(screen.getByLabelText(/Origem/i), {
      target: { value: "Av Teste 1" },
    });
    fireEvent.change(screen.getByLabelText(/Destino/i), {
      target: { value: "Rua Teste 2" },
    });

    // Wait for employee options and select the first one
    await waitFor(() =>
      expect(screen.getByText(/João Silva/)).toBeInTheDocument()
    );
    fireEvent.change(screen.getByLabelText(/Passageiro/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    // Table should show the newly created booking
    await waitFor(() =>
      expect(screen.getByText(/Av Teste 1/)).toBeInTheDocument()
    );

    // Click cancel for the newly created booking (find row by origin)
    const row = screen.getByText(/Av Teste 1/).closest("tr");
    expect(row).toBeTruthy();
    const { within } = await import("@testing-library/react");
    const cancelBtn = within(row as HTMLElement).getByRole("button", {
      name: /Cancelar/i,
    });
    fireEvent.click(cancelBtn);

    // After cancel, the status cell should show 'cancelled'
    await waitFor(() =>
      expect(screen.getByText(/cancelled|cancelada/i)).toBeInTheDocument()
    );
  });
});
