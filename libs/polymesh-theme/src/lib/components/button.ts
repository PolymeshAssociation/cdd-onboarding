import { ComponentStyleConfig } from '@chakra-ui/react'

export const Button: ComponentStyleConfig = {
    baseStyle: {
        fontWeight: 'bold', // Normally, it is "semibold"     
        color: "blue",
      },
      sizes: {
        xl: {
            h: '56px',
            px: '56px',
            borderRadius: '28px',
        }
      },
      variants: {
        primary: {

        },
        outline: {},
      }
}