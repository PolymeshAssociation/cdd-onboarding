import { mode } from '@chakra-ui/theme-tools';
import type { StyleFunctionProps } from '@chakra-ui/styled-system';
import { colors } from './colors/colors';

const fontFamily = `'Poppins', sans-serif`;

export const styles = {
  fonts: {
    html: fontFamily,
    body: fontFamily,
    heading: fontFamily,   
  },
  global: (props: StyleFunctionProps) => ({
    'html, body': {
      bg: mode(colors.bg.light, colors.bg.dark)(props),
      color: mode(colors.text.light, colors.text.dark)(props),
      fontSize: "16px",
      minHeight: "100vh",
      height: 'auto',
      maxHeight: '100vh',
      lineHeight: '1.5',
    },
  }),
};
