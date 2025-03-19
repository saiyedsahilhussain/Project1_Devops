const path = require('path');

module.exports = {
  mode: 'development', // Set mode to either 'development' or 'production'
  entry: 'index.js', // Your entry file, make sure 'src/index.js' exists
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  // Any additional Webpack configuration you may need
};
