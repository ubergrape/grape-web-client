/**
 * We use require because we can't import anything before the initial config is provided.
 */
/* eslint-disable global-require */

import merge from 'lodash/merge'
import has from 'lodash/has'
import Emitter from 'component-emitter'
import {
  isElectron,
  setWebClientVersion,
} from 'grape-web/lib/x-platform/electron'

import conf from '../conf'
import { toCamel } from '../utils/convert-case'
import { loadConfig } from '../utils/backend/api'
import rpc from '../utils/backend/rpc'
import ie10Polyfills from './ie10Polyfills'
import grapeVersion from './version.macro'
import themes from '../themes'

let resolveAppReady

const appReady = new Promise(resolve => {
  resolveAppReady = resolve
})

const docReady = new Promise(resolve => {
  if (/interactive|complete/.test(document.readyState)) resolve()
  else document.addEventListener('DOMContentLoaded', resolve)
})

const actionsReady = new Promise(resolve => {
  appReady.then(() => {
    const getBoundActions = require('../app/boundActions').default
    resolve(getBoundActions())
  })
})

const checkShowHideComponent = (() => {
  const allowed = ['search', 'mentions', 'labeledMessages']

  return name => {
    if (allowed.indexOf(name) === -1) {
      throw new Error(
        `Unexpected component name "${name}". Possible values: ${allowed}.`,
      )
    }
  }
})()

const init = _config => {
  const config = _config
  // Using "uk" instead "ua", as react-intl using it for ukrainian
  if (has(config, 'user.languageCode') && config.user.languageCode === 'ua') {
    config.user.languageCode = 'uk'
  }

  conf.setup(
    merge(toCamel(config), {
      organization: {
        // eslint-disable-next-line no-underscore-dangle
        colors: __THEME__ ? themes[__THEME__] : {},
      },
    }),
  )

  const app = require('../app')
  resolveAppReady(app)

  actionsReady.then(actions => {
    actions.setConf(conf)
  })

  if (isElectron) setWebClientVersion(grapeVersion)

  app.init()
  app.renderSheetsInsertionPoints()
  // We don't know if container is already in the tree.
  docReady.then(app.render)
}

const resume = () =>
  appReady.then(app => {
    app.resume()
  })

const suspend = () =>
  appReady.then(app => {
    app.suspend()
  })

const embed = options => {
  if (!options.serviceUrl) {
    throw new Error('Missing serviceUrl option.')
  }

  const config = loadConfig({ serviceUrl: options.serviceUrl }).then(res =>
    merge({}, res, {
      container: options.container,
      organization: {
        id: options.orgId,
      },
      server: {
        serviceUrl: options.serviceUrl,
        staticPath: options.staticBaseUrl,
      },
      channelId: options.channelId,
      embed: true,
      callbacks: {
        onRender: options.onRender,
        onPin: options.onPin,
        onUnpin: options.onUnpin,
      },
    }),
  )

  return Promise.all([config, ie10Polyfills(options)]).then(values => {
    init(values[0])
  })
}

const show = (name, options) => {
  checkShowHideComponent(name)
  return actionsReady.then(actions => {
    actions.showSidebar(name, options)
  })
}

const hide = name => {
  // Validate it for the future, we might be using it to hide other things than sidebar.
  checkShowHideComponent(name)
  return actionsReady.then(actions => {
    actions.hideSidebar()
  })
}

const searchMessages = (query, options) => {
  show('search', options)
  return actionsReady.then(actions => {
    actions.updateMessageSearchQuery(query)
  })
}

const setOpenFileDialogHandler = fn => {
  if (typeof fn !== 'function')
    throw new TypeError('Expected function argument.')
  return actionsReady.then(actions => {
    actions.setOpenFileDialogHandler(fn)
  })
}

const setChannel = (id, messageId) =>
  actionsReady.then(actions => {
    if (!id) {
      // eslint-disable-next-line no-console
      console.error(
        'channelId parameter for setChannel should be a number. Please check documentation: https://uebergrape.staging.chatgrape.com/doc/development/embedded_web_client.html?highlight=embedded#change-channel',
      )
      return
    }
    actions.setChannel(id, messageId)
  })

class Api extends Emitter {
  init = init
  embed = embed
  show = show
  hide = hide
  searchMessages = searchMessages
  setOpenFileDialogHandler = setOpenFileDialogHandler
  setChannel = setChannel
  resume = resume
  suspend = suspend
  authStatus = 'unauthorized'
  rpc = rpc
  version = grapeVersion

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
