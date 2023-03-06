import { PolymeshTheme } from '../../../ThemeProvider';

import QAComponent, { QuestionItem } from './QuestionsAnswers';

export default {
  title: 'organisms/QuestionsAnswers',
  parameters: {
    layout: 'fullscreen',
  },
};

const items: QuestionItem[]= [
    {
        question: 'What is onboarding',
        answer: 'Onboarding is the first step of the app. It is the first step of the app.'
    }
]

export const QuestionsAnswers: React.FC = () => (
  <PolymeshTheme>
    <QAComponent title="Frequently asked questions" items={items} />
  </PolymeshTheme>
);

