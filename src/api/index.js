/**
 * We use require because we can't import anything before the initial config is provided.
 */
 /* eslint-disable global-require */

import merge from 'lodash/object/merge'
import Emitter from 'component-emitter'

import conf from '../conf'
import loadConfig from '../utils/backend/api/loadConfig'

let app

const onDocReady = (callback) => {
  if (/interactive|complete/.test(document.readyState)) callback()
  else document.addEventListener('DOMContentLoaded', callback)
}

const getActions = (() => {
  let getBoundActions
  return () => {
    if (!getBoundActions) getBoundActions = require('../app/boundActions').default
    return getBoundActions()
  }
})()

const checkShowHideComponent = (() => {
  const allowed = ['search', 'mentions', 'labeledMessages']

  return (name) => {
    if (allowed.indexOf(name) === -1) {
      throw new Error(`Unexpected component name "${name}". Possible values: ${allowed}.`)
    }
  }
})()

const init = (config) => {
  conf.setup(config)
  app = require('../app')
  const initLegacy = require('../legacy').default
  app.init()
  app.renderSheetsInsertionPoints()
  initLegacy()
  // We don't know if container is already in the tree.
  onDocReady(app.render)
}

const resume = () => {
  app.resume()
}

const suspend = () => {
  app.suspend()
}

const embed = (options) => {
  if (!options.serviceUrl) {
    throw new Error('Missing serviceUrl option.')
  }
  loadConfig({serviceUrl: options.serviceUrl})
    .then(res => merge({}, res, {
      container: options.container,
      organization: {
        id: options.orgId
      },
      server: {serviceUrl: options.serviceUrl},
      channelId: options.channelId,
      embed: true
    }))
    .then(init)
}

const show = (name) => {
  checkShowHideComponent(name)
  getActions().showSidebar(name)
}

const hide = (name) => {
  // Validate it for the future, we might be using it to hide other things than sidebar.
  checkShowHideComponent(name)
  getActions().hideSidebar()
}

const searchMessages = (query) => {
  show('search')
  getActions().updateMessageSearchQuery(query)
}

const setOpenFileDialogHandler = (fn) => {
  if (typeof fn !== 'function') throw new TypeError('Expected function argument.')
  getActions().setOpenFileDialogHandler(fn)
}

class Api extends Emitter {
  init = init
  embed = embed
  show = show
  hide = hide
  searchMessages = searchMessages
  setOpenFileDialogHandler = setOpenFileDialogHandler
  resume = resume
  suspend = suspend
  authStatus = 'unauthorized'

  setAuthStatus(nextStatus) {
    if (nextStatus === this.authStatus) return
    this.authStatus = nextStatus
    this.emit('authChange', nextStatus)
  }

  // We are abastracting away the fact that it is located in the sidebar,
  // because this might change.
  onHideSidebar() {
    this.emit('hide')
  }
}

export default new Api()
