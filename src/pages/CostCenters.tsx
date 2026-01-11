import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Spinner,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { CostCenterCard, FormInput, FormModal } from "../components";
import api, { CostCenter, CreateCostCenterData } from "../services/api";

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
  });

  const fetchCostCenters = async () => {
    try {
      setLoading(true);
      const response = await api.get<CostCenter[]>("/corporate/cost-centers");
      setCostCenters(response.data);
    } catch (error) {
      console.error(error);
      // Mock data para desenvolvimento
      setCostCenters([
        {
          id: "1",
          name: "Marketing",
          code: "MKT-001",
          budget_limit: 10000,
          current_spent: 4500,
          active: true,
        },
        {
          id: "2",
          name: "Vendas",
          code: "VND-001",
          budget_limit: 15000,
          current_spent: 11200,
          active: true,
        },
        {
          id: "3",
          name: "TI",
          code: "TI-001",
          budget_limit: 8000,
          current_spent: 2800,
          active: true,
        },
        {
          id: "4",
          name: "Diretoria",
          code: "DIR-001",
          budget_limit: 50000,
          current_spent: 46500,
          active: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCostCenters();
  }, []);

  const handleOpenModal = (cc?: CostCenter) => {
    if (cc) {
      setEditingCC(cc);
      setFormData({
        name: cc.name,
        code: cc.code,
        budget_limit: cc.budget_limit,
        active: cc.active,
      });
    } else {
      setEditingCC(null);
      setFormData({ name: "", code: "", budget_limit: 0, active: true });
    }
    onOpen();
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (editingCC) {
        await api.put(`/corporate/cost-centers/${editingCC.id}`, formData);
        toast({
          title: "Centro de Custo atualizado!",
          status: "success",
          duration: 3000,
        });
      } else {
        await api.post("/corporate/cost-centers", formData);
        toast({
          title: "Centro de Custo criado!",
          status: "success",
          duration: 3000,
        });
      }

      onClose();
      setFormData({ name: "", code: "", budget_limit: 0, active: true });
      fetchCostCenters();
    } catch {
      toast({
        title: "Erro ao salvar centro de custo",
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
