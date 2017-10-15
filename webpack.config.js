/*s
module.exports = {
    entry: './../src/js/scripts.js',
    output: {
        filename: 'bundle.js'
    }
}
*/
let webpack = require("webpack");
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {

  entry: "./../src/js/scripts.js",
  output: {
    filename: "scripts.min.js"
  },
  externals: {
      d3: 'd3',
      cookies: 'Cookies',
  },
  plugins: [
    new UglifyJsPlugin({/*minimize: true*/})
  ]
};