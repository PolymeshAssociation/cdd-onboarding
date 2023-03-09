import React from 'react';
import {
  Box,
  Flex,
  Button,
  Code,
  Divider,
  Text,
  useClipboard,
  Alert,
  AlertIcon,
  InputGroup,
  Input,
  InputRightElement,
  AlertDescription,
} from '@chakra-ui/react';
import QRCode from 'react-qr-code';

import { FormNavigation } from '@polymeshassociation/polymesh-theme/ui/organisms';
import { VerificationState } from './index.d';

export const QRCodeView: React.FC<{ link: string; provider: string }> = ({
  link,
  provider,
}) => {
  return (
    <>
      <Text textAlign="justify">
        Please use the QR code to continue verification with{' '}
        <Code>{provider.toUpperCase()}</Code> on your phone.
      </Text>
      <Box p="1rem" bg="white" my="1rem" ml="auto" mr="auto">
        <QRCode value={link} />
      </Box>
    </>
  );
};

export const OrDivider = () => {
  return (
    <Box w="100%" position="relative" my="1rem">
        <Divider my="1rem" borderColor="gray.600" />
        <Box
          fontSize="1rem"
          position="absolute"
          top="0.25rem"
          left={0.25}
          right={0}
          w="2rem"
          ml="auto"
          mr="auto"
          bg="white"
          textAlign="center"
        >
          OR
        </Box>
      </Box>
  )
}

export const CopyLink = ({ link }: { link: string }) => {
  const { onCopy, hasCopied } = useClipboard(link);

  return (
    <>
    <Text textAlign="justify" mb="1rem">Copy the link to verification page and copy that in a new browser window.</Text>
    <InputGroup size="md">
      <Input
        pr="7.6rem"
        type="text"
        disabled
        placeholder="Link to CDD"
        borderRadius="1.5rem"
        value={link}
      />
      <InputRightElement width="7rem" mr="0.1rem">
        <Button size="md" onClick={onCopy} borderLeftRadius={0}>
          {hasCopied ? 'Copied' : 'Copy link'}
        </Button>
      </InputRightElement>
    </InputGroup>
    </>
  );
};

const OnboardingContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Flex
      maxW="500px"
      direction="column"
      children={children}
    />
  );
};

export const JumioView: React.FC<{ link: string }> = ({ link }) => {
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
      <FormNavigation
        nextStepLabel={`Go to Jumio`}
        nextIsDisabled={!link}
        onNext={onNavigateToCddProvider}
      />
    </OnboardingContainer>
  );
};

export const NetkiView: React.FC<{ link: string }> = ({ link }) => {
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
      <FormNavigation />
    </>
  );
};

export const GoToCddProvider: React.FC<VerificationState> = ({
  link,
  provider,
}) => {
  if (provider === 'jumio' && link) {
    return <JumioView link={link} />;
  }

  if (provider === 'netki' && link) {
    return <NetkiView link={link} />;
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
      <FormNavigation />
    </>
  );
};

export default GoToCddProvider;
