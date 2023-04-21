import React from 'react';
import {
  StepForm,
  StepFormStep,
} from '@polymeshassociation/polymesh-theme/ui/organisms';

import { EnterAddress, SelectCddProvider, GoToCddProvider, EnterDetails } from './steps';
import { VerificationState } from './steps/index.d';


export const Verification: React.FC = () => {
  const [state, setState] = React.useState<VerificationState>({})

  return (
    <StepForm title="Onboarding" initialStep={0}>
      <StepFormStep title="Your Details">
        <EnterDetails setState={setState} state={state} />
      </StepFormStep>
      <StepFormStep title="Verify Address">
        <EnterAddress setState={setState} state={state} />
      </StepFormStep>
      <StepFormStep title="Select CDD Provider">
        <SelectCddProvider state={state} setState={setState} />
      </StepFormStep>
      <StepFormStep title="Get Verified">
        <GoToCddProvider {...state} />
      </StepFormStep>
    </StepForm>
  );
};

export default Verification;
