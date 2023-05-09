import { HealthCheckResponse } from '@cdd-onboarding/cdd-types';
import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { IpFilterGuard } from '../common/ip-filter.guard';
import { InfoService } from '../info/info.service';

@Controller('health')
@ApiTags('health')
@UseGuards(IpFilterGuard)
export class HealthController {
  constructor(
    private readonly infoService: InfoService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Get('/')
  public async getHealth(): Promise<string> {
    const result = await this.infoService.all();

    return this.isHealthy(result);
  }

  @Get('/redis')
  public async getRedisHealth(): Promise<string> {
    const result = await this.infoService.redisInfo();

    return this.isHealthy(result);
  }

  @Get('/network')
  public async getNetworkHealth(): Promise<string> {
    const result = await this.infoService.polymeshInfo();

    return this.isHealthy(result);
  }

  @Get('/netki')
  public async getNetkiHealth(): Promise<string> {
    const result = await this.infoService.netkiInfo();

    return this.isHealthy(result);
  }

  @Get('/jumio')
  public async getJumioHealth(): Promise<string> {
    const result = await this.infoService.jumioInfo();

    return this.isHealthy(result);
  }

  @Get('/mailchimp')
  public async getMailchimpHealth(): Promise<string> {
    const result = await this.infoService.mailchimpInfo();

    return this.isHealthy(result);
  }

  private isHealthy(result: HealthCheckResponse<unknown>): string {
    if (!result.healthy) {
      this.logger.warn('health check not healthy', result);
      throw new ServiceUnavailableException();
    }

    return 'OK';
  }
}
