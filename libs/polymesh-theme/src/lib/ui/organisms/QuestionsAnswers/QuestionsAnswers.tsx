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

export type QuestionItem = {
  question: string;
  answer: string | React.ReactNode;
};

export type QuestionsAnswersProps = {
  items: QuestionItem[];
};

export const QuestionsAnswers: React.FC<QuestionsAnswersProps> = ({
  items,
}) => {
  const textColor = useColorModeValue('heading.light', 'heading.dark')
  return (
      <Accordion allowToggle mx="auto">
        {items.map(({ question, answer }) => (
          <AccordionItem key={question} w={{ base: '100%', xl: "600px", '2xl': '960px' }} >
            <Heading as="h4" size="xl" fontWeight="bold">
              <AccordionButton _expanded={{ color: 'link' }} px={{ base: 0, md: '1rem'}}>
                <Box as="span" flex="1" textAlign="left" fontWeight="600" color={textColor} pl={{ base: '0.5rem', md: '1rem'}} lineHeight="2em">
                  {question}
                </Box>
                <AccordionIcon boxSize="2rem" />
              </AccordionButton>
            </Heading>
            <AccordionPanel pb={4} mt="1.5rem" maxW="calc(100% - 2rem)">{answer}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
  );
};

export default QuestionsAnswers;
