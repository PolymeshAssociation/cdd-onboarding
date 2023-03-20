import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Logger } from 'winston';
import { BasicAuthGuard } from './basic-auth.guard';

const asBase64 = (value: string) => Buffer.from(value).toString('base64');

describe('BasicAuthGuard', () => {
  let ipFilterGuard: BasicAuthGuard;
  const allowedBasicAuth = ['someUser:somePassword'];

  beforeEach(() => {
    ipFilterGuard = new BasicAuthGuard(allowedBasicAuth, createMock<Logger>());
  });

  describe('canActivate', () => {
    it('should return true if the client Authorization header is included in the allowed basic auth', () => {
      const mockExecutionContext: ExecutionContext =
        createMock<ExecutionContext>({
          switchToHttp: () => ({
            getRequest: () => ({
              header: jest
                .fn()
                .mockReturnValue(`Bearer ${asBase64('someUser:somePassword')}`),
            }),
          }),
        });

      const canActivate = ipFilterGuard.canActivate(mockExecutionContext);
      expect(canActivate).toBe(true);
    });

    it('should return false if the client Authorization header is not included in the basic auth', () => {
      const mockExecutionContext: ExecutionContext =
        createMock<ExecutionContext>({
          switchToHttp: () => ({
            getRequest: () => ({
              header: jest
                .fn()
                .mockReturnValue(`Bearer ${asBase64('eve:badPassword')}`),
            }),
          }),
        });

      const canActivate = ipFilterGuard.canActivate(mockExecutionContext);
      expect(canActivate).toBe(false);
    });
  });
});
