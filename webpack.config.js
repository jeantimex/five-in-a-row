var webpack = require('webpack'),
    minimize = process.argv.indexOf('--no-minimize') === -1 ? true : false,
    plugins = [];

minimize && plugins.push(new webpack.optimize.UglifyJsPlugin());

module.exports = {
  entry: './app-client.js',
  output: {
    filename: 'public/bundle.js'
  },
  plugins: plugins,
  module: {
    loaders: [{
      exclude: /(node_modules|app-server.js)/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'react']
      }
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }]
  }
};