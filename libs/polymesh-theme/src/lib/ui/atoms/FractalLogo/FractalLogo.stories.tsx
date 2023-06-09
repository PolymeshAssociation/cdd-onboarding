import { Box } from '@chakra-ui/react';
import { PolymeshTheme } from '../../../ThemeProvider';

import LogoComponent from './FractalLogo';

export default {
  title: 'atoms/FractalLogo',
};

export const FractalLogo: React.FC = () => {
  return (
    <PolymeshTheme>
      <Box p={10}>
        <LogoComponent boxSize={40}/>
      </Box>
    </PolymeshTheme>
  );
};
