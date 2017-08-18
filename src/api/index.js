import merge from 'lodash/object/merge'

import conf from '../conf'
import getBoundActions from '../app/boundActions'

const onDocReady = (callback) => {
  if (/interactive|complete/.test(document.readyState)) callback()
  else document.addEventListener('DOMContentLoaded', callback)
}

export const init = (config) => {
  conf.setup(config)
  // FIXME
  // conf.server.staticPath is used immediately at evaluation time.
  /* eslint-disable global-require */
  const app = require('../app')
  const initLegacy = require('../legacy').default
  /* eslint-enable global-require */
  app.init()
  app.renderSheetsInsertionPoints()
  initLegacy()
  // Wait for container element.
  onDocReady(app.render)
}

export const embed = (options) => {
  // eslint-disable-next-line global-require
  const api = require('../utils/backend/api')
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

export const searchMessages = (query) => {
  getBoundActions().showSidebar('search')
  getBoundActions().updateMessageSearchQuery(query)
}

export const setOpenFileDialogHandler = (fn) => {
  getBoundActions().setOpenFileDialogHandler(fn)
}
