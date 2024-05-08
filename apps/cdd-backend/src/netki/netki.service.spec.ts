import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { getQueueToken } from '@nestjs/bull';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { Job, Queue } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { of } from 'rxjs';
import { Logger } from 'winston';
import { AppRedisService } from '../app-redis/app-redis.service';
import { NetkiAccessLinkModel } from '../app-redis/models/netki-access-link.model';
import { CddJob } from '../cdd-worker/types';
import { NetkiService } from './netki.service';
import { NetkiCallbackDto } from './types';
import { bullJobOptions } from '../config/consts';

describe('NetkiService', () => {
  let service: NetkiService;
  let mockRedis: DeepMocked<AppRedisService>;
  let mockHttp: DeepMocked<HttpService>;
  let mockQueue: DeepMocked<Queue>;

  const mockConfig = createMock<ConfigService>(); // mock for constructor
  mockConfig.getOrThrow.mockReturnValue('https://example.com');

  const address = 'test-address';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AppRedisService,
          useValue: createMock<AppRedisService>(),
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
    mockRedis = module.get<typeof mockRedis>(AppRedisService);
    mockHttp = module.get<typeof mockHttp>(HttpService);
    mockQueue = module.get<typeof mockQueue>(getQueueToken(''));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exposedService = service as any;
    exposedService.businessId = 'mesh-test';
    exposedService.accessToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY3ODg5MzI1NiwianRpIjoiZDVjYzU0YjViNzgyNDA0YmJhYzM2ZDVkMDdmYzU1ZDIiLCJ1c2VyX2lkIjoiYWJkZWU2ZTQtM2I3Ny00YjI0LWEwMjUtOGVkNDAzNzM5NzAzIn0.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('popLink', () => {
    it('should return an access code', async () => {
      const mockCode = { id: '123', code: 'abc' } as NetkiAccessLinkModel;
      mockRedis.popNetkiAccessLink.mockResolvedValue(mockCode);

      const result = await service.allocateLinkForAddress(address);

      expect(result).toEqual({
        id: '123',
        code: 'abc',
        url: 'https://example.com?service_code=abc&applicationId=test-address',
      });
    });

    it('should throw if no code is returned from redis', async () => {
      mockRedis.popNetkiAccessLink.mockResolvedValue(null);

      return expect(service.allocateLinkForAddress(address)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('fetchAccessCodes', () => {
    const mockAccessResponse = {
      data: {
        access:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY3ODg5MzI1NiwianRpIjoiZDVjYzU0YjViNzgyNDA0YmJhYzM2ZDVkMDdmYzU1ZDIiLCJ1c2VyX2lkIjoiYWJkZWU2ZTQtM2I3Ny00YjI0LWEwMjUtOGVkNDAzNzM5NzAzIn0.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      },
    } as AxiosResponse;

    it('should return the amount fetched and total amount of codes', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              id: '123',
              code: 'abc',
              created: new Date().toISOString(),
              parent_code: null,
            },
            {
              id: '345',
              code: 'def',
              created: new Date().toISOString(),
              parent_code: null,
            },
          ],
        },
      } as AxiosResponse;

      jest.spyOn(mockHttp, 'get').mockImplementation(() => of(mockResponse));
      jest
        .spyOn(mockHttp, 'post')
        .mockImplementation(() => of(mockAccessResponse));

      mockRedis.getAllocatedNetkiCodes.mockResolvedValue(new Set(['def']));
      mockRedis.pushNetkiCodes.mockResolvedValue(1);

      const result = await service.fetchAccessCodes();

      expect(result).toEqual({ added: 1, total: 3 });
      expect(mockRedis.pushNetkiCodes).toHaveBeenCalledWith([
        expect.objectContaining({ code: 'abc' }),
      ]);
    });

    it('should loop through all of the pages', async () => {
      const mockPageOne = {
        data: {
          next: 'http://example.com?offset=1',
          results: [
            {
              id: '123',
              code: 'abc',
              created: new Date().toISOString(),
              parent_code: null,
            },
          ],
        },
      } as AxiosResponse;

      const mockPageTwo = {
        data: {
          next: null,
          results: [
            {
              id: '345',
              code: 'def',
              created: new Date().toISOString(),
              parent_code: null,
            },
          ],
        },
      } as AxiosResponse;

      jest
        .spyOn(mockHttp, 'post')
        .mockImplementation(() => of(mockAccessResponse));
      jest.spyOn(mockHttp, 'get').mockImplementationOnce(() => of(mockPageOne));
      jest.spyOn(mockHttp, 'get').mockImplementationOnce(() => of(mockPageTwo));

      mockRedis.getAllocatedNetkiCodes.mockResolvedValue(new Set());
      mockRedis.pushNetkiCodes.mockResolvedValue(1);

      const result = await service.fetchAccessCodes();

      expect(result).toEqual({ added: 2, total: 3 });
      expect(mockRedis.pushNetkiCodes).toHaveBeenCalledTimes(2);
    });
  });

  describe('queueCddJob', () => {
    it('should call the queue with a netki job', async () => {
      mockQueue.add.mockResolvedValue({} as Job<CddJob>);

      const fakeInfo = {} as NetkiCallbackDto;

      await service.queueCddJob(fakeInfo);

      expect(mockQueue.add).toHaveBeenCalledWith(
        {
          type: 'netki',
          value: fakeInfo,
        },
        bullJobOptions
      );
    });
  });
});
