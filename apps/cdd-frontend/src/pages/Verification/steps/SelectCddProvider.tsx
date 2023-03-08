import React, { useContext, useEffect } from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CircularProgress,
  Grid,
  Card,
  CardBody,
  GridItem,
} from '@chakra-ui/react';

import {
  JumioLogo,
  NetkiLogo,
} from '@polymeshassociation/polymesh-theme/ui/atoms';

import { VerificationState } from './index.d';
import {
  FormContext,
  FormNavigation,
} from '@polymeshassociation/polymesh-theme/ui/organisms';
import useGetProviderLinkMutation from 'apps/cdd-frontend/src/hooks/useGetProviderLinkMutation';

type ProviderLogoCardProps = {
  provider: 'netki' | 'jumio';
  isSelected: boolean;
  onSelectProvider: (provider: 'netki' | 'jumio') => void;
};

const ErrorLoadingProviderLink: React.FC<{ isError: boolean }> = ({
  isError,
}) => {
  if (!isError) {
    return null;
  }

  return (
    <Alert
      status="error"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      borderRadius="0.5rem"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Error loading CDD Provider link
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        Sorry there was an error generating CDD provider link please try again.
      </AlertDescription>
    </Alert>
  );
};

const ProviderLogoCard: React.FC<ProviderLogoCardProps> = ({
  provider,
  onSelectProvider,
  isSelected,
}) => {
  const onClick = () => {
    onSelectProvider(provider);
  };

  return (
    <GridItem w="100%">
      <Card
        _hover={{ cursor: 'pointer', borderColor: 'navy' }}
        border="2px solid"
        borderColor={isSelected ? 'fucsia.700' : 'gray.100'}
        boxSizing="border-box"
        onClick={onClick}
      >
        <CardBody
          p="2rem"
          style={{ aspectRatio: 1 }}
          justifyContent="center"
          alignItems="center"
          display="flex"
        >
          {provider === 'jumio' && <JumioLogo boxSize="80%" />}
          {provider === 'netki' && <NetkiLogo boxSize="80%" />}
        </CardBody>
      </Card>
    </GridItem>
  );
};

type SelectCddProviderProps = {
  setState: React.Dispatch<React.SetStateAction<VerificationState>>;
  state: VerificationState;
};

export const SelectCddProvider: React.FC<SelectCddProviderProps> = ({
  state,
  setState,
}) => {
  const { onNext } = useContext(FormContext);
  const { mutate, isLoading, isError, data } = useGetProviderLinkMutation();
  const { link } = data || {};

  const onSelectProvider = (provider: 'netki' | 'jumio') => {
    if (!isLoading) {
      setState((prev) => ({ ...prev, provider }));
    }
  };

  useEffect(() => {
    if(link) {
      setState((prev) => ({...prev, link }));
        onNext();
    }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link])
  

  const onClickNext = () => {
    if (state.provider && state.address) {
      mutate({ provider: state.provider, address: state.address });
    }
  };

  return (
    <>
      {isError && <ErrorLoadingProviderLink isError={isError} />}
      <Grid gap="2rem" templateColumns="repeat(auto-fit, minMax(250px, 300px))">
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
      </Grid>
      <FormNavigation
        nextStepLabel="Next"
        nextIsDisabled={!state.provider}
        nextIsLoading={isLoading}
        nextLoadingLabel={<><CircularProgress size="1.5rem" isIndeterminate color='white' mr="1rem" /> Generating CDD link...</>}
        onNext={onClickNext}
      />
    </>
  );
};

export default SelectCddProvider;
