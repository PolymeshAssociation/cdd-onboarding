import { Box, HStack, useColorModeValue } from '@chakra-ui/react';

import { Logo } from '../../atoms';
import useScrollPosition from '../../hooks/useScrollPosition';

export type HeaderProps = {
  center?: React.ReactNode;
  right?: React.ReactNode;
};

export const Header: React.FC<HeaderProps> = ({ center, right }) => {
  const bgColor = useColorModeValue('bg.light', 'bg.dark');
  const scrollPos = useScrollPosition();

  return (
    <HStack
      maxW="100%"
      w="100vw"
      position="fixed"
      top={0}
      left={0}
      right={0}
      py="1rem"
      px="3.125rem"
      justifyContent="space-between"
      bg={scrollPos > 10 ? bgColor : 'unset'}
      transition="all 0.3s ease-in-out"
      zIndex={1000}
    >
      <Logo height={{ base: '19px', lg: '16px', xl: '19px' }} />
      <Box>{center}</Box>
      <Box>{right}</Box>
    </HStack>
  );
};

export default Header;
