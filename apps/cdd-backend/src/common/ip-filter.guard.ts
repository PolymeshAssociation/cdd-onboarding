import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Logger } from 'winston';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { BlockList, isIPv4, isIPv6 } from 'node:net';

export const ALLOWED_IPS_PROVIDER = Symbol('ALLOWED_IPS_TOKEN');
@Injectable()
export class IpFilterGuard implements CanActivate {
  private allowedList = new BlockList();

  constructor(
    @Inject(ALLOWED_IPS_PROVIDER) allowedIPs: string[],
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    allowedIPs.forEach((ip) => {
      const [addr, prefix] = ip.split('/');
      if (isIPv4(addr)) {
        if (prefix) {
          this.allowedList.addSubnet(addr, Number(prefix), 'ipv4');
        } else {
          this.allowedList.addAddress(addr, 'ipv4');
        }
      } else if (isIPv6(addr)) {
        if (prefix) {
          this.allowedList.addSubnet(addr, Number(prefix), 'ipv6');
        } else {
          this.allowedList.addAddress(addr, 'ipv6');
        }
      }
    });
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientIp =
      request.header('x-forwarded-for') || request.connection.remoteAddress;

    const type = isIPv4(clientIp) ? 'ipv4' : 'ipv6';
    const result = this.allowedList.check(clientIp, type);

    this.logger.debug('filtered IP', { clientIp, result });

    return result;
  }
}
