import React from 'react';

import { Header, Footer } from '../../molecules';

type MainTemplateProps = {
  children: React.ReactNode;
};



export const MainTemplate: React.FC<MainTemplateProps> = ({ children }) => {
  return (
    <>
      <Header />
        {children}
      <Footer />
    </>
  );
};

export default MainTemplate;
