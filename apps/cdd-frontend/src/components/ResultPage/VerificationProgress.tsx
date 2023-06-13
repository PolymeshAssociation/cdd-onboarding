import { Box, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { useHCaptcha } from '../HCaptcha/HCaptchaContext';
import HCaptchaComponent from '../HCaptcha/HCaptchaComponent';
import { useResultPageContext } from './ResultPageContext';
import { ProviderResult, ChainStatus, AddressStep } from './steps';
import StepWrapper from './steps/StepWrapper';
import { VerificationStatus } from './types.d';

const VerificationProgress: React.FC = () => {
  const { globalStatus } = useResultPageContext();
  const { token } = useHCaptcha();

  if(!token){
    return <HCaptchaComponent />;
  }

  if (globalStatus === VerificationStatus.SUCCESS) {
    return (
      <Box pt={12}>
        <Text size="lg" textAlign="center">
          To get more details you can visit{' '}
          <Link href="https://dashboard.polymesh.network" isExternal>
            Polymesh Dashboard
          </Link>
        </Text>
      </Box>
    );
  }

  return (
    <Box pt={12}>
      <StepWrapper>
        <ProviderResult index={0} />
        <AddressStep index={1} />
        <ChainStatus index={2} />
      </StepWrapper>
    </Box>
  );
};

export default VerificationProgress;
