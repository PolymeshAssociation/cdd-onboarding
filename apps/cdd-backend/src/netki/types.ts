import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

const NetkiAccessCodeZ = extendApi(
  z.object({
    code: z.string(),
    is_active: z.boolean(),
    created: z.string(),
  })
);

const NetkiCallbackZ = extendApi(
  z.object({
    identity: z.object({
      transaction_identity: z.object({
        client_guid: z.string(),
        identity_access_code: z.object({
          code: z.string(),
          child_codes: z.array(NetkiAccessCodeZ),
        }),
      }),
      state: z.string(),
    }),
  })
);

export class NetkiCallbackDto extends createZodDto(NetkiCallbackZ) {}

export interface NetkiAccessCode {
  id: string;
  code: string;
  parent_code: null | string;
  child_codes: string[];
  is_active: boolean;
  created: string;
}

/**
 * Note additional fields are present on the response - current use case is to act as a "ping"
 */
export interface NetkiBusinessInfo {
  business_type: string;
  created: string;
  id: string;
  is_active: boolean;
  name: string;
  primary_account: string;
  status: string;
  updated: string;
}

export type NetkiBusinessInfoPageResponse =
  NetkiPaginatedResponse<NetkiBusinessInfo>;

export type NetkiAccessCodePageResponse =
  NetkiPaginatedResponse<NetkiAccessCode>;

type NetkiPaginatedResponse<T> = {
  count: number;
  next: null;
  previous: null;
  results: T[];
};

export interface NetkiFetchCodesResponse {
  added: number;
  total: number;
}
