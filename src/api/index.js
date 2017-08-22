/**
 * We use require because we can't import anything before the initial config is provided.
 */
 /* eslint-disable global-require */

import merge from 'lodash/object/merge'

import conf from '../conf'

const onDocReady = (callback) => {
  if (/interactive|complete/.test(document.readyState)) callback()
  else document.addEventListener('DOMContentLoaded', callback)
}

export const init = (config) => {
  conf.setup(config)
  const app = require('../app')
  const initLegacy = require('../legacy').default
  app.init()
  app.renderSheetsInsertionPoints()
  initLegacy()
  // We don't know if container is already in the tree.
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

const getActions = (() => {
  let getBoundActions
  return () => {
    if (!getBoundActions) getBoundActions = require('../app/boundActions').default
    return getBoundActions()
  }
})()

export const searchMessages = (query) => {
  getActions().showSidebar('search')
  getActions().updateMessageSearchQuery(query)
}

export const setOpenFileDialogHandler = (fn) => {
  getActions().setOpenFileDialogHandler(fn)
}
