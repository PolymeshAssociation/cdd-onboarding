import React from 'react';
import { Flex, useMediaQuery, useColorModeValue, Text } from '@chakra-ui/react';

import {
  JumioLogo,
  NetkiLogo,
  FractalLogo,
} from '@polymeshassociation/polymesh-theme/ui/atoms';

type ProviderLogoCardProps = {
  provider:  'netki' | 'jumio' | 'fractal' | 'mock'
  isSelected: boolean;
  onSelectProvider: (provider: 'netki' | 'jumio' | 'fractal' | 'mock') => void;
};

export const ProviderLogoCard: React.FC<ProviderLogoCardProps> = ({
  provider,
  onSelectProvider,
  isSelected,
}) => {
  const onClick = () => {
    onSelectProvider(provider);
  };
  const [isLargerThan320] = useMediaQuery('(min-width: 320px)');
  const borderColor = useColorModeValue('gray.100', 'gray.700')

  return (
      <Flex
        alignItems="center"
        justifyContent="center"
        _hover={{ cursor: 'pointer', borderColor: 'navy' }}
        border="2px solid"
        borderColor={isSelected ? 'fucsia.700' : borderColor}
        boxSizing="border-box"
        onClick={onClick}
        h={{ base: '120px', md: '150px', lg: 'unset' }}
        w={{ base: '100%', md: '200px', lg: '250px' }}
        style={{ aspectRatio: isLargerThan320 ? '1' : 'unset' }}
        p="1.5rem"
        borderRadius="0.75rem"
      >
        {provider === 'jumio' && <JumioLogo boxSize="80%" />}
        {provider === 'netki' && <NetkiLogo boxSize="80%" />}
        {provider === 'fractal' && <FractalLogo boxSize="80%" />}
        {provider === 'mock' && <Text>Mock CDD (Best choice!)</Text> }
      </Flex>
  );
};

export default ProviderLogoCard;
