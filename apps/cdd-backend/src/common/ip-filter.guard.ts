import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Logger } from 'winston';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

export const ALLOWED_IPS_TOKEN = Symbol('ALLOWED_IPS');
@Injectable()
export class IpFilterGuard implements CanActivate {
  constructor(
    @Inject(ALLOWED_IPS_TOKEN) private readonly allowedIPs: string[],
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientIp =
      request.headers['x-forwarded-for'] || request.connection.remoteAddress;

    const result = this.allowedIPs.includes(clientIp);

    this.logger.debug('checked webhook IP', { clientIp, result });

    return result;
  }
}
