import { Stepper } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useResultPageContext } from '../ResultPageContext';

const StepWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeStep, setStepCount } = useResultPageContext();

  const stepCount = React.Children.count(children);
  useEffect(() => {
    setStepCount(stepCount);
  }, [stepCount, setStepCount]);

  return (
    <Stepper
      orientation="vertical"
      size="sm"
      index={activeStep}
      gap={1}
      children={children}
    />
  );
};

export default StepWrapper;
