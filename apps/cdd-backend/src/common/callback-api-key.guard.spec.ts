import { HttpException, HttpStatus } from '@nestjs/common';
import { mockHttpContext } from '../test-utils/mocks';
import { CallbackApiKeyGuard } from './callback-api-key.guard';

describe('CallbackApiKeyGuard', () => {
  let guard: CallbackApiKeyGuard;
  const validApiKeys = ['valid-key-1', 'valid-key-2'];

  beforeEach(() => {
    guard = new CallbackApiKeyGuard(validApiKeys);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if the valid api key is provided in the query params', () => {
      const httpContext = mockHttpContext(
        '::1',
        '',
        {},
        {
          apiKey: 'valid-key-1',
        }
      );
      const canActivate = guard.canActivate(httpContext);
      expect(canActivate).toBe(true);
    });

    it('should throw BAD_REQUEST when no API key is provided', () => {
      const httpContext = mockHttpContext('::1', '', {}, { apiKey: undefined });

      expect(() => guard.canActivate(httpContext)).toThrow(
        new HttpException('API Key is required', HttpStatus.BAD_REQUEST)
      );
    });

    it('should throw UNAUTHORIZED when an invalid API key is provided', () => {
      const httpContext = mockHttpContext('::1', '', {}, { apiKey: 'BAD-KEY' });

      expect(() => guard.canActivate(httpContext)).toThrow(
        new HttpException('Invalid API Key', HttpStatus.UNAUTHORIZED)
      );
    });
  });
});
