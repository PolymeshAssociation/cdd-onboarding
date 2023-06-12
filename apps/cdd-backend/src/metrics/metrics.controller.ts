import { NetkiCodeCountResponse } from '@cdd-onboarding/cdd-types';
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
    type: NetkiCodeCountResponse,
  })
  @Get('/netki-codes')
  public async getNetkiCodeCount(): Promise<NetkiCodeCountResponse> {
    return this.metricsService.getNetkiAvailableCodeCount();
  }
}
