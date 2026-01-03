import {
    Box,
    Button,
    Flex,
    SimpleGrid,
    Spinner,
    Text,
    useDisclosure, useToast
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CostCenterCard, FormInput, FormModal } from '../components';
import { CorporateService } from '../services/corporate';
import { CostCenter, CreateCostCenterInput } from '../types';

const CostCenters: React.FC = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCC, setEditingCC] = useState<CostCenter | null>(null);

  const [formData, setFormData] = useState<CreateCostCenterInput>({
    name: '',
    code: '',
    budget_limit: 0,
  });

  const fetchCostCenters = async () => {
    try {
      setLoading(true);
      const data = await CorporateService.getCostCenters();
      setCostCenters(data);
    } catch (error: any) {
      console.error("Erro ao carregar centros de custo:", error);
      toast({
        title: 'Erro ao carregar centros de custo',
        description: error?.response?.data?.detail || 'Tente novamente mais tarde',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
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
      });
    } else {
      setEditingCC(null);
      setFormData({ name: '', code: '', budget_limit: 0 });
    }
    onOpen();
  };

  const handleSave = async () => {
    if (!formData.name || !formData.code || !formData.budget_limit) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSaving(true);
      
      if (editingCC) {
        await CorporateService.updateCostCenter(editingCC.id, formData);
        toast({
          title: '✅ Centro de Custo atualizado!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await CorporateService.createCostCenter(formData);
        toast({
          title: '✅ Centro de Custo criado!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      onClose();
      setFormData({ name: '', code: '', budget_limit: 0 });
      fetchCostCenters();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || 'Tente novamente mais tarde';
      toast({
        title: `❌ Erro ao ${editingCC ? 'atualizar' : 'criar'} centro de custo`,
        description: errorMessage,
        status: 'error',
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
      <Flex justify="space-between" align="center" mb={8}>
        <Text textStyle="h2" color="white">
          Centros de <Text as="span" color="brand.600">Custo</Text>
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
      ) : costCenters.length === 0 ? (
        <Flex
          justify="center"
          align="center"
          p={10}
          bg="gray.800"
          borderRadius="lg"
          minH="300px"
        >
          <Text color="gray.500" textAlign="center">
            Nenhum centro de custo cadastrado ainda.
            <br />
            <Button
              colorScheme="gold"
              size="sm"
              mt={4}
              onClick={() => handleOpenModal()}
            >
              Criar primeiro centro
            </Button>
          </Text>
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
              active={cc.is_active}
              onEdit={() => handleOpenModal(cc)}
            />
          ))}
        </SimpleGrid>
      )}

      {/* Modal de Criação/Edição */}
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title={editingCC ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
        onSubmit={handleSave}
        isLoading={isSaving}
        submitLabel={editingCC ? 'Atualizar' : 'Criar'}
      >
        <FormInput
          label="Nome do Departamento *"
          isRequired
          placeholder="Ex: Marketing"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />

        <FormInput
          label="Código ERP/SAP *"
          isRequired
          placeholder="Ex: MKT-001"
          value={formData.code}
          onChange={e => setFormData({...formData, code: e.target.value})}
        />
        <Text fontSize="xs" color="gray.500" mb={4}>
          Código interno para conciliação com sistema financeiro
        </Text>

        <FormInput
          label="Orçamento Mensal (R$) *"
          type="number"
          isRequired
          placeholder="10000.00"
          value={formData.budget_limit || ''}
          onChange={e => setFormData({...formData, budget_limit: parseFloat(e.target.value) || 0})}
        />
      </FormModal>
    </Box>
  );
};

export default CostCenters;
