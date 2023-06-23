import React, { useEffect } from 'react';
import { Text, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import useGetAddressApplicationsQuery from '../../../hooks/useGetAddressApplicationsQuery';
import { useResultPageContext } from '../ResultPageContext';
import { VerificationStatus } from '../types.d';

import StepTemplate, { StepTemplateProps } from './StepTemplate';

const ChainStatus: React.FC<Pick<StepTemplateProps, 'index'>> = ({ index }) => {
  const { setStepResult, activeStep, address, stepStatus, provider } =
    useResultPageContext();
  const { isLoading, data, isFetched } = useGetAddressApplicationsQuery(
    address,
    activeStep === index
  );
  const { did, applications } = data || {};
  const localStatus = stepStatus[index];

  useEffect(() => {
    if (isLoading) {
      setStepResult(index, VerificationStatus.PROCESSING);
    }
  }, [index, isLoading, setStepResult]);

  useEffect(() => {
    if (did) {
      setStepResult(index, VerificationStatus.SUCCESS);
    }

    if (!did && isFetched) {
      setStepResult(index, VerificationStatus.FAILED);
    }
  }, [did, index, isFetched, setStepResult]);

  if (isLoading) {
    return (
      <StepTemplate title="Checking Polymesh Account on-chain" index={index}>
        Checking if Identity has been assigned to the address..
      </StepTemplate>
    );
  }

  if (localStatus === VerificationStatus.FAILED && Boolean(applications?.length)) {
    return (
      <StepTemplate title="Identity not found" index={index}>
        <Text mb={2} as="span">
          Great! You’ve submitted information to the identity verification
          provider and we are awaiting the results.
        </Text>
        <Text mb={2} as="span">
          Please note this process can take 1-2 business days. In the meantime,
          feel free to explore the Polymesh Portal. Keep checking there in the
          next few days to see if your identity has been verified.
        </Text>
        <Text mb={2} as="span">
          After 2 business days, if your identity is still not verified, please
          email <Link href='mailto:support@polymesh.network'>support@polymesh.network</Link> with your Polymesh key address and the
          identity verification provider that you selected.
        </Text>
      </StepTemplate>
    );
  }

  if(provider === 'mock') {
    return (
      <StepTemplate title="Identity not created" index={index}>
        <Text mb={2} as="span">
          Mock identity not yet created. It is expected to take a few minutes at most. Try refreshing the page to check again
        </Text>

        <Text mb={2} as="span">
          If you are having problems with the onboarding process, please
          email <Link href='mailto:support@polymesh.network'>support@polymesh.network</Link> with your Polymesh key address and the
          identity verification provider that you selected.
        </Text>
      </StepTemplate>
    )
  }

  if (localStatus === VerificationStatus.FAILED) {
    return (
      <StepTemplate title="Identity not found" index={index}>
        <Text mb={2} as="span">
          Sorry we were not able to find any applications associated to this address. Please start <Link to="/verification" as={RouterLink}>onboarding process</Link> to create an identity.
        </Text>

        <Text mb={2} as="span">
          If you are having problems with the onboarding process, please
          email <Link href='mailto:support@polymesh.network'>support@polymesh.network</Link> with your Polymesh key address and the
          identity verification provider that you selected.
        </Text>
      </StepTemplate>
    );
  }

  return <StepTemplate title="Verify Identity on Chain" index={index} />;
};

export default ChainStatus;
