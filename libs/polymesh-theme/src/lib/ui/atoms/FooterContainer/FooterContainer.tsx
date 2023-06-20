import { StackProps, useColorModeValue, VStack } from "@chakra-ui/react"

export const FooterContainer: React.FC<StackProps> = ({ children, ...rest }) => {
    const borderColor = useColorModeValue('gray.200', 'gray.700')

    return (
      <VStack maxW="100%" w="100%" py="1rem" px="3.125rem" borderStyle="solid none none" borderWidth="1px 0 0" borderColor={borderColor} {...rest}>
        {children}
      </VStack>
    )
  }

export default FooterContainer;