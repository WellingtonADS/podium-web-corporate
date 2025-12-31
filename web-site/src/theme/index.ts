import { extendTheme } from "@chakra-ui/react";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";

// Paleta Podium
const midnight = {
  50: "#F5F5F7",
  100: "#EAEAED",
  200: "#D5D5DB",
  300: "#C0C0C9",
  400: "#8B8B95",
  500: "#565661",
  600: "#2D2D3D",
  700: "#1A1A2E",
  800: "#0F141F",
  900: "#0B1019", // Azul Meia-noite Principal
};

const gold = {
  50: "#FEF9EF",
  100: "#FEF3DF",
  200: "#FDE8BF",
  300: "#FDD99F",
  400: "#FCC86F",
  500: "#F5B73F",
  600: "#D4AF37", // Dourado Principal
  700: "#A68627",
  800: "#7A6220",
  900: "#4E3D14",
};

export const theme = extendTheme({
  fonts: {
    heading: "'Montserrat', sans-serif",
    body: "'Inter', sans-serif",
  },
  colors: {
    midnight,
    gold,
    brand: {
      50: gold[50],
      100: gold[100],
      200: gold[200],
      300: gold[300],
      400: gold[400],
      500: gold[500],
      600: gold[600],
      700: gold[700],
      800: gold[800],
      900: gold[900],
    },
  },
  styles: {
    global: {
      html: {
        scrollBehavior: "smooth",
      },
      body: {
        bg: midnight[900],
        color: "white",
        fontFamily: "body",
      },
      a: {
        color: gold[600],
        _hover: {
          color: gold[400],
        },
      },
    },
  },
  layerStyles: {
    card: {
      bg: midnight[800],
      border: "1px solid",
      borderColor: "whiteAlpha.100",
      borderRadius: "lg",
      p: 6,
      transition: "all 0.3s",
      _hover: {
        borderColor: gold[600],
        boxShadow: `0 0 20px rgba(212, 175, 55, 0.1)`,
      },
    },
    section: {
      py: { base: 12, md: 20 },
      px: { base: 4, md: 6 },
    },
  },
  textStyles: {
    h1: {
      fontFamily: "heading",
      fontSize: { base: "2xl", md: "4xl", lg: "5xl" },
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: "heading",
      fontSize: { base: "xl", md: "2xl", lg: "3xl" },
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontFamily: "heading",
      fontSize: { base: "lg", md: "xl" },
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle: {
      fontFamily: "body",
      fontSize: { base: "sm", md: "md" },
      fontWeight: 300,
      color: "whiteAlpha.700",
      lineHeight: 1.6,
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
      variants: {
        primary: {
          bg: gold[600],
          color: midnight[900],
          fontWeight: 700,
          fontSize: "sm",
          letterSpacing: "0.05em",
          _hover: {
            bg: gold[500],
            transform: "scale(1.05)",
          },
          _active: {
            bg: gold[700],
          },
        },
        secondary: {
          bg: "transparent",
          color: gold[600],
          border: "1px solid",
          borderColor: gold[600],
          fontWeight: 700,
          fontSize: "sm",
          letterSpacing: "0.05em",
          _hover: {
            bg: "whiteAlpha.100",
            borderColor: gold[400],
            color: gold[400],
          },
        },
      },
    },
    Heading: {
      defaultProps: {
        fontFamily: "heading",
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: midnight[800],
            borderColor: "whiteAlpha.200",
            color: "white",
            _focus: {
              borderColor: gold[600],
              boxShadow: `0 0 0 1px ${gold[600]}`,
            },
            _placeholder: {
              color: "whiteAlpha.500",
            },
          },
        },
      },
    },
    Textarea: {
      variants: {
        outline: {
          bg: midnight[800],
          borderColor: "whiteAlpha.200",
          color: "white",
          _focus: {
            borderColor: gold[600],
            boxShadow: `0 0 0 1px ${gold[600]}`,
          },
          _placeholder: {
            color: "whiteAlpha.500",
          },
        },
      },
    },
  },
});

export default theme;
