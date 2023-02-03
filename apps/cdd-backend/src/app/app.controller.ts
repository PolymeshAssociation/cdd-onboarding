import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AppService } from './app.service';
import {
  GenerateLinkDto,
  GenerateLinkResponse,
  VerifyAddressParamDto,
  VerifyAddressResponse,
} from '@cdd-onboarding/cdd-types';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiParam({
    name: 'address',
    description: 'Validate a ss58 encoded address is eligible for onboarding',
    example: '5Cabc1UmM3CgE6cvvstL2LW62HecBmBwuhQqz8geBQ7h3kDS',
  })
  @ApiOkResponse({
    type: VerifyAddressResponse,
  })
  @Get('/verify/:address')
  async verifyAddress(
    @Param() { address }: VerifyAddressParamDto
  ): Promise<VerifyAddressResponse> {
    const valid = await this.appService.verifyAddress(address);

    return new VerifyAddressResponse(valid);
  }

  @Post('/links')
  async generateProviderLink(
    @Body() body: GenerateLinkDto
  ): Promise<GenerateLinkResponse> {
    const link = await this.appService.generateProviderLink(body);

    return new GenerateLinkResponse(link);
  }
}
