import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

const MockCddZ = extendApi(
  z.object({
    address: z.string(),
    id: z.string(),
  })
);

export class MockCddDto extends createZodDto(MockCddZ) {}
