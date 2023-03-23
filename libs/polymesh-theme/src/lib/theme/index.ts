import { extendTheme } from "@chakra-ui/react"

import { colors } from "./colors/colors"
import components from "./components"
import { styles } from "./styles"
import { breakpoints } from "./breakpoints"

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

export const theme = extendTheme({
    breakpoints,
    config,
    ...styles,
    colors,
    components,
  })

  export default theme