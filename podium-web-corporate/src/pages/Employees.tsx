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
import { useAuth } from "../contexts/AuthContext";
import { CorporateService } from "../services/corporate";
import { CostCenter, CreateEmployeeInput, User } from "../types";

const Employees: React.FC = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();

  const [employees, setEmployees] = useState<User[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<CreateEmployeeInput>({
    full_name: "",
    email: "",
    password: "",
    department: "",
    cost_center_id: undefined,
    phone: "",
  });

  // 🔥 Carregar dados em paralelo
  const loadData = async () => {
    try {
      setLoading(true);
      
      const [empData, ccData] = await Promise.all([
        CorporateService.getEmployees(),
        CorporateService.getCostCenters(),
      ]);
      
      setEmployees(empData);
      setCostCenters(ccData);
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        description: error?.response?.data?.detail || "Tente novamente mais tarde",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEmployee = async () => {
    // Validação básica
    if (!formData.full_name || !formData.email || !formData.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha Nome, Email e Senha",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSaving(true);

      // Preparar payload com company_id do usuário atual
      const payload = {
        ...formData,
        company_id: user?.employee_profile?.company_id || 1,
      };

      await CorporateService.createEmployee(payload);

      toast({
        title: "✅ Funcionário cadastrado!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
      
      // Resetar form
      setFormData({
        full_name: "",
        email: "",
        password: "",
        department: "",
        cost_center_id: undefined,
        phone: "",
      });

      // Recarregar lista
      loadData();
    } catch (error: any) {
      const errorMessage = 
        error?.response?.data?.detail || 
        "Verifique os dados e tente novamente";
      
      toast({
        title: "❌ Erro ao criar funcionário",
        description: errorMessage,
        status: "error",
        duration: 4000,
        isClosable: true,
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
          <Spinner color="brand.600" size="lg" />
        </Flex>
      ) : employees.length === 0 ? (
        <Flex
          justify="center"
          align="center"
          p={10}
          bg="gray.800"
          borderRadius="lg"
          minH="300px"
        >
          <Text color="gray.500" textAlign="center">
            Nenhum funcionário cadastrado ainda.{"\n"}
            <Button
              colorScheme="gold"
              size="sm"
              mt={4}
              onClick={onOpen}
            >
              Criar primeiro funcionário
            </Button>
          </Text>
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
          {/* Linha 1: Nome e Email */}
          <FormInput
            label="Nome Completo *"
            placeholder="João Silva"
            isRequired
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
          />
          <FormInput
            label="Email *"
            type="email"
            placeholder="joao@empresa.com"
            isRequired
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          {/* Linha 2: Senha e Telefone */}
          <FormInput
            label="Senha *"
            type="password"
            placeholder="••••••••"
            isRequired
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <FormInput
            label="Telefone"
            placeholder="11 99999-9999"
            value={formData.phone || ""}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          {/* Linha 3: Departamento e Centro de Custo */}
          <FormInput
            label="Departamento"
            placeholder="Ex: Marketing, Vendas"
            value={formData.department || ""}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
          />
          
          <FormSelect
            label="Centro de Custo"
            value={formData.cost_center_id ? String(formData.cost_center_id) : ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                cost_center_id: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            options={[
              { value: "", label: "Selecione um centro de custo..." },
              ...costCenters.map((cc) => ({
                value: String(cc.id),
                label: `${cc.code} - ${cc.name}`,
              })),
            ]}
          />
        </SimpleGrid>
      </FormModal>
    </Box>
  );
};

export default Employees;
