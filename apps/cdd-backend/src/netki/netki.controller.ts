import {
  BusinessLinkDto,
  BusinessLinkResponse,
} from '@cdd-onboarding/cdd-types';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/api-key.guard';
import { BasicAuthGuard } from '../common/basic-auth.guard';
import { NetkiService } from './netki.service';
import {
  NetkiBusinessCallbackDto,
  NetkiCallbackDto,
  NetkiFetchCodesResponse,
} from './types';

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

  @Post('/business/callback')
  @ApiBody({
    type: NetkiCallbackDto,
  })
  @UseGuards(BasicAuthGuard)
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  public async businessCallback(@Body() data: NetkiBusinessCallbackDto) {
    await this.service.queueBusinessJob(data);
  }

  @Post('/business-link')
  @UseGuards(ApiKeyGuard)
  async businessLink(
    @Body() body: BusinessLinkDto
  ): Promise<BusinessLinkResponse> {
    return this.service.allocateLinkForBusiness(body);
  }
}
