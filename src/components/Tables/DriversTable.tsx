// DEPRECATED: Tabela de Motoristas — não utilizada no Portal Corporativo. Remover ou mover para pacote de Operação.
import {
  Badge,
  Box,
  Button,
  Card,
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface Driver {
  id: number;
  full_name: string;
  vehicle_plate: string;
  vehicle_model: string;
  is_active: boolean;
}

interface DriversTableProps {
  drivers: Driver[];
  onEdit?: (driver: Driver) => void;
  onDelete?: (id: number) => void;
  actions?: (driver: Driver) => ReactNode;
}

export const DriversTable = ({
  drivers,
  onEdit,
  onDelete,
  actions,
}: DriversTableProps) => {
  const headBg = useColorModeValue("midnight.50", "midnight.800");
  const rowBg = useColorModeValue("white", "midnight.700");
  const hoverBg = useColorModeValue("midnight.25", "midnight.600");

  return (
    <Card borderRadius="lg" overflow="hidden" shadow="sm">
      <Box overflowX="auto">
        <Table variant="simple" size="md">
          <Thead bg={headBg}>
            <Tr>
              <Th color="midnight.900" fontWeight="bold">
                Nome
              </Th>
              <Th color="midnight.900" fontWeight="bold">
                Placa
              </Th>
              <Th color="midnight.900" fontWeight="bold">
                Modelo
              </Th>
              <Th color="midnight.900" fontWeight="bold">
                Status
              </Th>
              <Th color="midnight.900" fontWeight="bold">
                Ações
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {drivers.map((driver) => (
              <Tr key={driver.id} bg={rowBg} _hover={{ bg: hoverBg }}>
                <Td fontWeight="medium">{driver.full_name}</Td>
                <Td>{driver.vehicle_plate}</Td>
                <Td>{driver.vehicle_model}</Td>
                <Td>
                  <Badge colorScheme={driver.is_active ? "green" : "gray"}>
                    {driver.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    {actions ? (
                      actions(driver)
                    ) : (
                      <>
                        {onEdit && (
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => onEdit(driver)}
                          >
                            Editar
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => onDelete(driver.id)}
                          >
                            Deletar
                          </Button>
                        )}
                      </>
                    )}
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
};
