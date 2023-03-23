import React from 'react';
import { Code, Text } from '@chakra-ui/react';

import { StepFormNavigation } from '@polymeshassociation/polymesh-theme/ui/organisms';

import QRCodeView from './QRCodeView';
import OrDivider from './OrDivider';
import CopyLink, { CopyLinkProps } from './CopyLink';
import OnboardingContainer from './OnboardingContainer';

export const JumioView: React.FC<CopyLinkProps> = ({ link }) => {
  const onNavigateToCddProvider = () => {
    if (link) {
      window.location.assign(link);
    }
  };

  return (
    <OnboardingContainer>
      <QRCodeView link={link} provider="jumio" />
      <OrDivider />
      <CopyLink link={link} />
      <OrDivider />
      <Text textAlign="justify">
        Click on the <Code>Go to Jumio</Code> button to be redirected to Jumio.
      </Text>
      <StepFormNavigation
        nextStepLabel={`Go to Jumio`}
        nextIsDisabled={!link}
        onNext={onNavigateToCddProvider}
      />
    </OnboardingContainer>
  );
};

export default JumioView;
