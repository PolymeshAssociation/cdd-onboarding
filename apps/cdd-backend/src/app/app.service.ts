import { GenerateLinkDto } from '@cdd-onboarding/cdd-types';
import { Injectable } from '@nestjs/common';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';

@Injectable()
export class AppService {
  constructor(private readonly sdk: Polymesh) {}

  async verifyAddress(address: string): Promise<boolean> {
    const account = await this.sdk.accountManagement.getAccount({ address });

    const identity = await account.getIdentity();
    if (identity) {
      return false;
    }

    return true;
  }

  async generateProviderLink({
    address,
    provider,
  }: GenerateLinkDto): Promise<string> {
    return `http://example.com/${address}/${provider}`;
  }
}
