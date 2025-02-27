import { Box } from '@chakra-ui/react';
import { PolymeshTheme } from '../../../ThemeProvider';

import LogoComponent from './FinclusiveLogo';

export default {
  title: 'atoms/FinclusiveLogo',
};

export const FinclusiveLogo: React.FC = () => {
  return (
    <PolymeshTheme>
      <Box p={10}>
        <LogoComponent boxSize={40} />
      </Box>
    </PolymeshTheme>
  );
};
