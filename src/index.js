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
