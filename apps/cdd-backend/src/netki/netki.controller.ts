import { Body, Controller, Post } from '@nestjs/common';
import { NetkiService } from './netki.service';
import { NetkiCallbackDto } from './types';

@Controller('netki')
export class NetkiController {
  constructor(private readonly service: NetkiService) {}

  @Post('/fetch-access-codes')
  public async fetchAccessCodes() {
    const { fetchCount, totalCount } = await this.service.fetchAccessCodes();

    return `Added ${fetchCount} access codes. Current code count: ${totalCount}`;
  }

  @Post('/callback')
  public async callback(@Body() data: NetkiCallbackDto) {
    await this.service.queueCddJob(data);
  }
}
