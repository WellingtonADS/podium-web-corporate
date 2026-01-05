import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react"; // <--- useEffect adicionado
import { useNavigate } from "react-router-dom"; // <--- Importação Crítica
import { useAuth } from "../contexts/AuthContext";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signed } = useAuth(); // <--- Pegamos 'signed' também
  const toast = useToast();
  const navigate = useNavigate(); // <--- Instância do navegador
  const [isLoading, setIsLoading] = useState(false);

  // Efeito de Segurança: Se já estiver logado, joga pro Dashboard
  // (Evita que o usuário acesse /login se já tiver token)
  useEffect(() => {
    if (signed) {
      navigate("/dashboard");
    }
  }, [signed, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn({ email, password });
      // O useEffect acima vai perceber a mudança de 'signed' e redirecionar.
      // Mas por garantia/rapidez, podemos forçar aqui também:
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro no login.",
        description: "Verifique as suas credenciais.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      width="100vw"
      height="100vh"
      align="center"
      justify="center"
      bg="midnight.900"
    >
      <Box layerStyle="card" p={8} maxWidth="400px">
        <Box textAlign="center">
          <Heading textStyle="h2" color="white">
            Podium{" "}
            <Text as="span" color="brand.600">
              Admin
            </Text>
          </Heading>
        </Box>
        <Box my={4} textAlign="left">
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel color="gray.300">Email</FormLabel>
              <Input
                type="email"
                placeholder="admin@podium.com"
                onChange={(e) => setEmail(e.target.value)}
                variant="outline"
              />
            </FormControl>
            <FormControl mt={6} isRequired>
              <FormLabel color="gray.300">Password</FormLabel>
              <Input
                type="password"
                placeholder="*******"
                onChange={(e) => setPassword(e.target.value)}
                variant="outline"
              />
            </FormControl>
            <Button
              width="full"
              mt={4}
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};
