import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../tests/test-utils";
import Bookings from "../Bookings";

describe("Bookings page", () => {
  it("renders bookings list and cancels booking", async () => {
    renderWithProviders(<Bookings />);

    await waitFor(() =>
      expect(screen.getByText(/Reservas/i)).toBeInTheDocument(),
    );

    // Create a new booking via the modal
    await waitFor(() =>
      screen.getByRole("button", { name: /\+ Nova Reserva/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /\+ Nova Reserva/i }));

    await waitFor(() => screen.getByLabelText(/Origem/i));
    fireEvent.change(screen.getByLabelText(/Origem/i), {
      target: { value: "Av Teste 1" },
    });
    fireEvent.change(screen.getByLabelText(/Destino/i), {
      target: { value: "Rua Teste 2" },
    });

    // Focus and type into employee search to reveal options, then select first
    const passengerInput = screen.getByLabelText(/Passageiro/i);
    fireEvent.focus(passengerInput);
    fireEvent.change(passengerInput, { target: { value: "João" } });
    await waitFor(() =>
      expect(screen.getByText(/João Silva/)).toBeInTheDocument(),
    );
    const passengerOption = screen.getByText(/João Silva/);
    fireEvent.click(passengerOption);

    // Select a cost center (required) using the same select pattern as Passageiro
    await waitFor(() =>
      expect(screen.getByLabelText(/Centro de Custo/i)).toBeInTheDocument(),
    );
    const ccInput = screen.getByLabelText(/Centro de Custo/i);
    // focus and type to reveal options
    fireEvent.focus(ccInput);
    fireEvent.change(ccInput, { target: { value: "Diretoria" } });
    const ccOption = await waitFor(() => screen.getByText(/Diretoria/), {
      timeout: 5000,
    });
    // click the option to select
    fireEvent.click(ccOption);

    // Wait for the selection to reflect in the input
    await waitFor(
      () => expect((ccInput as HTMLInputElement).value).not.toBe(""),
      {
        timeout: 5000,
      },
    );

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    // Table should show the newly created booking
    await waitFor(() =>
      expect(screen.getByText(/Av Teste 1/)).toBeInTheDocument(),
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
      expect(screen.getByText(/cancelled|cancelada/i)).toBeInTheDocument(),
    );
  }, 20000);
});
