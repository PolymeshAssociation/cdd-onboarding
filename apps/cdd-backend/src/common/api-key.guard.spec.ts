import { mockHttpContext } from '../test-utils/mocks';
import { ApiKeyGuard } from './api-key.guard';

describe('ApiKeyGuard', () => {
  let apiKeyGuard: ApiKeyGuard;
  const allowedApiKeys = ['someApiKey'];

  beforeEach(() => {
    apiKeyGuard = new ApiKeyGuard(allowedApiKeys);
  });

  describe('canActivate', () => {
    it('should return true if the client Authorization header is included in the allowed basic auth', () => {
      const httpContext = mockHttpContext('::1', 'Bearer someApiKey', {});
      const canActivate = apiKeyGuard.canActivate(httpContext);
      expect(canActivate).toBe(true);
    });

    it('should return false if the client Authorization header is not included in the basic auth', () => {
      const httpContext = mockHttpContext('::1', 'Bearer BAD-KEY', {});

      const canActivate = apiKeyGuard.canActivate(httpContext);
      expect(canActivate).toBe(false);
    });
  });
});
