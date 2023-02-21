import { extendTheme } from "@chakra-ui/react"

import { colors } from "./colors/colors"
import { Button } from "./components/button"
import { Heading } from "./components/heading"
import { Link } from "./components/link"
import { Text } from "./components/text"
import { styles } from "./styles"

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

export const theme = extendTheme({
    config,
    ...styles,
    colors,
    components: {
      Button,
      Heading,
      Text,
      Link,
    }
  })