/**
 * We use require because we can't import anything before the initial config is provided.
 */
 /* eslint-disable global-require */

import merge from 'lodash/object/merge'
import Emitter from 'component-emitter'

import conf from '../conf'
import {loadConfig} from '../utils/backend/api'

let resolveAppReady

const appReady = new Promise((resolve) => {
  resolveAppReady = resolve
})

const docReady = new Promise((resolve) => {
  if (/interactive|complete/.test(document.readyState)) resolve()
  else document.addEventListener('DOMContentLoaded', resolve)
})

const actionsReady = new Promise((resolve) => {
  appReady.then(() => {
    const getBoundActions = require('../app/boundActions').default
    resolve(getBoundActions())
  })
})

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
  const app = require('../app')
  resolveAppReady(app)

  app.init()
  app.renderSheetsInsertionPoints()
  // We don't know if container is already in the tree.
  docReady.then(app.render)
}

const resume = () => {
  appReady.then((app) => {
    app.resume()
  })
}

const suspend = () => {
  appReady.then((app) => {
    app.suspend()
  })
}

const embed = (options) => {
  if (!options.serviceUrl) {
    throw new Error('Missing serviceUrl option.')
  }

  const intlPolyfill = new Promise((resolve) => {
    if (window.Intl) {
      resolve()
      return
    }

    // eslint-disable-next-line camelcase, no-undef
    __webpack_public_path__ = `${options.staticBaseUrl}app/`

    require.ensure([
      'intl',
      'intl/locale-data/jsonp/en.js',
      'intl/locale-data/jsonp/de.js'
    ], (require) => {
      require('intl')
      require('intl/locale-data/jsonp/en.js')
      require('intl/locale-data/jsonp/de.js')
      resolve()
    })
  })

  const config = loadConfig({serviceUrl: options.serviceUrl})
    .then(res => merge({}, res, {
      container: options.container,
      organization: {
        id: options.orgId
      },
      server: {
        serviceUrl: options.serviceUrl,
        staticPath: options.staticBaseUrl
      },
      channelId: options.channelId,
      embed: true
    }))

  Promise.all([intlPolyfill, config]).then((values) => {
    init(values[1])
  })
}

const show = (name, options) => {
  checkShowHideComponent(name)
  actionsReady.then((actions) => {
    actions.showSidebar(name, options)
  })
}

const hide = (name) => {
  // Validate it for the future, we might be using it to hide other things than sidebar.
  checkShowHideComponent(name)
  actionsReady.then((actions) => {
    actions.hideSidebar()
  })
}

const searchMessages = (query, options) => {
  show('search', options)
  actionsReady.then((actions) => {
    actions.updateMessageSearchQuery(query)
  })
}

const setOpenFileDialogHandler = (fn) => {
  if (typeof fn !== 'function') throw new TypeError('Expected function argument.')
  actionsReady.then((actions) => {
    actions.setOpenFileDialogHandler(fn)
  })
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
