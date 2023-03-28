import { z } from 'zod';

export const allowedIpsZ = z
  .string()
  .array()
  .describe('A comma separated list of IPs that can access routes')
  .default(['127.0.0.1', '::1']);

export const allowedBasicAuthZ = z
  .string()
  .array()
  .describe(
    'A comma separated list of `user:password` combinations that can POST webhooks'
  )
  .default(['someUser:somePassword']);
