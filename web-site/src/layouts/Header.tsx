import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdClose, MdDirectionsCar, MdMenu } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleNavClick = (id: string) => {
    // Se estiver em outra página, navega para Home com hash
    if (window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }

    // Se já estiver na Home, apenas rola
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const navLinks = [
    { label: "Serviços", id: "services" },
    { label: "Frota", id: "fleet" },
    { label: "Contato", id: "lead" },
  ];

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={50}
      bg="midnight.900"
      backdropFilter="blur(10px)"
      borderBottom="1px solid"
      borderColor="whiteAlpha.100"
    >
      <Flex
        maxW="1400px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        h={20}
        align="center"
        justify="space-between"
      >
        {/* Logo */}
        <HStack
          spacing={2}
          cursor="pointer"
          onClick={() => {
            if (window.location.pathname !== "/") {
              window.location.href = "/";
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <Box
            w={8}
            h={8}
            rounded="full"
            border="2px solid"
            borderColor="gold.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={MdDirectionsCar} color="gold.600" boxSize={5} />
          </Box>
          <Box>
            <Box
              fontFamily="heading"
              fontWeight="bold"
              fontSize="lg"
              color="gold.600"
              letterSpacing="0.1em"
            >
              PODIUM
            </Box>
            <Box
              fontSize="2xs"
              color="whiteAlpha.600"
              letterSpacing="0.15em"
              fontWeight="500"
            >
              Rent A Car
            </Box>
          </Box>
        </HStack>

        {/* Desktop Navigation */}
        {!isMobile && (
          <HStack spacing={8} display={{ base: "none", md: "flex" }}>
            {navLinks.map((link) => (
              <Button
                key={link.id}
                variant="ghost"
                color="white"
                fontSize="sm"
                fontWeight="600"
                letterSpacing="0.05em"
                textTransform="uppercase"
                _hover={{ color: "gold.600" }}
                onClick={() => handleNavClick(link.id)}
              >
                {link.label}
              </Button>
            ))}
            <Button
              as={RouterLink}
              to="/novidades"
              variant="ghost"
              color="white"
              fontSize="sm"
              fontWeight="600"
              letterSpacing="0.05em"
              textTransform="uppercase"
              _hover={{ color: "gold.600" }}
            >
              Novidades
            </Button>
          </HStack>
        )}

        {/* Desktop CTA */}
        {!isMobile && (
          <Button
            as="a"
            href="https://corp.podiumrentacar.com"
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            px={6}
            py={2.5}
            fontSize="xs"
            letterSpacing="0.05em"
          >
            Área Corporativa
          </Button>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            onClick={() => setIsOpen(!isOpen)}
            display={{ base: "flex", md: "none" }}
          >
            <Icon as={isOpen ? MdClose : MdMenu} boxSize={6} />
          </Button>
        )}
      </Flex>

      {/* Mobile Navigation */}
      {isMobile && isOpen && (
        <Box
          bg="midnight.800"
          borderTop="1px solid"
          borderColor="whiteAlpha.100"
          p={4}
          display={{ base: "flex", md: "none" }}
          flexDirection="column"
          gap={3}
        >
          {navLinks.map((link) => (
            <Button
              key={link.id}
              w="full"
              variant="ghost"
              color="white"
              fontSize="sm"
              fontWeight="600"
              justifyContent="flex-start"
              _hover={{ color: "gold.600" }}
              onClick={() => handleNavClick(link.id)}
            >
              {link.label}
            </Button>
          ))}
          <Button
            as={RouterLink}
            to="/novidades"
            variant="ghost"
            color="white"
            fontSize="sm"
            fontWeight="600"
            justifyContent="flex-start"
            _hover={{ color: "gold.600" }}
          >
            Novidades
          </Button>
          <Button
            as="a"
            href="https://corp.podiumrentacar.com"
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            w="full"
            fontSize="xs"
            mt={2}
          >
            Área Corporativa
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Header;
