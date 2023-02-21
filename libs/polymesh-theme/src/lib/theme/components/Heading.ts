import { ComponentStyleConfig } from '@chakra-ui/react';

export const Heading: ComponentStyleConfig = {
  baseStyle: {
    paddingBottom: 0,
    lineHeight: '140%',
    fontWeight: 600,
    letterSpacing: '-0.03em',
  },
  sizes: {
    '4xl': {
      fontSize: '3rem',
    },
    '3xl': {
      fontSize: '2rem',
    },
    '2xl': {
      fontSize: '1.5rem',
    },
    xl: {
        fontSize: '1.25rem',
    },
    lg: {
        fontSize: '1rem',
    },
    md: { 
        fontSize: '0.875rem',
    },
    sm: {
        fontSize: '0.75rem',
    },
    xs: {
        fontSize: '0.625rem',
    },
  },
};
