import React, { useContext, useEffect } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { StepProps } from '.';
import { StepFormContext } from './StepFormContext';
import { StepFormNavigation } from './StepFormNavigation';

export const StepFormStep: React.FC<StepProps> = ({
  title,
  subTitle,
  index,
  children,
  nextStepLabel = 'Next Step',
  showFormNavigation,
}) => {
  const { addStep, activeStep } = useContext(StepFormContext);

  useEffect(() => {
    addStep({ title });
  }, [title, addStep]);

  if (index !== activeStep) {
    return null;
  }

  return (
    <Box
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.5,
        },
      }}
    >
      <Heading mb="2rem" as="h1" size="2xl" mt={{ base: '6rem', md: 'unset' }}>
        {title}
      </Heading>
      {subTitle && <Heading>{subTitle}</Heading>}
      {children}
      {showFormNavigation && (
        <StepFormNavigation nextStepLabel={nextStepLabel} />
      )}
    </Box>
  );
};
