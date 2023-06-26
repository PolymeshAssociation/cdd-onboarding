import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { SigningManager } from '@polymeshassociation/signing-manager-types';
import { AddressBookService } from './address-book.service';
import {
  signingManagerFactory,
  SIGNING_MANAGER_PROVIDER,
} from './signing-manager.factory';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SIGNING_MANAGER_PROVIDER,
      inject: [ConfigService],
      useFactory: signingManagerFactory,
    },
    {
      provide: Polymesh,
      inject: [
        ConfigService,
        { token: SIGNING_MANAGER_PROVIDER, optional: false },
      ],
      useFactory: (
        configService: ConfigService,
        signingManager: SigningManager
      ): Promise<Polymesh> => {
        return Polymesh.connect({
          nodeUrl: configService.getOrThrow('polymesh.nodeUrl'),
          signingManager,
        });
      },
    },
    AddressBookService,
  ],

  exports: [Polymesh, AddressBookService],
})
export class PolymeshModule {}
