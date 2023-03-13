import { ComponentStyleConfig } from '@chakra-ui/react'

export const Button: ComponentStyleConfig = {
    baseStyle: {
        fontWeight: 500,
        color: "blue",
        paddingX: '1.5em',
        paddingY: '0.8em',
        letterSpacing: '0.05em',
      },
      sizes: {
        xl: {
            h: '56px',
            px: '56px',
            borderRadius: '28px',
        },
        lg: {
            h: '48px',
            px: '48px',
            borderRadius: '24px',
        },
        md: {
            h: '36px',
            px: '36px',
            borderRadius: '18px',
            paddingY: '0.5em',
        },
        sm: {
            h: '24px',
            px: '24px',
            borderRadius: '12px',
        }
      },
}