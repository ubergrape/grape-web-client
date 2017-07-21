import 'custom-event-polyfill'
import 'innersvg-polyfill'
import merge from 'lodash/object/merge'

import conf from './conf'
import {
  init as initApp,
  render as renderApp,
  renderSheetsInsertionPoints
} from './app'
import initLegacy from './legacy'
import * as api from './utils/backend/api'

export const init = (config) => {
  conf.setup(config)
  initApp()
  renderSheetsInsertionPoints()
  initLegacy()
  renderApp()
}

export const embed = (options) => {
  api
    .loadConfig({
      host: options.host,
      protocol: 'https:'
    })
    .then(res => merge(res, {
      container: options.container,
      organization: {
        id: options.orgId
      },
      channelId: options.channelId,
      server: {
        host: options.host
      },
      embed: true
    }))
    .then(init)
}

// Legacy init, remove it.
if (window.CHATGRAPE_CONFIG) {
  const div = document.body.appendChild(document.createElement('div'))
  div.id = 'grape-client'
  init({...window.CHATGRAPE_CONFIG, container: `#${div.id}`})
}
