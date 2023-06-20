import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';
import { addressZ, hCaptcha } from './utils';
import { ApiProperty } from '@nestjs/swagger';

const CddProviderZEnum = z.enum(['netki', 'jumio', 'fractal', 'mock']);

export type CddProvider = z.TypeOf<typeof CddProviderZEnum>;

export const ProviderLinkZ = extendApi(
  z.object({
    address: addressZ,
    provider: CddProviderZEnum,
    hCaptcha,
  }),
  {
    title: 'Generate Onboarding Link',
  }
);

export class ProviderLinkDto extends createZodDto(ProviderLinkZ) {}

export class ProviderLinkResponse {
  @ApiProperty({
    type: 'string',
    description: 'Deep link to the provider for the user to follow',
  })
  link: string;

  constructor(link: string) {
    this.link = link;
  }
}
