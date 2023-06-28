import { Inject, Injectable } from '@nestjs/common';
import { HashicorpVaultSigningManager } from '@polymeshassociation/hashicorp-vault-signing-manager';
import { SigningManager } from '@polymeshassociation/signing-manager-types';
import { SIGNING_MANAGER_PROVIDER } from './signing-manager.factory';

@Injectable()
export class AddressBookService {
  private addressBook: Record<string, string> = {};

  constructor(
    @Inject(SIGNING_MANAGER_PROVIDER)
    private readonly signingManager: SigningManager
  ) {}

  async onModuleInit(): Promise<void> {
    if (isVaultSigner(this.signingManager)) {
      const keys = await this.signingManager.getVaultKeys();
      keys.forEach((key) => {
        if (key.name.includes('jumio')) {
          this.insertAddress('jumio', key.address);
        }

        if (key.name.includes('netki')) {
          this.insertAddress('netki', key.address);
        }

        if (key.name.includes('mock')) {
          this.insertAddress('mock', key.address);
        }
      });
    } else {
      const [firstAccount] = await this.signingManager.getAccounts();
      this.insertAddress('jumio', firstAccount);
      this.insertAddress('netki', firstAccount);
      this.insertAddress('mock', firstAccount);
    }
  }

  public findAddress(signer: 'jumio' | 'netki' | 'mock'): string {
    const signerAddress = this.addressBook[signer];
    if (!signerAddress) {
      throw new Error(`config error: key for '${signer}' was not found`);
    }

    return signerAddress;
  }

  public insertAddress(name: string, address: string): void {
    if (this.addressBook[name]) {
      throw new Error(
        `config error: multiple keys found containing '${name}' in their name`
      );
    }

    this.addressBook[name] = address;
  }
}

const isVaultSigner = (
  signingManager: SigningManager | undefined
): signingManager is HashicorpVaultSigningManager => {
  return (
    !!signingManager && signingManager instanceof HashicorpVaultSigningManager
  );
};
