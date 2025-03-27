import { Box, CircularProgress, Flex } from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';

import {
  StepFormContext,
  StepFormNavigation,
} from '@polymeshassociation/polymesh-theme/ui/organisms';
import { VerificationState } from '../index.d';

import config from '../../../../config/constants';
import useGetProviderLinkMutation from '../../../../hooks/useGetProviderLinkMutation';

import HCaptchaComponent from '../../../../components/HCaptcha/HCaptchaComponent';
import ErrorLoadingProviderLink from './ErrorLoadingProviderLink';
import ProviderLogoCard from './ProviderLogoCard';

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
  const { token: hCaptcha } = useCaptcha();
  const onSelectProvider = (
    provider: 'netki' | 'jumio' | 'mock' | 'finclusive'
  ) => {
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

  const enabledProviders = config.PROVIDERS_ENABLED;

  return (
    <>
      {isError && <ErrorLoadingProviderLink isError={isError} />}
      <Flex gap="2rem" w="100%" direction={{ base: 'column', md: 'row' }}>
        {enabledProviders.includes('jumio') && (
          <ProviderLogoCard
            provider="jumio"
            onSelectProvider={onSelectProvider}
            isSelected={state.provider === 'jumio'}
          />
        )}
        {enabledProviders.includes('netki') && (
          <ProviderLogoCard
            provider="netki"
            onSelectProvider={onSelectProvider}
            isSelected={state.provider === 'netki'}
          />
        )}
        {enabledProviders.includes('finclusive') && (
          <ProviderLogoCard
            provider="finclusive"
            onSelectProvider={onSelectProvider}
            isSelected={state.provider === 'finclusive'}
          />
        )}
        {config.MOCK_ENABLED && (
          <ProviderLogoCard
            provider="mock"
            onSelectProvider={onSelectProvider}
            isSelected={state.provider === 'mock'}
          />
        )}
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
