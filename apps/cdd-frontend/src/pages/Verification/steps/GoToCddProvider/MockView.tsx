import React from 'react';
import { Text } from '@chakra-ui/react';

import { StepFormNavigation } from '@polymeshassociation/polymesh-theme/ui/organisms';
import { useNavigate } from "react-router-dom"

import  { CopyLinkProps } from './CopyLink';
import OnboardingContainer from './OnboardingContainer';
import axios from '../../../../services/axios';

export const MockView: React.FC<CopyLinkProps & {address: string}> = ({ link, address }) => {
  const navigate = useNavigate()

  const onNavigateToCddProvider = async () => {
      const body = { address, id: 'testID' }

      let result = 'success'

      await axios.post(link, body).catch(error => {
        console.error(error)
        result = 'failure'
      })

      navigate(`/result/mock/${result}?address=${address}`);
  };

  return (
    <OnboardingContainer>
      <Text textAlign="justify">
        This will create a CDD claim for the address without verifying any documents. Mock CDD is not available for mainnet, it is intended for testing purposes only.
      </Text>
      <Text textAlign="justify">
      </Text>
      <StepFormNavigation
        nextStepLabel={`Create Mock CDD Claim`}
        onNext={onNavigateToCddProvider}
      />
    </OnboardingContainer>
  );
};

export default MockView;
