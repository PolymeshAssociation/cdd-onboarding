import { z } from 'zod';

const configZ = z
  .object({
    signer: z
      .object({
        mnemonic: z.optional(
          z.string().describe('mnemonic to create CDD claims with')
        ),
        vault: z.optional(
          z.object({
            url: z.string().url(),
            token: z.string(),
            // key: z.string(),
            jumioKey: z.string(),
            netkiKey: z.string(),
            mockCddKey: z.string().optional(),
          })
        ),
      })
      .refine(
        (data) => !data.mnemonic !== !data.vault,
        'Exactly one of `signer.mnemonic` or `signer.vault` must be configured'
      )
      .describe('config values needed to access the CDD provider key'),

    polymesh: z
      .object({
        nodeUrl: z
          .string()
          .url()
          .default('ws://localhost:9944')
          .describe('Polymesh chain node ws url'),
      })
      .describe('Polymesh chain related config'),
  })
  .describe('config values needed for "worker" mode');

export type WorkerConfig = ReturnType<typeof configZ.parse>;

/**
 * Read worker config settings from the environment
 *
 * @note The key to sign CDD claims with is determined by this order:
 * 1. If env `VAULT_URL` is set then `VAULT_TOKEN` and `VAULT_KEY` will be used to determine the CDD signing key
 * 2. If `MESH_MNEMONIC` is set then that will be used to sign
 * 3. Otherwise the default of `//Alice` will be used
 */
export const workerEnvConfig = (): WorkerConfig => {
  const signer: WorkerConfig['signer'] = {
    mnemonic: undefined,
    vault: undefined,
  };

  if (process.env.VAULT_URL) {
    signer.vault = {
      url: process.env.VAULT_URL,
      token: process.env.VAULT_TOKEN || '',
      // key: process.env.VAULT_KEY || '',
      jumioKey: process.env.JUMIO_KEY || '',
      netkiKey: process.env.NETKI_KEY || '',
      mockCddKey: process.env.MOCK_CDD_KEY,
    };
  } else if (process.env.MESH_MNEMONIC) {
    signer.mnemonic = process.env.MESH_MNEMONIC;
  } else {
    signer.mnemonic = '//Alice';
  }

  const rawConfig = {
    signer,
    polymesh: {
      nodeUrl: process.env.MESH_NODE_URL,
    },
  };

  return configZ.parse(rawConfig);
};
