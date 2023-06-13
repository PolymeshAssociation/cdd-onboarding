import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { RouteParams, VerificationStatus } from './types.d';
import { ResultPageContext } from './ResultPageContext';
import { useSteps } from '@chakra-ui/react';

const ResultPageContextProvider = ({
  children,
}: {
  children: React.ReactNode;
  initialStep?: number;
}) => {
  const { provider, result } = useParams<RouteParams>();
  const [stepCount, setStepCount] = useState<number>(0);
  const [address, setAddress] = useState<string | null>(null);
  const [globalStatus, setGlobalStatus] = useState<VerificationStatus>();
  const [stepStatus, setStepStatus] = useState<VerificationStatus[]>([]);
  const navigate = useNavigate();

  if (!provider || !['jumio', 'netki'].includes(provider)) {
    navigate('/404');
  }

  if (provider !== 'netki' && (!result || !['success', 'failed'].includes(result))) {
    navigate('/404');
  }

  useEffect(() => {
    const getStatus = () => {
      if (
        stepStatus.length && stepStatus.length === stepCount &&
        stepStatus.every((s) => s === VerificationStatus.SUCCESS)
      ) {
        setGlobalStatus(VerificationStatus.SUCCESS);

        return;
      }

      if (
        stepStatus.length &&
        stepStatus.some((s) => s === VerificationStatus.FAILED)
      ) {
        setGlobalStatus(VerificationStatus.FAILED);

        return;
      }

      setGlobalStatus(VerificationStatus.PROCESSING);
    };

    getStatus();
  }, [stepStatus, stepCount]);

  const { activeStep, setActiveStep, isActiveStep } = useSteps({
    index: 0,
    count: stepCount,
  });

  const onNext = useCallback(() => {
    setActiveStep((step) => step + 1);
  }, [setActiveStep]);

  const onBack = useCallback(() => {
    setActiveStep((step) => step - 1);
  }, [setActiveStep]);

  const setStepResult = useCallback(
    (index: number, status: VerificationStatus) => {
      setStepStatus((prev) => {
        const newStatus = [...prev];
        newStatus[index] = status;

        return newStatus;
      });
    },
    []
  );

  const api = useMemo(
    () => ({
      address,
      setAddress,
      activeStep,
      onNext,
      onBack,
      provider,
      providerResult: result,
      setStepCount,
      globalStatus,
      isActiveStep,
      stepStatus,
      setStepResult,
    }),
    [
      address,
      setAddress,
      activeStep,
      onBack,
      onNext,
      provider,
      result,
      setStepCount,
      globalStatus,
      isActiveStep,
      stepStatus,
      setStepResult,
    ]
  );

  return (
    <ResultPageContext.Provider value={api}>
      {children}
    </ResultPageContext.Provider>
  );
};

export default ResultPageContextProvider;
