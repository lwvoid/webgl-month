const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')


module.exports = {
  mode: 'development',

  devServer: {
    contentBase: './dist'
  },

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
        test: /\.(glsl|obj)$/,
        use: 'raw-loader',
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        use: 'url-loader',
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
  ],
}