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
  child_codes: string[]; // TODO double check this
  is_active: boolean;
  created: string;
}

export type NetkiAccessCodePageResponse =
  NetkiPaginatedResponse<NetkiAccessCode>;

type NetkiPaginatedResponse<T> = {
  count: number;
  next: null;
  previous: null;
  results: T[];
};

export const availableCodesSetName = 'netki-codes' as const;
export const allocatedCodesPrefix = 'netki-allocated-codes:' as const;

export const netkiAllocatedPrefixer = (id: string) =>
  `${allocatedCodesPrefix}${id}`;
