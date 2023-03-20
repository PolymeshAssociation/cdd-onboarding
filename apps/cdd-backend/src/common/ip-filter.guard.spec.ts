import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { IpFilterGuard } from './ip-filter.guard';

describe('IpFilterGuard', () => {
  let ipFilterGuard: IpFilterGuard;
  let mockConfigService: DeepMocked<ConfigService>;
  const allowedIp = ['192.168.1.1'];

  beforeEach(() => {
    ipFilterGuard = new IpFilterGuard(allowedIp, createMock<Logger>());
    mockConfigService = createMock<ConfigService>();
  });

  describe('canActivate', () => {
    it('should return true if the client IP is included in the allowed IPs', () => {
      const mockExecutionContext: ExecutionContext =
        createMock<ExecutionContext>({
          switchToHttp: () => ({
            getRequest: () => ({
              headers: {},
              connection: {
                remoteAddress: '192.168.1.1',
              },
            }),
          }),
        });

      const canActivate = ipFilterGuard.canActivate(mockExecutionContext);
      expect(canActivate).toBe(true);
    });

    it('should return false if the client IP is not included in the allowed IPs', () => {
      mockConfigService.get.mockReturnValue(['192.168.1.1']);
      const mockExecutionContext: ExecutionContext =
        createMock<ExecutionContext>({
          switchToHttp: () => ({
            getRequest: () => ({
              headers: {},
              connection: {
                remoteAddress: '192.168.1.2',
              },
            }),
          }),
        });

      const canActivate = ipFilterGuard.canActivate(mockExecutionContext);
      expect(canActivate).toBe(false);
    });
  });
});
