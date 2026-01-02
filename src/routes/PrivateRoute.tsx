import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Flex, Spinner } from "@chakra-ui/react";

export const PrivateRoute: React.FC = () => {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh" bg="midnight.900">
        <Spinner color="brand.600" size="xl" />
      </Flex>
    );
  }

  return signed ? <Outlet /> : <Navigate to="/login" replace />;
};
