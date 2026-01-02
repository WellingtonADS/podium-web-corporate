import { Button, ButtonProps, useColorModeValue } from "@chakra-ui/react";

interface PodiumButtonProps extends ButtonProps {
  variant?: "solid" | "outline" | "ghost";
}

export const PodiumButton = ({
  variant = "solid",
  ...props
}: PodiumButtonProps) => {
  const hoverBg = useColorModeValue("gold.700", "gold.500");

  if (variant === "outline") {
    return (
      <Button
        variant="outline"
        borderColor="gold.600"
        color="gold.600"
        _hover={{ bg: "gold.50", borderColor: "gold.700" }}
        {...props}
      />
    );
  }

  if (variant === "ghost") {
    return (
      <Button
        variant="ghost"
        color="gold.600"
        _hover={{ bg: "gold.50" }}
        {...props}
      />
    );
  }

  return (
    <Button
      bg="gold.600"
      color="white"
      _hover={{ bg: hoverBg, transform: "translateY(-2px)" }}
      transition="all 0.3s"
      {...props}
    />
  );
};
