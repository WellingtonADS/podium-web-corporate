import React, { useEffect, useState } from 'react';
import { 
  Box, Flex, Text, Button, Table, Thead, Tbody, Tr, Th, Td, 
  Badge, Spinner, useToast, Modal, ModalOverlay, ModalContent, 
  ModalHeader, ModalFooter, ModalBody, ModalCloseButton, 
  useDisclosure, FormControl, FormLabel, Input, SimpleGrid 
} from '@chakra-ui/react';
import api, { User, CreateDriverData } from '../services/api';

export const Drivers: React.FC = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [drivers, setDrivers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<CreateDriverData>({
    full_name: '',
    email: '',
    password: '',
    role: 'driver',
    vehicle_model: '',
    vehicle_plate: '',
    cnh_number: ''
  });

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await api.get<User[]>('/users/', {
        params: { role: 'driver' } 
      });
      setDrivers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleCreateDriver = async () => {
    try {
      setIsSaving(true);
      await api.post('/signup/driver', formData);
      
      toast({
        title: 'Motorista cadastrado!',
        status: 'success',
        duration: 3000,
      });

      onClose();
      setFormData({
        full_name: '', email: '', password: '', role: 'driver',
        vehicle_model: '', vehicle_plate: '', cnh_number: ''
      });
      fetchDrivers();
    } catch (error) {
      toast({
        title: 'Erro ao criar motorista',
        description: 'Verifique os dados e tente novamente.',
        status: 'error',
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box>
      {/* Título e Botão */}
      <Flex align="center" justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="white">
          Gestão de <Text as="span" color="#D4AF37">Motoristas</Text>
        </Text>
        <Button colorScheme="yellow" size="sm" onClick={onOpen}>
          + Novo Motorista
        </Button>
      </Flex>

      {/* Tabela de Listagem */}
      <Box bg="#111c44" borderRadius="20px" p={6} boxShadow="lg">
        {loading ? (
          <Flex justify="center" p={10}><Spinner color="brand.100" /></Flex>
        ) : (
          <Table variant="simple" color="white">
            <Thead>
              <Tr>
                <Th color="gray.400">Nome</Th>
                <Th color="gray.400">Veículo</Th>
                <Th color="gray.400">CNH</Th>
                <Th color="gray.400">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {drivers.map((driver) => (
                <Tr key={driver.id} _hover={{ bg: "#1a254e" }}>
                  <Td>
                    <Text fontWeight="bold">{driver.full_name}</Text>
                    <Text fontSize="xs" color="gray.400">{driver.email}</Text>
                  </Td>
                  <Td>
                    {driver.driver_profile ? (
                      <>
                        <Text>{driver.driver_profile.vehicle_model}</Text>
                        <Badge colorScheme="blue">{driver.driver_profile.vehicle_plate}</Badge>
                      </>
                    ) : <Text color="gray.500">-</Text>}
                  </Td>
                  <Td>{driver.driver_profile?.cnh_number || '-'}</Td>
                  <Td>
                    <Badge colorScheme={driver.is_active ? "green" : "red"}>
                      {driver.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* MODAL DE CADASTRO */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent bg="#111c44" color="white">
          <ModalHeader>Novo Motorista</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={2} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome Completo</FormLabel>
                <Input 
                  bg="#0b1437" border="none"
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                  type="email" bg="#0b1437" border="none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <Input 
                  type="password" bg="#0b1437" border="none"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>CNH</FormLabel>
                <Input 
                  bg="#0b1437" border="none"
                  value={formData.cnh_number}
                  onChange={e => setFormData({...formData, cnh_number: e.target.value})}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Modelo do Carro</FormLabel>
                <Input 
                  placeholder="Ex: Fiat Cronos" bg="#0b1437" border="none"
                  value={formData.vehicle_model}
                  onChange={e => setFormData({...formData, vehicle_model: e.target.value})}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Placa</FormLabel>
                <Input 
                  placeholder="ABC-1234" bg="#0b1437" border="none"
                  value={formData.vehicle_plate}
                  onChange={e => setFormData({...formData, vehicle_plate: e.target.value})}
                />
              </FormControl>
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} _hover={{ bg: "#1a254e" }}>
              Cancelar
            </Button>
            <Button colorScheme="yellow" onClick={handleCreateDriver} isLoading={isSaving}>
              Salvar Motorista
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};