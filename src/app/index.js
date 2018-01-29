import React from 'react'
import ReactDom from 'react-dom'
import Raven from 'raven-js'
import {addLocaleData} from 'react-intl'
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'
import moment from 'moment'

import conf from '../conf'
import subscribe from './subscribe'
import * as client from './client'
import AppFull from './AppFull'
import AppEmbedded from './AppEmbedded'

let sheetsInsertionPoint
let renderContainer
let isSuspended = true

export const resume = () => {
  if (!isSuspended) return null
  isSuspended = false
  return client.connect()
}

export const suspend = () => {
  if (isSuspended) return
  isSuspended = true
  client.suspend()
}

export function init() {
  Raven.config(conf.server.sentryJsDsn).install()
  Raven.setUserContext({
    email: conf.user.email,
    id: conf.user.id,
    username: conf.user.username,
    organization: conf.organization.subdomain,
    organizationID: conf.organization.id
  })
  Raven.context(() => {
    addLocaleData([...en, ...de])
    moment.locale(conf.user.languageCode)
    subscribe(resume())
  })
}

export function renderSheetsInsertionPoints() {
  sheetsInsertionPoint = document.createComment('grape-jss')
  document.head.appendChild(sheetsInsertionPoint)
}

export function render() {
  const renderApp = () => {
    const App = conf.embed ? AppEmbedded : AppFull
    renderContainer = document.querySelector(conf.container)
    ReactDom.render(React.createElement(App), renderContainer)
  }

  if (__DEV__ && 'performance' in window && 'now' in window.performance) {
    const before = performance.now()
    renderApp()
    const diff = performance.now() - before
    // eslint-disable-next-line no-console
    console.log(`Initial render took ${diff}ms`)
  } else {
    renderApp()
  }
}
