const path = require('path')
const config = require('./webpack.config')

module.exports = {
  components: 'src/components/**/[A-Z]*.js',
  webpackConfigFile: './webpack.config.js',
  webpackConfig: {
    resolve: {
      alias: {
        'rsg-components/Wrapper': path.join(__dirname, 'src/components/i18n/IntlProvider')
      }
    }
  }
}
