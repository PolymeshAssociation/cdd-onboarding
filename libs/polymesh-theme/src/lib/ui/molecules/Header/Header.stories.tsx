import { PolymeshTheme } from '../../../ThemeProvider';

import HeaderComponent from './Header';

export default {
  title: 'molecules/Header',
};

export const Header: React.FC = () => (
  <PolymeshTheme>
    <HeaderComponent />
  </PolymeshTheme>
);

