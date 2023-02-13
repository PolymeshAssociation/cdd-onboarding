// TODO validate config with zod
export default () => ({
  /**
   * port the server will listen on
   */
  port: parseInt(process.env.PORT || '3333'),
  /**
   * config for the Polymesh SDK
   */
  polymesh: {
    /**
     * websocket URL of the Polymesh node to use
     */
    nodeUrl: process.env.NODE_URL || 'ws://localhost:9944',
    /**
     * mnemonic used to generate CDD request with
     */
    mnemonic: '//Alice',
  },
  /**
   * config for redis instance
   */
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'cdd',
  },
});
