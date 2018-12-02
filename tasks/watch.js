const webpack = require('webpack');
const path = require('path');
const WebpackDevServer = require('webpack-dev-server');

var config = require("../webpack.config.js");
config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/");
var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
  contentBase: path.resolve('src/assets'),
  compress: true,
});
server.listen(8080);
