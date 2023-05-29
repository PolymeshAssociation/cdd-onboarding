import {
  ProviderLinkDto,
  VerifyAddressDto,
  VerifyAddressResponse,
  ProviderLinkResponse,
  EmailDetailsDto,
} from '@cdd-onboarding/cdd-types';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CddApplicationModel } from '../app-redis/models/cdd-application.model';
import { HCaptchaGuard } from '../common/hcaptcha.guard';
import { CddService } from './cdd.service';

@Controller('')
@ApiTags('user')
@UseGuards(HCaptchaGuard)
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

  @Get('/:address/applications')
  async addressApplications(address: string): Promise<CddApplicationModel[]> {
    return this.cddService.getApplications(address);
  }
}
