import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Flex,
  Progress,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { StatCard } from "../components";
import {
  useCostCentersUsage,
  useDashboard,
  useRecentRides,
} from "../hooks/useDashboard";

const Dashboard: React.FC = () => {
  const { stats, error } = useDashboard();
  const { data: costCenters, loading: loadingCC } = useCostCentersUsage();
  const { data: recentRides, loading: loadingRides } = useRecentRides();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <Box>
      {error && (
        <Alert
          status="error"
          mb={6}
          borderRadius="lg"
          bg="red.900"
          color="white"
          border="1px solid"
          borderColor="red.600"
        >
          <AlertIcon color="red.400" />
          <Box>
            <AlertTitle>Erro de Conexão</AlertTitle>
            <AlertDescription fontSize="sm">{error}</AlertDescription>
          </Box>
        </Alert>
      )}

      {/* Título da Seção */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Text
            fontSize="sm"
            color="gray.400"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="wide"
          >
            Portal Corporativo
          </Text>
          <Text textStyle="h1" color="white">
            Dashboard Executivo
          </Text>
        </Box>
        <Box>
          <Badge colorScheme="green" p={2} borderRadius="md" fontSize="xs">
            Sistema Ativo
          </Badge>
        </Box>
      </Flex>

      {/* Grid de KPIs Corporativos */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard
          title="Consumo Mensal"
          value={formatCurrency(stats?.total_spent || 0)}
          color="green.500"
        >
          <Text fontSize="xs" color="midnight.500">
            Este mês
          </Text>
        </StatCard>
        <StatCard
          title="Funcionários Ativos"
          value={stats?.active_employees}
          color="blue.500"
        >
          <Text fontSize="xs" color="midnight.500">
            Cadastrados
          </Text>
        </StatCard>
        <StatCard
          title="Corridas Realizadas"
          value={stats?.rides_completed}
          color="purple.500"
        >
          <Text fontSize="xs" color="midnight.500">
            Este mês
          </Text>
        </StatCard>
        <StatCard
          title="Orçamento Restante"
          value={formatCurrency(stats?.remaining_budget || 0)}
          color="gold.600"
        >
          <Text fontSize="xs" color="midnight.500">
            Disponível
          </Text>
        </StatCard>
      </SimpleGrid>

      {/* Grid de Resumos */}
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
        {/* Widget: Uso por Centro de Custo */}
        <Box layerStyle="card" borderRadius="20px" p={6}>
          <Text textStyle="h3" mb={4} color="white">
            Uso por Centro de Custo
          </Text>

          {loadingCC ? (
            <Flex justify="center" align="center" h="200px">
              <Spinner color="brand.500" />
            </Flex>
          ) : costCenters.length === 0 ? (
            <Text color="gray.400" fontSize="sm">
              Nenhum dado disponível
            </Text>
          ) : (
            costCenters.map((cc) => (
              <Box key={cc.cost_center_id} mb={6}>
                <Flex mb={2} align="center" justify="space-between">
                  <Text color="gray.400" fontSize="sm">
                    {cc.name}
                  </Text>
                  <Text color="white" fontWeight="bold">
                    {formatCurrency(cc.spent)}
                  </Text>
                </Flex>
                <Progress
                  value={cc.percentage}
                  size="xs"
                  colorScheme={
                    cc.percentage > 60
                      ? "red"
                      : cc.percentage > 30
                        ? "blue"
                        : "green"
                  }
                  bg="whiteAlpha.200"
                  borderRadius="full"
                />
              </Box>
            ))
          )}
        </Box>

        {/* Widget: Últimas Corridas */}
        <Box layerStyle="card" borderRadius="20px" p={6}>
          <Text textStyle="h3" mb={4} color="white">
            Últimas Corridas
          </Text>

          {loadingRides ? (
            <Flex justify="center" align="center" h="200px">
              <Spinner color="brand.500" />
            </Flex>
          ) : recentRides.length === 0 ? (
            <Text color="gray.400" fontSize="sm">
              Nenhuma corrida registrada
            </Text>
          ) : (
            <Box>
              <Flex
                justify="space-between"
                mb={3}
                borderBottom="1px solid"
                borderColor="whiteAlpha.100"
                pb={2}
              >
                <Text color="gray.500" fontSize="xs" textTransform="uppercase">
                  Funcionário
                </Text>
                <Text color="gray.500" fontSize="xs" textTransform="uppercase">
                  Valor
                </Text>
              </Flex>

              {recentRides.map((ride, index) => (
                <Flex
                  key={index}
                  justify="space-between"
                  mb={3}
                  pb={3}
                  borderBottom={
                    index < recentRides.length - 1 ? "1px solid" : undefined
                  }
                  borderColor="whiteAlpha.50"
                >
                  <Box>
                    <Text color="white" fontSize="sm" fontWeight="bold">
                      {ride.employee_name}
                    </Text>
                    <Text color="gray.500" fontSize="xs">
                      {ride.department}{" "}
                      {ride.cost_center_name !== "-"
                        ? `• ${ride.cost_center_name}`
                        : ""}
                    </Text>
                  </Box>
                  <Text color="brand.600" fontWeight="bold">
                    {formatCurrency(ride.price)}
                  </Text>
                </Flex>
              ))}
            </Box>
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
