import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Link, useColorModeValue } from '@chakra-ui/react';

export const LandingCta: React.FC = () => {
  const linkColor = useColorModeValue('navy.500', 'navy.200');

  return (
    <Box textAlign="center" w="100%">
      <Button
        colorScheme="navy"
        size={{ base: 'md', sm: 'lg' }}
        as={RouterLink}
        to="/verification"
        w={{ base: '100%', md: '250px' }}
        mx="auto"
        mb="1.5rem"
        display="block"
      >
        New Application
      </Button>
      <Link
        color={linkColor}
        variant="ghost"
        href="https://chrome.google.com/webstore/detail/polymesh-wallet/jojhfeoedkpkglbfimdfabpdfjaoolaf?hl=__REACT_APP_WALLET_URL=https://chrome.google.com/webstore/detail/polymesh-wallet/jojhfeoedkpkglbfimdfabpdfjaoolaf?hl__"
        target="_blank"
        isExternal
      >
        I don't have a Polymesh Wallet yet
      </Link>
    </Box>
  );
};

export default LandingCta;
