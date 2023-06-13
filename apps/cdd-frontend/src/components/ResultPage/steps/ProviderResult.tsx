import React, { useEffect } from 'react';

import useTimer from '../../../hooks/useTimer';
import { useResultPageContext } from '../ResultPageContext';
import { VerificationStatus } from '../types.d';
import StepTemplate, { StepTemplateProps } from './StepTemplate';

const ProviderResult: React.FC<Pick<StepTemplateProps, 'index'>> = ({
  index,
}) => {
  const { provider, providerResult, setStepResult, stepStatus, activeStep } =
    useResultPageContext();
  const localStatus = stepStatus[index];

  useEffect(() => {
    if (activeStep === index) {
      setStepResult(index, VerificationStatus.PROCESSING);
    }
  }, [setStepResult, index, activeStep]);

  useTimer(() => {
    if (providerResult === 'success' || provider === 'netki') {
      setStepResult(index, VerificationStatus.SUCCESS);
    }

    if (providerResult === 'failed') {
      setStepResult(index, VerificationStatus.FAILED);
    }
  }, 1000);

  if (provider === 'jumio' && localStatus === VerificationStatus.SUCCESS) {
    return <StepTemplate title="Identity verified with JUMIO" index={index} />;
  }

  if (provider === 'netki') {
    return <StepTemplate title="Response received from Netki" index={index} />;
  }

  return (
    <StepTemplate title="Checking CDD Provider Result" index={index}>
      Checking identity status with {provider?.toLocaleUpperCase()}
    </StepTemplate>
  );
};

export default ProviderResult;
