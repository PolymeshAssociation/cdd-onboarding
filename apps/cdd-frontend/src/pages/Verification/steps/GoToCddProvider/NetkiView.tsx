import React from 'react';
import { Text } from '@chakra-ui/react';

import { StepFormNavigation } from '@polymeshassociation/polymesh-theme/ui/organisms';

import QRCodeView from './QRCodeView';
import OrDivider from './OrDivider';
import CopyLink, { CopyLinkProps } from './CopyLink';
import OnboardingContainer from './OnboardingContainer';

export const NetkiView: React.FC<CopyLinkProps> = ({ link }) => {
  return (
    <>
      <OnboardingContainer>
        <Text textAlign="justify">
          Please use the QR code or copy link to continue verification with
          Netki on your phone.
        </Text>
        <QRCodeView link={link} provider="netki" />
        <OrDivider />
        <CopyLink link={link} />
      </OnboardingContainer>
      <StepFormNavigation />
    </>
  );
};
