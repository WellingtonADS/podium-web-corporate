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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signed } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
              Corporate
            </Text>
          </Heading>
        </Box>
        <Box my={4} textAlign="left">
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel color="gray.300">Email</FormLabel>
              <Input
                type="email"
                placeholder="corporate@empresa.com"
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
