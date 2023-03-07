import React, { useContext } from 'react';
import { Grid, Card, CardBody, GridItem } from '@chakra-ui/react';

import {
  JumioLogo,
  NetkiLogo,
} from '@polymeshassociation/polymesh-theme/ui/atoms';

import { VerificationState } from './index.d';
import {
  FormContext,
  FormNavigation,
} from '@polymeshassociation/polymesh-theme/ui/organisms';

type ProviderLogoCardProps = {
  provider: 'netki' | 'jumio';
  isSelected: boolean;
  onSelectProvider: (provider: 'netki' | 'jumio') => void;
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

  const onSelectProvider = (provider: 'netki' | 'jumio') => {
    setState((prev) => ({ ...prev, provider }));
  };

  return (
    <>
      <Grid
        gap="2rem"
        templateColumns="repeat(auto-fit, minMax(250px, 300px))"
      >
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
        onNext={onNext}
      />
    </>
  );
};

export default SelectCddProvider;
