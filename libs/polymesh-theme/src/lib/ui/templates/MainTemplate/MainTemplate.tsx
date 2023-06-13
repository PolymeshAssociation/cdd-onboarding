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
      <Flex flexDirection="column" minH="calc(100vh - 150px)">
        <Box flexGrow={1} mt="3rem" minH="600px">
          {children}
        </Box>
      </Flex>
      <Footer />
    </>
  );
};

export default MainTemplate;
