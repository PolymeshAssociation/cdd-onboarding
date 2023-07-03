import { Box, VStack, StackProps } from '@chakra-ui/react';

export type SectionContainerProps = {
  children: React.ReactNode;
  noGutters?: boolean;
  fullHeight?: boolean;
  fullWidth?: boolean;
} & StackProps;

export const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  noGutters,
  fullHeight,
  fullWidth,
  bgImage,
  bgPosition,
  bgRepeat,
  bgSize,
  ...rest
}) => {
  return (
    <Box w="100vw" bgImage={bgImage} bgPosition={bgPosition} bgRepeat={bgRepeat} bgSize={bgSize}>
    <VStack
      w={fullWidth ? '100vw' : { base: '100vw', md: '80vw', '2xl': '1440px' }}
      py="3.125rem"
      px={noGutters ? 'unset' : { base: '1.5rem', md: '3.125rem' }}
      align="flex-start"
      minH={fullHeight ? '100vh' : undefined}
      mx="auto"
      position="relative"
      {...rest}
    >
      {children}
    </VStack>
    </Box>
  );
};
