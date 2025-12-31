import { Box, Button, Container, Divider, Flex, HStack, Icon, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { MdFacebook, MdLanguage, MdLinkedIn } from "react-icons/md";

const Footer = () => {
  const footerLinks = [
    { label: "Sobre", href: "#" },
    { label: "Parceiros", href: "#" },
    { label: "Doações", href: "#" },
  ];

  const socialLinks = [
    { icon: MdFacebook, label: "Facebook", href: "#" },
    { icon: MdLinkedIn, label: "LinkedIn", href: "#" },
    { icon: MdLanguage, label: "Website", href: "#" },
  ];

  return (
    <Box bg="black" borderTopWidth="1px" borderTopColor="whiteAlpha.100">
      <Container maxW="1200px" py={{ base: 12, md: 16 }}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 8, md: 12 }} mb={12}>
          <VStack align="flex-start" spacing={3}>
            <Text fontSize="xs" color="gold.600" letterSpacing="0.1em" fontWeight={700} textTransform="uppercase">
              Links Rápidos
            </Text>
            {footerLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                fontSize="sm"
                color="whiteAlpha.700"
                _hover={{ color: "gold.600" }}
                h="auto"
                p={0}
                as="a"
                href={link.href}
              >
                {link.label}
              </Button>
            ))}
          </VStack>

          <VStack align="flex-start" spacing={3}>
            <Text fontSize="xs" color="gold.600" letterSpacing="0.1em" fontWeight={700} textTransform="uppercase">
              Redes Sociais
            </Text>
            <HStack spacing={3}>
              {socialLinks.map((link) => (
                <Button
                  key={link.label}
                  as="a"
                  href={link.href}
                  variant="ghost"
                  isRound
                  w={10}
                  h={10}
                  p={0}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg="whiteAlpha.100"
                  color="white"
                  _hover={{ bg: "gold.600", color: "midnight.900" }}
                  transition="all 0.3s"
                >
                  <Icon as={link.icon} boxSize={5} />
                </Button>
              ))}
            </HStack>
          </VStack>

          <VStack align="flex-start" spacing={3}>
            <Text fontSize="xs" color="gold.600" letterSpacing="0.1em" fontWeight={700} textTransform="uppercase">
              Contato
            </Text>
            <VStack align="flex-start" spacing={2} fontSize="sm" color="whiteAlpha.700">
              <Text>Manaus, AM - Brasil</Text>
              <Text>hello@podium.com</Text>
            </VStack>
          </VStack>
        </SimpleGrid>

        <Divider borderColor="whiteAlpha.100" my={8} />

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          gap={4}
        >
          <Text fontSize="2xs" color="whiteAlpha.600" letterSpacing="0.05em" textTransform="uppercase">
            © 2025 Podium Rent A Car. Todos os direitos reservados.
          </Text>
          <HStack spacing={6} fontSize="2xs" color="whiteAlpha.600">
            <Button variant="ghost" _hover={{ color: "gold.600" }} fontSize="2xs" h="auto" p={0}>
              Privacidade
            </Button>
            <Button variant="ghost" _hover={{ color: "gold.600" }} fontSize="2xs" h="auto" p={0}>
              Termos
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;