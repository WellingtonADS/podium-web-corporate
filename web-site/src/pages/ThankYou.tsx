import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
  return (
    <Box textAlign="center" py={20}>
      <Heading>Obrigado!</Heading>
      <Text mt={4}>Seu lead foi enviado com sucesso. Entraremos em contato em breve.</Text>
      <Button as={Link} to="/" mt={6} colorScheme="gold">
        Voltar ao Início
      </Button>
    </Box>
  );
};

export default ThankYou;