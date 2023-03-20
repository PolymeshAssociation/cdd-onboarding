import { z } from 'zod';

const allowedIpsZ = z
  .string()
  .array()
  .describe('A comma separated list of IPs that can POST webhooks')
  .default(['127.0.0.1', '::1']);

const configZ = z
  .object({
    server: z
      .object({
        routePrefix: z
          .string()
          .default('')
          .describe('(optional) global route prefix e.g. `/api`'),
        port: z.coerce
          .number()
          .positive()
          .max(65535)
          .default(3333)
          .describe('port the server will listen on'),
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
        refreshToken: z
          .string()
          .describe(
            'JWT refresh token used to fetch an access token which will in turn be used an an Authorization header'
          ),
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
        allowedIps: allowedIpsZ,
      })
      .describe('Netki related config'),
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
    },
    polymesh: {
      nodeUrl: process.env.MESH_NODE_URL,
    },
    jumio: {
      apiKey: Buffer.from(process.env.JUMIO_API_KEY || '').toString('base64'),
      generateLinkUrl: process.env.JUMIO_GENERATE_LINK_URL,
      allowedIps: process.env.NETKI_ALLOWED_IPS?.split(',').map((ip) =>
        ip.trim()
      ),
    },
    netki: {
      url: process.env.NETKI_URL,
      refreshToken: process.env.NETKI_REFRESH_TOKEN,
      businessId: process.env.NETKI_BUSINESS_ID,
      linkUrl: process.env.NETKI_LINK_URL,
      allowedIps: process.env.NETKI_ALLOWED_IPS?.split(',').map((ip) =>
        ip.trim()
      ),
    },
  };

  return configZ.parse(rawConfig);
};
