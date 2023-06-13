import React, { useEffect } from 'react';

import useGetAddressApplicationsQuery from '../../../hooks/useGetAddressApplicationsQuery';
import { useResultPageContext } from '../ResultPageContext';
import { VerificationStatus } from '../types.d';

import StepTemplate, { StepTemplateProps } from './StepTemplate';

const ChainStatus: React.FC<Pick<StepTemplateProps, 'index'>> = ({ index }) => {
  const { setStepResult, activeStep, address } = useResultPageContext();
  const { isLoading, data, isFetched } = useGetAddressApplicationsQuery(address, activeStep === index);
  const { did } = data || {};
    
  useEffect(() => {
    if (isLoading) {
      setStepResult(index, VerificationStatus.PROCESSING);
    }
  }, [index, isLoading, setStepResult]);

  useEffect(() => {
    if (did) {
      setStepResult(index, VerificationStatus.SUCCESS);
    }

    if (!did && isFetched) {
      setStepResult(index, VerificationStatus.FAILED);
    }
  }, [did, index, isFetched, setStepResult])

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
