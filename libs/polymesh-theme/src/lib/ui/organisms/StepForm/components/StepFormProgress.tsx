import React, { useContext } from 'react';
import { List, ListIcon, ListItem, Text, useColorModeValue } from '@chakra-ui/react';
import { BsCheck2Square, BsArrowRight, BsSquare } from 'react-icons/bs';

import { StepFormContext } from './StepFormContext';

export const StepFormProgress: React.FC = () => {
  const { activeStep, steps } = useContext(StepFormContext);
  const activeStepColor = useColorModeValue("gray.800", "gray.100")
  return (
    <List>
      {steps.map(({ title }, index) => (
        <ListItem
          key={title}
          display="flex"
          alignItems="center"
          py="0.5rem"
          fontSize="1rem"
        >
          {index < activeStep && (
            <ListIcon
              as={BsCheck2Square}
              color="green.500"
              mr="1rem"
              boxSize="1rem"
            />
          )}
          {index === activeStep && (
            <ListIcon
              as={BsArrowRight}
              color="text.light"
              mr="1rem"
              boxSize="1rem"
            />
          )}
          {index > activeStep && (
            <ListIcon as={BsSquare} color="gray.300" mr="1rem" boxSize="1rem" />
          )}
          <Text
            fontWeight={index === activeStep ? 'bold' : 'unset'}
            color={activeStepColor}
          >
            {title}
          </Text>
        </ListItem>
      ))}
    </List>
  );
};

export default StepFormProgress;
