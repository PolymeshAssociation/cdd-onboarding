import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { SigningManager } from '@polymeshassociation/signing-manager-types';
import { AddressBookService } from './address-book.service';
import { SIGNING_MANAGER_PROVIDER } from './signing-manager.factory';

describe('AddressBookService', () => {
  let service: AddressBookService;
  let mockSigningManager: DeepMocked<SigningManager>;

  beforeEach(async () => {
    mockSigningManager = createMock<SigningManager>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressBookService,
        {
          provide: SIGNING_MANAGER_PROVIDER,
          useValue: mockSigningManager,
        },
      ],
    }).compile();

    service = module.get<AddressBookService>(AddressBookService);
    mockSigningManager = module.get<typeof mockSigningManager>(
      SIGNING_MANAGER_PROVIDER
    );

    mockSigningManager.getAccounts.mockResolvedValue(['someAddress']);

    // triggers `onModuleInit` hook
    module.createNestApplication().init();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAddress', () => {
    it('should find a known address', () => {
      const result = service.findAddress('jumio');

      expect(result).toBeDefined();
    });

    it('should throw if address is not found', () => {
      const expectedError = new Error(
        "config error: key for 'not-a-provider' was not found"
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => service.findAddress('not-a-provider' as any)).toThrow(
        expectedError
      );
    });
  });

  describe('insertAddress', () => {
    it('should throw on key name collision', () => {
      service.insertAddress('some-key', 'someAddress');

      const expectedError = new Error(
        "config error: multiple keys found containing 'some-key' in their name"
      );

      expect(() => service.insertAddress('some-key', 'someAddress')).toThrow(
        expectedError
      );
    });
  });
});
