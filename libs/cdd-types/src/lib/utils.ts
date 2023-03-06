import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const base58Regex = /^[A-HJ-NP-Za-km-z1-9]*$/;

export const addressZ = extendApi(
  z.string().regex(base58Regex).min(47).max(48),
  {
    example: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  }
);
