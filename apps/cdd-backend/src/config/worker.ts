import { z } from 'zod';

const configZ = z.object({
  signer: z
    .object({
      mnemonic: z.optional(
        z.string().describe('mnemonic to create CDD claims with')
      ),
      vault: z.optional(
        z.object({
          url: z.string().url(),
          token: z.string(),
          key: z.string(),
        })
      ),
    })
    .refine(
      (data) => !data.mnemonic !== !data.vault,
      'Exactly one of `signer.mnemonic` or `signer.vault` must be configured'
    ),

  polymesh: z
    .object({
      nodeUrl: z
        .string()
        .url()
        .default('ws://localhost:9944')
        .describe('Polymesh chain node ws url'),
    })
    .describe('Polymesh chain related config'),

  redis: z
    .object({
      host: z.string().default('localhost').describe('redis host'),
      port: z.coerce
        .number()
        .positive()
        .max(65535)
        .default(6379)
        .describe('redis port'),
      password: z.string().optional().describe('redis password'),
    })
    .describe('redis related config'),
});

export type AppConfig = ReturnType<typeof configZ.parse>;

export default (): AppConfig => {
  const signer: AppConfig['signer'] = {
    mnemonic: undefined,
    vault: undefined,
  };

  if (process.env.VAULT_URL) {
    signer.vault = {
      url: process.env.VAULT_URL,
      token: process.env.VAULT_TOKEN!,
      key: process.env.VAULT_KEY!,
    };
  } else if (process.env.MESH_MNEMONIC) {
    signer.mnemonic = process.env.MESH_MNEMONIC;
  } else {
    signer.mnemonic = '//Alice';
  }

  const rawConfig = {
    signer,
    server: {
      port: process.env.APP_PORT,
      routePrefix: process.env.APP_ROUTE_PREFIX,
    },
    polymesh: {
      nodeUrl: process.env.MESH_NODE_URL,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
  };

  return configZ.parse(rawConfig);
};
