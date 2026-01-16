import {
  Box,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

interface SelectSearchableOption {
  value: number | string;
  label: string;
}

interface SelectSearchableProps {
  label?: string;
  placeholder?: string;
  value: number | string;
  options: SelectSearchableOption[];
  onChange: (value: number | string) => void;
  isRequired?: boolean;
}

export const SelectSearchable: React.FC<SelectSearchableProps> = ({
  label,
  placeholder = "Digite para pesquisar...",
  value,
  options,
  onChange,
  isRequired = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<
    SelectSearchableOption[]
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const borderColor = useColorModeValue("midnight.200", "midnight.600");

  // Atualiza o texto baseado no valor selecionado
  useEffect(() => {
    const selected = options.find((opt) => opt.value === value);
    if (selected && !isOpen) {
      setSearchTerm(selected.label);
    } else if (!value && !isOpen) {
      setSearchTerm("");
    }
  }, [value, options, isOpen]);

  // Filtra opções baseado no termo de busca
  useEffect(() => {
    if (!searchTerm) {
      setFilteredOptions(options);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = options.filter((opt) =>
      opt.label.toLowerCase().includes(term)
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (option: SelectSearchableOption) => {
    onChange(option.value);
    setSearchTerm(option.label);
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <FormControl isRequired={isRequired} mb={4} ref={containerRef}>
      {label && <FormLabel fontWeight="600">{label}</FormLabel>}
      <Box position="relative">
        <Input
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          variant="outline"
          bg="midnight.800"
          borderColor={borderColor}
          color="white"
          _placeholder={{ color: "whiteAlpha.500" }}
          _focus={{
            borderColor: "gold.600",
            boxShadow: "0 0 0 1px #D4AF37",
          }}
        />

        {isOpen && filteredOptions.length > 0 && (
          <List
            position="absolute"
            top="100%"
            left={0}
            right={0}
            mt={1}
            bg="midnight.800"
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius="md"
            maxH="240px"
            overflowY="auto"
            zIndex={1000}
            boxShadow="lg"
          >
            {filteredOptions.map((option) => (
              <ListItem
                key={option.value}
                px={4}
                py={2.5}
                cursor="pointer"
                _hover={{ bg: "midnight.700" }}
                onClick={() => handleSelect(option)}
                bg={option.value === value ? "gold.600" : "transparent"}
                color={option.value === value ? "midnight.900" : "white"}
                fontWeight={option.value === value ? "600" : "500"}
              >
                <Text>{option.label}</Text>
              </ListItem>
            ))}
          </List>
        )}

        {isOpen && filteredOptions.length === 0 && searchTerm && (
          <Box
            position="absolute"
            top="100%"
            left={0}
            right={0}
            mt={1}
            bg="midnight.800"
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius="md"
            p={4}
            zIndex={1000}
          >
            <Text fontSize="sm" color="whiteAlpha.600">
              Nenhum resultado encontrado
            </Text>
          </Box>
        )}
      </Box>
    </FormControl>
  );
};
