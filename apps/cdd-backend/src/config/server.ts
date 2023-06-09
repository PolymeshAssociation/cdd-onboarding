import { z } from 'zod';
import { allowedBasicAuthZ, allowedIpsZ } from './internal';

const configZ = z
  .object({
    server: z
      .object({
        routePrefix: z
          .string()
          .transform((val) => val.trim().replace(/^\/+/, ''))
          .default('')
          .describe('(optional) global route prefix e.g. `/api`'),
        port: z.coerce
          .number()
          .positive()
          .max(65535)
          .default(3333)
          .describe('port the server will listen on'),
        allowedCorsDomains: z
          .string()
          .array()
          .default(['localhost:4200'])
          .describe('CSV list of allowed CORS domains'),
        healthAllowedIps: allowedIpsZ,
      })
      .describe('server related config'),

    polymesh: z
      .object({
        nodeUrl: z
          .string()
          .url()
          .default('ws://localhost:9944')
          .describe('Polymesh chain node ws url'),
      })
      .describe('Polymesh chain related config'),

    jumio: z
      .object({
        apiKey: z
          .string()
          .default('')
          .describe('api key to authenticate outbound jumio calls with'),
        generateLinkUrl: z
          .string()
          .url()
          .default('https://netverify.com/api/v4/initiate')
          .describe(
            'http URL users will be directed to when onboarding with Jumio'
          ),
        allowedIps: allowedIpsZ,
      })
      .describe('Jumio related config'),

    netki: z
      .object({
        url: z
          .string()
          .url()
          .default('https://kyc.myverify.info/api/')
          .describe('base URL for netki API'),
        username: z.string().describe('netki username to authorize the app'),
        password: z.string().describe('netki password to authorize the app '),
        businessId: z
          .string()
          .default('2c30b4ad-03ef-4cd9-b6fc-7b812f24d788')
          .describe('Polymesh Netki Business ID'),
        linkUrl: z
          .string()
          .default('https://daiu.app.link/yBE7efy4PI')
          .describe(
            'http URL users will be directed to when onboarding with Netki'
          ),
        allowedBasicAuth: allowedBasicAuthZ,
      })
      .describe('Netki related config'),

    fractalUrl: z
      .string()
      .url()
      .describe('URL users will be redirected to when selecting Fractal'),

    hCaptcha: z
      .object({
        secretKey: z.string().describe('hCaptcha secret key'),
      })
      .describe('hCaptcha related config'),
  })
  .describe('config values needed for "server" mode');

export type ServerConfig = ReturnType<typeof configZ.parse>;

/**
 * read server config setting from the environment
 */
export const serverEnvConfig = (): ServerConfig => {
  const rawConfig = {
    server: {
      port: process.env.APP_PORT,
      routePrefix: process.env.APP_ROUTE_PREFIX,
      allowedCorsDomains: process.env.ALLOWED_CORS_DOMAINS?.split(',').map(
        (domain) => domain.trim()
      ),
      healthAllowedIps: process.env.APP_HEALTH_IPS?.split(',').map((ip) =>
        ip.trim()
      ),
    },
    polymesh: {
      nodeUrl: process.env.MESH_NODE_URL,
    },
    jumio: {
      apiKey: Buffer.from(process.env.JUMIO_API_KEY || '').toString('base64'),
      generateLinkUrl: process.env.JUMIO_GENERATE_LINK_URL,
      allowedIps: process.env.JUMIO_ALLOWED_IPS?.split(',').map((ip) =>
        ip.trim()
      ),
    },
    netki: {
      url: process.env.NETKI_URL,
      username: process.env.NETKI_USERNAME,
      password: process.env.NETKI_PASSWORD,
      businessId: process.env.NETKI_BUSINESS_ID,
      linkUrl: process.env.NETKI_LINK_URL,
      allowedBasicAuth: process.env.NETKI_ALLOWED_BASIC_AUTH?.split(',').map(
        (credential) => credential.trim()
      ),
    },
    fractalUrl: process.env.FRACTAL_URL,
    hCaptcha: {
      secretKey: process.env.HCAPTCHA_SECRET_KEY,
    },
  };

  return configZ.parse(rawConfig);
};
