import { Box, HStack } from '@chakra-ui/react'

import Logo from '../logo/logo'

export type HeaderProps = {
    center?: React.ReactNode,
    right?: React.ReactNode,
}

export const Header: React.FC<HeaderProps> = ({ center, right }) => {
  return (
    <HStack maxW="100%" w="100%" position="fixed" top={0} left={0} right={0} py="1rem" px="3.125rem" justifyContent="space-between">
      <Logo height={{ base: '19px', lg: '16px', xl: '19px', }} />
      <Box>{center}</Box>
      <Box>{right}</Box>
    </HStack>
  )
}

export default Header