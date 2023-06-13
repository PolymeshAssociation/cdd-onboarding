import React, { useEffect } from 'react';

import { useStoredAddressValue } from '../../../hooks/useStoredAddressValue';
import AddressPicker from '../../AddressPicker';
import { useResultPageContext } from '../ResultPageContext';
import { VerificationStatus } from '../types.d';
import StepTemplate, { StepTemplateProps } from './StepTemplate';

const AddressStep: React.FC<Pick<StepTemplateProps, 'index'>> = ({ index }) => {
  const { provider, setStepResult, activeStep, stepStatus, setAddress, address } =
    useResultPageContext();
  const { address: storedAddress } = useStoredAddressValue();
  const localStatus = stepStatus[index];

  useEffect(() => {
    if (provider === 'jumio') {
      setAddress(storedAddress || 'somevalue'); // extract address from url
    }

    if (provider === 'netki') {
      setAddress(storedAddress);
    }
  }, [provider, storedAddress]);

  useEffect(() => {
    if (activeStep === index) {
      setStepResult(index, VerificationStatus.PROCESSING);
    }
  }, [setStepResult, index, activeStep]);

  useEffect(() => {
    if (address && activeStep === index) {
      const timer = setTimeout(() => {
        setStepResult(index, VerificationStatus.SUCCESS);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (!address && activeStep === index) {
      const timer = setTimeout(() => {
        setStepResult(index, VerificationStatus.NONE);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeStep, address, index, setStepResult]);

  if (localStatus === VerificationStatus.SUCCESS) {
    return (
      <StepTemplate title="Address verified" index={index}>
        {address}
      </StepTemplate>
    );
  }

  if (!address && localStatus !== VerificationStatus.PROCESSING) {
    return (
      <StepTemplate title="Please select your address" index={index}>
        <AddressPicker onSubmit={({ address }) => setAddress(address)} />
      </StepTemplate>
    );
  }

  return (
    <StepTemplate title="Verifying address" index={index}>
      {address}
    </StepTemplate>
  );
};

export default AddressStep;
