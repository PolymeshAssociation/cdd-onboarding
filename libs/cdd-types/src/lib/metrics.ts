import { ApiProperty } from '@nestjs/swagger';

export class NetkiCodeCountResponse {
  @ApiProperty({
    description: 'number of available netki codes',
  })
  readonly count: number;

  constructor(count: number) {
    this.count = count;
  }
}
