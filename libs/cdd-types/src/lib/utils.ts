import { extendApi } from '@anatine/zod-openapi';
import { decodeAddress } from '@polkadot/keyring';
import { z } from 'zod';

export const base58Regex = /^[A-HJ-NP-Za-km-z1-9]*$/;

export const addressZ = extendApi(
  z
    .string()
    .regex(base58Regex, 'Invalid characters entered')
    .min(47, 'Address must be at least 47 characters in length')
    .max(48, 'Address must be at most 48 characters in length')
    .refine(
      (arg) => {
        try {
          decodeAddress(arg);
          return true;
        } catch (error) {
          return false;
        }
      },
      {
        message: 'Address must be ss58 encoded',
      }
    ),
  {
    example: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  }
);

export const hCaptcha =
  process.env['HCAPTCHA_IS_ENABLED'] === 'true'
    ? z.string().nonempty('hCaptcha validation token is required')
    : z.optional(z.string());
