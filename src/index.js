import 'custom-event-polyfill'
import 'innersvg-polyfill'
import merge from 'lodash/object/merge'

import conf from './conf'

const onDocReady = (callback) => {
  if (/interactive|complete/.test(document.readyState)) callback()
  else document.addEventListener('DOMContentLoaded', callback)
}

export const init = (config) => {
  conf.setup(config)
  // FIXME
  // conf.server.staticPath is used immediately at evaluation time.
  /* eslint-disable global-require */
  const app = require('./app')
  const initLegacy = require('./legacy').default
  /* eslint-enable global-require */
  app.init()
  app.renderSheetsInsertionPoints()
  initLegacy()
  // Wait for container element.
  onDocReady(app.render)
}

export const embed = (options) => {
  // eslint-disable-next-line global-require
  const api = require('./utils/backend/api')
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
