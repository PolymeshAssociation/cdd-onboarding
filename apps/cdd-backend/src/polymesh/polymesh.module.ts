import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalSigningManager } from '@polymeshassociation/local-signing-manager';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      // Provide Polymesh SDK
      provide: Polymesh,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const signingManager = await LocalSigningManager.create({
          accounts: [
            { mnemonic: configService.getOrThrow('polymesh.mnemonic') },
          ],
        });

        return Polymesh.connect({
          ...configService.getOrThrow('polymesh'),
          signingManager,
        });
      },
    },
  ],

  exports: [Polymesh],
})
export class PolymeshModule {}
