import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BookingForm } from "../components/BookingForm";
import { useBookings } from "../hooks/useBookings";
import api from "../services/api";

const Bookings: React.FC = () => {
  const { bookings, loading } = useBookings();
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleCancel = async (id: number) => {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      toast({ title: "Reserva cancelada", status: "success" });
    } catch {
      toast({ title: "Falha ao cancelar", status: "error" });
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="white">
          Reservas
        </Heading>
        <Button colorScheme="gold" onClick={handleOpen}>
          + Nova Reserva
        </Button>
      </Flex>

      <BookingForm isOpen={isOpen} onClose={handleClose} />

      {loading ? (
        <Flex justify="center" p={10}>
          <Spinner color="brand.600" />
        </Flex>
      ) : bookings.length === 0 ? (
        <Text color="midnight.400">Nenhuma reserva encontrada</Text>
      ) : (
        <Table variant="simple" colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Passageiro</Th>
              <Th>Origem</Th>
              <Th>Destino</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map((b) => (
              <Tr key={b.id}>
                <Td>{b.id}</Td>
                <Td>{b.passenger_id}</Td>
                <Td>{b.origin_address}</Td>
                <Td>{b.dest_address}</Td>
                <Td>{b.status}</Td>
                <Td>
                  {b.status !== "cancelled" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleCancel(b.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default Bookings;
