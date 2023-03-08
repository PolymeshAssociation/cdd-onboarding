import React from 'react';
import {
  Box,
  Text,
} from '@chakra-ui/react';
import { FormNavigation } from '@polymeshassociation/polymesh-theme/ui/organisms';
import { VerificationState } from './index.d';






export const GoToCddProvider: React.FC<VerificationState> = ({
  link, provider
}) => {
  const onNavigateToCddProvider = () => {
    if (link) {
      window.location.assign(link);
    }
  };

  return (
    <>
    <Box>
        <Text mb="1rem">After clicking on "Go to {provider?.toUpperCase()}" you will be redirected to the CDD provider's website.</Text>
        <Text>Please have your identification documents ready to proceed with you identity verification.</Text>
    </Box>
      <FormNavigation
        nextStepLabel={`Go to ${provider?.toUpperCase()}`}
        nextIsDisabled={!link}
        onNext={onNavigateToCddProvider}
      />
    </>
  );
};

export default GoToCddProvider;
