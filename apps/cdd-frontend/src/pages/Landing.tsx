import React from 'react';

import { LandingImage } from '@polymeshassociation/polymesh-theme/ui/atoms';
import { Hero } from '@polymeshassociation/polymesh-theme/ui/organisms';

import { LandingCta, LandingQuestionsAnswers } from '../components';

const Landing: React.FC = () => {
  return (
    <>
      <LandingImage src="/assets/img/blocks.svg" alt="Blockchain image" />
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
