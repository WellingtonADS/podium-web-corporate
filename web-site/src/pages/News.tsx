import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Footer, Header } from "../layouts";

interface NewsItem {
  title: string;
  summary: string;
  tag: string;
  date: string;
  href: string;
}

const news: NewsItem[] = [
  {
    title: "Plano mensal com tabela fixa",
    summary:
      "Pacotes de horas ou KM para diretoria com motoristas treinados, sem tarifa dinâmica e com cobertura em Manaus.",
    tag: "Promoção",
    date: "Jan 2026",
    href: "/#lead",
  },
  {
    title: "Transfers aeroporto ↔ hotel",
    summary:
      "Operação coordenada para eventos e agendas corporativas com veículos premium e SLA de pontualidade.",
    tag: "Novidade",
    date: "Jan 2026",
    href: "/#lead",
  },
  {
    title: "Gestão corporativa B2B",
    summary:
      "Centralize custos de mobilidade com centro de custo, relatórios e faturamento mensal simplificado.",
    tag: "Solução",
    date: "Dez 2025",
    href: "/#lead",
  },
];

const News = () => {
  return (
    <Box bg="midnight.900" minH="100vh">
      <Header />

      <Box pt={28} pb={{ base: 12, md: 16 }}>
        <Container maxW="1100px">
          <VStack align="flex-start" spacing={6} mb={8}>
            <Text
              fontSize="xs"
              color="gold.600"
              letterSpacing="0.15em"
              textTransform="uppercase"
              fontWeight={700}
            >
              Novidades
            </Text>
            <Heading textStyle="h1" color="white" lineHeight={1.2}>
              Atualizações, promoções e comunicados
            </Heading>
            <Text color="whiteAlpha.800" maxW="720px">
              Fique por dentro das condições especiais, novos serviços e
              melhorias operacionais da Podium. Se quiser falar com um
              consultor, clique em qualquer chamada de ação abaixo.
            </Text>
          </VStack>

          <Grid
            templateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={{ base: 6, md: 8 }}
          >
            {news.map((item) => (
              <GridItem key={item.title}>
                <VStack
                  align="flex-start"
                  spacing={3}
                  p={6}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  bg="midnight.800"
                  boxShadow="0 10px 30px rgba(0,0,0,0.35)"
                >
                  <HStack spacing={3} color="whiteAlpha.700" fontSize="sm">
                    <Tag colorScheme="yellow" variant="subtle">
                      {item.tag}
                    </Tag>
                    <Text color="whiteAlpha.600">{item.date}</Text>
                  </HStack>
                  <Heading textStyle="h3" color="white" lineHeight={1.3}>
                    {item.title}
                  </Heading>
                  <Text color="whiteAlpha.800" fontSize="sm">
                    {item.summary}
                  </Text>
                  <Button
                    as="a"
                    href={item.href}
                    variant="primary"
                    size="sm"
                    letterSpacing="0.05em"
                  >
                    Falar com um consultor
                  </Button>
                </VStack>
              </GridItem>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default News;
