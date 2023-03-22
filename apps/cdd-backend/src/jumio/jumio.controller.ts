import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOkResponse()
  @Post('/callback')
  @HttpCode(HttpStatus.OK) // return 200, not the default 201 for POST
  public async processCddApplication(@Body() request: JumioCallbackDto) {
    await this.service.queueApplication(request);
  }
}
