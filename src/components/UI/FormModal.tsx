import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
  const headerBg = "midnight.900";
  const contentBg = "midnight.800";
  const borderColor = "gold.600";
  const textColor = "white";

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={contentBg} color={textColor}>
        <ModalHeader
          bg={headerBg}
          borderBottomWidth="2px"
          borderColor={borderColor}
          fontWeight="bold"
          color={textColor}
        >
          {title}
        </ModalHeader>
        <ModalCloseButton color={textColor} _hover={{ color: "gold.500" }} />
        <ModalBody py={6}>{children}</ModalBody>
        <ModalFooter borderTopWidth="2px" borderColor={borderColor}>
          <HStack spacing={3}>
            <Button
              variant="ghost"
              onClick={onClose}
              color="white"
              _hover={{ bg: "midnight.700", color: "gold.500" }}
            >
              {cancelLabel}
            </Button>
            <Button
              colorScheme="gold"
              bg="gold.600"
              color="white"
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
