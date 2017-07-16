var webpack = require('webpack');
module.exports = {
  entry: './src/index.js',
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: __dirname,
        exclude: /node_modules/
      }
    ]
  }
};
