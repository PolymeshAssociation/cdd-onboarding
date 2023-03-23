import React from 'react';

import { Box, Button, Link } from '@chakra-ui/react';

export const LandingCta: React.FC = () => {
  return (
    <Box textAlign="center">
      <Button
        colorScheme="navy"
        size={{ base: 'md', md: 'lg' }}
        as="a"
        href="/verification"
        w={{ base: '100%', md: 'unset' }}
        mb="1.5rem"
        display="block"
      >
        New Application
      </Button>
      <Link
        color="navy"
        variant="ghost"
        bg="#fff"
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
