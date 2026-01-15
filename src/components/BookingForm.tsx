import { useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useBookings } from "../hooks/useBookings";
import { fetchEmployees, User } from "../services/api";
import { FormInput } from "./UI/FormInput";
import { FormModal } from "./UI/FormModal";
import { FormSelect } from "./UI/FormSelect";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialPassengerId?: number;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  isOpen,
  onClose,
  initialPassengerId,
}) => {
  const toast = useToast();
  const { createBooking, creating } = useBookings();

  const [employees, setEmployees] = useState<User[]>([]);
  const [payload, setPayload] = useState({
    origin_address: "",
    dest_address: "",
    passenger_id: initialPassengerId ?? 0,
    cost_center_id: 0,
    notes: "",
  });

  // Reset passenger when modal opened/closed
  useEffect(() => {
    if (isOpen) {
      setPayload({
        origin_address: "",
        dest_address: "",
        passenger_id: initialPassengerId ?? 0,
        cost_center_id: 0,
        notes: "",
      });
    }
  }, [isOpen, initialPassengerId]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  const handleSubmit = async () => {
    if (
      !payload.origin_address ||
      !payload.dest_address ||
      !payload.passenger_id
    ) {
      toast({
        title: "Preencha origem, destino e passageiro",
        status: "warning",
      });
      return;
    }

    try {
      await createBooking({
        origin_address: payload.origin_address,
        dest_address: payload.dest_address,
        passenger_id: payload.passenger_id,
        cost_center_id: payload.cost_center_id || 1,
        notes: payload.notes,
      });

      toast({ title: "Reserva criada", status: "success" });
      onClose();
    } catch {
      toast({ title: "Erro ao criar reserva", status: "error" });
    }
  };

  return (
    <FormModal
      title="Solicitar / Agendar Corrida"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={creating}
    >
      <FormInput
        label="Origem"
        value={payload.origin_address}
        onChange={(e) =>
          setPayload({ ...payload, origin_address: e.target.value })
        }
      />
      <FormInput
        label="Destino"
        value={payload.dest_address}
        onChange={(e) =>
          setPayload({ ...payload, dest_address: e.target.value })
        }
      />
      <FormSelect
        label="Passageiro"
        value={payload.passenger_id}
        onChange={(e) =>
          setPayload({ ...payload, passenger_id: Number(e.target.value) })
        }
      >
        <option value={0}>Selecione um funcionário</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.full_name} — {emp.email}
          </option>
        ))}
      </FormSelect>
      <FormInput
        label="Observações (opcional)"
        value={payload.notes}
        onChange={(e) => setPayload({ ...payload, notes: e.target.value })}
      />
    </FormModal>
  );
};
