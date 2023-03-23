import React from 'react';
import { Flex } from '@chakra-ui/react';

export const OnboardingContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Flex maxW="500px" direction="column" children={children} />;
};

export default OnboardingContainer;
