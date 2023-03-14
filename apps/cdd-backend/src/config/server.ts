import { z } from 'zod';

const configZ = z.object({
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
    })
    .describe('Netki related config'),
});

export type AppConfig = ReturnType<typeof configZ.parse>;

export default (): AppConfig => {
  const rawConfig = {
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
    jumio: {
      apiKey: Buffer.from(process.env.JUMIO_API_KEY || '').toString('base64'),
      generateLinkUrl: process.env.JUMIO_GENERATE_LINK_URL,
    },
    netki: {
      url: process.env.NETKI_URL,
      refreshToken: process.env.NETKI_REFRESH_TOKEN,
      businessId: process.env.NETKI_BUSINESS_ID,
      linkUrl: process.env.NETKI_LINK_URL,
    },
  };

  return configZ.parse(rawConfig);
};
