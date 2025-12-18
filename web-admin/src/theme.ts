import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#0b1437', // Azul Escuro Profundo (Horizon Dark)
        color: 'white',
      },
    },
  },
  colors: {
    brand: {
      100: '#D4AF37', // Dourado
      900: '#1a202c',
    },
  },
});