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
import React, { useEffect, useState } from "react";
import { StatCard } from "../components/Cards";
import { LiveMap } from "../components/LiveMap";
import { useDashboard } from "../hooks/useDashboard";
import api, { User } from "../services/api";

export const Dashboard: React.FC = () => {
  const { stats, loading, error } = useDashboard();
  const [activeDrivers, setActiveDrivers] = useState<User[]>([]);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const token = localStorage.getItem("@Podium:token");
        if (!token) {
          return;
        }

        const response = await api.get<User[]>("/users/", {
          params: { role: "driver" },
        });
        setActiveDrivers(response.data);
      } catch (err: any) {
        // Silencia erros 401 (não autenticado) - esperado na primeira vez
        if (err.response?.status !== 401) {
          console.error("Erro ao carregar mapa", err);
        }
      }
    };

    fetchMapData();
    const interval = setInterval(fetchMapData, 10000);
    return () => clearInterval(interval);
  }, []);

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
            Visão Geral
          </Text>
          <Text fontSize="3xl" fontWeight="bold" color="white">
            Dashboard Operacional
          </Text>
        </Box>
        <Box>
          <Badge colorScheme="green" p={2} borderRadius="md" fontSize="xs">
            Sistema Online
          </Badge>
        </Box>
      </Flex>

      {/* Grid de KPIs (Widgets Superiores) */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard
          title="Motoristas Ativos"
          value={stats?.drivers_online}
          color="green.500"
        >
          <Text fontSize="xs" color="midnight.500">
            Disponíveis agora
          </Text>
        </StatCard>
        <StatCard
          title="Corridas Hoje"
          value={stats?.rides_today}
          color="blue.500"
        >
          <Text fontSize="xs" color="midnight.500">
            Todas as Zonas
          </Text>
        </StatCard>
        <StatCard
          title="Faturamento Dia"
          value={formatCurrency(stats?.revenue_today || 0)}
          color="gold.600"
        >
          <Text fontSize="xs" color="midnight.500">
            Meta: R$ 5.000
          </Text>
        </StatCard>
        <StatCard
          title="Ticket Médio"
          value={formatCurrency(stats?.average_ticket || 0)}
          color="purple.500"
        >
          <Text fontSize="xs" color="midnight.500">
            Corporativo
          </Text>
        </StatCard>
      </SimpleGrid>

      {/* Grid Principal (Mapa e Listas) */}
      <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={6}>
        {/* Coluna Esquerda: Mapa (Ocupa 2/3 em telas grandes) */}
        <Box
          gridColumn={{ xl: "span 2" }}
          layerStyle="card"
          height="500px"
          borderRadius="20px"
          p={4}
          position="relative"
        >
          <Flex justify="space-between" align="center" mb={4} px={2}>
            <Text textStyle="h3" color="white">
              Monitoramento de Frota
            </Text>
            <Badge bg="brand.600" color="black">
              Ao Vivo
            </Badge>
          </Flex>
          <Box
            h="420px"
            w="100%"
            borderRadius="15px"
            overflow="hidden"
            border="1px solid"
            borderColor="whiteAlpha.100"
          >
            <LiveMap drivers={activeDrivers} />
          </Box>
        </Box>

        {/* Coluna Direita: Status e Últimas Corridas */}
        <Flex direction="column" gap={6}>
          {/* Widget: Status da Frota */}
          <Box layerStyle="card" borderRadius="20px" p={6}>
            <Text textStyle="h3" mb={4} color="white">
              Status da Frota
            </Text>

            <Flex mb={4} align="center" justify="space-between">
              <Text color="gray.400" fontSize="sm">
                Em Corrida
              </Text>
              <Text color="white" fontWeight="bold">
                0
              </Text>
            </Flex>
            <Progress
              value={0}
              size="xs"
              colorScheme="blue"
              bg="whiteAlpha.200"
              mb={6}
              borderRadius="full"
            />

            <Flex mb={4} align="center" justify="space-between">
              <Text color="gray.400" fontSize="sm">
                Disponíveis
              </Text>
              <Text color="white" fontWeight="bold">
                {stats?.drivers_online || 0}
              </Text>
            </Flex>
            <Progress
              value={80}
              size="xs"
              colorScheme="green"
              bg="whiteAlpha.200"
              mb={6}
              borderRadius="full"
            />

            <Flex mb={2} align="center" justify="space-between">
              <Text color="gray.400" fontSize="sm">
                Offline
              </Text>
              <Text color="white" fontWeight="bold">
                2
              </Text>
            </Flex>
            <Progress
              value={20}
              size="xs"
              colorScheme="gray"
              bg="whiteAlpha.200"
              borderRadius="full"
            />
          </Box>

          {/* Widget: Últimas Corridas (Placeholder melhorado) */}
          <Box layerStyle="card" flex="1" borderRadius="20px" p={6}>
            <Text textStyle="h3" mb={4} color="white">
              Últimas Solicitações
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
                  Passageiro
                </Text>
                <Text color="gray.500" fontSize="xs" textTransform="uppercase">
                  Status
                </Text>
              </Flex>

              {/* Item Vazio */}
              <Flex
                justify="center"
                align="center"
                h="100px"
                border="1px dashed"
                borderColor="gray.700"
                borderRadius="md"
              >
                <Text color="gray.500" fontSize="sm">
                  Nenhuma corrida recente
                </Text>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </SimpleGrid>
    </Box>
  );
};
