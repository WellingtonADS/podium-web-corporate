import React from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
} from "@chakra-ui/react";

const Billing: React.FC = () => {
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={8}>
        <Text textStyle="h2" color="white">
          Faturas &{" "}
          <Text as="span" color="brand.600">
            Auditoria
          </Text>
        </Text>
      </Flex>

      <Box layerStyle="card" borderRadius="20px" p={6}>
        <Table variant="simple" color="white">
          <Thead>
            <Tr>
              <Th color="gray.400">Mês/Ano</Th>
              <Th color="gray.400">Corridas</Th>
              <Th color="gray.400">Valor Total</Th>
              <Th color="gray.400">Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Janeiro/2026</Td>
              <Td>128</Td>
              <Td fontWeight="bold" color="brand.600">
                R$ 12.500,00
              </Td>
              <Td>
                <Badge colorScheme="yellow">Pendente</Badge>
              </Td>
            </Tr>
            <Tr>
              <Td>Dezembro/2025</Td>
              <Td>142</Td>
              <Td fontWeight="bold" color="brand.600">
                R$ 14.200,00
              </Td>
              <Td>
                <Badge colorScheme="green">Pago</Badge>
              </Td>
            </Tr>
            <Tr>
              <Td>Novembro/2025</Td>
              <Td>135</Td>
              <Td fontWeight="bold" color="brand.600">
                R$ 13.500,00
              </Td>
              <Td>
                <Badge colorScheme="green">Pago</Badge>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default Billing;
