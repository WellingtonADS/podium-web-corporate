import {
  Box,
  Card,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ExportBillingButton } from "../components/Buttons/ExportBillingButton";
import { BillingFilterCard } from "../components/Cards/BillingFilterCard";
import { BillingTable } from "../components/Tables/BillingTable";
import { BillingFilters, useBillingData } from "../hooks/useBillingData";
import { formatCurrency } from "../utils";

const Billing: React.FC = () => {
  const [filters, setFilters] = useState<BillingFilters>({
    period: new Date().toISOString().slice(0, 7),
  });

  const { billingPeriods, rides, loading } = useBillingData(filters);

  const handlePeriodChange = (period: string) => {
    setFilters({ ...filters, period });
  };

  const handleEmployeeChange = (employee_id: number | undefined) => {
    setFilters({ ...filters, employee_id });
  };

  const handleCostCenterChange = (cost_center_id: number | undefined) => {
    setFilters({ ...filters, cost_center_id });
  };

  const currentPeriod = billingPeriods[0];
  const compliantCount = rides.filter((r) => r.policy_compliant).length;
  const violationCount = rides.filter((r) => !r.policy_compliant).length;
  const totalAmount = rides.reduce((sum, r) => sum + r.amount, 0);

  return (
    <Box>
      {/* Título */}
      <Flex justify="space-between" align="center" mb={8}>
        <Text textStyle="h2" color="white">
          Faturas &{" "}
          <Text as="span" color="brand.600">
            Auditoria
          </Text>
        </Text>
        <ExportBillingButton periods={billingPeriods} />
      </Flex>

      {/* Filtros */}
      <BillingFilterCard
        period={filters.period}
        employee_id={filters.employee_id}
        cost_center_id={filters.cost_center_id}
        onPeriodChange={handlePeriodChange}
        onEmployeeChange={handleEmployeeChange}
        onCostCenterChange={handleCostCenterChange}
      />

      {/* Cards de Resumo */}
      {!loading && currentPeriod && (
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
          <Card bg="midnight.700" p={6} borderRadius="lg">
            <Text fontSize="sm" color="midnight.400" mb={2}>
              Total de Corridas
            </Text>
            <Heading size="lg" color="white">
              {currentPeriod.rides_count}
            </Heading>
          </Card>

          <Card bg="midnight.700" p={6} borderRadius="lg">
            <Text fontSize="sm" color="midnight.400" mb={2}>
              Valor Total
            </Text>
            <Heading size="lg" color="gold.600">
              {formatCurrency(totalAmount || currentPeriod.total_amount)}
            </Heading>
          </Card>

          <Card bg="midnight.700" p={6} borderRadius="lg">
            <Text fontSize="sm" color="midnight.400" mb={2}>
              Conforme com Política
            </Text>
            <Heading size="lg" color="green.400">
              {compliantCount}
            </Heading>
            <Text fontSize="xs" color="midnight.500" mt={1}>
              {rides.length > 0
                ? ((compliantCount / rides.length) * 100).toFixed(1)
                : 0}
              %
            </Text>
          </Card>

          <Card bg="midnight.700" p={6} borderRadius="lg">
            <Text fontSize="sm" color="midnight.400" mb={2}>
              Violações Detectadas
            </Text>
            <Heading size="lg" color="red.400">
              {violationCount}
            </Heading>
            <Text fontSize="xs" color="midnight.500" mt={1}>
              {rides.length > 0
                ? ((violationCount / rides.length) * 100).toFixed(1)
                : 0}
              %
            </Text>
          </Card>
        </SimpleGrid>
      )}

      {/* Tabela de Detalhes */}
      {loading ? (
        <Flex justify="center" p={10}>
          <Spinner color="brand.600" size="xl" />
        </Flex>
      ) : (
        <>
          <Text fontSize="sm" color="midnight.400" mb={3}>
            Mostrando {rides.length} corrida(s)
          </Text>
          <BillingTable rides={rides} />
        </>
      )}
    </Box>
  );
};

export default Billing;
