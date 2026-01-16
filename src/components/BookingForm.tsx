import { useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useBookings } from "../hooks/useBookings";
import {
  CostCenter,
  fetchCostCenters,
  fetchEmployees,
  User,
} from "../services/api";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { FormInput } from "./UI/FormInput";
import { FormModal } from "./UI/FormModal";
import { FormSelect } from "./UI/FormSelect";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialPassengerId?: number;
}

interface AddressData {
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
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
    origin_lat: 0,
    origin_lng: 0,
    dest_address: "",
    dest_lat: 0,
    dest_lng: 0,
    passenger_id: initialPassengerId ?? 0,
    cost_center_id: 0,
    notes: "",
    scheduled_time: "",
  });

  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);

  // Reset quando modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      setPayload({
        origin_address: "",
        origin_lat: 0,
        origin_lng: 0,
        dest_address: "",
        dest_lat: 0,
        dest_lng: 0,
        passenger_id: initialPassengerId ?? 0,
        cost_center_id: 0,
        notes: "",
        scheduled_time: "",
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

    const loadCostCenters = async () => {
      try {
        const ccs = await fetchCostCenters();
        setCostCenters(ccs);
      } catch {
        // ignore
      }
    };
    loadCostCenters();
  }, []);

  const handleOriginSelect = (addressData: AddressData) => {
    setPayload({
      ...payload,
      origin_address: addressData.address,
      origin_lat: addressData.latitude,
      origin_lng: addressData.longitude,
    });
  };

  const handleDestSelect = (addressData: AddressData) => {
    setPayload({
      ...payload,
      dest_address: addressData.address,
      dest_lat: addressData.latitude,
      dest_lng: addressData.longitude,
    });
  };

  const handleSubmit = async () => {
    if (
      !payload.origin_address ||
      !payload.dest_address ||
      !payload.passenger_id ||
      !payload.cost_center_id
    ) {
      toast({
        title: "Preencha origem, destino, passageiro e centro de custo",
        status: "warning",
      });
      return;
    }

    // Validate scheduled_time if provided
    if (payload.scheduled_time) {
      const scheduledDate = new Date(payload.scheduled_time);
      const now = new Date();
      const minTime = new Date(now.getTime() + 30 * 60 * 1000); // +30min
      const maxTime = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30days

      if (scheduledDate < minTime) {
        toast({
          title:
            "Agendamento deve ser feito com no mínimo 30 minutos de antecedência",
          status: "warning",
        });
        return;
      }

      if (scheduledDate > maxTime) {
        toast({
          title:
            "Agendamento não pode ser feito com mais de 30 dias de antecedência",
          status: "warning",
        });
        return;
      }
    }

    try {
      await createBooking({
        origin_address: payload.origin_address,
        origin_lat: payload.origin_lat,
        origin_lng: payload.origin_lng,
        dest_address: payload.dest_address,
        dest_lat: payload.dest_lat,
        dest_lng: payload.dest_lng,
        passenger_id: payload.passenger_id,
        cost_center_id:
          payload.cost_center_id === 0 ? undefined : payload.cost_center_id,
        notes: payload.notes,
        scheduled_time: payload.scheduled_time || undefined,
      });

      toast({ title: "Reserva criada com sucesso!", status: "success" });
      onClose();
    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      toast({
        title: "Erro ao criar reserva",
        status: "error",
      });
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
      <AddressAutocomplete
        label="Origem"
        placeholder="Rua, número, bairro - Cidade"
        value={payload.origin_address}
        onChange={handleOriginSelect}
        onTextChange={(text) =>
          setPayload((p) => ({ ...p, origin_address: text }))
        }
      />

      <AddressAutocomplete
        label="Destino"
        placeholder="Rua, número, bairro - Cidade"
        value={payload.dest_address}
        onChange={handleDestSelect}
        onTextChange={(text) =>
          setPayload((p) => ({ ...p, dest_address: text }))
        }
      />

      <FormSelect
        label="Passageiro"
        value={payload.passenger_id}
        onChange={(e) =>
          setPayload((p) => ({ ...p, passenger_id: Number(e.target.value) }))
        }
      >
        <option value={0}>Selecione um funcionário</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.full_name} — {emp.email}
          </option>
        ))}
      </FormSelect>

      <FormSelect
        label="Centro de Custo"
        value={payload.cost_center_id}
        onChange={(e) =>
          setPayload((p) => ({ ...p, cost_center_id: Number(e.target.value) }))
        }
      >
        <option value={0}>Selecione...</option>
        {costCenters.map((c) => (
          <option key={c.id} value={Number(c.id)}>
            {c.code} - {c.name}
          </option>
        ))}
      </FormSelect>

      {/* Data/Hora de Agendamento (opcional) */}
      <FormInput
        label="Agendar para (opcional)"
        type="datetime-local"
        value={payload.scheduled_time}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPayload((p) => ({ ...p, scheduled_time: e.target.value }))
        }
      />

      {/* Observações (opcional) */}
      <FormInput
        label="Observações (opcional)"
        placeholder="Informações úteis para o motorista"
        value={payload.notes}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => setPayload((p) => ({ ...p, notes: e.target.value }))}
      />
    </FormModal>
  );
};
