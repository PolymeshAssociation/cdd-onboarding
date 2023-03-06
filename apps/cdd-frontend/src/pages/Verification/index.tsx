import React from 'react';
import {
  StepForm,
  Step,
} from '@polymeshassociation/polymesh-theme/ui/organisms';

import EnterAddress from './steps/EnterAddress';

export const Verification: React.FC = () => {
  return (
    <StepForm title="Onboarding">
      <Step title="First Step" nextStepLabel="Get Started">
        <EnterAddress />
      </Step>
      <Step title="Second Step">test</Step>
      <Step title="Third Step">test</Step>
    </StepForm>
  );
};

export default Verification;
