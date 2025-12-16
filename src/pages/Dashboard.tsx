import React, { useEffect, useState } from 'react';
import { 
  Box, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, 
  Spinner, Alert, AlertIcon, AlertTitle, AlertDescription, Flex, Badge, Progress
} from '@chakra-ui/react';
import { useDashboard } from '../hooks/useDashboard';
import { LiveMap } from '../components/LiveMap'; 
import api, { User } from '../services/api';

const Card = ({ title, value, footer, isLoading, trend }: any) => (
  <Box 
    bg="#111c44" 
    p={6} 
    borderRadius="20px" 
    boxShadow="0px 5px 14px rgba(0,0,0,0.05)"
    position="relative"
    overflow="hidden"
  >
    {/* Decoração visual sutil */}
    <Box position="absolute" top={0} right={0} w="70px" h="70px" bgGradient="linear(to-bl, brand.100, transparent)" opacity={0.1} borderBottomLeftRadius="100%" />
    
    <Stat>
      <StatLabel color="gray.400" fontSize="sm" fontWeight="medium">{title}</StatLabel>
      {isLoading ? (
        <Spinner size="sm" color="brand.100" my={2} />
      ) : (
        <StatNumber fontSize="3xl" color="white" fontWeight="bold" my={1}>{value}</StatNumber>
      )}
      <StatHelpText color={trend === 'up' ? "green.400" : "gray.500"} fontSize="xs" display="flex" alignItems="center">
        {trend === 'up' ? '▲' : '•'} {footer}
      </StatHelpText>
    </Stat>
  </Box>
);

export const Dashboard: React.FC = () => {
  const { stats, loading, error } = useDashboard();
  const [activeDrivers, setActiveDrivers] = useState<User[]>([]);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const token = localStorage.getItem('@Podium:token');
        if (!token) {
          return;
        }
        
        const response = await api.get<User[]>('/users/', { params: { role: 'driver' } });
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
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <Box>
      {error && (
        <Alert status="error" mb={6} borderRadius="lg" bg="red.900" color="white" border="1px solid" borderColor="red.600">
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
          <Text fontSize="sm" color="gray.400" fontWeight="bold" textTransform="uppercase" letterSpacing="wide">Visão Geral</Text>
          <Text fontSize="3xl" fontWeight="bold" color="white">Dashboard Operacional</Text>
        </Box>
        <Box>
           <Badge colorScheme="green" p={2} borderRadius="md" fontSize="xs">Sistema Online</Badge>
        </Box>
      </Flex>
      
      {/* Grid de KPIs (Widgets Superiores) */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card 
          title="Motoristas Ativos" 
          value={stats?.drivers_online} 
          footer="Disponíveis agora" 
          isLoading={loading} 
          trend="up"
        />
        <Card 
          title="Corridas Hoje" 
          value={stats?.rides_today} 
          footer="Todas as Zonas" 
          isLoading={loading} 
        />
        <Card 
          title="Faturamento Dia" 
          value={formatCurrency(stats?.revenue_today || 0)} 
          footer="Meta: R$ 5.000" 
          isLoading={loading} 
          trend="up"
        />
        <Card 
          title="Ticket Médio" 
          value={formatCurrency(stats?.average_ticket || 0)} 
          footer="Corporativo" 
          isLoading={loading} 
        />
      </SimpleGrid>

      {/* Grid Principal (Mapa e Listas) */}
      <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={6}>
          
          {/* Coluna Esquerda: Mapa (Ocupa 2/3 em telas grandes) */}
          <Box gridColumn={{ xl: "span 2" }} bg="#111c44" height="500px" borderRadius="20px" p={4} position="relative" boxShadow="lg">
              <Flex justify="space-between" align="center" mb={4} px={2}>
                <Text fontSize="lg" fontWeight="bold" color="white">Monitoramento de Frota</Text>
                <Badge bg="brand.100" color="black">Ao Vivo</Badge>
              </Flex>
              <Box h="420px" w="100%" borderRadius="15px" overflow="hidden" border="1px solid" borderColor="whiteAlpha.100">
                  <LiveMap drivers={activeDrivers} />
              </Box>
          </Box>

          {/* Coluna Direita: Status e Últimas Corridas */}
          <Flex direction="column" gap={6}>
            
            {/* Widget: Status da Frota */}
            <Box bg="#111c44" borderRadius="20px" p={6} boxShadow="lg">
              <Text fontSize="lg" fontWeight="bold" mb={4} color="white">Status da Frota</Text>
              
              <Flex mb={4} align="center" justify="space-between">
                <Text color="gray.400" fontSize="sm">Em Corrida</Text>
                <Text color="white" fontWeight="bold">0</Text>
              </Flex>
              <Progress value={0} size="xs" colorScheme="blue" bg="whiteAlpha.200" mb={6} borderRadius="full" />

              <Flex mb={4} align="center" justify="space-between">
                <Text color="gray.400" fontSize="sm">Disponíveis</Text>
                <Text color="white" fontWeight="bold">{stats?.drivers_online || 0}</Text>
              </Flex>
              <Progress value={80} size="xs" colorScheme="green" bg="whiteAlpha.200" mb={6} borderRadius="full" />

              <Flex mb={2} align="center" justify="space-between">
                <Text color="gray.400" fontSize="sm">Offline</Text>
                <Text color="white" fontWeight="bold">2</Text>
              </Flex>
              <Progress value={20} size="xs" colorScheme="gray" bg="whiteAlpha.200" borderRadius="full" />
            </Box>

            {/* Widget: Últimas Corridas (Placeholder melhorado) */}
            <Box bg="#111c44" flex="1" borderRadius="20px" p={6} boxShadow="lg">
                <Text fontSize="lg" fontWeight="bold" mb={4} color="white">Últimas Solicitações</Text>
                <Box>
                  <Flex justify="space-between" mb={3} borderBottom="1px solid" borderColor="whiteAlpha.100" pb={2}>
                    <Text color="gray.500" fontSize="xs" textTransform="uppercase">Passageiro</Text>
                    <Text color="gray.500" fontSize="xs" textTransform="uppercase">Status</Text>
                  </Flex>
                  
                  {/* Item Vazio */}
                  <Flex justify="center" align="center" h="100px" border="1px dashed" borderColor="gray.700" borderRadius="md">
                    <Text color="gray.500" fontSize="sm">Nenhuma corrida recente</Text>
                  </Flex>
                </Box>
            </Box>
          </Flex>

      </SimpleGrid>
    </Box>
  );
};