import React, { useContext, useEffect } from 'react';
import { CircularProgress, Flex, Box } from '@chakra-ui/react';

import { VerificationState } from '../index.d';
import {
  StepFormContext,
  StepFormNavigation,
} from '@polymeshassociation/polymesh-theme/ui/organisms';

import useGetProviderLinkMutation from '../../../../hooks/useGetProviderLinkMutation';
import config from '../../../../config/constants';

import ErrorLoadingProviderLink from './ErrorLoadingProviderLink';
import ProviderLogoCard from './ProviderLogoCard';
import HCaptchaComponent from '../../../../components/HCaptcha/HCaptchaComponent';

import { useCaptcha } from '../../../../hooks';

type SelectCddProviderProps = {
  setState: React.Dispatch<React.SetStateAction<VerificationState>>;
  state: VerificationState;
};

export const SelectCddProvider: React.FC<SelectCddProviderProps> = ({
  state,
  setState,
}) => {
  const { onNext } = useContext(StepFormContext);
  const { mutate, isLoading, isError, data } = useGetProviderLinkMutation();
  const { link } = data || {};
  const { token: hCaptcha } = useCaptcha()
  const onSelectProvider = (provider: 'netki' | 'jumio' | 'fractal' | 'mock') => {
    if (!isLoading) {
      setState((prev) => ({ ...prev, provider }));
    }
  };

  useEffect(() => {
    if (link) {
      setState((prev) => ({ ...prev, link }));
      onNext();
    }
  }, [link, setState, onNext]);

  const onClickNext = () => {
    if (state.provider && state.address && hCaptcha) {
      mutate({ provider: state.provider, address: state.address, hCaptcha });
    }
  };

  return (
    <>
      {isError && <ErrorLoadingProviderLink isError={isError} />}
      <Flex gap="2rem" w="100%" direction={{ base: 'column', md: 'row' }}>
        <ProviderLogoCard
          provider="jumio"
          onSelectProvider={onSelectProvider}
          isSelected={state.provider === 'jumio'}
        />
        <ProviderLogoCard
          provider="netki"
          onSelectProvider={onSelectProvider}
          isSelected={state.provider === 'netki'}
        />
        { config.FRACTAL_ENABLED &&
          <ProviderLogoCard
            provider="fractal"
            onSelectProvider={onSelectProvider}
            isSelected={state.provider === 'fractal'}
          />
        }
        {
          config.MOCK_ENABLED &&
          <ProviderLogoCard
            provider="mock"
            onSelectProvider={onSelectProvider}
            isSelected={state.provider === 'mock'}
          />
        }
        
      </Flex>
      <Box mt={4}>
        <HCaptchaComponent mt={8} />
      </Box>
      <StepFormNavigation
        nextStepLabel="Next"
        nextIsDisabled={!state.provider}
        nextIsLoading={isLoading}
        nextLoadingLabel={
          <>
            <CircularProgress
              size="1.5rem"
              isIndeterminate
              color="white"
              mr="1rem"
            />{' '}
            Generating CDD link...
          </>
        }
        onNext={onClickNext}
      />
    </>
  );
};

export default SelectCddProvider;
