import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppBullModule } from '../app-bull/app-bull.module';
import { JumioController } from './jumio.controller';
import { JumioService } from './jumio.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    AppBullModule,
    BullModule.registerQueue({ name: 'cdd' }),
  ],
  controllers: [JumioController],
  providers: [JumioService, { provide: Logger, useValue: new Logger('Jumio') }],
  exports: [JumioService],
})
export class JumioModule {}
