import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Slide {
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
}

const slides: Slide[] = [
  {
    title: "Tarifa fixa por KM e zona",
    description:
      "Previsibilidade total para sua operação executiva com tabela publicada e sem tarifa dinâmica.",
    cta: "Fale com um consultor",
    href: "#lead",
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&h=600&fit=crop",
  },
  {
    title: "Transfers e eventos",
    description:
      "Planejamento porta a porta para agendas corporativas, hotéis e aeroportos com frota própria premium.",
    cta: "Planejar trajeto",
    href: "#lead",
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&h=600&fit=crop",
  },
  {
    title: "Planos mensais",
    description:
      "Reduza custo com pacotes mensais de horas ou KM para executivos e diretoria.",
    cta: "Ver condições",
    href: "#lead",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&h=600&fit=crop",
  },
];

const PromoCarousel = () => {
  const [index, setIndex] = useState(0);

  const current = slides[index];

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box bg="midnight.800" py={{ base: 12, md: 16 }}>
      <Container maxW="1200px">
        <Grid
          templateColumns={{ base: "1fr", lg: "1.1fr 0.9fr" }}
          gap={{ base: 8, md: 10 }}
          alignItems="center"
        >
          <GridItem>
            <VStack align="flex-start" spacing={5}>
              <Text
                fontSize="xs"
                color="gold.600"
                letterSpacing="0.1em"
                textTransform="uppercase"
                fontWeight={700}
              >
                Novidades e ofertas
              </Text>
              <Heading textStyle="h2" color="white" lineHeight={1.2}>
                {current.title}
              </Heading>
              <Text color="whiteAlpha.800" fontSize="md">
                {current.description}
              </Text>
              <HStack spacing={3}>
                <Button
                  as="a"
                  href={current.href}
                  variant="primary"
                  px={6}
                  py={3}
                  fontSize="sm"
                  letterSpacing="0.05em"
                >
                  {current.cta}
                </Button>
                <HStack spacing={2}>
                  {slides.map((_, i) => (
                    <Box
                      key={i}
                      w={2.5}
                      h={2.5}
                      rounded="full"
                      bg={i === index ? "gold.600" : "whiteAlpha.400"}
                      transition="all 0.2s"
                    />
                  ))}
                </HStack>
              </HStack>
              <HStack spacing={3} pt={2}>
                <Button variant="outline" onClick={handlePrev} size="sm" px={5}>
                  Anterior
                </Button>
                <Button variant="outline" onClick={handleNext} size="sm" px={5}>
                  Próximo
                </Button>
              </HStack>
            </VStack>
          </GridItem>
          <GridItem>
            <Box
              borderRadius="xl"
              overflow="hidden"
              border="1px solid"
              borderColor="whiteAlpha.200"
              boxShadow="0 20px 60px rgba(0,0,0,0.45)"
            >
              <Image
                src={current.image}
                alt={current.title}
                w="full"
                h={{ base: "240px", md: "340px" }}
                objectFit="cover"
                transition="all 0.3s"
              />
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default PromoCarousel;
