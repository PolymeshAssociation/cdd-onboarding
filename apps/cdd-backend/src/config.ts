export default () => ({
  /**
   * port the app will listen on
   */
  port: parseInt(process.env.PORT || '3333'),
  polymeshSdk: {
    /**
     * websocket port of the Polymesh node to use
     */
    nodeUrl: process.env.NODE_URL || 'ws://localhost:9944',
  },
});
