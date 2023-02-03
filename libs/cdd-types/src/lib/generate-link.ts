import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';
import { addressZ } from './utils';
import { ApiProperty } from '@nestjs/swagger';

export const GenerateLinkZ = extendApi(
  z.object({
    address: addressZ,
    provider: z.enum(['jumio', 'netki']),
  }),
  { title: 'Generate Link Request' }
);

export class GenerateLinkDto extends createZodDto(GenerateLinkZ) {}

export class GenerateLinkResponse {
  @ApiProperty({
    type: 'string',
    description: 'Deep link to the provider the user should follow',
  })
  link: string;

  constructor(link: string) {
    this.link = link;
  }
}
