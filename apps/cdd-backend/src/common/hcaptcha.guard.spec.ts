import { createMock } from '@golevelup/ts-jest';
import { Logger } from 'winston';
import { mockHttpContext } from '../test-utils/mocks';
import { HCaptchaGuard } from './hcaptcha.guard';
import { verify } from 'hcaptcha';

jest.mock('hcaptcha', () => ({
  verify: jest.fn(),
}));

describe('hCaptcha guard', () => {
  let hCaptchaGuard: HCaptchaGuard;
  let mockVerify: jest.MockedFunction<typeof verify>;

  beforeEach(() => {
    hCaptchaGuard = new HCaptchaGuard('someSecret', createMock<Logger>());
    mockVerify = (verify as jest.Mock).mockReset();
  });

  describe('canActivate', () => {
    it('should return true if hCaptcha token is valid', async () => {
      const httpContext = mockHttpContext('::1', '', {
        hCaptcha: 'someToken',
      });
      mockVerify.mockResolvedValue({ success: true });

      const canActivate = await hCaptchaGuard.canActivate(httpContext);

      expect(canActivate).toBe(true);
    });

    it('should return false if hCaptcha is not valid', async () => {
      const httpContext = mockHttpContext('::1', '', { hCaptcha: 'someToken' });
      mockVerify.mockResolvedValue({ success: false });

      const canActivate = await hCaptchaGuard.canActivate(httpContext);

      expect(canActivate).toBe(false);
    });

    it('should throw if hCaptcha is not provided', () => {
      const httpContext = mockHttpContext('::1', '', {});

      expect(hCaptchaGuard.canActivate(httpContext)).rejects.toThrow();
    });
  });
});
