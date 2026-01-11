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
import {
  EmployeesTable,
  FormInput,
  FormModal,
  FormSelect,
} from "../components";
import api, { CreateEmployeeData, User } from "../services/api";

const Employees: React.FC = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<CreateEmployeeData>({
    full_name: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
    cost_center_id: undefined,
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get<User[]>("/users/", {
        params: { role: "employee" },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
      // Mock data para desenvolvimento
      setEmployees([
        {
          id: 1,
          email: "joao@empresa.com",
          full_name: "João Silva",
          role: "employee",
          is_active: true,
          employee_profile: { department: "Marketing", cost_center_id: 1 },
        },
        {
          id: 2,
          email: "maria@empresa.com",
          full_name: "Maria Santos",
          role: "employee",
          is_active: true,
          employee_profile: { department: "Vendas", cost_center_id: 2 },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreateEmployee = async () => {
    try {
      setIsSaving(true);
      await api.post("/corporate/employees", formData);

      toast({
        title: "Funcionário cadastrado!",
        status: "success",
        duration: 3000,
      });

      onClose();
      setFormData({
        full_name: "",
        email: "",
        password: "",
        role: "employee",
        department: "",
        cost_center_id: undefined,
      });
      fetchEmployees();
    } catch {
      toast({
        title: "Erro ao criar funcionário",
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
            Funcionários
          </Text>
        </Text>
        <Button colorScheme="gold" size="sm" onClick={onOpen}>
          + Novo Funcionário
        </Button>
      </Flex>

      {/* Tabela de Listagem */}
      {loading ? (
        <Flex justify="center" p={10}>
          <Spinner color="brand.600" />
        </Flex>
      ) : (
        <EmployeesTable employees={employees} />
      )}

      {/* Modal de Cadastro */}
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title="Novo Funcionário"
        onSubmit={handleCreateEmployee}
        isLoading={isSaving}
        submitLabel="Salvar Funcionário"
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
            label="Departamento"
            placeholder="Ex: Marketing"
            isRequired
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
          />
          <FormSelect
            label="Centro de Custo"
            value={formData.cost_center_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                cost_center_id: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            options={[
              { value: "", label: "Selecione..." },
              { value: "1", label: "CC-1 - Marketing" },
              { value: "2", label: "CC-2 - Vendas" },
              { value: "3", label: "CC-3 - TI" },
            ]}
          />
        </SimpleGrid>
      </FormModal>
    </Box>
  );
};

export default Employees;
