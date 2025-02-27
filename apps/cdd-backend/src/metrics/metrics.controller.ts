import {
  CodeCountResponse,
  JobQueueStatsResponse,
} from '@cdd-onboarding/cdd-types';
import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IpFilterGuard } from '../common/ip-filter.guard';
import { MetricsService } from './metrics.service';

@Controller('metrics')
@ApiTags('metrics')
@UseGuards(IpFilterGuard)
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'available netki codes',
    type: CodeCountResponse,
  })
  @Get('/netki-codes')
  public async getNetkiCodeCount(): Promise<CodeCountResponse> {
    return this.metricsService.getNetkiAvailableCodeCount();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'available finclusive codes',
    type: CodeCountResponse,
  })
  @Get('/finclusive-codes')
  public async getFinclusiveCodeCount(): Promise<CodeCountResponse> {
    return this.metricsService.getFinclusiveAvailableCodeCount();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'job queue statistics',
    type: JobQueueStatsResponse,
  })
  @Get('/job-stats')
  public async getJobQueueStats(): Promise<JobQueueStatsResponse> {
    return this.metricsService.getJobQueueStats();
  }
}
