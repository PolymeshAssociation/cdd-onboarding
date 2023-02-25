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
  };

  return configZ.parse(rawConfig);
};
