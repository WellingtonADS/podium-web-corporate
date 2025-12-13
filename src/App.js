// src/App.js
import React from 'react';
import { ChakraProvider, Box, Flex, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, extendTheme } from '@chakra-ui/react';

// 1. Configuração do Tema "Podium Dark"
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#0b1437', // Azul Escuro Profundo (Horizon Dark)
        color: 'white',
      },
    },
  },
  colors: {
    brand: {
      100: '#D4AF37', // Dourado
      900: '#1a202c',
    },
  },
});

// Componente de Cartão (Card)
const Card = ({ title, value, footer }) => (
  <Box bg="#111c44" p={5} borderRadius="20px" boxShadow="lg">
    <Stat>
      <StatLabel color="gray.400">{title}</StatLabel>
      <StatNumber fontSize="2xl" color="white" fontWeight="bold">{value}</StatNumber>
      <StatHelpText color="brand.100">{footer}</StatHelpText>
    </Stat>
  </Box>
);

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Flex h="100vh" flexDirection="column">
        {/* Header / Topo */}
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg="#0b1437" borderBottom="1px solid #1f2747">
          <Text fontSize="xl" fontWeight="bold" letterSpacing="wide">
            PODIUM <Text as="span" color="#D4AF37">ADMIN</Text>
          </Text>
          <Box>
            <Text fontSize="sm" color="gray.400">Bem-vindo, Gestor</Text>
          </Box>
        </Flex>

        {/* Conteúdo Principal */}
        <Box flex="1" p={8}>
          <Text fontSize="2xl" mb={6} fontWeight="bold">Dashboard Geral</Text>
          
          {/* Grid de Cards (KPIs) */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
            <Card title="Motoristas Online" value="1,250" footer="↗ 12% desde ontem" />
            <Card title="Corridas Hoje" value="8,900" footer="Manaus (Todas Zonas)" />
            <Card title="Faturamento do Dia" value="R$ 450k" footer="Meta: R$ 500k" />
            <Card title="Ticket Médio" value="R$ 50,56" footer="Corporativo" />
          </SimpleGrid>

          {/* Área do Mapa (Simulação) */}
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
                 <Flex justify="space-between" mb={2}>
                   <Text>Maria Souza (Honda)</Text>
                   <Text fontWeight="bold">R$ 22,50</Text>
                   <Text color="blue.400">Em Rota</Text>
                 </Flex>
               </Box>
            </Box>
          </SimpleGrid>

        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;