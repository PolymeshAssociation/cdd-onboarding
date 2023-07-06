import z from 'zod';

import { PolyNetwork } from '../hooks/usePollyWallet';

const configSchema = z.object({
  API_URL: z.string(),
  NETWORK: z.enum(['local', 'testnet', 'staging', 'mainnet']),
  SS58_FORMAT: z.number(),
  LOG_LEVEL: z.enum(['log', 'warn', 'error', 'debug', 'off']),
  H_CAPTCHA_SITE_KEY: z.string().optional(),
  NX_USER_PORTAL_URL: z.string(),
  FRACTAL_ENABLED: z.enum(['true', 'false']).transform((val) => val === 'true'),
  MOCK_ENABLED: z.enum(['true', 'false']).transform((val) => val === 'true'),
});

export const NETWORK_NAMES: Record<PolyNetwork, string> = {
  local: 'Local Node',
  testnet: 'Testnet',
  staging: 'Staging',
  mainnet: 'Mainnet',
};

export default configSchema.parse({
  API_URL: process.env.NX_API_URL,
  NETWORK: process.env.NX_MESH_NETWORK,
  SS58_FORMAT: process.env.NX_MESH_NETWORK === "mainnet" ? 12 : 42,
  LOG_LEVEL: process.env.NX_LOG_LEVEL,
  H_CAPTCHA_SITE_KEY: process.env.NX_H_CAPTCHA_SITE_KEY,
  NX_USER_PORTAL_URL: process.env.NX_USER_PORTAL_URL,
  FRACTAL_ENABLED: process.env.NX_FRACTAL_ENABLED,
  MOCK_ENABLED: process.env.NX_MOCK_ENABLED,
});

export type AppConfig = z.infer<typeof configSchema>;
