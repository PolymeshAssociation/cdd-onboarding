import { addressZ } from '@cdd-onboarding/cdd-types/utils';
import { useMutation } from 'react-query';
import { z } from 'zod';

import { hCaptcha } from '../components/HCaptcha/HCaptchaFormComponent';
import axios from '../services/axios';

import { ApplicationInfo } from './useGetAddressApplicationsQuery';

type IdentityInfo = {
  did: string;
  validCdd: boolean;
};

export type ServiceResponse = {
  valid: boolean;
  identity: IdentityInfo | null;
  applications?: ApplicationInfo[];
};

export const verifyAddressSchema = z.object({
  address: addressZ,
  hCaptcha,
});

export type VerifyAddressPayload = z.infer<typeof verifyAddressSchema>;

const verifyAddress = async (payload: VerifyAddressPayload) => {
  const { data } = await axios.post<ServiceResponse>('/verify-address', payload);

  return data;
};

export const useVerifyAddressMutation = () => {
  return useMutation(verifyAddress);
};

export default useVerifyAddressMutation;
