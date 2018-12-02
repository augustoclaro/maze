const webpack = require('webpack');
var config = require("../webpack.config.js");

webpack(config).run(err => {
  if (!!err) {
    return console.error(err);
  }
  console.log('Build completed.');
});
