import { Box, Progress } from "@chakra-ui/react";
import React from "react";
import { useLoading } from "../../contexts/LoadingContext";

/**
 * Barra de progresso global que aparece no topo da página
 * durante requisições longas (upload CSV, importação em massa, etc)
 */
export const GlobalLoadingBar: React.FC = () => {
  const { isLoading } = useLoading();

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={9999}
      height={isLoading ? "3px" : "0"}
      transition="height 0.2s ease-in-out"
    >
      <Progress
        value={isLoading ? 90 : 0}
        colorScheme="gold"
        height="100%"
        isAnimated
        hasStripe
      />
    </Box>
  );
};
