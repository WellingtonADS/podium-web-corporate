import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { DriversTable, FormInput, FormModal } from "../components";
import api, { CreateDriverData, User } from "../services/api";

export const Drivers: React.FC = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [drivers, setDrivers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<CreateDriverData>({
    full_name: "",
    email: "",
    password: "",
    role: "driver",
    vehicle_model: "",
    vehicle_plate: "",
    cnh_number: "",
  });

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await api.get<User[]>("/users/", {
        params: { role: "driver" },
      });
      setDrivers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleCreateDriver = async () => {
    try {
      setIsSaving(true);
      await api.post("/signup/driver", formData);

      toast({
        title: "Motorista cadastrado!",
        status: "success",
        duration: 3000,
      });

      onClose();
      setFormData({
        full_name: "",
        email: "",
        password: "",
        role: "driver",
        vehicle_model: "",
        vehicle_plate: "",
        cnh_number: "",
      });
      fetchDrivers();
    } catch (error) {
      toast({
        title: "Erro ao criar motorista",
        description: "Verifique os dados e tente novamente.",
        status: "error",
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box>
      {/* Título e Botão */}
      <Flex align="center" justify="space-between" mb={6}>
        <Text textStyle="h2" color="white">
          Gestão de{" "}
          <Text as="span" color="brand.600">
            Motoristas
          </Text>
        </Text>
        <Button colorScheme="gold" size="sm" onClick={onOpen}>
          + Novo Motorista
        </Button>
      </Flex>

      {/* Tabela de Listagem */}
      {loading ? (
        <Flex justify="center" p={10}>
          <Spinner color="brand.100" />
        </Flex>
      ) : (
        <DriversTable drivers={drivers} />
      )}

      {/* Modal de Cadastro */}
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title="Novo Motorista"
        onSubmit={handleCreateDriver}
        isLoading={isSaving}
        submitLabel="Salvar Motorista"
      >
        <SimpleGrid columns={2} spacing={4}>
          <FormInput
            label="Nome Completo"
            isRequired
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
          />
          <FormInput
            label="Email"
            type="email"
            isRequired
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <FormInput
            label="Senha"
            type="password"
            isRequired
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <FormInput
            label="CNH"
            isRequired
            value={formData.cnh_number}
            onChange={(e) =>
              setFormData({ ...formData, cnh_number: e.target.value })
            }
          />
          <FormInput
            label="Modelo do Carro"
            placeholder="Ex: Fiat Cronos"
            isRequired
            value={formData.vehicle_model}
            onChange={(e) =>
              setFormData({ ...formData, vehicle_model: e.target.value })
            }
          />
          <FormInput
            label="Placa"
            placeholder="ABC-1234"
            isRequired
            value={formData.vehicle_plate}
            onChange={(e) =>
              setFormData({ ...formData, vehicle_plate: e.target.value })
            }
          />
        </SimpleGrid>
      </FormModal>
    </Box>
  );
};
