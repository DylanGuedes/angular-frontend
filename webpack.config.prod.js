const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const assetsPath = path.resolve(__dirname, 'public', 'assets');
const entryPath = path.resolve(__dirname, 'frontend', 'app.js');

const config = {

  // Makes sure errors in console map to the correct file
  // and line number
  devtool: 'eval',
  resolve: {
    modules: ['node_modules']
  },
  entry: [
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
    new Webpack.optimize.AggressiveMergingPlugin(),
    new Webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      },
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      },
      output: {
        comments: false
      }
    })
  ]
};

module.exports = config;
