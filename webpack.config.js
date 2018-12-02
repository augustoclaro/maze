const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PHASER_BUILD_DIR = path.resolve('node_modules/phaser-ce/build/custom');
const APP_BUILD_DIR = path.resolve('build');

module.exports = {
  entry: {
    app: [
      './index.ts',
      './src/assets/css/game.scss'
    ]
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.scss', '.css'],

  },
  output: {
    path: APP_BUILD_DIR,
    filename: 'output.js'
  },
  module: {
    rules: [
      {
        test: path.join(PHASER_BUILD_DIR, 'pixi.js'),
        use: [{
          loader: 'expose-loader',
          options: 'PIXI'
        }]
      },
      {
        test: path.join(PHASER_BUILD_DIR, 'p2.js'),
        use: [{
          loader: 'expose-loader',
          options: 'p2'
        }]
      },
      {
        test: path.join(PHASER_BUILD_DIR, 'phaser-split.js'),
        use: [{
          loader: 'expose-loader',
          options: 'Phaser'
        }]
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('css-loader', 'sass-loader')
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin('output.css'),
    new CopyWebpackPlugin([
      {
        from: '**/*.html',
        to: APP_BUILD_DIR
      }
    ], {
      ignore: [
        '**/node_modules/**',
        APP_BUILD_DIR
      ]
    })
  ]
};