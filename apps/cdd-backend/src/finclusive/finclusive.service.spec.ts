import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { FinclusiveService } from './finclusive.service';
import {
  FinclusiveAccessCode,
  FinclusiveAccessCodeTypeEnum,
  FinclusiveAccessToken,
  FinclusiveCallbackDto,
} from './types';

import { getQueueToken } from '@nestjs/bull';
import { InternalServerErrorException } from '@nestjs/common';
import { Job, Queue } from 'bull';
import individualClientDetails from '../test-utils/finclusive-http/individual-client-details.json';
import okAccessCodeResponse from '../test-utils/finclusive-http/ok-access-code-response.json';
import okAccessTokenResponse from '../test-utils/finclusive-http/ok-access-token-response.json';
import unauthorizedResponse from '../test-utils/finclusive-http/unauthorized.json';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CddJob } from '../cdd-worker/types';
import { bullJobOptions } from '../config/consts';

describe('FinclusiveService', () => {
  let service: FinclusiveService;
  let mockHttp: DeepMocked<HttpService>;
  let mockConfig: DeepMocked<ConfigService>;
  let mockQueue: DeepMocked<Queue>;
  let mockAccessTokenResponse: AxiosResponse<FinclusiveAccessToken>;
  let mockAccessCodeResponse: AxiosResponse<FinclusiveAccessCode>;

  beforeEach(async () => {
    mockConfig = createMock<ConfigService>();

    mockConfig.getOrThrow.mockImplementation((key: string) => {
      const configValue = {
        'finclusive.customerId': '140647882',
        'finclusive.url': 'https://partnerapimstagesandbox.azure-api.net',
        'finclusive.oauthUrl':
          'https://fincb2cStage.b2clogin.com/fincb2cStage.onmicrosoft.com',
        'finclusive.webformUrl': 'https://webforms.sandbox.finclusive.com',
        'finclusive.username': 'user@email.com',
        'finclusive.password': 'password',
        'finclusive.clientId': 'c84b828e-cd67-4115-a980-0584c98f1ac9',
        'finclusive.partnerId': 'B2C_1_sandboxROPC',
        'finclusive.subscriptionKey': 'someKey',
        'finclusive.allowedIps': '40.89.251.223',
      };
      return configValue[key as keyof typeof configValue];
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinclusiveService,
        { provide: HttpService, useValue: createMock<HttpService>() },
        { provide: ConfigService, useValue: mockConfig },
        { provide: getQueueToken(), useValue: createMock<Queue>() },
        { provide: WINSTON_MODULE_PROVIDER, useValue: createMock<Logger>() },
      ],
    }).compile();

    service = module.get<FinclusiveService>(FinclusiveService);
    mockHttp = module.get<typeof mockHttp>(HttpService);
    mockQueue = module.get<typeof mockQueue>(getQueueToken(''));

    mockAccessTokenResponse = {
      data: okAccessTokenResponse,
      headers: {},
      config: { url: '', headers: createMock<AxiosHeaders>() },
      status: 200,
      statusText: 'Ok',
    };

    mockAccessCodeResponse = {
      data: okAccessCodeResponse,
      headers: {},
      config: { url: '', headers: createMock<AxiosHeaders>() },
      status: 200,
      statusText: 'Ok',
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateLink', () => {
    const configuredUrl = 'https://example.com';

    it('should throw an InternalServerException if finclusive returns an error while fetching access token', async () => {
      const mockResponse: AxiosResponse = {
        data: unauthorizedResponse,
        headers: {},
        config: { url: '', headers: createMock<AxiosHeaders>() },
        status: 401,
        statusText: 'Unauthorized',
      };

      jest.spyOn(mockHttp, 'post').mockImplementation(() => of(mockResponse));

      mockConfig.getOrThrow.mockReturnValue(configuredUrl);

      await expect(service.generateLink()).rejects.toThrow(
        InternalServerErrorException
      );
    });

    it('should throw an InternalServerException if finclusive returns an error while creating new access code', async () => {
      const mockResponse: AxiosResponse = {
        data: unauthorizedResponse,
        headers: {},
        config: { url: '', headers: createMock<AxiosHeaders>() },
        status: 401,
        statusText: 'Unauthorized',
      };

      jest
        .spyOn(mockHttp, 'post')
        .mockImplementationOnce(() => of(mockAccessTokenResponse))
        .mockImplementationOnce(() => of(mockResponse));

      await expect(service.generateLink()).rejects.toThrow(
        InternalServerErrorException
      );
    });

    it('should make an http request to the create new access code', async () => {
      const postSpy = jest
        .spyOn(mockHttp, 'post')
        .mockImplementationOnce(() => of(mockAccessTokenResponse))
        .mockImplementationOnce(() => of(mockAccessCodeResponse));

      const expectedHeaders = {
        headers: {
          Authorization: `Bearer ${okAccessTokenResponse.access_token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          'Ocp-Apim-Subscription-Key': 'someKey',
        },
      };

      const response = await service.generateLink(
        FinclusiveAccessCodeTypeEnum.INDIVIDUAL
      );

      expect(response).toEqual(
        expect.objectContaining({
          url: expect.stringContaining(
            `/individual.html?accessCode=${okAccessCodeResponse.value}`
          ),
          ...okAccessCodeResponse,
        })
      );

      expect(postSpy).toHaveBeenCalledWith(
        'https://partnerapimstagesandbox.azure-api.net/customer/WebformAccessCodeManagement/accesscode',
        {
          description: '',
          isMultipleUse: true,
          type: FinclusiveAccessCodeTypeEnum.INDIVIDUAL,
          expiresAt: expect.any(String),
        },
        expectedHeaders
      );
    });
  });

  describe('queueApplication', () => {
    it('should call the queue with a finclusive job', async () => {
      const mockGetClientDetailsResponse = {
        data: individualClientDetails,
        headers: {},
        config: { url: '', headers: createMock<AxiosHeaders>() },
        status: 200,
        statusText: 'Ok',
      };

      const expectedHeaders = {
        headers: {
          Authorization: `Bearer ${okAccessTokenResponse.access_token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          'Ocp-Apim-Subscription-Key': 'someKey',
        },
      };

      jest
        .spyOn(mockHttp, 'post')
        .mockImplementation(() => of(mockAccessTokenResponse));

      const getSpy = jest
        .spyOn(mockHttp, 'get')
        .mockImplementation(() => of(mockGetClientDetailsResponse));

      mockQueue.add.mockResolvedValue({} as Job<CddJob>);

      const fakeInfo = {
        FinClusiveID: '140651058',
      } as FinclusiveCallbackDto;

      await service.queueApplication(fakeInfo, 'ClientComplianceStatusChange');

      expect(getSpy).toHaveBeenCalledWith(
        'https://partnerapimstagesandbox.azure-api.net/customer/140647882/client/140651058',
        expectedHeaders
      );

      expect(mockQueue.add).toHaveBeenCalledWith(
        {
          type: 'finclusive',
          value: {
            ...fakeInfo,
            notificationType: 'ClientComplianceStatusChange',
            address:
              individualClientDetails.individual.customAttributes[0].value,
            name: 'First Name Last Name',
          },
        },
        bullJobOptions
      );
    });
  });
});
