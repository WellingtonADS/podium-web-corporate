import {
  Box,
  FormControl,
  FormLabel,
  Select,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

interface BillingFilterCardProps {
  period?: string;
  employee_id?: number;
  cost_center_id?: number;
  onPeriodChange: (period: string) => void;
  onEmployeeChange: (id: number | undefined) => void;
  onCostCenterChange: (id: number | undefined) => void;
}

export const BillingFilterCard = ({
  period,
  employee_id,
  cost_center_id,
  onPeriodChange,
  onEmployeeChange,
  onCostCenterChange,
}: BillingFilterCardProps) => {
  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <Box layerStyle="card" borderRadius="lg" p={6} mb={6}>
      <Text fontWeight="600" mb={4}>
        Filtros de Relatório
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <FormControl>
          <FormLabel fontWeight="600" fontSize="sm">
            Período (Mês/Ano)
          </FormLabel>
          <input
            type="month"
            value={period || currentMonth}
            onChange={(e) => onPeriodChange(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
            }}
          />
          <Text fontSize="xs" color="midnight.500" mt={1}>
            Selecione o mês para filtrar corridas
          </Text>
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="600" fontSize="sm">
            Funcionário
          </FormLabel>
          <Select
            placeholder="Todos"
            value={employee_id || ""}
            onChange={(e) =>
              onEmployeeChange(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            fontSize="sm"
          >
            <option value="1">João Silva</option>
            <option value="2">Maria Santos</option>
            <option value="3">Carlos Oliveira</option>
          </Select>
          <Text fontSize="xs" color="midnight.500" mt={1}>
            Filtrar por colaborador (opcional)
          </Text>
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="600" fontSize="sm">
            Centro de Custo
          </FormLabel>
          <Select
            placeholder="Todos"
            value={cost_center_id || ""}
            onChange={(e) =>
              onCostCenterChange(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            fontSize="sm"
          >
            <option value="1">Marketing</option>
            <option value="2">Vendas</option>
            <option value="3">TI</option>
            <option value="4">Diretoria</option>
          </Select>
          <Text fontSize="xs" color="midnight.500" mt={1}>
            Filtrar por departamento (opcional)
          </Text>
        </FormControl>
      </SimpleGrid>
    </Box>
  );
};
