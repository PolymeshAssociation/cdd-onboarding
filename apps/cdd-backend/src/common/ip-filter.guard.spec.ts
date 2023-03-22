import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Logger } from 'winston';
import { IpFilterGuard } from './ip-filter.guard';

describe('IpFilterGuard', () => {
  let ipFilterGuard: IpFilterGuard;
  const allowedIp = ['192.168.1.1'];

  beforeEach(() => {
    ipFilterGuard = new IpFilterGuard(allowedIp, createMock<Logger>());
  });

  describe('canActivate', () => {
    it('should return true if the client IP is included in the allowed IPs', () => {
      const mockExecutionContext: ExecutionContext =
        createMock<ExecutionContext>({
          switchToHttp: () => ({
            getRequest: () => ({
              header: jest.fn(),
              connection: {
                remoteAddress: '192.168.1.1',
              },
            }),
          }),
        });

      const canActivate = ipFilterGuard.canActivate(mockExecutionContext);
      expect(canActivate).toBe(true);
    });

    it('should return true if the client IP is included in the x-forwarded-header', () => {
      const mockExecutionContext: ExecutionContext =
        createMock<ExecutionContext>({
          switchToHttp: () => ({
            getRequest: () => ({
              header: jest.fn().mockReturnValue('192.168.1.1'),
              connection: {
                remoteAddress: '::1',
              },
            }),
          }),
        });

      const canActivate = ipFilterGuard.canActivate(mockExecutionContext);
      expect(canActivate).toBe(true);
    });

    it('should return false if the client IP is not included in the allowed IPs', () => {
      const mockExecutionContext: ExecutionContext =
        createMock<ExecutionContext>({
          switchToHttp: () => ({
            getRequest: () => ({
              header: jest.fn(),
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
