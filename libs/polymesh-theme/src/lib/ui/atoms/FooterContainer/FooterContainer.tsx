import { StackProps, VStack } from "@chakra-ui/react"

export const FooterContainer: React.FC<StackProps> = ({ children, ...rest }) => {

    return (
      <VStack maxW="100%" w="100%" py="1rem" px="3.125rem" borderStyle="solid none none" borderWidth="1px 0 0" borderColor="#c7c7c7 #000" {...rest}>
        {children}
      </VStack>
    )
  }

export default FooterContainer;