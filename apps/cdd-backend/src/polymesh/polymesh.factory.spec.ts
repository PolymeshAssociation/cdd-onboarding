import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { HashicorpVaultSigningManager } from '@polymeshassociation/hashicorp-vault-signing-manager';
import { LocalSigningManager } from '@polymeshassociation/local-signing-manager';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { polymeshFactory } from './polymesh.factory';

/**
 jest auto mock causes polkadot to print a multiple version warning. These are manually implemented to avoid the issue
*/
jest.mock('@polymeshassociation/polymesh-sdk', () => ({
  Polymesh: createMock<Polymesh>(),
}));

const getVaultKeyStub = jest.fn();
const mockHashicorpSigningManager = Object.create(
  HashicorpVaultSigningManager.prototype
);
Object.assign(mockHashicorpSigningManager, {
  ...createMock<HashicorpVaultSigningManager>(),
  getVaultKeys: getVaultKeyStub,
});

jest.mock('@polymeshassociation/hashicorp-vault-signing-manager', () => ({
  HashicorpVaultSigningManager: function () {
    return mockHashicorpSigningManager;
  },
}));

describe('polymesh factory', () => {
  let mockPolymesh: DeepMocked<Polymesh>;
  beforeEach(() => {
    mockPolymesh = createMock<Polymesh>();
  });

  let configService: DeepMocked<ConfigService>;
  const connectSpy = jest.spyOn(Polymesh, 'connect');

  beforeEach(() => {
    connectSpy.mockResolvedValue(mockPolymesh);
    configService = createMock<ConfigService>();
  });

  describe('with no configured signer', () => {
    beforeEach(() => {
      configService.get.mockReturnValue(undefined);
    });

    it('should call Polymesh.connect with LocalSigningManager with no keys added', async () => {
      const polymesh = await polymeshFactory(configService);

      expect(polymesh).toEqual(mockPolymesh);

      expect(connectSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          signingManager: expect.any(LocalSigningManager),
        })
      );

      // await expect(polymesh.getSigningIdentity()).rejects.toThrowError();
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
      getVaultKeyStub.mockResolvedValue([
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
          signingManager: mockHashicorpSigningManager,
        })
      );

      expect(mockPolymesh.setSigningAccount).toHaveBeenCalledWith(
        'test-address'
      );
    });

    it('should throw an error if the signing key is not found', async () => {
      getVaultKeyStub.mockResolvedValue([]);

      await expect(polymeshFactory(configService)).rejects.toThrowError();
    });
  });
});
