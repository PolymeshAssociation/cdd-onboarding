import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { Header, Footer } from '../../molecules';

type MainTemplateProps = {
  children: React.ReactNode;
};

export const MainTemplate: React.FC<MainTemplateProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Flex flexDirection="column" minH="100vh">
        <Box flexGrow={1} mt="3rem">
          {children}
        </Box>
      </Flex>
      <Footer />
    </>
  );
};

export default MainTemplate;
