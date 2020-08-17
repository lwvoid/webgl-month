const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')


module.exports = {
  mode: 'development',

  entry: {
    'index': './src/index.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.glsl$/,
        use: 'raw-loader',
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'public/index.html'),
      inject: true,
      hash: false,
    }),
  ]
}