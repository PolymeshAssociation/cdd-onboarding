import { Heading, Stack } from '@chakra-ui/react';
import React from 'react';

import {
  VerificationMessage,
  VerificationProgress,
} from '../components/ResultPage';
import ResultPageContextProvider from '../components/ResultPage/ResultPageContextProvider';

const ResultPage: React.FC = () => {
  return (
      <ResultPageContextProvider>
        <Stack justifyContent="center" alignItems="center" p="6">
          <Heading size="3xl" mt={8} mb={12}>
            Polymesh Identity
          </Heading>
          <VerificationMessage />
          <VerificationProgress />
        </Stack>
      </ResultPageContextProvider>
  );
};

export default ResultPage;
