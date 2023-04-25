import {
  ProviderLinkDto,
  VerifyAddressParamDto,
  VerifyAddressResponse,
  ProviderLinkResponse,
  EmailDetailsDto,
} from '@cdd-onboarding/cdd-types';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { HCaptchaGuard } from '../common/hcaptcha.guard';
import { CddService } from './cdd.service';

@Controller('')
@ApiTags('user')
@UseGuards(HCaptchaGuard)
export class CddController {
  constructor(private readonly cddService: CddService) {}

  @ApiParam({
    name: 'address',
    description: 'Validate a ss58 encoded address is eligible for onboarding',
    example: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  })
  @ApiOkResponse({
    type: VerifyAddressResponse,
  })
  @ApiBadRequestResponse({
    description:
      'Address is not valid ss58 for the network (prefixed with 12 for mainnet, 42 otherwise)',
  })
  @Get('/verify/:address')
  async verifyAddress(
    @Param() { address }: VerifyAddressParamDto
  ): Promise<VerifyAddressResponse> {
    return this.cddService.verifyAddress(address);
  }

  @Post('/provider-link')
  async providerLink(
    @Body() body: ProviderLinkDto
  ): Promise<ProviderLinkResponse> {
    const link = await this.cddService.getProviderLink(body);

    return new ProviderLinkResponse(link);
  }

  @Post('/email')
  async emailAddress(
    @Body() body: EmailDetailsDto
  ): Promise<boolean> {
    return this.cddService.processEmail(body);
  }
}
