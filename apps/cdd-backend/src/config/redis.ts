import { z } from 'zod';

const redisZ = z
  .object({
    redis: z.object({
      host: z.string().default('localhost').describe('redis host'),
      port: z.coerce
        .number()
        .positive()
        .max(65535)
        .default(6379)
        .describe('redis port'),
      password: z.string().optional().describe('redis password'),
    }),
  })
  .describe('redis config');

export type RedisConfig = ReturnType<typeof redisZ.parse>;

export const redisEnvConfig = (): RedisConfig => {
  const rawConfig = {
    redis: {
      host: process.env.REDIS_HOST || '',
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
  };

  return redisZ.parse(rawConfig);
};
