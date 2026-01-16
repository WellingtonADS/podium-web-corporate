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

export interface EmployeeRow {
  id: number;
  full_name: string;
  email: string;
  department: string;
  cost_center_id?: number;
  cost_center_name?: string;
  is_active: boolean;
}

interface EmployeesTableProps {
  employees: EmployeeRow[];
  onEdit?: (employee: EmployeeRow) => void;
  onDelete?: (id: number) => void;
  actions?: (employee: EmployeeRow) => ReactNode;
}

export const EmployeesTable = ({
  employees,
  onEdit,
  onDelete,
  actions,
}: EmployeesTableProps) => {
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
                Email
              </Th>
              <Th color="midnight.900" fontWeight="bold">
                Departamento
              </Th>
              <Th color="midnight.900" fontWeight="bold">
                Centro de Custo
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
            {employees.map((employee) => (
              <Tr key={employee.id} bg={rowBg} _hover={{ bg: hoverBg }}>
                <Td fontWeight="medium">{employee.full_name}</Td>
                <Td fontSize="sm">{employee.email}</Td>
                <Td>{employee.department}</Td>
                <Td>
                  {employee.cost_center_name ??
                    (employee.cost_center_id
                      ? String(employee.cost_center_id)
                      : "-")}
                </Td>
                <Td>
                  <Badge colorScheme={employee.is_active ? "green" : "gray"}>
                    {employee.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    {actions ? (
                      actions(employee)
                    ) : (
                      <>
                        {onEdit && (
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => onEdit(employee)}
                          >
                            Editar
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => onDelete(employee.id)}
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
