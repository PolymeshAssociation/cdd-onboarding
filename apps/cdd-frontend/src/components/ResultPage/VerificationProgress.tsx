import { Box, Link, Text } from '@chakra-ui/react';
import React from 'react';

import constants from '../../config/constants';
import { useResultPageContext } from './ResultPageContext';
import { ProviderResult, ChainStatus, AddressStep } from './steps';
import StepWrapper from './steps/StepWrapper';
import { VerificationStatus } from './types.d';

const VerificationProgress: React.FC = () => {
  const { globalStatus } = useResultPageContext();
  const dashboardLink = constants.NX_USER_PORTAL_URL;


  if (globalStatus === VerificationStatus.SUCCESS) {
    return (
      <Box pt={12}>
        <Text size="lg" textAlign="center">
          You’re now ready to use Polymesh and explore the{' '}
          <Link href={dashboardLink} isExternal>
            Polymesh Portal
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
