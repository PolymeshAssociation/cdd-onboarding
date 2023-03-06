import { VStack } from "@chakra-ui/react";

export type SectionContainerProps = {
    children: React.ReactNode;
    noGutters?: boolean;
    fullHeight?: boolean;
  };
  
  export const SectionContainer: React.FC<SectionContainerProps> = ({
    children,
    noGutters,
    fullHeight,
  }) => {
    return (
      <VStack
        maxW="100%"
        w="100%"
        py="3.125rem"
        px={noGutters ? 'unset' : '3.125rem'}
        align="flex-start"
        minH={fullHeight ? '100vh' : undefined}
      >
        {children}
      </VStack>
    );
  };