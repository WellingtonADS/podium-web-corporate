import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Booking,
  createBooking,
  CreateBookingData,
  fetchBookings,
} from "../services/api";

export const useBookings = () => {
  const queryClient = useQueryClient();

  const bookingsQuery = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    staleTime: 10000,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateBookingData) => createBooking(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });

  return {
    bookings: bookingsQuery.data ?? [],
    loading: bookingsQuery.isLoading,
    error: bookingsQuery.error,
    createBooking: createMutation.mutateAsync,
    creating: createMutation.isPending,
  };
};
