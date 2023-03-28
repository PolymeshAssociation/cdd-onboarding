import { ApiProperty } from '@nestjs/swagger';
import { boolean } from 'zod';

export class HealthCheckResponse<DataType = Record<string, unknown>> {
  @ApiProperty({
    type: boolean,
    description: 'service is connected',
  })
  readonly healthy: boolean;

  @ApiProperty({
    description: 'additional data for the service',
  })
  readonly data?: DataType;

  constructor(reachable: boolean, data?: DataType) {
    this.healthy = reachable;
    this.data = data;
  }
}
