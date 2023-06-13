import { Heading, Stack } from '@chakra-ui/react';
import React from 'react';

import {
  VerificationMessage,
  VerificationProgress,
} from '../components/ResultPage';
import ResultPageContextProvider from '../components/ResultPage/ResultPageContextProvider';
import { HCaptchaProvider } from '../components/HCaptcha/HCaptchaContext';

const ResultPage: React.FC = () => {
  return (
    <HCaptchaProvider>
      <ResultPageContextProvider>
        <Stack flex={1} justifyContent="center" alignItems="center" p="6">
          <Heading size="3xl" mt={8} mb={12}>
            Polymesh Identity
          </Heading>
          <VerificationMessage />
          <VerificationProgress />
        </Stack>
      </ResultPageContextProvider>
    </HCaptchaProvider>
  );
};

export default ResultPage;
