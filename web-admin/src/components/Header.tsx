import React from 'react';
import { Flex, Text, Button, Box } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Flex
      as="header"
      h="80px"
      align="center"
      justify="space-between"
      px={8}
      bg="#0b1437" // Mantém a cor de fundo para fundir com o conteúdo
      borderBottom="1px solid"
      borderColor="whiteAlpha.100"
    >
      <Box>
        <Text fontSize="sm" color="gray.400" textTransform="capitalize">
          {currentDate}
        </Text>
        <Text fontSize="md" fontWeight="bold" color="white">
          Bem-vindo, {user?.full_name || 'Gestor'}
        </Text>
      </Box>

      <Flex align="center" gap={4}>
        <Box textAlign="right" display={{ base: 'none', md: 'block' }}>
          <Text fontSize="xs" color="gray.500">CONTA ADMINISTRATIVA</Text>
          <Text fontSize="sm" color="brand.100">{user?.email}</Text>
        </Box>
        <Button 
          size="sm" 
          variant="outline" 
          colorScheme="red" 
          onClick={signOut}
          _hover={{ bg: 'red.500', color: 'white', borderColor: 'red.500' }}
        >
          Sair
        </Button>
      </Flex>
    </Flex>
  );
};