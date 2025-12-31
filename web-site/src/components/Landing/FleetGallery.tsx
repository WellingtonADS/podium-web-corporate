import { Box, Container, Heading, Image, SimpleGrid, Text, VStack } from "@chakra-ui/react";

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
    >
      <Box
        overflow="hidden"
        height="250px"
        position="relative"
      >
        <Image
          src={image}
          alt={title}
          w="full"
          h="full"
          objectFit="cover"
          transition="all 0.3s"
          _groupHover={{ transform: "scale(1.05)" }}
        />
      </Box>
      <VStack p={6} align="flex-start" spacing={2} flex={1}>
        <Heading textStyle="h3" color="white">
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
      image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=600&h=400&fit=crop",
    },
    {
      title: "SUV Blindado",
      image: "https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=600&h=400&fit=crop",
    },
    {
      title: "Van Corporativa",
      image: "https://images.unsplash.com/photo-1533473359331-35b3c054d2d7?w=600&h=400&fit=crop",
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
            <Text textStyle="subtitle" color="gold.600" fontSize="sm" letterSpacing="0.1em">
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