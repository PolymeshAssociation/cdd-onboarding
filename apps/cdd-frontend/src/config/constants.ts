import z from 'zod';

import { PolyNetwork } from '../hooks/usePollyWallet';

const configSchema = z.object({
  API_URL: z.string(),
  NETWORK: z.enum(['local', 'testnet', 'staging', 'mainnet']),
  LOG_LEVEL: z.enum(['log', 'warn', 'error', 'debug', 'off']),
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
  LOG_LEVEL: process.env.NX_LOG_LEVEL,  
});

export type AppConfig = z.infer<typeof configSchema>;