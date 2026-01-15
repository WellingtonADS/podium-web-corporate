import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { useBookings } from "../useBookings";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useBookings", () => {
  it("fetches bookings and allows creating a booking", async () => {
    const { result } = renderHook(() => useBookings(), {
      wrapper: createWrapper(),
    });

    // Create booking directly and ensure it appears in the list
    await act(async () => {
      await result.current.createBooking({
        origin_address: "A",
        dest_address: "B",
        passenger_id: 1,
        cost_center_id: 1,
      });
    });

    // After creation, bookings should be invalidated and refetched
    await waitFor(() =>
      expect(result.current.bookings.length).toBeGreaterThanOrEqual(1)
    );
    expect(result.current.bookings[0]).toHaveProperty("id");
  });
});
