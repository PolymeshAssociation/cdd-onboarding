import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { string, z } from 'zod';
import { addressZ } from './utils';

const AddressApplicationInfoZ = extendApi(
  z.object({
    address: addressZ,
  }),
  {
    title: 'Get address applications',
    description: 'fetch address application history',
  }
);

export class AddressApplicationsParamsDto extends createZodDto(
  AddressApplicationInfoZ
) {}

export class ApplicationInfo {
  @ApiProperty({
    type: 'string',
    description: 'The provider for the CDD application',
  })
  readonly provider: string;

  @ApiProperty({
    type: 'date',
    description: 'When this application was submitted',
  })
  readonly timestamp: string;

  constructor(provider: string, timestamp: string) {
    this.provider = provider;
    this.timestamp = timestamp;
  }
}

export class AddressApplicationsResponse {
  @ApiProperty({
    type: 'string',
    description: 'The address associated to the application requests',
  })
  readonly address: string;

  @ApiProperty({
    type: ApplicationInfo,
    description: 'Information about the accounts applications',
  })
  readonly applications: ApplicationInfo[];

  @ApiPropertyOptional({
    type: string,
    description: 'Identity DID associated to the account',
  })
  readonly did?: string;

  constructor(
    address: string,
    applications: ApplicationInfo[],
    did: string | undefined
  ) {
    this.address = address;
    this.applications = applications;
    this.did = did;
  }
}
