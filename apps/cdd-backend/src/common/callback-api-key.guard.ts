import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

export const CALLBACK_API_KEYS_PROVIDER = Symbol('CALLBACK_API_KEYS_PROVIDER');

@Injectable()
export class CallbackApiKeyGuard implements CanActivate {
  constructor(
    @Inject(CALLBACK_API_KEYS_PROVIDER)
    private readonly apiKeys: string[],
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.apiKeys.length) {
      const request = context.switchToHttp().getRequest();
      const apiKey = request.query.apiKey;
      const clientIp =
        request.header('x-forwarded-for') ?? request.connection.remoteAddress;

      if (!apiKey) {
        this.logger.error(
          `No API Key provided. Request received from IP: ${clientIp}`
        );
        throw new HttpException('API Key is required', HttpStatus.BAD_REQUEST);
      }

      if (!this.apiKeys.includes(apiKey)) {
        this.logger.error(
          `Invalid API Key "${apiKey}" provided. Request received from IP: ${clientIp}`
        );
        throw new HttpException('Invalid API Key', HttpStatus.UNAUTHORIZED);
      }
    }

    return true;
  }
}
