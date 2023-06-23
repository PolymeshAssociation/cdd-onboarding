import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { HashicorpVaultSigningManager } from '@polymeshassociation/hashicorp-vault-signing-manager';
import { LocalSigningManager } from '@polymeshassociation/local-signing-manager';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { polymeshFactory, signerKeyMap } from './polymesh.factory';

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
  setSs58Format: jest.fn(),
});

jest.mock('@polymeshassociation/hashicorp-vault-signing-manager', () => ({
  HashicorpVaultSigningManager: function () {
    return mockHashicorpSigningManager;
  },
}));

describe('polymesh factory', () => {
  let mockPolymesh: DeepMocked<Polymesh>;
  let configService: DeepMocked<ConfigService>;
  const connectSpy = jest.spyOn(Polymesh, 'connect');

  beforeEach(() => {
    mockPolymesh = createMock<Polymesh>();
    configService = createMock<ConfigService>();

    connectSpy.mockImplementation(async ({ signingManager }) => {
      if (signingManager) {
        console.log(signingManager);
        signingManager.setSs58Format(42);
      }
      return mockPolymesh;
    });
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
    beforeEach(() => {
      configService.get.mockReturnValue({
        vault: {
          url: 'http://example.com',
          token: 'someSecret',
        },
      });
    });

    it('should call Polymesh.connect with a HashicorpVaultSigningManager', async () => {
      getVaultKeyStub.mockResolvedValue([
        {
          address: 'jumio-test-address',
          name: 'jumio-signing-key',
          publicKey: '0x00',
          version: 1,
        },
        {
          address: 'netki-test-address',
          name: 'netki-signing-key',
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

      expect(signerKeyMap['jumio']).toEqual('jumio-test-address');
      expect(signerKeyMap['netki']).toEqual('netki-test-address');
    });

    it('should throw an error if the jumio key is not found', async () => {
      delete signerKeyMap.jumio;

      getVaultKeyStub.mockResolvedValue([]);

      await expect(polymeshFactory(configService)).rejects.toThrowError();
    });

    it('should throw an error if the netki key is not found', async () => {
      delete signerKeyMap.netki;

      getVaultKeyStub.mockResolvedValue([]);

      await expect(polymeshFactory(configService)).rejects.toThrowError();
    });
  });
});
