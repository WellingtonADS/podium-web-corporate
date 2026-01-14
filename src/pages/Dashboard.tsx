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
  Text,
} from "@chakra-ui/react";
import React from "react";
import { StatCard } from "../components";
import { useDashboard } from "../hooks/useDashboard";

const Dashboard: React.FC = () => {
  const { stats, error } = useDashboard();

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
          value={formatCurrency(stats?.monthly_consumption || 0)}
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

          <Flex mb={4} align="center" justify="space-between">
            <Text color="gray.400" fontSize="sm">
              Marketing
            </Text>
            <Text color="white" fontWeight="bold">
              R$ 4.500
            </Text>
          </Flex>
          <Progress
            value={45}
            size="xs"
            colorScheme="green"
            bg="whiteAlpha.200"
            mb={6}
            borderRadius="full"
          />

          <Flex mb={4} align="center" justify="space-between">
            <Text color="gray.400" fontSize="sm">
              Vendas
            </Text>
            <Text color="white" fontWeight="bold">
              R$ 5.200
            </Text>
          </Flex>
          <Progress
            value={52}
            size="xs"
            colorScheme="blue"
            bg="whiteAlpha.200"
            mb={6}
            borderRadius="full"
          />

          <Flex mb={2} align="center" justify="space-between">
            <Text color="gray.400" fontSize="sm">
              TI
            </Text>
            <Text color="white" fontWeight="bold">
              R$ 2.800
            </Text>
          </Flex>
          <Progress
            value={28}
            size="xs"
            colorScheme="purple"
            bg="whiteAlpha.200"
            borderRadius="full"
          />
        </Box>

        {/* Widget: Últimas Corridas */}
        <Box layerStyle="card" borderRadius="20px" p={6}>
          <Text textStyle="h3" mb={4} color="white">
            Últimas Corridas
          </Text>
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

            {/* Items de exemplo */}
            <Flex
              justify="space-between"
              mb={3}
              pb={3}
              borderBottom="1px solid"
              borderColor="whiteAlpha.50"
            >
              <Box>
                <Text color="white" fontSize="sm" fontWeight="bold">
                  João Silva
                </Text>
                <Text color="gray.500" fontSize="xs">
                  Marketing
                </Text>
              </Box>
              <Text color="brand.600" fontWeight="bold">
                R$ 45,00
              </Text>
            </Flex>

            <Flex
              justify="space-between"
              mb={3}
              pb={3}
              borderBottom="1px solid"
              borderColor="whiteAlpha.50"
            >
              <Box>
                <Text color="white" fontSize="sm" fontWeight="bold">
                  Maria Santos
                </Text>
                <Text color="gray.500" fontSize="xs">
                  Vendas
                </Text>
              </Box>
              <Text color="brand.600" fontWeight="bold">
                R$ 38,00
              </Text>
            </Flex>

            <Flex justify="space-between">
              <Box>
                <Text color="white" fontSize="sm" fontWeight="bold">
                  Pedro Costa
                </Text>
                <Text color="gray.500" fontSize="xs">
                  TI
                </Text>
              </Box>
              <Text color="brand.600" fontWeight="bold">
                R$ 52,00
              </Text>
            </Flex>
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
