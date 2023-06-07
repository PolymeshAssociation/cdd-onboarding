import {
  ProviderLinkDto,
  VerifyAddressDto,
  VerifyAddressResponse,
  ProviderLinkResponse,
  EmailDetailsDto,
  AddressApplicationsResponse,
  AddressApplicationsParamsDto,
} from '@cdd-onboarding/cdd-types';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HCaptchaGuard } from '../common/hcaptcha.guard';
import { CddService } from './cdd.service';

@Controller('')
@ApiTags('user')
export class CddController {
  constructor(private readonly cddService: CddService) {}

  @ApiOkResponse({
    type: VerifyAddressResponse,
  })
  @ApiBadRequestResponse({
    description:
      'Address is not valid ss58 for the network (prefixed with 12 for mainnet, 42 otherwise)',
  })
  @Post('/verify-address')
  async verifyAddress(
    @Body() { address }: VerifyAddressDto
  ): Promise<VerifyAddressResponse> {
    return this.cddService.verifyAddress(address);
  }

  @Post('/provider-link')
  @UseGuards(HCaptchaGuard)
  async providerLink(
    @Body() body: ProviderLinkDto
  ): Promise<ProviderLinkResponse> {
    const link = await this.cddService.getProviderLink(body);

    return new ProviderLinkResponse(link);
  }

  @Post('/email')
  async emailAddress(@Body() body: EmailDetailsDto): Promise<boolean> {
    return this.cddService.processEmail(body);
  }

  @ApiOperation({
    summary: 'Fetch address applications',
  })
  @Get('/applications/:address')
  async getApplications(
    @Param() { address }: AddressApplicationsParamsDto
  ): Promise<AddressApplicationsResponse> {
    return this.cddService.getApplications(address);
  }
}
