const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/popup.html',
  filename: './popup.html',
});

module.exports = {
  mode: 'development',
  target: 'web',
  entry: './src/popup.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [htmlPlugin],
  output: {
    path: path.resolve(`${__dirname}/./dist/popup`),
  },
};
