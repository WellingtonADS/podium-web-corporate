import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: () => void | Promise<void>;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export const FormModal = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  children,
  submitLabel = "Salvar",
  cancelLabel = "Cancelar",
  isLoading = false,
}: FormModalProps) => {
  const headerBg = useColorModeValue("midnight.50", "midnight.800");
  const contentBg = useColorModeValue("white", "midnight.700");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={contentBg}>
        <ModalHeader
          bg={headerBg}
          borderBottomWidth="1px"
          borderColor="midnight.200"
          fontWeight="bold"
        >
          {title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>{children}</ModalBody>
        <ModalFooter borderTopWidth="1px" borderColor="midnight.200">
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button
              colorScheme="gold"
              bg="gold.600"
              _hover={{ bg: "gold.700" }}
              onClick={onSubmit}
              isLoading={isLoading}
            >
              {submitLabel}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
