import { ComponentMultiStyleConfig } from '@chakra-ui/react';

const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-1.75rem)',
};

export const Form: ComponentMultiStyleConfig = {
  parts: [],
  variants: {
    floating: {
      container: {
        _focusWithin: {
          label: {
            ...activeLabelStyles,
          },
        },
        '> input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label':
          {
            ...activeLabelStyles,
          },
        label: {
          top: 0,
          left: 0,
          zIndex: 2,
          position: 'absolute',
          backgroundColor: 'white',
          pointerEvents: 'none',
          mx: 3,
          px: 1,
          my: 3,
          transformOrigin: 'left top',
        },
      },
    },
  },
};
