import { createMock } from '@golevelup/ts-jest';
import { Logger } from 'winston';
import { mockHttpContext } from '../test-utils/mocks';
import { BasicAuthGuard } from './basic-auth.guard';

const asBase64 = (value: string) => Buffer.from(value).toString('base64');

describe('BasicAuthGuard', () => {
  let basicAuthGuard: BasicAuthGuard;
  const allowedBasicAuth = ['someUser:somePassword'];

  beforeEach(() => {
    basicAuthGuard = new BasicAuthGuard(allowedBasicAuth, createMock<Logger>());
  });

  describe('canActivate', () => {
    it('should return true if the client Authorization header is included in the allowed basic auth', () => {
      const httpContext = mockHttpContext(
        '::1',
        `Bearer ${asBase64('someUser:somePassword')}`
      );
      const canActivate = basicAuthGuard.canActivate(httpContext);
      expect(canActivate).toBe(true);
    });

    it('should return false if the client Authorization header is not included in the basic auth', () => {
      const httpContext = mockHttpContext(
        '::1',
        `Bearer ${asBase64('eve:badPassword')}`
      );

      const canActivate = basicAuthGuard.canActivate(httpContext);
      expect(canActivate).toBe(false);
    });
  });
});
