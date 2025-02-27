import { Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FinclusiveService } from './finclusive.service';
import { FinclusiveFetchCodesResponse } from './types';

@Controller('finclusive')
@ApiTags('finclusive')
export class FinclusiveController {
  constructor(private readonly service: FinclusiveService) {}

  @Post('/fetch-access-codes')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'access code fetched and total count',
  })
  public async fetchAccessCodes(): Promise<FinclusiveFetchCodesResponse> {
    return this.service.fetchAccessCodes();
  }

  // @Post('/callback')
  // @ApiBody({
  //   type: FinclusiveCallbackDto,
  // })
  // @UseGuards(BasicAuthGuard)
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  // })
  // public async callback(@Body() data: FinclusiveCallbackDto) {
  //   // await this.service.queueCddJob(data);
  // }
}
