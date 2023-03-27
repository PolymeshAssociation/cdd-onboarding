import React from 'react';
import { useColorModeValue } from '@chakra-ui/react';

import { LandingImage } from '@polymeshassociation/polymesh-theme/ui/atoms';
import { Hero } from '@polymeshassociation/polymesh-theme/ui/organisms';

import { LandingCta, LandingQuestionsAnswers } from '../components';

const Landing: React.FC = () => {
  const bgImage = useColorModeValue('blocks.svg', 'blocks-dark.svg');
  
  return (
    <>
      <LandingImage src={`/assets/img/${bgImage}`} alt="Blockchain image" />
      <Hero
        title="Welcome to Polymesh"
        subtitle="Before onboarding to Polymesh, please make sure you have the Polymesh Wallet installed."
        cta={<LandingCta />}
      />

      <LandingQuestionsAnswers />
    </>
  );
};

export default Landing;
