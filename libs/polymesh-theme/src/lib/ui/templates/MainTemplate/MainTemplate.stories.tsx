import { Button } from '@chakra-ui/react';
import { PolymeshTheme } from '../../../ThemeProvider';
import LandingImage from '../../atoms/LandingImage/LandingImage';
import { Hero, QuestionsAnswers } from '../../organisms';

import MainTemplateComponent from './MainTemplate';

export default {
  title: 'templates/MainTemplate',
  parameters: {
    layout: 'fullscreen',
  },
};

export const MainTemplate: React.FC = () => (
  <PolymeshTheme>
    <MainTemplateComponent>
      <LandingImage src='blocks.svg' alt="Blockchain image" />
      <Hero title="Hero component" subtitle="Subtitle" cta={<Button variant="solid" colorScheme="navy">Some Action</Button>} />
      <QuestionsAnswers title="Frequently asked questions" items={[{ question: 'What is onboarding', answer: 'It is easy'}]} />
    </MainTemplateComponent>
  </PolymeshTheme>
);

