import React, { useContext, useEffect } from 'react';
import { CircularProgress, Flex } from '@chakra-ui/react';

import { VerificationState } from '../index.d';
import {
  StepFormContext,
  StepFormNavigation,
} from '@polymeshassociation/polymesh-theme/ui/organisms';

import useGetProviderLinkMutation from '../../../../hooks/useGetProviderLinkMutation';

import ErrorLoadingProviderLink from './ErrorLoadingProviderLink';
import ProviderLogoCard from './ProviderLogoCard';

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

  const onSelectProvider = (provider: 'netki' | 'jumio') => {
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
    if (state.provider && state.address) {
      mutate({ provider: state.provider, address: state.address });
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
      </Flex>
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
