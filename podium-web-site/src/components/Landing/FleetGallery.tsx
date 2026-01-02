import {
  Box,
  Container,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";

interface VehicleCardProps {
  title: string;
  image: string;
}

const VehicleCard = ({ title, image }: VehicleCardProps) => (
  <Box role="group" h="full">
    <VStack
      layerStyle="card"
      align="stretch"
      overflow="hidden"
      p={0}
      height="100%"
      transition="all 0.3s"
      _groupHover={{ transform: "translateY(-8px)", boxShadow: "2xl" }}
      borderRadius="lg"
    >
      <Box
        overflow="hidden"
        height={{ base: "200px", md: "250px", lg: "280px" }}
        position="relative"
        bg="gray.900"
        flexShrink={0}
        borderTopRadius="lg"
      >
        <Image
          src={image}
          alt={title}
          w="full"
          h="full"
          objectFit="contain"
          objectPosition="center"
          transition="all 0.3s ease"
          loading="lazy"
          bg="gray.800"
        />
      </Box>
      <VStack p={6} align="flex-start" spacing={2} flex={1} justify="center">
        <Heading
          textStyle="h3"
          color="white"
          fontSize={{ base: "lg", md: "xl" }}
        >
          {title}
        </Heading>
      </VStack>
    </VStack>
  </Box>
);

const FleetGallery = () => {
  const vehicles = [
    {
      title: "Sedan Executivo",
      image: "/images/sedan-executivo.jpg",
    },
    {
      title: "SUV Executivo",
      image: "/images/suv-executivo.jpg",
    },
    {
      title: "Van Corporativa",
      image: "/images/van-corporativa.jpg",
    },
  ];

  return (
    <Box id="fleet" layerStyle="section" bg="midnight.900">
      <Container maxW="1200px">
        <VStack spacing={{ base: 8, md: 12 }} align="stretch">
          <VStack spacing={3} align="center">
            <Heading textStyle="h2" color="white" textAlign="center">
              NOSSA FROTA
            </Heading>
            <Text
              textStyle="subtitle"
              color="gold.600"
              fontSize="sm"
              letterSpacing="0.1em"
            >
              Veículos de Luxo Renovados
            </Text>
          </VStack>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={{ base: 6, md: 8 }}
          >
            {vehicles.map((vehicle, index) => (
              <VehicleCard key={index} {...vehicle} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default FleetGallery;
