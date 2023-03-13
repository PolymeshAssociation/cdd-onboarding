import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { getQueueToken } from '@nestjs/bull';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { Job, Queue } from 'bull';
import Redis from 'ioredis';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { of } from 'rxjs';
import { Logger } from 'winston';
import { CddJob } from '../cdd-worker/types';
import { NetkiService } from './netki.service';
import { netkiAllocatedPrefixer, NetkiCallbackDto } from './types';

describe('NetkiService', () => {
  let service: NetkiService;
  let mockRedis: DeepMocked<Redis>;
  let mockHttp: DeepMocked<HttpService>;
  let mockQueue: DeepMocked<Queue>;

  const mockConfig = createMock<ConfigService>(); // mock for constructor
  mockConfig.getOrThrow.mockReturnValue('https://example.com');

  const address = 'test-address';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Redis,
          useValue: createMock<Redis>(),
        },
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: createMock<Logger>(),
        },
        {
          provide: getQueueToken(''),
          useValue: createMock<Queue>(),
        },
        {
          provide: ConfigService,
          useValue: mockConfig,
        },
        NetkiService,
      ],
    }).compile();

    service = module.get<NetkiService>(NetkiService);
    mockRedis = module.get<typeof mockRedis>(Redis);
    mockHttp = module.get<typeof mockHttp>(HttpService);
    mockQueue = module.get<typeof mockQueue>(getQueueToken(''));

    mockConfig.getOrThrow.mockReturnValue('http://example.com/');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exposedService = service as any;
    exposedService.businessId = 'mesh-test';
    exposedService.accessToken = 'test-token';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('popLink', () => {
    it('should return an access code', async () => {
      const mockCode = ['{"id": "123", "code": "abc"}'];
      mockRedis.spop.mockResolvedValue(mockCode);
      mockRedis.set.mockResolvedValue('OK');

      const result = await service.popLink(address);

      expect(mockRedis.set).toHaveBeenCalledWith(
        netkiAllocatedPrefixer('abc'),
        address
      );

      expect(result).toEqual({
        id: '123',
        code: 'abc',
        url: 'http://example.com/?service_code=abc&applicationId=cG9seW1lc2hDZGQ=',
      });
    });

    it('should throw if no code is returned from redis', async () => {
      mockRedis.spop.mockResolvedValue([]);

      return expect(service.popLink(address)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('fetchAccessCodes', () => {
    it('should return the amount fetched and total amount of codes', async () => {
      const mockResponse = {
        data: {
          results: [
            { id: '123', code: 'abc', created: new Date().toISOString() },
          ],
        },
      } as AxiosResponse;
      const mockAccessResponse = {
        data: {
          access: 'fake-access-token',
        },
      } as AxiosResponse;

      jest.spyOn(mockHttp, 'get').mockImplementation(() => of(mockResponse));
      jest
        .spyOn(mockHttp, 'post')
        .mockImplementation(() => of(mockAccessResponse));
      mockRedis.keys.mockResolvedValue([]);
      mockRedis.sadd.mockResolvedValue(1);
      mockRedis.scard.mockResolvedValue(3);

      const result = await service.fetchAccessCodes();

      expect(result).toEqual({ fetched: 1, total: 3 });
    });
  });

  describe('queueCddJob', () => {
    it('should call the queue with a netki job', async () => {
      mockQueue.add.mockResolvedValue({} as Job<CddJob>);

      const fakeInfo = {} as NetkiCallbackDto;

      await service.queueCddJob(fakeInfo);

      expect(mockQueue.add).toHaveBeenCalledWith({
        type: 'netki',
        value: fakeInfo,
      });
    });
  });
});
