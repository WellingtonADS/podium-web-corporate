import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  FormErrorMessage,
  useColorModeValue,
  InputProps,
  Select,
  SelectProps,
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

interface FormSelectProps extends SelectProps {
  label?: string;
  error?: string;
  isRequired?: boolean;
  options: Array<{ value: string | number; label: string }>;
}

export const FormSelect = ({
  label,
  error,
  isRequired = false,
  options,
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
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
