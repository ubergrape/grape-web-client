import 'custom-event-polyfill'
import 'innersvg-polyfill'

if (!global.Intl) {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/en.js',
    'intl/locale-data/jsonp/de.js'
  ], (require) => {
    require('intl')
    require('intl/locale-data/jsonp/en.js')
    require('intl/locale-data/jsonp/de.js')
  })
}
