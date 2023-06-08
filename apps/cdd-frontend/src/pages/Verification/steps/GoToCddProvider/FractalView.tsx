import React from 'react';
import { Code, Text } from '@chakra-ui/react';

import { StepFormNavigation } from '@polymeshassociation/polymesh-theme/ui/organisms';

import QRCodeView from './QRCodeView';
import OrDivider from './OrDivider';
import CopyLink, { CopyLinkProps } from './CopyLink';
import OnboardingContainer from './OnboardingContainer';

export const FractalView: React.FC<CopyLinkProps> = ({ link }) => {
  const onNavigateToCddProvider = () => {
    if (link) {
      window.location.assign(link);
    }
  };

  return (
    <OnboardingContainer>
      <QRCodeView link={link} provider="fractal" />
      <OrDivider />
      <CopyLink link={link} />
      <OrDivider />
      <Text textAlign="justify">
        Click on the <Code>Go to Fractal</Code> button to be redirected to Fractal.
      </Text>
      <StepFormNavigation
        nextStepLabel={`Go to Fractal`}
        nextIsDisabled={!link}
        onNext={onNavigateToCddProvider}
      />
    </OnboardingContainer>
  );
};

export default FractalView;
