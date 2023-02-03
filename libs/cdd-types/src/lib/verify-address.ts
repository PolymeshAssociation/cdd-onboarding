import { z } from 'zod';
import { base58Regex } from './utils';
import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';
import { ApiProperty } from '@nestjs/swagger';

const VerifyAddressZ = extendApi(
  z.object({ address: z.string().regex(base58Regex) }),
  {
    title: 'Verify an Address',
    description: 'verify an address is eligible for onboarding',
  }
);

export class VerifyAddressParamDto extends createZodDto(VerifyAddressZ) {}

export class VerifyAddressResponse {
  @ApiProperty({
    type: 'boolean',
    description: 'Whether the account is eligible for CDD onboarding',
  })
  readonly valid: boolean;

  constructor(valid: boolean) {
    this.valid = valid;
  }
}
