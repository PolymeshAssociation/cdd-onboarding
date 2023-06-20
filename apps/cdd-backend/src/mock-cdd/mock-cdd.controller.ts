import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MockCddService } from './mock-cdd.service';
import { MockCddDto } from './types';

@Controller('mock-cdd')
@ApiTags('mockCdd')
export class MockCddController {
  constructor(private readonly mockCddService: MockCddService) {}

  @Post('/')
  async submitMockCdd(@Body() body: MockCddDto) {
    await this.mockCddService.queueMockCddJob(body);
  }
}
