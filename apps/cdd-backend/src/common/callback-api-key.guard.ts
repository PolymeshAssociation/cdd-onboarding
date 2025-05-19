import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

export const CALLBACK_API_KEYS_PROVIDER = Symbol('CALLBACK_API_KEYS_PROVIDER');

@Injectable()
export class CallbackApiKeyGuard implements CanActivate {
  constructor(
    @Inject(CALLBACK_API_KEYS_PROVIDER)
    private readonly apiKeys: string[]
  ) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.apiKeys.length) {
      const request = context.switchToHttp().getRequest();
      const apiKey = request.query.apiKey;

      if (!apiKey) {
        throw new HttpException('API Key is required', HttpStatus.BAD_REQUEST);
      }

      if (!this.apiKeys.includes(apiKey)) {
        throw new HttpException('Invalid API Key', HttpStatus.UNAUTHORIZED);
      }
    }

    return true;
  }
}
