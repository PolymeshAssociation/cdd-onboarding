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
    console.log('in on module init...');
    if (isVaultSigner(this.signingManager)) {
      const keys = await this.signingManager.getVaultKeys();
      keys.forEach((key) => {
        if (key.name.includes('jumio')) {
          this.insertKey('jumio', key.address);
        }

        if (key.name.includes('netki')) {
          this.insertKey('netki', key.address);
        }

        if (key.name.includes('mock')) {
          this.insertKey('mock', key.address);
        }
      });
    } else {
      const [firstAccount] = await this.signingManager.getAccounts();
      this.addressBook['jumio'] = firstAccount;
      this.addressBook['netki'] = firstAccount;
      this.addressBook['mock'] = firstAccount;
    }
  }

  lookupSigningAddress(signer: 'jumio' | 'netki' | 'mock'): string {
    const signerAddress = this.addressBook[signer];
    if (!signerAddress) {
      throw new Error(`config error: key for '${signer}' was not found`);
    }

    return signerAddress;
  }

  insertKey(name: string, address: string): void {
    if (this.addressBook[name]) {
      throw new Error(
        `config error: multiple keys found containing '${name}' in their name`
      );
    }

    this.addressBook[name] = address;
  }
}

function isVaultSigner(
  signingManager: SigningManager | undefined
): signingManager is HashicorpVaultSigningManager {
  return (
    !!signingManager && signingManager instanceof HashicorpVaultSigningManager
  );
}
