import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import { Section, SectionProps } from '../../molecules/Section/Section';

export type QuestionItem = {
  question: string;
  answer: string | React.ReactNode;
};

export type QuestionsAnswersProps = Pick<SectionProps, 'title'> & {
  items: QuestionItem[];
};

export const QuestionsAnswers: React.FC<QuestionsAnswersProps> = ({
  title,
  items,
}) => {
  const textColor = useColorModeValue('heading.light', 'heading.dark')
  return (
    <Section title={title}>
      <Accordion allowToggle w={{ base: '100%', md: "60%" }}>
        {items.map(({ question, answer }) => (
          <AccordionItem key={question}>
            <Heading as="h4" size="xl" fontWeight="bold">
              <AccordionButton _expanded={{ color: 'link' }}>
                <Box as="span" flex="1" textAlign="left" fontWeight="600" color={textColor} pl="1rem" lineHeight="2em">
                  {question}
                </Box>
                <AccordionIcon boxSize="2rem" />
              </AccordionButton>
            </Heading>
            <AccordionPanel pb={4} mt="1.5rem" maxW="calc(100% - 2rem)">{answer}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
};

export default QuestionsAnswers;
