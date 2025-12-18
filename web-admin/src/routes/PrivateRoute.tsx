import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Flex, Spinner } from '@chakra-ui/react';

export const PrivateRoute: React.FC = () => {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh" bg="#0b1437">
        <Spinner color="brand.100" size="xl" />
      </Flex>
    );
  }

  // Se estiver logado, renderiza as rotas filhas (Outlet). Se não, redireciona para Login.
  return signed ? <Outlet /> : <Navigate to="/login" replace />;
};