let webpack = require("webpack");
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: "./../src/js/scripts.js",
    output: {
        filename: "scripts.min.js"
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: {loader: 'html-loader'}
            }
        ]
    },
    externals: {
      d3: 'd3',
      cookies: 'Cookies',
    },
    plugins: [
    //new UglifyJsPlugin({/*minimize: true*/})
    ]
};