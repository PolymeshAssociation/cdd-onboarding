import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { polymeshFactory } from './polymesh.factory';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: Polymesh,
      inject: [ConfigService],
      useFactory: polymeshFactory,
    },
  ],

  exports: [Polymesh],
})
export class PolymeshModule {}
