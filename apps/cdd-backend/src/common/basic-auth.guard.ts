import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Logger } from 'winston';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

const authHeader = 'Authorization';

export const BASIC_AUTH_CREDENTIALS_PROVIDER = Symbol(
  'BASIC_AUTH_CREDENTIALS_PROVIDER'
);

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(
    @Inject(BASIC_AUTH_CREDENTIALS_PROVIDER)
    private readonly allowedBasicAuth: string[],
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const rawClientAuth: string | undefined = request.header(authHeader);

    if (!rawClientAuth) {
      return false;
    }

    const clientAuth = Buffer.from(
      // Netki sends "Bearer ", but curl uses "Basic "
      rawClientAuth.replace('Bearer ', '').replace('Basic ', ''),
      'base64'
    ).toString();

    const result =
      !!rawClientAuth && this.allowedBasicAuth.includes(clientAuth);

    this.logger.debug('checked basic auth', {
      result,
    });

    return result;
  }
}
