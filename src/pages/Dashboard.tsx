import React from 'react';
import { Box, Flex, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Button } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

// Componente de Cartão (Reutilizável)
const Card = ({ title, value, footer }: { title: string, value: string, footer: string }) => (
  <Box bg="#111c44" p={5} borderRadius="20px" boxShadow="lg">
    <Stat>
      <StatLabel color="gray.400">{title}</StatLabel>
      <StatNumber fontSize="2xl" color="white" fontWeight="bold">{value}</StatNumber>
      <StatHelpText color="brand.100">{footer}</StatHelpText>
    </Stat>
  </Box>
);

export const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();

  return (
    <Flex h="100vh" flexDirection="column">
      {/* Header / Topo */}
      <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg="#0b1437" borderBottom="1px solid #1f2747">
        <Text fontSize="xl" fontWeight="bold" letterSpacing="wide">
          PODIUM <Text as="span" color="#D4AF37">ADMIN</Text>
        </Text>
        <Flex align="center" gap={4}>
            <Text fontSize="sm" color="gray.400">Olá, {user?.email}</Text>
            <Button size="sm" colorScheme="red" variant="outline" onClick={signOut}>
              Sair
            </Button>
        </Flex>
      </Flex>

      {/* Conteúdo Principal */}
      <Box flex="1" p={8} overflowY="auto">
        <Text fontSize="2xl" mb={6} fontWeight="bold">Dashboard Geral</Text>
        
        {/* Grid de Cards (KPIs) */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Card title="Motoristas Online" value="1,250" footer="↗ 12% desde ontem" />
          <Card title="Corridas Hoje" value="8,900" footer="Manaus (Todas Zonas)" />
          <Card title="Faturamento do Dia" value="R$ 450k" footer="Meta: R$ 500k" />
          <Card title="Ticket Médio" value="R$ 50,56" footer="Corporativo" />
        </SimpleGrid>

        {/* Área do Mapa e Listas */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Box bg="#111c44" height="300px" borderRadius="20px" p={5}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Live Map (Manaus)</Text>
            <Flex align="center" justify="center" h="80%" bg="#0b1437" borderRadius="10px" border="1px dashed gray">
              <Text color="gray.500">[ Mapa em Tempo Real Integrado aqui ]</Text>
            </Flex>
          </Box>

          <Box bg="#111c44" height="300px" borderRadius="20px" p={5}>
             <Text fontSize="lg" fontWeight="bold" mb={4}>Últimas Corridas</Text>
             <Box>
               <Flex justify="space-between" mb={2} borderBottom="1px solid gray" pb={2}>
                 <Text color="gray.400">Passageiro</Text>
                 <Text color="gray.400">Valor</Text>
                 <Text color="gray.400">Status</Text>
               </Flex>
               <Flex justify="space-between" mb={2}>
                 <Text>João Silva (Samsung)</Text>
                 <Text fontWeight="bold">R$ 45,00</Text>
                 <Text color="green.400">Finalizada</Text>
               </Flex>
             </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};