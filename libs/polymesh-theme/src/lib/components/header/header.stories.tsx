import { PolymeshTheme } from '../../theme-provider';

import HeaderComponent from './header';

export default {
  title: 'molecules/Header',
};

export const Header: React.FC = () => (
  <PolymeshTheme>
    <HeaderComponent />
  </PolymeshTheme>
);

