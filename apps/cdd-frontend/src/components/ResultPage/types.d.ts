import React from 'react';
import { UseStepsReturn } from '@chakra-ui/react';

export enum VerificationStatus {
  SUCCESS,
  FAILED,
  NONE,
  PROCESSING,
}

export enum ProviderEnum {
  JUMIO = 'jumio',
  NETKI = 'netki',
  FINCLUSIVE = 'finclusive',
  MOCK = 'mock',
}

export const PROVIDERS = [
  ProviderEnum.JUMIO,
  ProviderEnum.NETKI,
  ProviderEnum.FINCLUSIVE,
  ProviderEnum.MOCK,
] as const;

export type RouteParams = {
  provider?: ProviderEnum;
  result?: 'success' | 'failed';
};

export type ResultPageContextValue = Pick<RouteParams, 'provider'> &
  Pick<UseStepsReturn, 'activeStep' | 'isActiveStep'> & {
    providerResult: RouteParams['result'];
    setStepResult: (index: number, status: VerificationStatus) => void;
    activeStep: number;
    onNext: () => void;
    onBack: () => void;
    setStepCount: React.Dispatch<React.SetStateAction<number>>;
    globalStatus?: VerificationStatus;
    stepStatus: VerificationStatus[];
    address: string | null;
    setAddress: React.Dispatch<React.SetStateAction<string | null>>;
  };
