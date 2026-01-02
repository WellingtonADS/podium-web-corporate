import { Box, Button, Flex } from '@chakra-ui/react';

const Navbar = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box position="fixed" top={0} w="full" bg="rgba(0,0,0,0.8)" zIndex={10} p={4}>
      <Flex maxW="1200px" mx="auto" justify="center" gap={4}>
        <Button onClick={() => scrollToSection('services')} variant="ghost" color="white">
          Serviços
        </Button>
        <Button onClick={() => scrollToSection('fleet')} variant="ghost" color="white">
          Frota
        </Button>
      </Flex>
    </Box>
  );
};

export default Navbar;