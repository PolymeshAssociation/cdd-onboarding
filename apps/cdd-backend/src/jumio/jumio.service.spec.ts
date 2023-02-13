import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { getQueueToken } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { Queue } from 'bull';
import { of } from 'rxjs';
import { JumioService } from './jumio.service';
import { JumioGenerateLinkResponse } from './types';

import v4OKResponse from './recorded-responses/v4-initiate-ok.json';
import unauthorizedResponse from './recorded-responses/unauthorized.json';
import { InternalServerErrorException, Logger } from '@nestjs/common';

describe('JumioService', () => {
  let service: JumioService;
  const mockHttp = createMock<HttpService>();
  const mockConfig = createMock<ConfigService>();
  const mockQueue = createMock<Queue>();
  const mockLogger = createMock<Logger>();

  const address = 'someAddress';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JumioService,
        { provide: HttpService, useValue: mockHttp },
        { provide: ConfigService, useValue: mockConfig },
        { provide: getQueueToken('cdd'), useValue: mockQueue },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<JumioService>(JumioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateLink', () => {
    const id = 'someUUID';
    const configuredUrl = 'https://example.com';
    it('should make an http request to the configured endpoint', async () => {
      const expectedHeaders = {
        headers: {
          Accept: 'application/json',
          Authorization: 'Basic https://example.com',
          'Content-Type': 'application/json',
          'User-Agent': 'Polymesh CDD Onboarding/v1.0',
        },
      };

      const mockResponse: AxiosResponse<JumioGenerateLinkResponse> = {
        data: v4OKResponse,
        headers: {},
        config: { url: '', headers: createMock<AxiosHeaders>() },
        status: 200,
        statusText: 'OK',
      };

      const postSpy = jest
        .spyOn(mockHttp, 'post')
        .mockImplementation(() => of(mockResponse));

      mockConfig.getOrThrow.mockReturnValue(configuredUrl);

      const response = await service.generateLink(id, address);

      expect(response).toEqual(
        expect.objectContaining({
          redirectUrl: expect.stringContaining('https://'),
          transactionReference: expect.any(String),
        })
      );

      expect(postSpy).toHaveBeenCalledWith(
        configuredUrl,
        JSON.stringify({
          customerInternalReference: id,
          userReference: address,
        }),
        expectedHeaders
      );
    });

    it('should throw an InternalServerException if jumio returns an error', async () => {
      const mockResponse: AxiosResponse = {
        data: unauthorizedResponse,
        headers: {},
        config: { url: '', headers: createMock<AxiosHeaders>() },
        status: 401,
        statusText: 'Unauthorized',
      };

      jest.spyOn(mockHttp, 'post').mockImplementation(() => of(mockResponse));

      mockConfig.getOrThrow.mockReturnValue(configuredUrl);

      await expect(service.generateLink(id, address)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
});
