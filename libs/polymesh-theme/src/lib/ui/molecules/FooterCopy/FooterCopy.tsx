import { StackProps, Text, Link } from '@chakra-ui/react'
import React from 'react'
import { FooterContainer, ModeSelector } from '../../atoms'

export const FooterCopy: React.FC<StackProps & { compact?: boolean, isThemeModeVisible?: boolean }> = ({ compact, isThemeModeVisible = true, ...rest}) => {
    return (
      <FooterContainer fontSize="0.8rem" alignItems="center" {...rest}>
        <Text padding={0} m={0} w="100%">© {new Date().getFullYear()} Polymesh Association {compact && <br />} All Rights Reserved</Text>
        <Text marginTop="0px" w="100%"><Link href="https://polymesh.network/privacy-policy" isExternal>Privacy Policy</Link>{compact ? <br /> : ` | `}<Link href="https://polymesh.network/terms-of-service" isExternal>Terms Of Service</Link></Text>
        {isThemeModeVisible && <ModeSelector showLabel />}
      </FooterContainer>
    )
  }

export default FooterCopy