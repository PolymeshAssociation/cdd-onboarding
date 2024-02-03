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

export class JobQueueStatsResponse {
  @ApiProperty({
    description: 'number of active jobs',
  })
  readonly active: number;

  @ApiProperty({
    description: 'number of completed jobs',
  })
  readonly completed: number;

  @ApiProperty({
    description: 'number of failed jobs',
  })
  readonly failed: number;

  @ApiProperty({
    description: 'number of waiting jobs',
  })
  readonly waiting: number;

  @ApiProperty({
    description: 'number of seconds the oldest job has been waiting',
  })
  readonly oldestSeconds: number;

  constructor({
    active,
    completed,
    failed,
    waiting,
    oldestSeconds,
  }: JobQueueStatsResponse) {
    this.active = active;
    this.completed = completed;
    this.failed = failed;
    this.waiting = waiting;
    this.oldestSeconds = oldestSeconds;
  }
}
