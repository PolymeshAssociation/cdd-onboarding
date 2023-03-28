import { switchAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys)

const baseStyle = definePartsStyle({
  container: {
    
  },
  thumb: {
    bg: 'pink.800',
    _checked: {
        bg: "gray.100"
    }
  },
  track: {
    bg: 'gray.100',
    _checked: {
      bg: 'pink.800',
    },
  },
})

export const Switch = defineMultiStyleConfig({ baseStyle })