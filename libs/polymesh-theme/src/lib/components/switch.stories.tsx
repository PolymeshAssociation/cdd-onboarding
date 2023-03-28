import { PolymeshTheme } from '../theme-provider';

import SwitchComponent from './switch';

export default {
  title: 'atoms/Switch',
};

export const Switch: React.FC = () => (
  <PolymeshTheme>
    <SwitchComponent />
  </PolymeshTheme>
);

