import { addressZ } from '@cdd-onboarding/cdd-types/utils';
import { useMutation } from 'react-query';
import { z } from 'zod';

import axios from '../services/axios';

import { hCaptcha, useCaptcha } from './useCaptcha';
import { ApplicationInfo } from './useGetAddressApplicationsQuery';

type IdentityInfo = {
  did: string;
  validCdd: boolean;
};

export type VerifyAddressServiceResponse = {
  valid: boolean;
  identity: IdentityInfo | null;
  applications: ApplicationInfo[];
};

export const verifyAddressSchema = z.object({
  address: addressZ,
  hCaptcha,
});

export type VerifyAddressPayload = z.infer<typeof verifyAddressSchema>;

const verifyAddress = async (payload: VerifyAddressPayload) => {
  const { data } = await axios.post<VerifyAddressServiceResponse>('/verify-address', payload);

  return data;
};

export const useVerifyAddressMutation = () => {
  const mutation = useMutation(verifyAddress);
  const { captchaRef } = useCaptcha();

  const onMutate = (payload: VerifyAddressPayload) => {
    mutation.mutate(payload);
    captchaRef.current?.resetCaptcha();
  }

  return { ...mutation, mutate: onMutate }
};

export default useVerifyAddressMutation;
