import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  SimpleGrid,
  Spinner,
  Stack,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { CostCenterCard, FormInput, FormModal } from "../components";
import {
  CostCenter,
  createCostCenter,
  CreateCostCenterData,
  fetchCostCenters,
  updateCostCenter,
} from "../services/api";
import { validateCostCenterPolicy } from "../utils";

const rideCategories = ["Econômica", "Executivo", "Van"];

const CostCenters: React.FC = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCC, setEditingCC] = useState<CostCenter | null>(null);

  const [formData, setFormData] = useState<CreateCostCenterData>({
    name: "",
    code: "",
    budget_limit: 0,
    active: true,
    allowed_categories: [],
    spending_limit_per_ride: 0,
    business_hours: {
      start: "08:00",
      end: "18:00",
    },
  });

  const fetchCostCentersData = async () => {
    try {
      setLoading(true);
      const data = await fetchCostCenters();
      setCostCenters(data);
    } catch (error: unknown) {
      const errorMsg =
        ((error as Record<string, unknown>)?.message as string) ||
        "Erro ao buscar centros de custo";
      console.error(errorMsg);
      // Mock data para desenvolvimento
      setCostCenters([
        {
          id: "1",
          name: "Marketing",
          code: "MKT-001",
          budget_limit: 10000,
          current_spent: 4500,
          active: true,
          allowed_categories: ["UberX", "Black"],
          spending_limit_per_ride: 150,
          business_hours: { start: "08:00", end: "18:00" },
        },
        {
          id: "2",
          name: "Vendas",
          code: "VND-001",
          budget_limit: 15000,
          current_spent: 11200,
          active: true,
          allowed_categories: ["UberX", "Comfort"],
          spending_limit_per_ride: 120,
          business_hours: { start: "07:00", end: "20:00" },
        },
        {
          id: "3",
          name: "TI",
          code: "TI-001",
          budget_limit: 8000,
          current_spent: 2800,
          active: true,
          allowed_categories: ["UberX"],
          spending_limit_per_ride: 100,
          business_hours: { start: "08:00", end: "22:00" },
        },
        {
          id: "4",
          name: "Diretoria",
          code: "DIR-001",
          budget_limit: 50000,
          current_spent: 46500,
          active: true,
          allowed_categories: ["Black", "Van"],
          spending_limit_per_ride: 500,
          business_hours: { start: "06:00", end: "23:00" },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCostCentersData();
  }, []);

  const handleOpenModal = (cc?: CostCenter) => {
    if (cc) {
      setEditingCC(cc);
      setFormData({
        name: cc.name,
        code: cc.code,
        budget_limit: cc.budget_limit,
        active: cc.active,
        allowed_categories: cc.allowed_categories ?? [],
        spending_limit_per_ride: cc.spending_limit_per_ride ?? 0,
        business_hours: cc.business_hours || { start: "08:00", end: "18:00" },
      });
    } else {
      setEditingCC(null);
      setFormData({
        name: "",
        code: "",
        budget_limit: 0,
        active: true,
        allowed_categories: [],
        spending_limit_per_ride: 0,
        business_hours: {
          start: "08:00",
          end: "18:00",
        },
      });
    }
    onOpen();
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (!formData.name || !formData.code) {
        toast({
          title: "Preencha nome e código do centro de custo.",
          status: "warning",
          duration: 3000,
        });
        return;
      }

      if (!formData.budget_limit || formData.budget_limit <= 0) {
        toast({
          title: "Informe um orçamento mensal maior que zero.",
          status: "warning",
          duration: 3000,
        });
        return;
      }

      const policyValidation = validateCostCenterPolicy({
        allowed_categories: formData.allowed_categories,
        spending_limit_per_ride: formData.spending_limit_per_ride,
        business_hours: formData.business_hours,
      });

      if (!policyValidation.valid) {
        toast({
          title: policyValidation.message,
          status: "warning",
          duration: 3500,
        });
        return;
      }

      if (editingCC) {
        await updateCostCenter(editingCC.id, formData);
        toast({
          title: "Centro de Custo atualizado!",
          status: "success",
          duration: 3000,
        });
      } else {
        await createCostCenter(formData);
        toast({
          title: "Centro de Custo criado!",
          status: "success",
          duration: 3000,
        });
      }

      onClose();
      setFormData({
        name: "",
        code: "",
        budget_limit: 0,
        active: true,
        allowed_categories: [],
        spending_limit_per_ride: 0,
        business_hours: {
          start: "08:00",
          end: "18:00",
        },
      });
      fetchCostCentersData();
    } catch (error: unknown) {
      const errorMsg =
        ((error as Record<string, unknown>)?.message as string) ||
        "Erro ao salvar centro de custo";
      toast({
        title: `Erro: ${errorMsg}`,
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box>
      {/* Título e Botão */}
      <Flex justify="space-between" align="center" mb={8}>
        <Text textStyle="h2" color="white">
          Centros de{" "}
          <Text as="span" color="brand.600">
            Custo
          </Text>
        </Text>
        <Button colorScheme="gold" size="sm" onClick={() => handleOpenModal()}>
          + Novo Centro de Custo
        </Button>
      </Flex>

      {/* Grid de Centros de Custo */}
      {loading ? (
        <Flex justify="center" p={10}>
          <Spinner color="brand.600" size="xl" />
        </Flex>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {costCenters.map((cc) => (
            <CostCenterCard
              key={cc.id}
              name={cc.name}
              code={cc.code}
              budget_limit={cc.budget_limit}
              current_spent={cc.current_spent}
              active={cc.active}
              allowed_categories={cc.allowed_categories}
              spending_limit_per_ride={cc.spending_limit_per_ride}
              business_hours={cc.business_hours}
              onEdit={() => handleOpenModal(cc)}
            />
          ))}
        </SimpleGrid>
      )}

      {/* Modal de Criação/Edição */}
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title={editingCC ? "Editar Centro de Custo" : "Novo Centro de Custo"}
        onSubmit={handleSave}
        isLoading={isSaving}
        submitLabel={editingCC ? "Atualizar" : "Criar"}
      >
        <FormInput
          label="Nome do Departamento"
          isRequired
          placeholder="Ex: Marketing"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <FormInput
          label="Código ERP/SAP"
          isRequired
          placeholder="Ex: MKT-001"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
        />
        <Text fontSize="xs" color="midnight.500" mb={4}>
          Código interno para conciliação com sistema financeiro
        </Text>

        <FormInput
          label="Orçamento Mensal (R$)"
          type="number"
          isRequired
          placeholder="10000.00"
          value={formData.budget_limit || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              budget_limit: parseFloat(e.target.value) || 0,
            })
          }
        />

        <FormInput
          label="Limite por Corrida (R$)"
          type="number"
          isRequired
          placeholder="150.00"
          value={formData.spending_limit_per_ride || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              spending_limit_per_ride: parseFloat(e.target.value) || 0,
            })
          }
        />

        <Box mb={4}>
          <Text fontWeight="600" mb={2}>
            Categorias Permitidas
          </Text>
          <CheckboxGroup
            value={formData.allowed_categories}
            onChange={(value) =>
              setFormData({
                ...formData,
                allowed_categories: value as string[],
              })
            }
          >
            <Stack spacing={2} direction={{ base: "column", md: "row" }}>
              {rideCategories.map((category) => (
                <Checkbox key={category} value={category}>
                  {category}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
          <Text fontSize="xs" color="midnight.500" mt={1}>
            Selecione quais categorias de veículo podem ser usadas por este
            centro de custo.
          </Text>
        </Box>

        <Divider my={4} />

        <Text fontWeight="600" mb={2}>
          Horário Comercial Permitido
        </Text>
        <Flex gap={4} mb={4} direction={{ base: "column", md: "row" }}>
          <FormInput
            label="Início"
            type="time"
            value={formData.business_hours?.start || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                business_hours: {
                  ...(formData.business_hours || { end: "" }),
                  start: e.target.value,
                },
              })
            }
          />
          <FormInput
            label="Fim"
            type="time"
            value={formData.business_hours?.end || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                business_hours: {
                  ...(formData.business_hours || { start: "" }),
                  end: e.target.value,
                },
              })
            }
          />
        </Flex>
        <Text fontSize="xs" color="midnight.500" mb={4}>
          Viagens fora desse horário serão bloqueadas pela política corporativa.
        </Text>

        <Flex align="center" gap={4}>
          <Text fontWeight="600">Centro de Custo Ativo</Text>
          <Switch
            colorScheme="green"
            isChecked={formData.active}
            onChange={(e) =>
              setFormData({ ...formData, active: e.target.checked })
            }
          />
        </Flex>
      </FormModal>
    </Box>
  );
};

export default CostCenters;
