import { Box, HStack, StackProps, useColorModeValue } from '@chakra-ui/react';
import useScrollPosition from '../../hooks/useScrollPosition';

import { Logo, ColorModeSwitch } from '../../atoms';

export type HeaderProps = {
  center?: React.ReactNode;
  right?: React.ReactNode;
};

export const Header: React.FC<HeaderProps & Pick<StackProps, 'display'>> = ({
  center,
  right,
  display,
}) => {
  const bgColor = useColorModeValue('bg.light', 'bg.dark');
  const { scrollY } = useScrollPosition();

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
      bg={{ base: bgColor, md: scrollY > 10 ? bgColor : 'unset' }}
      transition="all 0.3s ease-in-out"
      zIndex={1000}
      display={display}
      boxShadow={{ md: 'none', base: '0px 1px 3px rgba(0, 0, 0, 0.1)' }}
    >
      <HStack justifyContent="space-between">
        <Logo height={{ base: '19px', lg: '16px', xl: '19px' }} link="/" />
        <ColorModeSwitch />
      </HStack>

      <Box>{center}</Box>
      <Box>{right}</Box>
    </HStack>
  );
};

export default Header;
