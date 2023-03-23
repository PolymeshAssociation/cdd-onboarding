const { composePlugins, withNx } = require('@nrwl/webpack');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  config.entry = 'apps/cdd-backend/src/entry/server.ts';

  return config;
});
