import { Box, HStack } from '@chakra-ui/react'

import { FooterContainer, Logo } from '../../atoms'
import { FooterCopy } from '../FooterCopy'

export type FooterProps = {
    center?: React.ReactNode,
    right?: React.ReactNode,
}

const FooterTop: React.FC<FooterProps> = ({ center, right }) => {
  return (
    <FooterContainer>
      <HStack w="100%" justifyContent="space-between">
      <Logo height={{ base: '19px', lg: '16px', xl: '19px', }} variant="grey" />
      <Box>{center}</Box>
      <Box>{right}</Box>
      </HStack>
    </FooterContainer>
  )
}

export const Footer: React.FC<FooterProps> = ({ center, right }) => {
  return (
    <Box>
      <FooterTop center={center} right={right} />
      <FooterCopy isThemeModeVisible={false} />
    </Box>
  )
}

export default Footer