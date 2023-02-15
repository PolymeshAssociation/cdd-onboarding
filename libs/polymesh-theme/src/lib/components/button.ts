import { ComponentStyleConfig } from '@chakra-ui/react'

export const Button: ComponentStyleConfig = {
    baseStyle: {
        fontWeight: 'bold', // Normally, it is "semibold"        
      },
      sizes: {
        xl: {
            h: '56px',
            borderRadius: '28px',
        }
      },
      variants: {
        primary: {},
        outline: {},
      }
}