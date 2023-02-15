import { mode } from '@chakra-ui/theme-tools';
import type { StyleFunctionProps } from '@chakra-ui/styled-system';

export const styles = {
  fonts: {
    body: 'Poppins, sans-serif',
  },
  global: (props: StyleFunctionProps) => ({
    'html, body': {
      bg: mode('bg.light', 'bg.dark')(props),
      color: mode('text.light', 'text.dark')(props),
    },
    a: {
      color: 'teal.500',
      _hover: {
        textDecoration: 'underline',
      },
    },
  }),
};
