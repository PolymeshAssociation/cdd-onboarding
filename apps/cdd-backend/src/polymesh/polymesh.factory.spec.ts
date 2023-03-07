import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { HashicorpVaultSigningManager } from '@polymeshassociation/hashicorp-vault-signing-manager';
import { LocalSigningManager } from '@polymeshassociation/local-signing-manager';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { polymeshFactory } from './polymesh.factory';

jest.mock('@polymeshassociation/polymesh-sdk');
jest.mock('@polymeshassociation/hashicorp-vault-signing-manager');

describe('polymesh factory', () => {
  const mockPolymesh = createMock<Polymesh>();

  let configService: DeepMocked<ConfigService>;
  const connectSpy = jest.spyOn(Polymesh, 'connect');
  const getVaultKeysSpy = jest.spyOn(
    HashicorpVaultSigningManager.prototype,
    'getVaultKeys'
  );

  beforeEach(() => {
    connectSpy.mockResolvedValue(mockPolymesh);
    configService = createMock<ConfigService>();
  });

  describe('with no signer', () => {
    beforeEach(() => {
      configService.get.mockReturnValue(undefined);
    });

    it('should call Polymesh.connect with `undefined` SigningManager', async () => {
      const polymesh = await polymeshFactory(configService);

      expect(polymesh).toEqual(mockPolymesh);

      expect(connectSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          signingManager: undefined,
        })
      );
    });
  });

  describe('with local signer config', () => {
    beforeEach(() => {
      configService.get.mockReturnValue({
        mnemonic: '//Alice',
      });
    });

    it('should call Polymesh.connect with a LocalSigningManager', async () => {
      const polymesh = await polymeshFactory(configService);

      expect(polymesh).toEqual(mockPolymesh);

      expect(connectSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          signingManager: expect.any(LocalSigningManager),
        })
      );
    });
  });

  describe('with hashicorp vault signer', () => {
    const signingKeyName = 'signing-key';

    beforeEach(() => {
      configService.get.mockReturnValue({
        vault: {
          url: 'http://example.com',
          token: 'someSecret',
          key: signingKeyName,
        },
      });
    });

    it('should call Polymesh.connect with a HashicorpVaultSigningManager', async () => {
      getVaultKeysSpy.mockResolvedValue([
        {
          address: 'test-address',
          name: signingKeyName,
          publicKey: '0x00',
          version: 1,
        },
      ]);

      const polymesh = await polymeshFactory(configService);

      expect(polymesh).toEqual(mockPolymesh);

      expect(connectSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          signingManager: expect.any(HashicorpVaultSigningManager),
        })
      );

      expect(mockPolymesh.setSigningAccount).toHaveBeenCalledWith(
        'test-address'
      );
    });

    it('should throw an error if the signing key is not found', async () => {
      getVaultKeysSpy.mockResolvedValue([]);

      await expect(polymeshFactory(configService)).rejects.toThrowError();
    });
  });
});
