import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IpFilterGuard } from '../common/ip-filter.guard';
import { JumioService } from './jumio.service';
import { JumioCallbackDto } from './types';

@Controller('jumio')
@ApiTags('jumio')
export class JumioController {
  constructor(private readonly service: JumioService) {}

  @ApiBody({
    type: JumioCallbackDto,
    description: 'The expected information to be received from the callback',
  })
  @ApiForbiddenResponse({
    description:
      "An authorization check failed - the server maybe misconfigured or you aren't supposed to be posting",
  })
  @ApiOkResponse()
  @Post('/callback')
  @UseGuards(IpFilterGuard)
  @HttpCode(HttpStatus.OK) // return 200, not the default 201 for POST
  public async processCddApplication(@Body() request: JumioCallbackDto) {
    await this.service.queueApplication(request);
  }
}
