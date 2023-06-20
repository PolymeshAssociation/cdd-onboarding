import { Module } from '@nestjs/common';
import { MockCddService } from './mock-cdd.service';
import { MockCddController } from './mock-cdd.controller';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [BullModule.registerQueue({})],
  providers: [MockCddService],
  controllers: [MockCddController],
})
export class MockCddModule {}
