import 'custom-event-polyfill'
import 'innersvg-polyfill'

import conf from './conf'
import {
  init as initApp,
  render as renderApp,
  renderSheetsInsertionPoints
} from './app'
import initLegacy from './legacy'

module.exports = (options) => {
  conf.setup(options)
  initApp()
  renderSheetsInsertionPoints()
  initLegacy()
  renderApp()
}

// Legacy init, remove it.
if (window.CHATGRAPE_CONFIG) {
  const div = document.body.appendChild(document.createElement('div'))
  div.id = 'grape-client'
  module.exports({...window.CHATGRAPE_CONFIG, container: `#${div.id}`})
}
