const { override } = require('customize-cra');

module.exports = {
  webpack: override(
    // Add your webpack overrides here
  ),
  devServer: configFunction => (proxy, allowedHost) => {
    const config = configFunction(proxy, allowedHost);
    config.allowedHosts = ['103.245.164.59']; // Replace with your allowed host
    return config;
  },
};