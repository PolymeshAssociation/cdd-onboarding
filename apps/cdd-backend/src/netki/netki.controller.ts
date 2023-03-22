import { HttpStatus, UseGuards } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BasicAuthGuard } from '../common/basic-auth.guard';
import { NetkiService } from './netki.service';
import { NetkiCallbackDto, NetkiFetchCodesResponse } from './types';

@Controller('netki')
@ApiTags('netki')
export class NetkiController {
  constructor(private readonly service: NetkiService) {}

  @Post('/fetch-access-codes')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'access code fetched and total count',
  })
  public async fetchAccessCodes(): Promise<NetkiFetchCodesResponse> {
    return this.service.fetchAccessCodes();
  }

  @Post('/callback')
  @ApiBody({
    type: NetkiCallbackDto,
  })
  @UseGuards(BasicAuthGuard)
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  public async callback(@Body() data: NetkiCallbackDto) {
    await this.service.queueCddJob(data);
  }
}
