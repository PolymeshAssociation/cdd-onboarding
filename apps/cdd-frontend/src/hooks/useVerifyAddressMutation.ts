import { checkAddress } from '@polkadot/util-crypto';
import { useMutation } from 'react-query';
import { z } from 'zod';

import axios from '../services/axios';
import config from '../config/constants';

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

const addressSchema = z
  .string()
  .min(47, 'Address must be at least 47 characters in length')
  .max(48, 'Address must be at most 48 characters in length')
  .superRefine((val, ctx) => {
    const [valid, message] = checkAddress(val, config.SS58_FORMAT);

    if (!valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: message && message.includes("mismatch") ? `The supplied address is not valid for ${config.NETWORK} address` : message ? message : "The supplied address is not valid",
      });
    }
  });

export const verifyAddressSchema = z.object({
  address: addressSchema,
});

export type VerifyAddressPayload = z.infer<typeof verifyAddressSchema>;

const verifyAddress = async (payload: VerifyAddressPayload) => {
  const { data } = await axios.post<VerifyAddressServiceResponse>(
    '/verify-address',
    payload
  );

  return data;
};

export const useVerifyAddressMutation = () => {
  return useMutation(verifyAddress);
};

export default useVerifyAddressMutation;
