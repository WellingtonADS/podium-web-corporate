import {
  Card,
  Heading,
  Text,
  Progress,
  HStack,
  VStack,
  Button,
  useColorModeValue,
  Box,
  Badge,
} from "@chakra-ui/react";

interface CostCenterCardProps {
  name: string;
  code: string;
  budget_limit: number;
  current_spent: number;
  active: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CostCenterCard = ({
  name,
  code,
  budget_limit,
  current_spent,
  active,
  onEdit,
  onDelete,
}: CostCenterCardProps) => {
  const cardBg = useColorModeValue("white", "midnight.700");
  const borderColor = useColorModeValue("midnight.100", "midnight.600");
  const percentage = (current_spent / budget_limit) * 100;

  const getProgressColor = () => {
    if (percentage >= 90) return "red";
    if (percentage >= 70) return "yellow";
    return "green";
  };

  return (
    <Card
      bg={cardBg}
      borderRadius="lg"
      p={6}
      shadow="sm"
      border="1px"
      borderColor={borderColor}
      transition="all 0.3s"
      _hover={{ shadow: "md" }}
    >
      <HStack justify="space-between" mb={4}>
        <Box>
          <Heading size="md" color="midnight.900">
            {name}
          </Heading>
          <Text fontSize="sm" color="midnight.500">
            Código: {code}
          </Text>
        </Box>
        <Badge colorScheme={active ? "green" : "gray"}>
          {active ? "Ativo" : "Inativo"}
        </Badge>
      </HStack>

      <VStack align="stretch" spacing={3}>
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" fontWeight="600">
              Orçamento Utilizado
            </Text>
            <Text fontSize="sm" color="midnight.600">
              R$ {current_spent.toFixed(2)} / R$ {budget_limit.toFixed(2)}
            </Text>
          </HStack>
          <Progress
            value={percentage}
            size="md"
            colorScheme={getProgressColor()}
            borderRadius="full"
            hasStripe
          />
          <Text fontSize="xs" color="midnight.500" mt={1}>
            {percentage.toFixed(1)}% utilizado
          </Text>
        </Box>

        <HStack spacing={2}>
          {onEdit && (
            <Button size="sm" colorScheme="blue" flex={1} onClick={onEdit}>
              Editar
            </Button>
          )}
          {onDelete && (
            <Button size="sm" colorScheme="red" flex={1} onClick={onDelete}>
              Deletar
            </Button>
          )}
        </HStack>
      </VStack>
    </Card>
  );
};
