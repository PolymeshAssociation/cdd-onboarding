import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Provider,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { verify } from 'hcaptcha';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

export const HCAPTCHA_GUARD_CREDENTIALS_PROVIDER = Symbol(
  'HCAPTCHA_GUARD_CREDENTIALS_PROVIDER'
);

export const HCaptchaGuardCredentialsProvider: Provider = {
  provide: HCAPTCHA_GUARD_CREDENTIALS_PROVIDER,
  useFactory: (config: ConfigService) =>
    config.getOrThrow<string[]>('hCaptcha.secretKey'),
  inject: [ConfigService],
};

@Injectable()
export class HCaptchaGuard implements CanActivate {
  isEnabled: boolean;

  constructor(
    @Inject(HCAPTCHA_GUARD_CREDENTIALS_PROVIDER)
    private readonly secretKey: string,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    config: ConfigService
  ) {
    this.isEnabled = config.getOrThrow('hCaptcha.isEnabled');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.isEnabled) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.body.hCaptcha;

    if (!token) {
      throw new HttpException(
        'hCaptcha token not provided',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const result = await verify(this.secretKey, token);

      this.logger.debug('hCaptcha verification result', result);

      if (result.success === true) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.logger.warn('hCaptcha verification failed', error);

      throw new HttpException(
        'hCaptcha verification failed',
        HttpStatus.FORBIDDEN
      );
    }
  }
}
