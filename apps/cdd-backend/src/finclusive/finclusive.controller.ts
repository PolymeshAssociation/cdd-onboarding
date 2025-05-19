import {
  Body,
  Controller,
  Headers,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IpFilterGuard } from '../common/ip-filter.guard';
import { FinclusiveService } from './finclusive.service';
import { FinclusiveCallbackDto } from './types';
import { CallbackApiKeyGuard } from '../common/callback-api-key.guard';

@Controller('finclusive')
@ApiTags('finclusive')
export class FinclusiveController {
  constructor(private readonly service: FinclusiveService) {}

  @Post('/callback')
  @UseGuards(IpFilterGuard, CallbackApiKeyGuard)
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  public async processCddApplication(
    @Body() data: FinclusiveCallbackDto,
    @Headers('X-Finclusive-Notificationtype') type: string
  ) {
    await this.service.queueApplication(data, type);
  }
}
