import React, { useEffect } from 'react';

import useVerifyAddressMutation from '../../../hooks/useVerifyAddressMutation';
import { useHCaptcha } from '../../HCaptcha/HCaptchaContext';
import { useResultPageContext } from '../ResultPageContext';
import { VerificationStatus } from '../types.d';

import StepTemplate, { StepTemplateProps } from './StepTemplate';

const ChainStatus: React.FC<Pick<StepTemplateProps, 'index'>> = ({ index }) => {
  const { setStepResult, activeStep, address, stepStatus } = useResultPageContext();
  const { token } = useHCaptcha();
  const { mutate, isLoading, isSuccess, isError, error } =
    useVerifyAddressMutation();
  const localStatus = stepStatus[index];

  useEffect(() => {
    if (activeStep === index) {
      setStepResult(index, VerificationStatus.PROCESSING);
    }
  }, [setStepResult, index, activeStep]);


  useEffect(() => {
    if (address && token && activeStep === index) {
      mutate({ address, hCaptcha: token });
    }

  }, [activeStep, address, index, mutate, setStepResult, token]);

  useEffect(() => {
    if (isSuccess && activeStep === index) {
      setStepResult(index, VerificationStatus.SUCCESS);
    }

    if (isError && activeStep === index) {
      setStepResult(index, VerificationStatus.FAILED);
    }
  }, [activeStep, index, isError, isSuccess, setStepResult])

  if (isLoading) {
    return (
      <StepTemplate title="Checking Identity on Chain" index={index}>
      Checking if Identity has been assigned to the address..
    </StepTemplate>
    );

  }

  return (
    <StepTemplate title="Verify Identity on Chain" index={index} />
  );
};

export default ChainStatus;
