import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

// Componente auxiliar para os links com suporte a ícones (visual)
const MenuLink = ({
  to,
  label,
  active = false,
}: {
  to: string;
  label: string;
  active?: boolean;
}) => (
  <NavLink to={to} style={{ textDecoration: "none", width: "100%" }}>
    {({ isActive }) => (
      <Box
        p={3}
        mx={4}
        mb={1}
        borderRadius="lg"
        bg={isActive || active ? "brand.100" : "transparent"}
        color={isActive || active ? "black" : "gray.400"}
        fontWeight={isActive || active ? "bold" : "medium"}
        _hover={{ bg: "whiteAlpha.100", color: "white" }}
        cursor="pointer"
        transition="all 0.2s"
        borderLeft={isActive || active ? "0px solid" : "0px solid transparent"} // Removemos a borda lateral antiga em favor do fundo preenchido
      >
        <Flex align="center">
          <Text fontSize="sm">{label}</Text>
        </Flex>
      </Box>
    )}
  </NavLink>
);

const MenuSection = ({ title }: { title: string }) => (
  <Box px={6} pt={6} pb={2}>
    <Text
      fontSize="10px"
      fontWeight="bold"
      color="gray.500"
      textTransform="uppercase"
      letterSpacing="widest"
    >
      {title}
    </Text>
  </Box>
);

export const Sidebar: React.FC = () => {
  return (
    <Box
      w="250px"
      h="100vh"
      bg="#111c44"
      borderRight="1px solid"
      borderColor="whiteAlpha.50"
      position="fixed"
      left={0}
      top={0}
      zIndex={100}
      boxShadow="4px 0px 30px rgba(0,0,0,0.3)" // Sombra mais pronunciada para profundidade
    >
      {/* Logo Area */}
      <Flex
        h="80px"
        align="center"
        justify="center"
        borderBottom="1px solid"
        borderColor="whiteAlpha.50"
        mb={2}
      >
        <Text
          fontSize="xl"
          fontWeight="black"
          color="white"
          letterSpacing="wide"
          fontStyle="italic"
        >
          PODIUM{" "}
          <Text as="span" color="brand.100">
            GO
          </Text>
        </Text>
      </Flex>

      {/* Menu Scrollável */}
      <Box
        overflowY="auto"
        h="calc(100vh - 80px)"
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "#2c3e50",
            borderRadius: "4px",
          },
        }}
      >
        <VStack spacing={0} align="stretch">
          <MenuSection title="Visão Geral" />
          <MenuLink to="/dashboard" label="Dashboard" />

          <MenuSection title="Gestão B2B" />
          <MenuLink to="/employees" label="Funcionários" />
          <MenuLink to="/cost-centers" label="Centros de Custo" />
          <MenuLink to="/billing" label="Faturamento" />
        </VStack>
      </Box>
    </Box>
  );
};
