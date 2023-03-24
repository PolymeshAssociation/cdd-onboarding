import { HealthCheckResponse } from '@cdd-onboarding/cdd-types';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { InfoService } from './info.service';
import { PolymeshNetworkResponse } from './types';

@Controller('info')
@ApiTags('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'information about the configured chain node',
    type: HealthCheckResponse<PolymeshNetworkResponse>,
  })
  @Get('/network')
  public async getNetworkHealth(): Promise<
    HealthCheckResponse<PolymeshNetworkResponse>
  > {
    return this.infoService.polymeshInfo();
  }
}
