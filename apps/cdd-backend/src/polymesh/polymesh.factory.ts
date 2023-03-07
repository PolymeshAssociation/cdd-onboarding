import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HashicorpVaultSigningManager } from '@polymeshassociation/hashicorp-vault-signing-manager';
import { LocalSigningManager } from '@polymeshassociation/local-signing-manager';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { SigningManager } from '@polymeshassociation/signing-manager-types';

export const polymeshFactory = async (
  configService: ConfigService
): Promise<Polymesh> => {
  let signingManager: SigningManager | undefined = undefined;

  const signer = configService.get('signer');
  if (signer) {
    if (signer.mnemonic) {
      signingManager = await LocalSigningManager.create({
        accounts: [{ mnemonic: signer.mnemonic }],
      });
    } else if (signer.vault) {
      signingManager = new HashicorpVaultSigningManager({
        url: signer.vault.url,
        token: signer.vault.token,
      });
    }
  }

  const sdk = await Polymesh.connect({
    nodeUrl: configService.getOrThrow('polymesh.nodeUrl'),
    signingManager,
  });

  if (signingManager instanceof HashicorpVaultSigningManager) {
    const key = signer.vault.key;
    const availableKeys = await signingManager.getVaultKeys();
    const signerKey = availableKeys.find(
      (availableKey) => availableKey.name === key
    );

    if (!signerKey) {
      throw new InternalServerErrorException(`'${key}' was not found in vault`);
    }

    sdk.setSigningAccount(signerKey.address);
  }

  return sdk;
};
