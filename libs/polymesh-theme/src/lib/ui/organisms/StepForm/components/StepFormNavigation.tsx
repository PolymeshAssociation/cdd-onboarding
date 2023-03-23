import React, { useContext } from 'react';
import { Button, Stack } from '@chakra-ui/react';

import { StepProps } from './index.d';
import { StepFormContext } from './StepFormContext';

import { MdKeyboardBackspace } from 'react-icons/md';

export const StepFormNavigation: React.FC<
  Pick<
    StepProps,
    | 'nextStepLabel'
    | 'nextIsLoading'
    | 'nextIsDisabled'
    | 'nextIsError'
    | 'nextLoadingLabel'
    | 'onNext'
  >
> = ({
  nextStepLabel,
  nextLoadingLabel,
  nextIsDisabled = false,
  nextIsLoading = false,
  nextIsError = false,
  onNext,
}) => {
  const { onBack, activeStep } = useContext(StepFormContext);

  return (
    <Stack
      mt="2rem"
      gap="1rem"
      direction="row"
      alignItems="center"
      justify={{ base: 'center', md: 'unset' }}
      py={{ base: '1.5rem', md: '1 rem' }}
      px={{ base: '1rem', md: 'unset' }}
      position={{ base: 'absolute', md: 'unset' }}
      left={{ base: 0, md: 'unset' }}
      bottom={{ base: 0, md: 'unset ' }}
      w={{ base: '100%', md: 'unset' }}
      bgColor={{ base: 'white', md: 'unset' }}
      zIndex={1}
    >
      {activeStep > 0 && (
        <Button
          onClick={onBack}
          leftIcon={<MdKeyboardBackspace />}
          variant="ghost"
        >
          Back
        </Button>
      )}
      {Boolean(nextStepLabel) && (
        <Button
          isDisabled={nextIsDisabled || nextIsLoading || nextIsError}
          colorScheme="navy"
          size="lg"
          type={onNext ? 'button' : 'submit'}
          onClick={onNext}
          form="stepForm"
          w={{ base: activeStep === 0 ? '100%' : 'unset', md: 'unset' }}
        >
          {nextIsLoading && nextLoadingLabel ? nextLoadingLabel : nextStepLabel}
        </Button>
      )}
    </Stack>
  );
};
