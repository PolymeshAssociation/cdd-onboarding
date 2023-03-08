import React from 'react';
import { useParams } from 'react-router-dom';

import { Box, Heading, Text } from '@chakra-ui/react';

export const Result: React.FC = () => {
  const { provider, result } = useParams();
  
  return (
    <Box>
      <Heading>Verification result</Heading>
      <Text>Provider {provider}</Text>
      <Text>Verification result {result}</Text>
    </Box>
  );
};

export default Result;
