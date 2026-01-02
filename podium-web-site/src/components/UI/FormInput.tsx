import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  FormErrorMessage,
  useColorModeValue,
  InputProps,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface FormInputProps extends InputProps {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  isRequired?: boolean;
}

export const FormInput = ({
  label,
  error,
  leftIcon,
  isRequired = false,
  ...props
}: FormInputProps) => {
  const borderColor = useColorModeValue("midnight.200", "midnight.600");

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired} mb={4}>
      {label && <FormLabel fontWeight="600">{label}</FormLabel>}
      <InputGroup>
        {leftIcon && <InputLeftElement>{leftIcon}</InputLeftElement>}
        <Input
          variant="outline"
          borderColor={borderColor}
          _focus={{
            borderColor: "gold.600",
            boxShadow: "0 0 0 1px #D4AF37",
          }}
          {...props}
        />
      </InputGroup>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
