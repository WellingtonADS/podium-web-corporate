import {
  Badge,
  Box,
  Card,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { RideRecord } from "../../services/api";
import { formatCurrency } from "../../utils";

interface BillingTableProps {
  rides: RideRecord[];
}

export const BillingTable = ({ rides }: BillingTableProps) => {
  const headBg = useColorModeValue("midnight.50", "midnight.800");
  const rowBg = useColorModeValue("white", "midnight.700");
  const hoverBg = useColorModeValue("midnight.25", "midnight.600");
  const violationBg = useColorModeValue("red.50", "rgba(245, 67, 54, 0.1)");

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card borderRadius="lg" overflow="hidden" shadow="sm">
      <Box overflowX="auto">
        <Table variant="simple" size="md">
          <Thead bg={headBg}>
            <Tr>
              <Th color="midnight.900" fontWeight="bold">
                Funcionário
              </Th>
              <Th color="midnight.900" fontWeight="bold">
                Centro de Custo
              </Th>
              <Th color="midnight.900" fontWeight="bold">
                Data
              </Th>
              <Th color="midnight.900" fontWeight="bold">
                Categoria
              </Th>
              <Th color="midnight.900" fontWeight="bold" textAlign="right">
                Valor
              </Th>
              <Th color="midnight.900" fontWeight="bold">
                Conformidade
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {rides.map((ride) => (
              <Tr
                key={ride.id}
                bg={ride.policy_compliant ? rowBg : violationBg}
                _hover={{ bg: hoverBg }}
              >
                <Td fontWeight="medium">{ride.employee_name}</Td>
                <Td>{ride.cost_center_name}</Td>
                <Td fontSize="sm">{formatDate(ride.ride_date)}</Td>
                <Td>
                  <Badge colorScheme="blue" variant="subtle">
                    {ride.category}
                  </Badge>
                </Td>
                <Td fontWeight="bold" color="gold.600" textAlign="right">
                  {formatCurrency(ride.amount)}
                </Td>
                <Td>
                  {ride.policy_compliant ? (
                    <Badge colorScheme="green">Conforme</Badge>
                  ) : (
                    <Badge colorScheme="red" title={ride.violation_reason}>
                      Violação
                    </Badge>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {rides.length === 0 && (
        <Box p={6} textAlign="center" color="midnight.500">
          Nenhuma corrida encontrada para os filtros aplicados.
        </Box>
      )}
    </Card>
  );
};
