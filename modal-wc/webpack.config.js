const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    port: 4000,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'modalWC',
      filename: 'remoteEntry.js',
      exposes: {
        './ConfirmModal': './src/components/confirm-modal.js',
      },
      shared: {},
    }),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
};