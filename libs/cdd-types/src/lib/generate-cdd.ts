import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';
import { addressZ } from './utils';
import { ApiProperty } from '@nestjs/swagger';

export const GenerateCddZ = extendApi(
  z.object({
    address: addressZ,
  }),
  { title: 'Generate CDD claim' }
);

export class GenerateCddDto extends createZodDto(GenerateCddZ) {}

export class GenerateCddResponse {
  @ApiProperty({
    type: 'string',
    description: 'Reference ID for the created job',
  })
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
