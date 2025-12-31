import { Box, Button, Container, Heading, HStack, Text, VStack } from "@chakra-ui/react";

const Hero = () => {
  const handleScroll = () => {
    const element = document.getElementById("lead");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      position="relative"
      minH="100vh"
      pt={20}
      pb={{ base: 12, md: 20 }}
      overflow="hidden"
      bgImage="url(/images/hero.jpg)"
      bgSize="cover"
      bgPosition="center"
      bgAttachment={{ base: "scroll", md: "fixed" }}
    >
      {/* Overlay Gradient */}
      <Box
        position="absolute"
        inset={0}
        bg="radial-gradient(circle at 50% 50%, rgba(11, 16, 25, 0.35) 0%, rgba(11, 16, 25, 0.9) 65%)"
        pointerEvents="none"
      />

      {/* Content */}
      <Container maxW="1200px" position="relative" zIndex={10} h="full" display="flex" alignItems="center">
        <VStack spacing={{ base: 6, md: 8 }} align="flex-start" maxW={{ base: "full", lg: "55%" }}>
          <Text
            fontSize="xs"
            color="gold.600"
            letterSpacing="0.2em"
            textTransform="uppercase"
            fontWeight={700}
          >
            Há 17 anos em mobilidade executiva
          </Text>
          <Heading
            textStyle="h1"
            color="white"
            lineHeight={1.2}
          >
            SUA MOBILIDADE COM <Text as="span" color="gold.600">CONFIANÇA</Text> E PRATICIDADE
          </Heading>

          <Text textStyle="subtitle" maxW="md">
            Elimine imprevistos e priorize segurança: frota própria premium, motoristas treinados em protocolo e tabela fixa por KM e zona.
          </Text>

          <HStack spacing={4} flexWrap="wrap">
            <Button
              variant="primary"
              size="lg"
              px={8}
              py={4}
              fontSize="sm"
              letterSpacing="0.05em"
              onClick={handleScroll}
              boxShadow="0 0 20px rgba(212, 175, 55, 0.3)"
              _hover={{
                boxShadow: "0 0 30px rgba(212, 175, 55, 0.5)",
              }}
            >
              Solicitar Orçamento
            </Button>
            <Button
              as="a"
              href="https://corp.podiumrentacar.com"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
              px={8}
              py={4}
              fontSize="sm"
              letterSpacing="0.05em"
            >
              Área Corporativa
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Hero;