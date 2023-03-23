import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Logger } from 'winston';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

export const ALLOWED_IPS_PROVIDER = Symbol('ALLOWED_IPS_TOKEN');
@Injectable()
export class IpFilterGuard implements CanActivate {
  constructor(
    @Inject(ALLOWED_IPS_PROVIDER) private readonly allowedIPs: string[],
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientIp =
      request.header('x-real-ip') || request.connection.remoteAddress;

    const result = this.allowedIPs.includes(clientIp);

    this.logger.debug('filtered IP', { clientIp, result });

    return result;
  }
}
