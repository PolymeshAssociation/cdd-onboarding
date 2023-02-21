import { Box, StackProps, HStack, Link, VStack, Text } from '@chakra-ui/react'

import Logo from '../../logo/logo'

const FooterContainer: React.FC<StackProps> = ({ children, ...rest }) => {

  return (
    <VStack maxW="100%" w="100%" py="1rem" px="3.125rem" borderStyle="solid none none" borderWidth="1px 0 0" borderColor="#c7c7c7 #000" {...rest}>
      {children}
    </VStack>
  )
}

export type FooterProps = {
    center?: React.ReactNode,
    right?: React.ReactNode,
}

const FooterTop: React.FC<FooterProps> = ({ center, right }) => {
  return (
    <FooterContainer>
      <HStack w="100%" justifyContent="space-between">
      <Logo height={{ base: '19px', lg: '16px', xl: '19px', }} variant="grey" />
      <Box>{center} a</Box>
      <Box>{right} b</Box>
      </HStack>
    </FooterContainer>
  )
}

const FooterCopy = () => {

  return (
    <FooterContainer fontSize="0.8rem" alignItems="flex-start">
      <Text padding={0} m={0}>© 2022 Polymesh Association. All Right Reserved</Text>
      <Text marginTop="0px"><Link>Privacy Policy</Link> | <Link>Terms Of Service</Link></Text>
    </FooterContainer>
  )
}



export const Footer: React.FC<FooterProps> = ({ center, right }) => {
  return (
    <Box>
      <FooterTop />
      <FooterCopy />
    </Box>
  )
}

export default Footer