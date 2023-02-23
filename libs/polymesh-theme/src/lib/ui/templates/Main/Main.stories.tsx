import { Button } from '@chakra-ui/react';
import { PolymeshTheme } from '../../../ThemeProvider';
import { Hero, QuestionsAnswers } from '../../organisms';

import LandingPageComponent from './Main';

export default {
  title: 'templates/Landing',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Landing: React.FC = () => (
  <PolymeshTheme>
    <LandingPageComponent>
      <Hero title="Hero component" subtitle="Subtitle" cta={<Button variant="solid" colorScheme="navy">Some Action</Button>} />
      <QuestionsAnswers title="Frequently asked questions" items={[{ question: 'What is onboarding', answer: 'It is easy'}]} />
    </LandingPageComponent>
  </PolymeshTheme>
);

