import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  SelectProps,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface FormSelectProps extends SelectProps {
  label?: string;
  error?: string;
  isRequired?: boolean;
  children: ReactNode;
}

export const FormSelect = ({
  label,
  error,
  isRequired = false,
  children,
  ...props
}: FormSelectProps) => {
  const borderColor = useColorModeValue("midnight.200", "midnight.600");

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired} mb={4}>
      {label && <FormLabel fontWeight="600">{label}</FormLabel>}
      <Select
        variant="outline"
        borderColor={borderColor}
        _focus={{
          borderColor: "gold.600",
          boxShadow: "0 0 0 1px #D4AF37",
        }}
        {...props}
      >
        {children}
      </Select>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
