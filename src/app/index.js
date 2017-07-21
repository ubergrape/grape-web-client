import React from 'react'
import ReactDom from 'react-dom'
import Raven from 'raven-js'
import {addLocaleData} from 'react-intl'
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'
import moment from 'moment'

import conf from '../conf'
import subscribe from './subscribe'
import {connect} from './client'
import App from './App'
import EmbeddedApp from './EmbeddedApp'

export function init() {
  addLocaleData([...en, ...de])
  moment.locale(conf.user.languageCode)

  Raven.config(conf.server.sentryJsDsn).install()
  Raven.setUser({
    email: conf.user.email,
    id: conf.user.id,
    username: conf.user.username,
    organization: conf.organization.subdomain,
    organizationID: conf.organization.id
  })
  subscribe(connect())
}

export function renderSheetsInsertionPoints() {
  document.head.appendChild(document.createComment('jss-theme-reactor'))
  document.head.appendChild(document.createComment('grape-jss'))
}

export function render() {
  const renderApp = () => {
    const container = document.querySelector(conf.container)
    const Component = conf.embed ? EmbeddedApp : App
    ReactDom.render(React.createElement(Component), container)
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
