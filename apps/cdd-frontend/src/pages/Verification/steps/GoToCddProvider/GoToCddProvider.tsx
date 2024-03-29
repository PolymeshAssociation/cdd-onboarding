import React from 'react';
import { Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';

import { StepFormNavigation } from '@polymeshassociation/polymesh-theme/ui/organisms';

import { VerificationState } from '../index.d';

import JumioView from './JumioView';
import { NetkiView } from './NetkiView';
import FractalView from './FractalView';
import MockView from './MockView';

export const GoToCddProvider: React.FC<VerificationState> = ({
  link,
  provider,
  address
}) => {
  if (provider === 'jumio' && link) {
    return <JumioView link={link} />;
  }

  if (provider === 'netki' && link) {
    return <NetkiView link={link} />;
  }

  if(provider === 'fractal' && link) {
    return <FractalView link={link} />
  }

  if(provider === 'mock' && link) {
    return <MockView link={link } address={address!} />
  }

  return (
    <>
      <Alert status="error" variant="subtle">
        <AlertIcon boxSize="1.75rem" />
        <AlertDescription maxWidth="sm" fontSize="sm">
          Sorry there was an error generating CDD provider link please try
          again.
        </AlertDescription>
      </Alert>
      <StepFormNavigation />
    </>
  );
};

export default GoToCddProvider;
