import {
  ProviderLinkDto,
  GenerateCddResponse,
  VerifyAddressParamDto,
  VerifyAddressResponse,
  GenerateCddDto,
  ProviderLinkResponse,
} from '@cdd-onboarding/cdd-types';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { CddService } from './cdd.service';

@Controller('')
export class CddController {
  constructor(private readonly cddService: CddService) {}

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
    const valid = await this.cddService.verifyAddress(address);

    return new VerifyAddressResponse(valid);
  }

  @Post('/provider-link')
  async providerLink(
    @Body() body: ProviderLinkDto
  ): Promise<ProviderLinkResponse> {
    const link = await this.cddService.generateProviderLink(body);

    return new ProviderLinkResponse(link);
  }

  @Post('/cdd')
  async generateCdd(@Body() body: GenerateCddDto) {
    const id = await this.cddService.queueCddRequest(body);

    return new GenerateCddResponse(id);
  }
}
