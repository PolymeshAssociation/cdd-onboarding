import { Flex } from '@chakra-ui/react';
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
          {children}
      </Flex>
      <Footer />
    </>
  );
};

export default MainTemplate;
