import React, { useState, useEffect } from 'react'; // <--- useEffect adicionado
import { Flex, Box, Heading, FormControl, FormLabel, Input, Button, Text, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // <--- Importação Crítica
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signed } = useAuth(); // <--- Pegamos 'signed' também
  const toast = useToast();
  const navigate = useNavigate(); // <--- Instância do navegador
  const [isLoading, setIsLoading] = useState(false);

  // Efeito de Segurança: Se já estiver logado, joga pro Dashboard
  // (Evita que o usuário acesse /login se já tiver token)
  useEffect(() => {
    if (signed) {
      navigate('/dashboard');
    }
  }, [signed, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn({ email, password });
      // O useEffect acima vai perceber a mudança de 'signed' e redirecionar.
      // Mas por garantia/rapidez, podemos forçar aqui também:
      navigate('/dashboard'); 
    } catch (error) {
      toast({
        title: 'Erro no login.',
        description: 'Verifique as suas credenciais.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex width="100vw" height="100vh" align="center" justify="center" bg="#0b1437">
      <Box p={8} maxWidth="400px" borderWidth={1} borderRadius={8} boxShadow="lg" bg="#111c44" borderColor="#1f2747">
        <Box textAlign="center">
          <Heading color="white">Podium <Text as="span" color="brand.100">Admin</Text></Heading>
        </Box>
        <Box my={4} textAlign="left">
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel color="gray.300">Email</FormLabel>
              <Input 
                type="email" 
                placeholder="admin@podium.com" 
                onChange={e => setEmail(e.target.value)} 
                bg="#0b1437"
                border="none"
                color="white"
                _focus={{ border: "1px solid #D4AF37" }}
              />
            </FormControl>
            <FormControl mt={6} isRequired>
              <FormLabel color="gray.300">Password</FormLabel>
              <Input 
                type="password" 
                placeholder="*******" 
                onChange={e => setPassword(e.target.value)} 
                bg="#0b1437"
                border="none"
                color="white"
                _focus={{ border: "1px solid #D4AF37" }}
              />
            </FormControl>
            <Button width="full" mt={4} type="submit" bg="brand.100" _hover={{ bg: '#b5952f' }} isLoading={isLoading}>
              Entrar
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};