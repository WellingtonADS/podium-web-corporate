import { Box, Container, Heading, Icon, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { MdBusinessCenter, MdDirectionsCar, MdSecurity } from "react-icons/md";
import { IconType } from "react-icons";

interface ServiceCardProps {
  icon: IconType;
  title: string;
  description: string;
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => (
  <Box role="group" h="full">
    <VStack
      layerStyle="card"
      align="flex-start"
      h="full"
    >
      <Box
        w={14}
        h={14}
        rounded="full"
        border="1px solid"
        borderColor="whiteAlpha.200"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="gold.600"
        transition="all 0.3s"
        _groupHover={{ bg: "gold.600", color: "midnight.900" }}
      >
        <Icon as={icon} boxSize={7} />
      </Box>
      <Heading textStyle="h3" color="white" textTransform="uppercase">
        {title}
      </Heading>
      <Text fontSize="sm" color="whiteAlpha.700">
        {description}
      </Text>
    </VStack>
  </Box>
);

const Services = () => {
  const services = [
    {
      icon: MdDirectionsCar,
      title: "Gestão Corporativa (B2B)",
      description: "Elimine a tarifa dinâmica. Utilizamos tabela de preço fixa por KM e Zona , garantindo previsibilidade total e fim das glosas no seu centro de custo.",
    },
    {
      icon: MdSecurity,
      title: "Transporte Executivo & Blindado",
      description: "Segurança máxima para autoridades. Frota própria de blindados e sedans premium, conduzida por motoristas especializados em direção defensiva e protocolo.",
    },
    {
      icon: MdBusinessCenter,
      title: "Terceirização de Frotas",
      description: "Há 17 anos liderando a logística em Manaus. Gerenciamos sua frota e motoristas para que sua empresa foque apenas no core business, sem passivo trabalhista.",
    },
  ];

  return (
    <Box id="services" layerStyle="section" bg="midnight.800">
      <Container maxW="1200px">
        <VStack spacing={{ base: 8, md: 12 }} align="stretch">
          <VStack spacing={3} align="center">
            <Heading textStyle="h2" color="white" textAlign="center">
              NOSSOS SERVIÇOS
            </Heading>
            <Text textStyle="subtitle" color="gold.600" fontSize="sm" letterSpacing="0.1em">
              Soluções Premium para Sua Mobilidade
            </Text>
          </VStack>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={{ base: 6, md: 8 }}
          >
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Services;