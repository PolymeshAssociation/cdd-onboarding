import { PolymeshTheme } from '../../../ThemeProvider';

import HeroComponent from './Hero';

export default {
  title: 'organisms/Hero',
};

export const Hero: React.FC = () => {
  return (
    <PolymeshTheme>
      <HeroComponent title={<div>Test</div>} subtitle="test 2" cta={<div>cta</div>} />
    </PolymeshTheme>
  );
};
