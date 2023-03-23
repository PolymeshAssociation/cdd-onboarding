import { Box } from '@chakra-ui/react';
import { PolymeshTheme } from '../../../ThemeProvider';

import LogoComponent from './JumioLogo';

export default {
  title: 'atoms/JumioLogo',
};

export const JumioLogo: React.FC = () => {
  return (
    <PolymeshTheme>
      <Box p={10}>
        <LogoComponent boxSize={40}/>
      </Box>
    </PolymeshTheme>
  );
};
