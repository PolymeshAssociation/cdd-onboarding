import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

//From: https://github.com/Jumio/implementation-guides/blob/master/netverify/callback.md#parameters
const JumioCallbackZ = extendApi(
  z.object({
    idScanStatus: z.enum(['APPROVED_VERIFIED', 'ERROR']),

    idScanSource: z.enum(['WEB', 'WEB_CAM', 'WEB_UPLOAD', 'API', 'SDK']),
    jumioIdScanReference: z.string(),
    verificationStatus: z.enum([
      'APPROVED_VERIFIED',
      'DENIED_FRAUD',
      'DENIED_UNSUPPORTED_ID_TYPE',
      'DENIED_UNSUPPORTED_ID_COUNTRY',
      'ERROR_NOT_READABLE_ID',
      'NO_ID_UPLOADED',
    ]),
    callbackDate: z.date(),
    transactionDate: z.date(),
  })
);

export class JumioCallbackDto extends createZodDto(JumioCallbackZ) {}

export interface JumioGenerateLinkResponse {
  timestamp: string;
  transactionReference: string;
  redirectUrl: string;
}
