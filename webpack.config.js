const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const assetsPath = path.resolve(__dirname, 'public', 'assets');
const entryPath = path.resolve(__dirname, 'app.js');
const host = process.env.APP_HOST || 'localhost';

const config = {

  // Makes sure errors in console map to the correct file
  // and line number
  devtool: 'eval',
  resolve: {
    modules: ['node_modules']
  },
      watch:true,
  entry: [

    // For hot style updates
    'webpack/hot/dev-server',

    // The script refreshing the browser on none hot updates
    `webpack-dev-server/client?http://${host}:3001`,

    // Our application
    entryPath
  ],
  output: {
    path: assetsPath,
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  module: {
    loaders: [

      {
        test: /\.js$/,
        loader: 'babel-loader'
      },


      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|jpeg)$/,
        loader: 'file-loader?name=[hash].[ext]',

      },

      {
        test: /\.html$/,
        loader: 'ng-cache-loader?prefix=/'
      },

      { // regular css files
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          loader: 'css-loader',
        }),
      }, { // sass / scss loader for webpack
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      }
    ]
  },

  plugins: [
    // We have to manually add the Hot Replacement plugin when running
    // from Node
    new Webpack.ProvidePlugin({
      echarts: 'echarts'
    }),
    new ExtractTextPlugin('styles.css'),
    new Webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = config;
