import { z } from 'zod';
import { addressZ, hCaptcha } from './utils';
import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationInfo } from './address-applications';

const VerifyAddressZ = extendApi(z.object({ address: addressZ, hCaptcha }), {
  title: 'Verify an Address',
  description: 'verify an address is eligible for onboarding',
});

export class VerifyAddressDto extends createZodDto(VerifyAddressZ) {}

export class IdentityInfo {
  @ApiProperty({
    type: 'string',
    description: 'The DID of the Identity associated to the address',
  })
  readonly did: string;

  @ApiProperty({
    type: 'boolean',
    description:
      'Wether this Identity has a valid CDD claim. Note, this service creates the DID atomically with the CDD claim',
  })
  readonly validCdd: boolean;

  constructor(did: string, validCdd: boolean) {
    this.did = did;
    this.validCdd = validCdd;
  }
}
export class VerifyAddressResponse {
  @ApiProperty({
    type: 'boolean',
    description: 'Whether the account is eligible for CDD onboarding',
  })
  readonly valid: boolean;

  @ApiProperty({
    type: IdentityInfo,
    description:
      'Information about the Identity if the account is linked to one',
  })
  readonly identity: IdentityInfo | null;

  @ApiPropertyOptional({
    type: ApplicationInfo,
    description: 'Information about the accounts applications',
  })
  readonly applications?: ApplicationInfo[];

  constructor(valid: boolean, identity: IdentityInfo | null, applications?: ApplicationInfo[]) {
    this.valid = valid;
    this.identity = identity;
    this.applications = applications;
  }
}
