import { z } from 'zod';

const configZ = z.object({
  port: z.coerce.number().positive().max(65535).default(3333),
  polymesh: z.object({
    nodeUrl: z.string().url().default('ws://localhost:9944'),
    mnemonic: z.string().default('//Alice'),
  }),
  redis: z.object({
    host: z.string().default('localhost'),
    port: z.coerce.number().positive().max(65535).default(6379),
    password: z.string().optional(),
  }),
  jumio: z.object({
    apiKey: z.string().default(''),
    generateLinkUrl: z
      .string()
      .url()
      .default('https://netverify.com/api/v4/initiate'),
  }),
  netki: z.object({
    url: z.string().url().default('https://kyc.myverify.info/api/'),
    refreshToken: z.string(),
    businessId: z.string().default('2c30b4ad-03ef-4cd9-b6fc-7b812f24d788'),
    linkUrl: z.string().default('https://daiu.app.link/yBE7efy4PI'),
  }),
});

export type AppConfig = ReturnType<typeof configZ.parse>;

export default (): AppConfig => {
  const rawConfig = {
    /**
     * port the app will listen on
     */
    port: process.env.APP_PORT,
    /**
     * config for the Polymesh SDK
     */
    polymesh: {
      /**
       * websocket URL of the Polymesh node to use
       */
      nodeUrl: process.env.MESH_NODE_URL,
      /**
       * mnemonic used to generate CDD request with
       */
      mnemonic: process.env.MESH_MNEMONIC,
    },
    /**
     * config for redis instance
     */
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
    jumio: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
