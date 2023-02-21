import { extendTheme } from "@chakra-ui/react"

import { colors } from "./colors/colors"
import * as components from "./components"
import { styles } from "./styles"

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

export const theme = extendTheme({
    config,
    ...styles,
    colors,
    components,
  })

  export default theme