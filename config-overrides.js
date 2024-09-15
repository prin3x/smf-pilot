const { override, setWebpackDevServerConfig } = require('customize-cra');

module.exports = {
  webpack: override(),
  devServer: override(
    setWebpackDevServerConfig({
      allowedHosts: ['103.245.164.59'], // Replace with your allowed host
    })
  ),
};