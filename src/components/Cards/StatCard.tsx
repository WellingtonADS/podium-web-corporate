import { Box, Card, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  children?: ReactNode;
}

export const StatCard = ({
  title,
  value,
  icon,
  color = "gold.600",
  children,
}: StatCardProps) => {
  const cardBg = useColorModeValue("white", "midnight.700");
  const borderColor = useColorModeValue("midnight.100", "midnight.600");

  return (
    <Card
      bg={cardBg}
      borderRadius="lg"
      p={6}
      shadow="sm"
      border="1px"
      borderColor={borderColor}
      transition="all 0.3s"
      _hover={{ shadow: "md", transform: "translateY(-2px)" }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={4}
      >
        <Box>
          <Heading size="md" color="midnight.900" mb={2}>
            {title}
          </Heading>
          <Text fontSize="2xl" fontWeight="bold" color={color}>
            {value}
          </Text>
        </Box>
        {icon && <Box color={color}>{icon}</Box>}
      </Box>
      {children}
    </Card>
  );
};
