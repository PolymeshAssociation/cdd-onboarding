import React from 'react';
import { GridItem, Flex, useMediaQuery } from '@chakra-ui/react';

import {
  JumioLogo,
  NetkiLogo,
} from '@polymeshassociation/polymesh-theme/ui/atoms';

type ProviderLogoCardProps = {
  provider: 'netki' | 'jumio';
  isSelected: boolean;
  onSelectProvider: (provider: 'netki' | 'jumio') => void;
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

  return (
    <GridItem w="100%">
      <Flex
        alignItems="center"
        justifyContent="center"
        _hover={{ cursor: 'pointer', borderColor: 'navy' }}
        border="2px solid"
        borderColor={isSelected ? 'fucsia.700' : 'gray.100'}
        boxSizing="border-box"
        onClick={onClick}
        h={{ base: '120px', md: '150px' }}
        w={{ base: '100%', md: 'unset' }}
        style={{ aspectRatio: isLargerThan320 ? '1' : 'unset' }}
        p="1.5rem"
        borderRadius="0.75rem"
      >
        {provider === 'jumio' && <JumioLogo boxSize="80%" />}
        {provider === 'netki' && <NetkiLogo boxSize="80%" />}
      </Flex>
    </GridItem>
  );
};

export default ProviderLogoCard;
