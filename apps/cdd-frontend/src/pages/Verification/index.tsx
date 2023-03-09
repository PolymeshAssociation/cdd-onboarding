import React from 'react';
import {
  StepForm,
  Step,
} from '@polymeshassociation/polymesh-theme/ui/organisms';

import { EnterAddress, SelectCddProvider, GoToCddProvider } from './steps';
import { VerificationState } from './steps/index.d';


export const Verification: React.FC = () => {
  const [state, setState] = React.useState<VerificationState>({})

  return (
    <StepForm title="Onboarding">
      <Step title="Verify Address">
        <EnterAddress setState={setState} state={state} />
      </Step>
      <Step title="Select CDD Provider">
        <SelectCddProvider state={state} setState={setState} />
      </Step>
      <Step title="Get Verified">
        <GoToCddProvider {...state} />
      </Step>
    </StepForm>
  );
};

export default Verification;
