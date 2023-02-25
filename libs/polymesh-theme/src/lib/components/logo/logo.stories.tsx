import { Box, DarkMode, Heading } from '@chakra-ui/react';
import { PolymeshTheme } from '../../theme-provider';

import LogoComponent from './logo';

export default {
  title: 'atoms/Logo',
};

export const Logo: React.FC = () => {
  return (
    <PolymeshTheme>
      <Heading>Light mode logo</Heading>
      <Box p={10}>
        <LogoComponent h={{ base: '24px', md: '40px', lg: '100px' }} />
      </Box>
      <DarkMode>
        <Heading>Dark mode logo</Heading>
        <Box bg="bg.dark" p={10}>
          <LogoComponent h={{ base: '24px', md: '40px', lg: '100px' }} />
        </Box>
      </DarkMode>
    </PolymeshTheme>
  );
};
