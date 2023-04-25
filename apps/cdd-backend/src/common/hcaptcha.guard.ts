import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Provider,
} from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

export const HCAPTCHA_GUARD_CREDENTIALS_PROVIDER = Symbol('HCAPTCHA_GUARD_CREDENTIALS_PROVIDER');

export const HCaptchaGuardCredentialsProvider: Provider = {
  provide: HCAPTCHA_GUARD_CREDENTIALS_PROVIDER,
  useFactory: (config: ConfigService) => config.getOrThrow<string[]>('hCaptcha.secretKey'),
  inject: [ConfigService],
};


@Injectable()
export class HCaptchaGuard implements CanActivate {
  constructor(
    @Inject(HCAPTCHA_GUARD_CREDENTIALS_PROVIDER)
    private readonly secretKey: string,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const responseToken = request.body.hCaptcha;

    if (!responseToken) {
      throw new HttpException(
        'hCaptcha token not provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    const apiUrl = `https://hcaptcha.com/siteverify?secret=${this.secretKey}&response=${responseToken}`;

    try {
      const result = await axios.post(apiUrl);
      if (result.data.success) {
        return true;
      } else {
        throw new HttpException(
          'hCaptcha verification failed',
          HttpStatus.FORBIDDEN,
        );
      }
    } catch (error) {
      throw new HttpException(
        'hCaptcha verification failed',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}




