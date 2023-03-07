import { Box } from '@chakra-ui/react';
import { PolymeshTheme } from '../../../ThemeProvider';

import LogoComponent from './NetkiLogo';

export default {
  title: 'atoms/NetkiLogo',
};

export const NetkiLogo: React.FC = () => {
  return (
    <PolymeshTheme>
      <Box p={10}>
        <LogoComponent boxSize={40}/>
      </Box>
    </PolymeshTheme>
  );
};
