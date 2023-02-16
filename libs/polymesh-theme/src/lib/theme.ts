import { extendTheme } from "@chakra-ui/react"

import { colors } from "./colors/colors"
import { Button } from "./components/button"
import { Heading } from "./components/heading"
import { Text } from "./components/text"
import { styles } from "./styles"

export const theme = extendTheme({
    ...styles,
    colors,
    components: {
      Button,
      Heading,
      Text,
    }
  })