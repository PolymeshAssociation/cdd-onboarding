import React from 'react';
import LandingImage from '../../atoms/LandingImage/LandingImage';

import { Header, Footer } from '../../molecules';

type LandingPageProps = {
  children: React.ReactNode;
};



export const Landing: React.FC<LandingPageProps> = ({ children }) => {
  return (
    <>
      <Header />
        {children}
        <LandingImage src='blocks.svg' alt="Blockchain image" />
      <Footer />
    </>
  );
};

export default Landing;
