import { extendApi } from '@anatine/zod-openapi';
import { decodeAddress } from '@polkadot/keyring';
import { z } from 'zod';

export const base58Regex = /^[A-HJ-NP-Za-km-z1-9]*$/;

export const addressZ = extendApi(
  z
    .string()
    .regex(base58Regex)
    .min(47)
    .max(48)
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
<<<<<<< HEAD
        message: 'Address must be ss58 encoded',
=======
        message: 'String must be ss58 encoded',
>>>>>>> origin/main
      }
    ),
  {
    example: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  }
);
