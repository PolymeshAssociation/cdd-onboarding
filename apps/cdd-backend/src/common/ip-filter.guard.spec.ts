import { createMock } from '@golevelup/ts-jest';
import { Logger } from 'winston';
import { mockHttpContext } from '../test-utils/mocks';
import { IpFilterGuard } from './ip-filter.guard';

describe('IpFilterGuard', () => {
  describe('canActivate', () => {
    const testCases = [
      {
        description: 'IPv4 - client IP is included in the allowed IPs',
        clientIP: '192.168.1.1',
        allowedIPs: ['192.168.1.1'],
        expected: true,
      },
      {
        description: 'IPv4 - client IP is included in the x-forwarded-header',
        clientIP: '::1',
        allowedIPs: ['192.168.1.1'],
        forwardedFor: '192.168.1.1',
        expected: true,
      },
      {
        description: 'IPv4 - client IP is not included in the allowed IPs',
        clientIP: '192.168.1.2',
        allowedIPs: ['192.168.1.1'],
        expected: false,
      },
      {
        description: 'IPv4 - client IP is within allowed subnet',
        clientIP: '172.16.0.4',
        allowedIPs: ['172.16.0.0/16'],
        expected: true,
      },
      {
        description:
          'IPv4 - client IP is within allowed subnet - v6 rule present',
        clientIP: '172.16.0.4',
        allowedIPs: ['2001:db8::/48', '172.16.0.0/16'],
        expected: true,
      },
      {
        description: 'IPv4 - client IP is outside of allowed subnet',
        clientIP: '192.168.0.1',
        allowedIPs: ['172.16.0.0/16'],
        expected: false,
      },
      {
        description: 'IPv6 - client IP is included in the allowed IPs',
        clientIP: '::1',
        allowedIPs: ['::1'],
        expected: true,
      },
      {
        description: 'IPv6 - client IP is within allowed subnet',
        clientIP: '2001:db8::abcd',
        allowedIPs: ['2001:db8::/48'],
        expected: true,
      },
      {
        description:
          'IPv6 - client IP is within allowed subnet - v4 rule present',
        clientIP: '2001:db8::abcd',
        allowedIPs: ['192.168.1.1', '2001:db8::/48'],
        expected: true,
      },
      {
        description: 'IPv6 - client IP is outside of allowed subnet',
        clientIP: '::1',
        allowedIPs: ['2001:db8::/48'],
        expected: false,
      },
      {
        description:
          'IPv6 - client IP is included in the allowed IPs with x-forwarded-for',
        clientIP: '::2',
        allowedIPs: ['::1'],
        forwardedFor: '::1',
        expected: true,
      },
      {
        description:
          'IPv6 - client IP is not included in the allowed IPs with x-forwarded-for',
        clientIP: '::2',
        allowedIPs: ['::1'],
        forwardedFor: '2001:db8::abcd',
        expected: false,
      },
    ];

    testCases.forEach(
      ({ description, clientIP, allowedIPs, forwardedFor, expected }) => {
        it(description, () => {
          const mockExecutionContext = mockHttpContext(clientIP, forwardedFor);
          const ipFilterGuard = new IpFilterGuard(
            allowedIPs,
            createMock<Logger>()
          );

          const canActivate = ipFilterGuard.canActivate(mockExecutionContext);
          expect(canActivate).toEqual(expected);
        });
      }
    );
  });
});
