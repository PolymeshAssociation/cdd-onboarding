import React from 'react';
import { Box, Divider, useColorModeValue } from '@chakra-ui/react';

export const OrDivider: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  
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
        bg={bgColor}
        textAlign="center"
      >
        OR
      </Box>
    </Box>
  );
};

export default OrDivider;
