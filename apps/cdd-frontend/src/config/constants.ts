import z from 'zod';

import { PolyNetwork } from '../hooks/usePollyWallet';

const configSchema = z.object({
  API_URL: z.string(),
  NETWORK: z.enum(['local', 'testnet', 'staging', 'mainnet']),
  SS58_FORMAT: z.coerce.number(),
  LOG_LEVEL: z.enum(['log', 'warn', 'error', 'debug', 'off']),
  H_CAPTCHA_SITE_KEY: z.string().optional(),
  NX_USER_PORTAL_URL: z.string(),
  MOCK_ENABLED: z.enum(['true', 'false']).transform((val) => val === 'true'),
  PROVIDERS_ENABLED: z
    .array(z.enum(['jumio', 'netki', 'finclusive']))
    .default(['jumio', 'netki', 'finclusive']),
});

export const NETWORK_NAMES: Record<PolyNetwork, string> = {
  local: 'Local Node',
  testnet: 'Testnet',
  staging: 'Staging',
  mainnet: 'Mainnet',
};

let providersEnabled;
if (process.env.NX_PROVIDERS_ENABLED) {
  providersEnabled = process.env.NX_PROVIDERS_ENABLED.split(',').map(
    (provider) => provider.trim()
  );
}

export default configSchema.parse({
  API_URL: process.env.NX_API_URL,
  NETWORK: process.env.NX_MESH_NETWORK,
  SS58_FORMAT: process.env.NX_SS58_FORMAT,
  LOG_LEVEL: process.env.NX_LOG_LEVEL,
  H_CAPTCHA_SITE_KEY: process.env.NX_H_CAPTCHA_SITE_KEY,
  NX_USER_PORTAL_URL: process.env.NX_USER_PORTAL_URL,
  MOCK_ENABLED: process.env.NX_MOCK_ENABLED,
  PROVIDERS_ENABLED: providersEnabled,
});

export type AppConfig = z.infer<typeof configSchema>;
