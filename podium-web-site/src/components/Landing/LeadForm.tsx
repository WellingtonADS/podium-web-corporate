import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Heading,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdCall, MdStarRate } from "react-icons/md";
import { LeadData, submitLead } from "../../api/leads.service";
import { formatPhone, isValidPhone } from "../../utils/masks";

const LeadForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LeadData>({
    full_name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>();
  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Aplicar máscara telefone
    if (name === "phone") {
      finalValue = formatPhone(value);
    }

    setFormData({ ...formData, [name]: finalValue });

    // Limpar erro ao digitar
    if (errors && errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = "Telefone deve ter 10 ou 11 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await submitLead(formData);
      onOpen();
      setFormData({ full_name: "", email: "", phone: "" });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        "Erro ao enviar solicitação. Tente novamente.";
      toast({
        title: "Erro",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    onClose();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Box id="lead" layerStyle="section" bg="midnight.900">
        <Container maxW="1200px">
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={{ base: 8, md: 12 }}
            alignItems="center"
          >
            {/* Testimonial */}
            <VStack align="flex-start" spacing={6}>
              <Box display="flex" gap={1} color="gold.600">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} as={MdStarRate} boxSize={5} />
                ))}
              </Box>

              <Text
                fontSize={{ base: "lg", md: "xl" }}
                fontFamily="heading"
                color="white"
                lineHeight={1.6}
                fontWeight={500}
              >
                "Ótimo serviço de aluguel! O carro estava em perfeitas condições
                e o motorista foi muito profissional."
              </Text>

              <VStack align="flex-start" spacing={1}>
                <Text fontWeight="bold" color="white" fontSize="md">
                  Ana R.
                </Text>
                <Text
                  fontSize="xs"
                  color="gold.600"
                  letterSpacing="0.05em"
                  fontWeight={600}
                  textTransform="uppercase"
                >
                  Cliente Executiva
                </Text>
              </VStack>

              <Box
                p={6}
                bg="whiteAlpha.5"
                border="1px solid"
                borderColor="whiteAlpha.100"
                rounded="lg"
                display="flex"
                gap={4}
                alignItems="flex-start"
              >
                <Box
                  w={12}
                  h={12}
                  bg="gold.600"
                  rounded="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Icon as={MdCall} color="midnight.900" boxSize={6} />
                </Box>
                <VStack align="flex-start" spacing={0}>
                  <Text
                    fontSize="2xs"
                    color="whiteAlpha.600"
                    letterSpacing="0.1em"
                    fontWeight={600}
                  >
                    Fone uma ligação?
                  </Text>
                  <Text fontSize="sm" color="white" mt={2}>
                    Av. Exemplo, 723 • Manaus, AM
                  </Text>
                </VStack>
              </Box>
            </VStack>

            {/* Form */}
            <Box
              bg="midnight.800"
              border="1px solid"
              borderColor="whiteAlpha.100"
              p={{ base: 6, md: 8 }}
              rounded="xl"
              boxShadow="0 0 30px rgba(0, 0, 0, 0.3)"
            >
              <VStack spacing={6} align="stretch">
                <Heading textStyle="h3" color="white" textTransform="uppercase">
                  Contacte
                </Heading>

                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                  <VStack spacing={5}>
                    <FormControl isInvalid={!!errors?.full_name}>
                      <FormLabel
                        fontSize="sm"
                        fontWeight={600}
                        color="whiteAlpha.800"
                      >
                        Nome Completo
                      </FormLabel>
                      <Input
                        name="full_name"
                        placeholder="Seu nome"
                        value={formData.full_name}
                        onChange={handleChange}
                        px={4}
                        py={2.5}
                        fontSize="sm"
                      />
                      <FormErrorMessage fontSize="xs" mt={1}>
                        {errors?.full_name}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors?.email}>
                      <FormLabel
                        fontSize="sm"
                        fontWeight={600}
                        color="whiteAlpha.800"
                      >
                        Email
                      </FormLabel>
                      <Input
                        name="email"
                        type="email"
                        placeholder="seu.email@exemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        px={4}
                        py={2.5}
                        fontSize="sm"
                      />
                      <FormErrorMessage fontSize="xs" mt={1}>
                        {errors?.email}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors?.phone}>
                      <FormLabel
                        fontSize="sm"
                        fontWeight={600}
                        color="whiteAlpha.800"
                      >
                        Telefone
                      </FormLabel>
                      <Input
                        name="phone"
                        placeholder="(92) 99999-9999"
                        value={formData.phone}
                        onChange={handleChange}
                        px={4}
                        py={2.5}
                        fontSize="sm"
                      />
                      <FormErrorMessage fontSize="xs" mt={1}>
                        {errors?.phone}
                      </FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      variant="primary"
                      w="full"
                      py={3}
                      fontSize="sm"
                      letterSpacing="0.05em"
                      isLoading={isLoading}
                      loadingText="Enviando..."
                    >
                      Enviar
                    </Button>
                  </VStack>
                </form>
              </VStack>
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Success Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent
          bg="midnight.800"
          borderColor="gold.600"
          border="1px solid"
        >
          <ModalHeader
            color="gold.600"
            textAlign="center"
            textTransform="uppercase"
            letterSpacing="0.1em"
            borderBottomColor="whiteAlpha.100"
            borderBottomWidth="1px"
          >
            Solicitação Confirmada
          </ModalHeader>
          <ModalCloseButton
            color="gold.600"
            _hover={{ bg: "whiteAlpha.100" }}
          />
          <ModalBody py={8}>
            <VStack spacing={4}>
              <Box fontSize="3xl" textAlign="center">
                ✓
              </Box>
              <Text
                textAlign="center"
                color="white"
                fontSize="md"
                lineHeight={1.6}
              >
                Agradecemos o interesse na frota Podium. Um de nossos
                consultores entrará em contato em breve para apresentar a
                proposta.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter
            borderTopColor="whiteAlpha.100"
            borderTopWidth="1px"
            justifyContent="center"
          >
            <Button
              variant="primary"
              onClick={handleCloseModal}
              w="full"
              letterSpacing="0.05em"
            >
              Voltar ao Início
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LeadForm;
