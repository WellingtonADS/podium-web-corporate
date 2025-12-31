import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#000000', // Preto
        color: '#D4AF37', // Dourado
      },
    },
  },
  colors: {
    brand: {
      100: '#D4AF37', // Dourado
      900: '#000000', // Preto
    },
  },
});