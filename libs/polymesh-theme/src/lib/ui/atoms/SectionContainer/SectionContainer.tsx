import { VStack } from "@chakra-ui/react";

export type SectionContainerProps = {
    children: React.ReactNode;
    noGutters?: boolean;
    fullHeight?: boolean;
    fullWidth?: boolean;
  };
  
  export const SectionContainer: React.FC<SectionContainerProps> = ({
    children,
    noGutters,
    fullHeight,
    fullWidth,
  }) => {
    return (
      <VStack
        maxW={fullWidth ? '100vw' : { base: '100%', md: '80%', lg: '1440px'}}
        py="3.125rem"
        px={noGutters ? 'unset' : { base: '1.5rem', md: '3.125rem' }}
        align="flex-start"
        minH={fullHeight ? '100vh' : undefined}
        mx="auto"
        position="relative"
      >
        {children}
      </VStack>
    );
  };