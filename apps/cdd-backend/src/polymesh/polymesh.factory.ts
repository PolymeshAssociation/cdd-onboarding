import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HashicorpVaultSigningManager } from '@polymeshassociation/hashicorp-vault-signing-manager';
import { LocalSigningManager } from '@polymeshassociation/local-signing-manager';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { SigningManager } from '@polymeshassociation/signing-manager-types';

export const signerKeyMap: Record<string, string> = {};

export const polymeshFactory = async (
  configService: ConfigService
): Promise<Polymesh> => {
  let signingManager: SigningManager;

  const signer = configService.get('signer') || {};

  if (signer.vault) {
    signingManager = new HashicorpVaultSigningManager({
      url: signer.vault.url,
      token: signer.vault.token,
    });
  } else {
    const accounts = signer.mnemonic ? [{ mnemonic: signer.mnemonic }] : [];
    signingManager = await LocalSigningManager.create({
      accounts,
    });
  }

  const sdk = await Polymesh.connect({
    nodeUrl: configService.getOrThrow('polymesh.nodeUrl'),
    signingManager,
  });

  if (isVaultSigner(signingManager)) {
    const availableKeys = await signingManager.getVaultKeys();

    availableKeys.forEach((key) => {
      if (key.name.includes('jumio')) {
        signerKeyMap['jumio'] = key.address;
      }
      if (key.name.includes('netki')) {
        signerKeyMap['netki'] = key.address;
      }
      if (key.name.includes('mock')) {
        signerKeyMap['mock'] = key.address;
      }
    });

    if (!signerKeyMap.jumio) {
      throw new InternalServerErrorException(
        'Jumio key must be set when using vault signer (vault should have a key with "jumio" in the name)'
      );
    }

    if (!signerKeyMap.netki) {
      throw new InternalServerErrorException(
        'Netki key must be set when using vault signer (vault should have a key with "netki" in the name)'
      );
    }
  } else {
    // when using a local signer use the same key for all accounts
    const [signingAddress] = await signingManager.getAccounts();
    signerKeyMap['jumio'] = signingAddress;
    signerKeyMap['netki'] = signingAddress;
    signerKeyMap['mock'] = signingAddress;
  }

  return sdk;
};

function isVaultSigner(
  signingManager: SigningManager | undefined
): signingManager is HashicorpVaultSigningManager {
  return (
    !!signingManager && signingManager instanceof HashicorpVaultSigningManager
  );
}
