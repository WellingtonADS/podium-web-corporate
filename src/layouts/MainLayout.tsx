import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export const MainLayout: React.FC = () => {
  return (
    <Flex minH="100vh" bg="#0b1437">
      {/* 1. Sidebar Fixa */}
      <Sidebar />

      {/* 2. Área de Conteúdo (Deslocada 250px para a direita) */}
      <Box ml="250px" w="calc(100% - 250px)" transition="all 0.3s">
        
        {/* 2.1 Header Fixo no topo do conteúdo */}
        <Header />

        {/* 2.2 Conteúdo Variável (Dashboard, Drivers, etc.) */}
        <Box p={8} h="calc(100vh - 80px)" overflowY="auto">
          <Outlet /> 
        </Box>
        
      </Box>
    </Flex>
  );
};