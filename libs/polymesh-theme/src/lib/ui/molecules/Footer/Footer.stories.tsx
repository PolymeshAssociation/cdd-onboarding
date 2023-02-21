import { PolymeshTheme } from '../../../ThemeProvider';

import FooterComponent from './Footer';

export default {
  title: 'molecules/Footer',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Footer: React.FC = () => (
  <PolymeshTheme>
    <FooterComponent />
  </PolymeshTheme>
);

