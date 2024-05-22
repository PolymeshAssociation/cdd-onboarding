import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';
import { addressZ } from './utils';
import { ApiProperty } from '@nestjs/swagger';

export const BusinessLinkZ = extendApi(
  z.object({
    address: z.optional(addressZ),
  }),
  {
    title: 'Generate a KYB Link',
  }
);

export class BusinessLinkDto extends createZodDto(BusinessLinkZ) {}

export class BusinessLinkResponse {
  @ApiProperty({
    type: 'string',
    description: 'Deep link to the provider for the user to follow',
  })
  link: string;

  @ApiProperty({
    type: 'string',
    description:
      "The access code used to identify the application on Netki's platform",
  })
  accessCode: string;

  constructor(link: string, accessCode: string) {
    this.link = link;
    this.accessCode = accessCode;
  }
}
