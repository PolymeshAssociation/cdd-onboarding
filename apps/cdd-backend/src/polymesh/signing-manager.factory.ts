import { ConfigService } from '@nestjs/config';
import { HashicorpVaultSigningManager } from '@polymeshassociation/hashicorp-vault-signing-manager';
import { LocalSigningManager } from '@polymeshassociation/local-signing-manager';
import { SigningManager } from '@polymeshassociation/signing-manager-types';

export const SIGNING_MANAGER_PROVIDER = Symbol('SIGNING_MANAGER');

export const signingManagerFactory = async (
  configService: ConfigService
): Promise<SigningManager> => {
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

  return signingManager;
};
